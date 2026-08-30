import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Html5Qrcode, Html5QrcodeScannerState } from "html5-qrcode";

import { supabase } from "../lib/supabase";
import { parseInvitationToken } from "../utils/invitationUrl";
import "../styles/admin.css";

interface CheckInResult {
  success: boolean;
  message: string;
  guest_name: string | null;
  guest_limit: number | null;
  already_checked_in: number;
  arriving: number;
  remaining: number;
}

export default function GatePage() {
  const navigate = useNavigate();

  const scannerRef = useRef<Html5Qrcode | null>(null);

  const [authorized, setAuthorized] = useState(false);

  const [loading, setLoading] = useState(true);

  const [scanning, setScanning] = useState(false);

  const [token, setToken] = useState<string | null>(null);

  const [guestName, setGuestName] = useState("");

  const [guestLimit, setGuestLimit] = useState<number | null>(null);

  const [alreadyCheckedIn, setAlreadyCheckedIn] = useState(0);

  const [arrivingGuests, setArrivingGuests] = useState(1);

  const [result, setResult] = useState<CheckInResult | null>(null);

  const [error, setError] = useState("");

  useEffect(() => {
    checkAccess();

    return () => {
      stopScanner();
    };
  }, []);

  async function checkAccess() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      navigate("/login");
      return;
    }

    const { data: role } = await supabase.rpc("get_my_role");

    if (role !== "gate") {
      await supabase.auth.signOut();
      navigate("/login");
      return;
    }

    setAuthorized(true);
    setLoading(false);
  }

  async function startScanner() {
    setError("");
    setResult(null);
    setToken(null);

    try {
      const scanner = new Html5Qrcode("qr-reader");

      scannerRef.current = scanner;

      await scanner.start(
        {
          facingMode: "environment",
        },
        {
          fps: 10,
          qrbox: {
            width: 250,
            height: 250,
          },
        },
        async (decodedText) => {
          await handleQRCode(decodedText);
        },
        () => {
          // Ignore normal scanning failures.
        },
      );

      setScanning(true);
    } catch (err) {
      console.error(err);

      setError("Could not access the camera. Please allow camera permission.");
    }
  }

  async function stopScanner() {
    const scanner = scannerRef.current;

    if (!scanner) {
      return;
    }

    try {
      if (scanner.getState() === Html5QrcodeScannerState.SCANNING) {
        await scanner.stop();
      }

      scanner.clear();
    } catch (err) {
      console.error(err);
    }

    scannerRef.current = null;
    setScanning(false);
  }

  async function handleQRCode(decodedText: string) {
    await stopScanner();

    setError("");
    setResult(null);

    const invitationToken = parseInvitationToken(decodedText);

    if (!invitationToken) {
      setError("Invalid QR code.");
      return;
    }

    setToken(invitationToken);

    /*
     * First retrieve public invitation information.
     */

    const { data, error } = await supabase.rpc("get_invitation_by_token", {
      token_value: invitationToken,
    });

    if (error) {
      console.error(error);

      setError("Could not validate this invitation.");

      return;
    }

    if (!data || data.length === 0) {
      setError("❌ INVALID INVITATION");
      return;
    }

    setGuestName(data[0].name);
    setGuestLimit(data[0].guest_limit);

    /*
     * We need the current check-in count.
     *
     * We get it through a gate-only function.
     */

    const { data: status, error: statusError } = await supabase.rpc(
      "get_checkin_status",
      {
        token_value: invitationToken,
      },
    );

    if (statusError) {
      console.error(statusError);

      setError("Could not retrieve check-in status.");

      return;
    }

    if (!status || status.length === 0) {
      setError("❌ INVALID INVITATION");
      return;
    }

    setAlreadyCheckedIn(status[0].guests_checked_in);
  }

  async function handleCheckIn() {
    if (!token) {
      setError("No invitation selected.");
      return;
    }

    setError("");

    const { data, error } = await supabase.rpc("check_in_invitation", {
      token_value: token,
      arriving_guests: arrivingGuests,
    });

    if (error) {
      console.error(error);

      setError(error.message);
      return;
    }

    if (!data || data.length === 0) {
      setError("No check-in response.");
      return;
    }

    const checkInResult = data[0] as CheckInResult;

    setResult(checkInResult);

    if (checkInResult.success) {
      setAlreadyCheckedIn(checkInResult.already_checked_in);
    }
  }

  function resetForNextGuest() {
    setToken(null);
    setGuestName("");
    setGuestLimit(null);
    setAlreadyCheckedIn(0);
    setArrivingGuests(1);
    setResult(null);
    setError("");
  }

  async function handleLogout() {
    await stopScanner();

    await supabase.auth.signOut();

    navigate("/login");
  }

  if (loading) {
    return <p>Checking access...</p>;
  }

  if (!authorized) {
    return null;
  }

  return (
    <main className="gate-page">
      <header className="gate-header">
        <h1>💍 Wedding Check-In</h1>

        <button onClick={handleLogout}>Logout</button>
      </header>

      {error && (
        <div>
          <h2>❌</h2>
          <p>{error}</p>

          <button onClick={resetForNextGuest}>Scan Another Invitation</button>
        </div>
      )}

      {!token && !error && (
        <section>
          <h2>Scan Guest QR Code</h2>

          <div
            id="qr-reader"
            style={{
              width: "100%",
              maxWidth: "400px",
            }}
          />

          {!scanning && (
            <button onClick={startScanner}>📷 Start Scanner</button>
          )}
        </section>
      )}

      {token && guestLimit !== null && !result && (
        <section>
          <h2>✓ Invitation Found</h2>

          <h1>{guestName}</h1>

          <p>
            Allowed:{" "}
            <strong>
              {guestLimit} {guestLimit === 1 ? "person" : "people"}
            </strong>
          </p>

          <p>
            Already entered: <strong>{alreadyCheckedIn}</strong>
          </p>

          <p>
            Remaining: <strong>{guestLimit - alreadyCheckedIn}</strong>
          </p>

          <hr />

          <h3>How many are arriving now?</h3>

          <select
            value={arrivingGuests}
            onChange={(event) => setArrivingGuests(Number(event.target.value))}
          >
            {Array.from(
              {
                length: Math.max(1, guestLimit - alreadyCheckedIn),
              },
              (_, index) => index + 1,
            ).map((number) => (
              <option key={number} value={number}>
                {number}
              </option>
            ))}
          </select>

          <br />
          <br />

          <button onClick={handleCheckIn}>
            ✓ Admit {arrivingGuests}{" "}
            {arrivingGuests === 1 ? "Person" : "People"}
          </button>

          <br />

          <button onClick={resetForNextGuest}>Cancel</button>
        </section>
      )}

      {result && (
        <section>
          {result.success ? (
            <>
              <h1>✅ ADMITTED</h1>

              <h2>{result.guest_name}</h2>

              <p>
                {result.arriving} {result.arriving === 1 ? "person" : "people"}{" "}
                admitted.
              </p>

              <p>
                Total entered: <strong>{result.already_checked_in}</strong>
                {" / "}
                {result.guest_limit}
              </p>

              <p>Remaining: {result.remaining}</p>
            </>
          ) : (
            <>
              <h1>❌ NOT ADMITTED</h1>

              <h2>{result.guest_name}</h2>

              <p>{result.message}</p>

              <p>Allowed: {result.guest_limit}</p>

              <p>Already entered: {result.already_checked_in}</p>
            </>
          )}

          <button onClick={resetForNextGuest}>Scan Next Guest</button>
        </section>
      )}
    </main>
  );
}
