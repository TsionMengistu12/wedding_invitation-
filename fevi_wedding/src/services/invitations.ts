import { supabase } from "../lib/supabase";
import type { GuestUploadRow } from "../types/guest";

export async function createGuests(
  guests: GuestUploadRow[]
) {
  const { data, error } = await supabase.rpc(
    "create_guests",
    {
      guest_rows: guests,
    }
  );

  if (error) {
    throw new Error(`Guest creation failed: ${error.message}`);
  }

  if (!Array.isArray(data)) {
    throw new Error("Guest creation returned an invalid response.");
  }

  return data;
}
