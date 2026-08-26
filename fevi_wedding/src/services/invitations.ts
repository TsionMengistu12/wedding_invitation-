import { supabase } from "../lib/supabase";

interface GuestUploadRow {
  name: string;
  guest_limit: number;
}

export async function createInvitations(
  guests: GuestUploadRow[]
) {
  const { data, error } = await supabase.rpc(
    "create_invitations",
    {
      invitations: guests,
    }
  );

  if (error) {
    throw error;
  }

  return data;
}