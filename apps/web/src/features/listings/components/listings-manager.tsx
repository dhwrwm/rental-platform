"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { Alert } from "@components/ui/alert";
import { Button, buttonVariants } from "@components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@components/ui/dialog";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Select } from "@components/ui/select";
import { Textarea } from "@components/ui/textarea";
import { authClient } from "@features/auth/api/auth-client";
import { cn } from "@lib/utils";
import { useListings } from "../hooks/use-listings";
import type {
  CreateListingPayload,
  Listing,
  ListingStatus,
  UpdateListingPayload,
} from "../types/listing";

type ListingFormState = {
  title: string;
  description: string;
  address: string;
  city: string;
  state: string;
  country: string;
  latitude: string;
  longitude: string;
  rooms: string;
  bedrooms: string;
  bathrooms: string;
  capacity: string;
  amenities: string;
  checkingInTime: string;
  checkingOutTime: string;
  basePrice: string;
  securityDepositPercentage: string;
  cleaningFee: string;
  serviceFee: string;
  otherFees: string;
  isActive: ListingStatus;
};

const emptyForm: ListingFormState = {
  title: "",
  description: "",
  address: "",
  city: "",
  state: "",
  country: "",
  latitude: "",
  longitude: "",
  rooms: "",
  bedrooms: "",
  bathrooms: "",
  capacity: "",
  amenities: "",
  checkingInTime: "",
  checkingOutTime: "",
  basePrice: "",
  securityDepositPercentage: "",
  cleaningFee: "",
  serviceFee: "",
  otherFees: "",
  isActive: "INACTIVE",
};

export function ListingsManager() {
  const router = useRouter();
  const { data, error: sessionError, isPending } = authClient.useSession();
  const user = data?.user;
  const {
    addListing,
    editListing,
    error,
    isLoading,
    isMutating,
    listings,
    removeListing,
  } = useListings();
  const [selectedListingId, setSelectedListingId] = useState<string | null>(
    null,
  );
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState<ListingFormState>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);

  const selectedListing = useMemo(
    () => listings.find((listing) => listing.id === selectedListingId) ?? null,
    [listings, selectedListingId],
  );

  useEffect(() => {
    if (!isPending && !user) {
      router.replace("/login");
    }
  }, [isPending, router, user]);

  function updateField(
    field: keyof ListingFormState,
    value: ListingFormState[keyof ListingFormState],
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function resetForm() {
    setSelectedListingId(null);
    setForm(emptyForm);
    setFormError(null);
    setIsFormOpen(false);
  }

  function startAdding() {
    setSelectedListingId(null);
    setForm(emptyForm);
    setFormError(null);
    setIsFormOpen(true);
  }

  function startEditing(listing: Listing) {
    setSelectedListingId(listing.id);
    setForm({
      title: listing.title,
      description: listing.description ?? "",
      address: listing.address,
      city: listing.city,
      state: listing.state,
      country: listing.country,
      latitude: String(listing.latitude),
      longitude: String(listing.longitude),
      rooms: String(listing.rooms),
      bedrooms: String(listing.bedrooms),
      bathrooms: optionalNumberToString(listing.bathrooms),
      capacity: String(listing.capacity),
      amenities: listing.amenities.join(", "),
      checkingInTime: listing.checkingInTime ?? "",
      checkingOutTime: listing.checkingOutTime ?? "",
      basePrice: String(listing.basePrice),
      securityDepositPercentage: optionalNumberToString(
        listing.securityDepositPercentage,
      ),
      cleaningFee: optionalNumberToString(listing.cleaningFee),
      serviceFee: optionalNumberToString(listing.serviceFee),
      otherFees: optionalNumberToString(listing.otherFees),
      isActive: listing.isActive,
    });
    setFormError(null);
    setIsFormOpen(true);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    if (!user) {
      setFormError("Sign in before managing listings.");
      return;
    }

    try {
      if (selectedListing) {
        await editListing(selectedListing.id, toUpdatePayload(form));
      } else {
        await addListing(toCreatePayload(form, user.id));
      }

      resetForm();
    } catch (caughtError) {
      setFormError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to save listing.",
      );
    }
  }

  async function handleDelete(listing: Listing) {
    const confirmed = window.confirm(`Delete "${listing.title}"?`);

    if (!confirmed) {
      return;
    }

    try {
      await removeListing(listing.id);

      if (selectedListingId === listing.id) {
        resetForm();
      }
    } catch (caughtError) {
      setFormError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to delete listing.",
      );
    }
  }

  if (isPending || !user) {
    return (
      <main className="px-6 py-6 sm:px-8">
        <section className="mx-auto flex min-h-[calc(100svh-3rem)] max-w-7xl items-center justify-center">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <p className="text-xs font-semibold uppercase tracking-normal text-muted-foreground">
                Listings access
              </p>
              <CardTitle>
                {isPending ? "Checking session..." : "Redirecting to login..."}
              </CardTitle>
              {sessionError ? (
                <CardDescription className="text-destructive">
                  {sessionError.message}
                </CardDescription>
              ) : (
                <CardDescription>
                  Listing management is available to signed-in team members.
                </CardDescription>
              )}
            </CardHeader>
          </Card>
        </section>
      </main>
    );
  }

  return (
    <main className="px-6 py-6 sm:px-8">
      <section className="mx-auto grid w-full max-w-7xl gap-6">
        <div className="space-y-6">
          <div className="rounded-4xl border border-border/70 bg-card/70 p-8 shadow-sm">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-normal text-muted-foreground">
                  Dashboard
                </p>
                <h1 className="mt-3 text-4xl font-semibold tracking-normal sm:text-5xl">
                  Listings
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                  Create, edit, publish, and remove rental inventory from one
                  workspace.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button onClick={startAdding} type="button">
                  Add listing
                </Button>
                <Link
                  className={cn(buttonVariants({ variant: "secondary" }))}
                  href="/dashboard"
                >
                  Back to dashboard
                </Link>
              </div>
            </div>
          </div>

          {error ? <Alert>{error}</Alert> : null}

          <div className="grid gap-4">
            {isLoading ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Loading listings...</CardTitle>
                  <CardDescription>
                    Fetching current inventory from the API.
                  </CardDescription>
                </CardHeader>
              </Card>
            ) : null}

            {!isLoading && listings.length === 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">No listings yet</CardTitle>
                  <CardDescription>
                    Add the first listing to start managing rental inventory.
                  </CardDescription>
                  <Button
                    className="mt-3 w-fit"
                    onClick={startAdding}
                    type="button"
                  >
                    Add listing
                  </Button>
                </CardHeader>
              </Card>
            ) : null}

            {listings.map((listing) => (
              <Card
                className={cn(
                  "transition",
                  selectedListingId === listing.id
                    ? "border-primary/50 shadow-primary/10"
                    : null,
                )}
                key={listing.id}
              >
                <CardHeader>
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <CardTitle className="text-xl">{listing.title}</CardTitle>
                      <CardDescription className="mt-2">
                        {listing.address}, {listing.city}, {listing.state}
                      </CardDescription>
                    </div>
                    <span className="w-fit rounded-full border border-border bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
                      {listing.isActive === "ACTIVE" ? "Active" : "Inactive"}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5">
                  <dl className="grid gap-3 text-sm sm:grid-cols-4">
                    <ListingFact label="Slug" value={listing.slug} />
                    <ListingFact
                      label="Base price"
                      value={`$${listing.basePrice}`}
                    />
                    <ListingFact
                      label="Capacity"
                      value={String(listing.capacity)}
                    />
                    <ListingFact
                      label="Bookings"
                      value={String(listing.counts.bookings)}
                    />
                  </dl>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      onClick={() => startEditing(listing)}
                      type="button"
                      variant="secondary"
                    >
                      Edit
                    </Button>
                    <Button
                      disabled={isMutating}
                      onClick={() => void handleDelete(listing)}
                      type="button"
                      variant="ghost"
                    >
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Dialog open={isFormOpen}>
        <DialogContent>
          <DialogHeader>
            <p className="text-xs font-semibold uppercase tracking-normal text-muted-foreground">
              {selectedListing ? "Update listing" : "Add listing"}
            </p>
            <DialogTitle>
              {selectedListing ? selectedListing.title : "New rental listing"}
            </DialogTitle>
            <DialogDescription>
              Slugs are generated by the API from the title and address.
            </DialogDescription>
          </DialogHeader>
          <div className="px-6 pb-6">
            <ListingForm
              form={form}
              formError={formError}
              isMutating={isMutating}
              isEditing={Boolean(selectedListing)}
              onCancel={resetForm}
              onFieldChange={updateField}
              onSubmit={handleSubmit}
            />
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}

function ListingFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 border-t border-border/70 pt-3">
      <dt className="text-xs font-semibold uppercase tracking-normal text-muted-foreground">
        {label}
      </dt>
      <dd className="truncate text-card-foreground">{value}</dd>
    </div>
  );
}

function ListingForm({
  form,
  formError,
  isEditing,
  isMutating,
  onCancel,
  onFieldChange,
  onSubmit,
}: {
  form: ListingFormState;
  formError: string | null;
  isEditing: boolean;
  isMutating: boolean;
  onCancel: () => void;
  onFieldChange: (
    field: keyof ListingFormState,
    value: ListingFormState[keyof ListingFormState],
  ) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form className="grid gap-5" onSubmit={onSubmit}>
      {formError ? <Alert>{formError}</Alert> : null}

      <FieldGroup>
        <Field
          label="Title"
          name="title"
          onChange={(value) => onFieldChange("title", value)}
          required
          value={form.title}
        />
        <div className="grid gap-2">
          <Label htmlFor="isActive">Status</Label>
          <Select
            id="isActive"
            name="isActive"
            onChange={(event) =>
              onFieldChange("isActive", event.target.value as ListingStatus)
            }
            value={form.isActive}
          >
            <option value="INACTIVE">Inactive</option>
            <option value="ACTIVE">Active</option>
          </Select>
        </div>
      </FieldGroup>

      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          onChange={(event) => onFieldChange("description", event.target.value)}
          placeholder="A bright two-bedroom stay near transit..."
          value={form.description}
        />
      </div>

      <Field
        label="Address"
        name="address"
        onChange={(value) => onFieldChange("address", value)}
        required
        value={form.address}
      />

      <FieldGroup>
        <Field
          label="City"
          name="city"
          onChange={(value) => onFieldChange("city", value)}
          required
          value={form.city}
        />
        <Field
          label="State"
          name="state"
          onChange={(value) => onFieldChange("state", value)}
          required
          value={form.state}
        />
      </FieldGroup>

      <FieldGroup>
        <Field
          label="Country"
          name="country"
          onChange={(value) => onFieldChange("country", value)}
          required
          value={form.country}
        />
        <Field
          label="Amenities"
          name="amenities"
          onChange={(value) => onFieldChange("amenities", value)}
          placeholder="wifi, parking, pool"
          required
          value={form.amenities}
        />
      </FieldGroup>

      <FieldGroup>
        <Field
          label="Latitude"
          name="latitude"
          onChange={(value) => onFieldChange("latitude", value)}
          required
          type="number"
          value={form.latitude}
        />
        <Field
          label="Longitude"
          name="longitude"
          onChange={(value) => onFieldChange("longitude", value)}
          required
          type="number"
          value={form.longitude}
        />
      </FieldGroup>

      <FieldGroup>
        <Field
          label="Rooms"
          name="rooms"
          onChange={(value) => onFieldChange("rooms", value)}
          required
          type="number"
          value={form.rooms}
        />
        <Field
          label="Bedrooms"
          name="bedrooms"
          onChange={(value) => onFieldChange("bedrooms", value)}
          required
          type="number"
          value={form.bedrooms}
        />
      </FieldGroup>

      <FieldGroup>
        <Field
          label="Bathrooms"
          name="bathrooms"
          onChange={(value) => onFieldChange("bathrooms", value)}
          type="number"
          value={form.bathrooms}
        />
        <Field
          label="Capacity"
          name="capacity"
          onChange={(value) => onFieldChange("capacity", value)}
          required
          type="number"
          value={form.capacity}
        />
      </FieldGroup>

      <FieldGroup>
        <Field
          label="Check-in"
          name="checkingInTime"
          onChange={(value) => onFieldChange("checkingInTime", value)}
          type="time"
          value={form.checkingInTime}
        />
        <Field
          label="Check-out"
          name="checkingOutTime"
          onChange={(value) => onFieldChange("checkingOutTime", value)}
          type="time"
          value={form.checkingOutTime}
        />
      </FieldGroup>

      <FieldGroup>
        <Field
          label="Base price"
          name="basePrice"
          onChange={(value) => onFieldChange("basePrice", value)}
          required
          type="number"
          value={form.basePrice}
        />
        <Field
          label="Deposit %"
          name="securityDepositPercentage"
          onChange={(value) =>
            onFieldChange("securityDepositPercentage", value)
          }
          type="number"
          value={form.securityDepositPercentage}
        />
      </FieldGroup>

      <FieldGroup>
        <Field
          label="Cleaning fee"
          name="cleaningFee"
          onChange={(value) => onFieldChange("cleaningFee", value)}
          type="number"
          value={form.cleaningFee}
        />
        <Field
          label="Service fee"
          name="serviceFee"
          onChange={(value) => onFieldChange("serviceFee", value)}
          type="number"
          value={form.serviceFee}
        />
      </FieldGroup>

      <Field
        label="Other fees"
        name="otherFees"
        onChange={(value) => onFieldChange("otherFees", value)}
        type="number"
        value={form.otherFees}
      />

      <div className="flex flex-wrap gap-3 pt-2">
        <Button disabled={isMutating} type="submit">
          {isMutating
            ? "Saving..."
            : isEditing
              ? "Update listing"
              : "Add listing"}
        </Button>
        <Button onClick={onCancel} type="button" variant="secondary">
          Cancel
        </Button>
      </div>
    </form>
  );
}

function FieldGroup({ children }: { children: ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
}

function Field({
  label,
  name,
  onChange,
  required,
  type = "text",
  value,
  placeholder,
}: {
  label: string;
  name: keyof ListingFormState;
  onChange: (value: string) => void;
  required?: boolean;
  type?: "number" | "text" | "time";
  value: string;
  placeholder?: string;
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        min={type === "number" ? 0 : undefined}
        name={name}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        step={type === "number" ? "any" : undefined}
        type={type}
        value={value}
      />
    </div>
  );
}

function toCreatePayload(
  form: ListingFormState,
  ownerId: string,
): CreateListingPayload {
  return {
    ...toSharedPayload(form),
    ownerId,
  };
}

function toUpdatePayload(form: ListingFormState): UpdateListingPayload {
  return toSharedPayload(form);
}

function toSharedPayload(form: ListingFormState) {
  return {
    title: form.title.trim(),
    description: optionalString(form.description),
    longitude: requiredNumber(form.longitude, "Longitude"),
    latitude: requiredNumber(form.latitude, "Latitude"),
    address: form.address.trim(),
    city: form.city.trim(),
    state: form.state.trim(),
    country: form.country.trim(),
    isActive: form.isActive,
    rooms: requiredNumber(form.rooms, "Rooms"),
    bedrooms: requiredNumber(form.bedrooms, "Bedrooms"),
    bathrooms: optionalNumber(form.bathrooms),
    capacity: requiredNumber(form.capacity, "Capacity"),
    amenities: form.amenities
      .split(",")
      .map((amenity) => amenity.trim())
      .filter(Boolean),
    checkingInTime: optionalString(form.checkingInTime),
    checkingOutTime: optionalString(form.checkingOutTime),
    basePrice: requiredNumber(form.basePrice, "Base price"),
    securityDepositPercentage: optionalNumber(form.securityDepositPercentage),
    cleaningFee: optionalNumber(form.cleaningFee),
    serviceFee: optionalNumber(form.serviceFee),
    otherFees: optionalNumber(form.otherFees),
  };
}

function requiredNumber(value: string, label: string) {
  const numberValue = Number(value);

  if (!value || Number.isNaN(numberValue)) {
    throw new Error(`${label} must be a number.`);
  }

  return numberValue;
}

function optionalNumber(value: string) {
  if (!value) {
    return null;
  }

  const numberValue = Number(value);

  if (Number.isNaN(numberValue)) {
    return null;
  }

  return numberValue;
}

function optionalString(value: string) {
  const trimmedValue = value.trim();

  return trimmedValue ? trimmedValue : null;
}

function optionalNumberToString(value?: number | null) {
  return typeof value === "number" ? String(value) : "";
}
