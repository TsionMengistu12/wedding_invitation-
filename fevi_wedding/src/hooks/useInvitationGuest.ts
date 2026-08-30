import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { normalizeInvitationToken } from "../utils/invitationUrl";

export interface Guest {
  name: string;
  guest_limit: number;
}

export function useInvitationGuest(token?: string) {
  const [guest, setGuest] = useState<Guest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadGuest() {
      const normalizedToken = token ? normalizeInvitationToken(token) : "";

      if (!normalizedToken) {
        setError("Invalid invitation.");
        setLoading(false);
        return;
      }

      try {
        const { data, error: invitationError } =
          await supabase.rpc(
            "get_invitation_by_token",
            {
              token_value: normalizedToken,
            }
          );

        if (invitationError) {
          throw invitationError;
        }

        if (!data?.length) {
          setError(
            "This invitation could not be found."
          );
          return;
        }

        setGuest(data[0]);
      } catch (requestError) {
        console.error(requestError);

        setError(
          "We couldn't load this invitation."
        );
      } finally {
        setLoading(false);
      }
    }

    loadGuest();
  }, [token]);

  return {
    guest,
    loading,
    error,
  };
}