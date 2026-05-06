import type {
  CreateListingPayload,
  Listing,
  UpdateListingPayload,
} from "../types/listing";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

type ApiErrorResponse = {
  message?: string | string[];
  error?: string;
};

async function parseResponse<T>(response: Response): Promise<T> {
  const data = (await response.json().catch(() => null)) as
    | ApiErrorResponse
    | T
    | null;

  if (!response.ok) {
    const message =
      isApiErrorResponse(data) && "message" in data
        ? Array.isArray(data.message)
          ? data.message.join(", ")
          : data.message
        : null;

    throw new Error(message || "Unable to complete the listings request.");
  }

  return data as T;
}

function isApiErrorResponse(value: unknown): value is ApiErrorResponse {
  return typeof value === "object" && value !== null;
}

export async function fetchListings(): Promise<Listing[]> {
  const response = await fetch(`${apiBaseUrl}/api/listings`, {
    credentials: "include",
  });

  return parseResponse<Listing[]>(response);
}

export async function createListing(
  payload: CreateListingPayload,
): Promise<Listing> {
  const response = await fetch(`${apiBaseUrl}/api/listings`, {
    body: JSON.stringify(payload),
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  return parseResponse<Listing>(response);
}

export async function updateListing(
  id: string,
  payload: UpdateListingPayload,
): Promise<Listing> {
  const response = await fetch(`${apiBaseUrl}/api/listings/${id}`, {
    body: JSON.stringify(payload),
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    method: "PATCH",
  });

  return parseResponse<Listing>(response);
}

export async function deleteListing(id: string): Promise<{ success: boolean }> {
  const response = await fetch(`${apiBaseUrl}/api/listings/${id}`, {
    credentials: "include",
    method: "DELETE",
  });

  return parseResponse<{ success: boolean }>(response);
}
