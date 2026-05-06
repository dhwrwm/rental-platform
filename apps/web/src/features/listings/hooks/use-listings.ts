"use client";

import { useCallback, useEffect, useState } from "react";
import {
  createListing,
  deleteListing,
  fetchListings,
  updateListing,
} from "../api/listings-api";
import type {
  CreateListingPayload,
  Listing,
  UpdateListingPayload,
} from "../types/listing";

export function useListings() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);

  const loadListings = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      setListings(await fetchListings());
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to load listings.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadListings();
  }, [loadListings]);

  async function addListing(payload: CreateListingPayload) {
    setIsMutating(true);
    setError(null);

    try {
      const listing = await createListing(payload);
      setListings((current) => [listing, ...current]);
      return listing;
    } catch (caughtError) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to create listing.";
      setError(message);
      throw new Error(message);
    } finally {
      setIsMutating(false);
    }
  }

  async function editListing(id: string, payload: UpdateListingPayload) {
    setIsMutating(true);
    setError(null);

    try {
      const listing = await updateListing(id, payload);
      setListings((current) =>
        current.map((item) => (item.id === listing.id ? listing : item)),
      );
      return listing;
    } catch (caughtError) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to update listing.";
      setError(message);
      throw new Error(message);
    } finally {
      setIsMutating(false);
    }
  }

  async function removeListing(id: string) {
    setIsMutating(true);
    setError(null);

    try {
      await deleteListing(id);
      setListings((current) => current.filter((listing) => listing.id !== id));
    } catch (caughtError) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to delete listing.";
      setError(message);
      throw new Error(message);
    } finally {
      setIsMutating(false);
    }
  }

  return {
    addListing,
    editListing,
    error,
    isLoading,
    isMutating,
    listings,
    refresh: loadListings,
    removeListing,
  };
}
