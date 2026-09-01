import { supabase } from "../lib/supabase";
import type {
  ModerateWishResult,
  PendingWish,
  SubmitWishResult,
  Wish,
} from "../types/wish";

export const WISH_REFRESH_INTERVAL_MS = 15_000;

export function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string" &&
    error.message
  ) {
    return error.message;
  }

  return fallback;
}

export async function submitWish(
  token: string,
  message: string,
  authorName: string,
) {
  const args = {
    token_value: token,
    wish_message: message,
    author_name: authorName,
  };

  let { data, error } = await supabase.rpc("submit_wish", args);

  // Older deployments accepted only token_value and wish_message. Keep wish
  // submission working while the migration below is rolled out.
  if (error?.code === "PGRST202") {
    ({ data, error } = await supabase.rpc("submit_wish", {
      token_value: token,
      wish_message: message,
    }));
  }

  if (error) {
    throw error;
  }

  return (data?.[0] ?? data) as SubmitWishResult;
}

export async function fetchApprovedWishes() {
  const { data, error } = await supabase.rpc("get_approved_wishes");

  if (error) {
    throw error;
  }

  return (data ?? []) as Wish[];
}

export async function fetchPendingWishes() {
  const { data, error } = await supabase.rpc("get_pending_wishes");

  if (error) {
    throw error;
  }

  return (data ?? []) as PendingWish[];
}

export async function approveWish(wishId: string) {
  const { data, error } = await supabase.rpc("review_wish", {
    wish_id: wishId,
    next_status: "approved",
  });

  if (error) {
    throw error;
  }

  return (data?.[0] ?? data) as ModerateWishResult;
}

export async function rejectWish(wishId: string) {
  const { data, error } = await supabase.rpc("review_wish", {
    wish_id: wishId,
    next_status: "rejected",
  });

  if (error) {
    throw error;
  }

  return (data?.[0] ?? data) as ModerateWishResult;
}
