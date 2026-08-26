import { useState } from "react";
import { createInvitations } from "../services/invitations";
import { generateInvitationCSV } from "../services/invitationExport";

interface GuestRow {
  name: string;
  guest_limit: number;
}

interface CreatedGuest {
  id: string;
  name: string;
  guest_limit: number;
  invitation_token: string;
}

export default function GuestUpload() {
  const [guests, setGuests] = useState<GuestRow[]>([]);
  const [createdGuests, setCreatedGuests] = useState<CreatedGuest[]>([]);

  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [creating, setCreating] = useState(false);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setError("");
    setSuccess("");
    setGuests([]);
    setCreatedGuests([]);
    setFileName(file.name);

    if (!file.name.toLowerCase().endsWith(".csv")) {
      setError(
        "Please upload a CSV file. In Excel, use File → Save As → CSV UTF-8.",
      );
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      const text = event.target?.result;

      if (typeof text !== "string") {
        setError("Could not read the file.");
        return;
      }

      try {
        const parsedGuests = parseCSV(text);

        setGuests(parsedGuests);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Could not read the guest list.",
        );
      }
    };

    reader.onerror = () => {
      setError("There was a problem reading the file.");
    };

    reader.readAsText(file);
  }

  function parseCSV(csv: string): GuestRow[] {
    // Remove UTF-8 BOM if Excel added one.
    const cleanedCSV = csv.replace(/^\uFEFF/, "").trim();

    const lines = cleanedCSV
      .split(/\r?\n/)
      .filter((line) => line.trim() !== "");

    if (lines.length < 2) {
      throw new Error(
        "The CSV file must contain a header and at least one guest.",
      );
    }

    const headers = parseCSVLine(lines[0]).map((header) =>
      header.trim().toLowerCase(),
    );

    if (
      headers.length !== 2 ||
      headers[0] !== "name" ||
      headers[1] !== "guest_limit"
    ) {
      throw new Error(
        "The CSV must have exactly these columns: name, guest_limit",
      );
    }

    const parsed: GuestRow[] = [];
    const names = new Set<string>();

    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);

      if (values.length !== 2) {
        throw new Error(
          `Row ${i + 1}: expected 2 columns (name, guest_limit).`,
        );
      }

      const name = values[0].trim();
      const guestLimit = Number(values[1].trim());

      if (!name) {
        throw new Error(`Row ${i + 1}: guest name is missing.`);
      }

      if (!Number.isInteger(guestLimit)) {
        throw new Error(`Row ${i + 1}: guest_limit must be a whole number.`);
      }

      if (![1, 2, 3].includes(guestLimit)) {
        throw new Error(`Row ${i + 1}: guest_limit must be 1, 2, or 3.`);
      }

      const normalizedName = name.toLowerCase();

      if (names.has(normalizedName)) {
        throw new Error(`Duplicate guest name found: "${name}".`);
      }

      names.add(normalizedName);

      parsed.push({
        name,
        guest_limit: guestLimit,
      });
    }

    if (parsed.length === 0) {
      throw new Error("No guests were found in the file.");
    }

    return parsed;
  }

  /**
   * Basic CSV parser.
   *
   * Supports values wrapped in quotes, which is useful
   * when a guest name contains a comma.
   */
  function parseCSVLine(line: string): string[] {
    const values: string[] = [];
    let current = "";
    let insideQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const character = line[i];

      if (character === '"') {
        if (insideQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          insideQuotes = !insideQuotes;
        }
      } else if (character === "," && !insideQuotes) {
        values.push(current);
        current = "";
      } else {
        current += character;
      }
    }

    if (insideQuotes) {
      throw new Error("The CSV contains an unmatched quotation mark.");
    }

    values.push(current);

    return values;
  }

  async function handleCreateInvitations() {
    if (guests.length === 0) {
      setError("Please upload a guest list first.");
      return;
    }

    setCreating(true);
    setError("");
    setSuccess("");
    setCreatedGuests([]);

    try {
      const created = await createInvitations(guests);

      setCreatedGuests(created);

      setSuccess(
        `${created.length} invitation${
          created.length === 1 ? "" : "s"
        } created successfully!`,
      );
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error ? err.message : "Could not create invitations.",
      );
    } finally {
      setCreating(false);
    }
  }

  function handleDownload() {
    if (createdGuests.length === 0) {
      setError("There are no generated invitations to download.");
      return;
    }

    generateInvitationCSV(createdGuests);

    setSuccess("Your invitation list has been downloaded.");
  }

  function getInvitationUrl(token: string) {
    return `${window.location.origin}/invite/${token}`;
  }

  function getGuestAllowanceText(limit: number) {
    if (limit === 1) {
      return "Guest only";
    }

    if (limit === 2) {
      return "+1 guest";
    }

    return "+2 guests";
  }

  function handleCopyLink(token: string) {
    const url = getInvitationUrl(token);

    navigator.clipboard
      .writeText(url)
      .then(() => {
        setSuccess("Invitation link copied!");
      })
      .catch(() => {
        setError("Could not copy the link. Please copy it from the table.");
      });
  }

  function handleReset() {
    setGuests([]);
    setCreatedGuests([]);
    setFileName("");
    setError("");
    setSuccess("");
  }

  return (
    <div className="admin-workspace">
      <div className="admin-title">
        <p className="section-eyebrow">Guest management</p>
        <h1>Create invitations</h1>
        <p>Upload a guest list, set each guest allowance, and generate private invitation links.</p>
      </div>

      {/* Upload */}
      <section className="upload-card">
        <p className="step-label">Step 1</p>
        <h2>Upload Guest List</h2>

        <p>Your CSV must contain:</p>

        <strong>name, guest_limit</strong>

        <p>Guest limit: 1 = guest only, 2 = +1, 3 = +2.</p>

        <label className="upload-button" htmlFor="guest-list">Choose CSV file</label>
        <input id="guest-list" type="file" accept=".csv,text/csv" onChange={handleFileChange} />

        {fileName && (
          <p>
            Selected file: <strong>{fileName}</strong>
          </p>
        )}
      </section>

      {/* Error */}
      {error && (
        <section className="upload-message is-error">
          <p role="alert">❌ {error}</p>
        </section>
      )}

      {/* Success */}
      {success && (
        <section className="upload-message is-success">
          <p>✅ {success}</p>
        </section>
      )}

      {/* Preview */}
      {guests.length > 0 && (
        <section className="guest-list">
          <div className="guest-list-header">
            <div><p className="step-label">Step 2</p><h2>Guest Preview</h2></div>
            <span>{guests.length} guests</span>
          </div>

          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Allowance</th>
              </tr>
            </thead>

            <tbody>
              {guests.map((guest, index) => (
                <tr key={`${guest.name}-${index}`}>
                  <td>{guest.name}</td>
                  <td>{getGuestAllowanceText(guest.guest_limit)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="card-actions">
          <button
            type="button"
            className="primary-button"
            onClick={handleCreateInvitations}
            disabled={creating}
          >
            {creating ? "Creating Invitations..." : "Create Invitations"}
          </button>
          <button type="button" className="secondary-button" onClick={handleReset}>Start Over</button>
          </div>
        </section>
      )}

      {/* Generated invitations */}
      {createdGuests.length > 0 && (
        <section className="guest-list">
          <div className="guest-list-header">
            <div><p className="step-label">Step 3</p><h2>Generated Invitations</h2></div>

          <p>Your personalized invitation links are ready.</p>

          <button type="button" className="secondary-button" onClick={handleDownload}>
            Download Invitation List
          </button>
          </div>

          <table>
            <thead>
              <tr>
                <th>Guest</th>
                <th>Allowance</th>
                <th>Invitation Link</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {createdGuests.map((guest) => {
                const invitationUrl = getInvitationUrl(guest.invitation_token);

                return (
                  <tr key={guest.id}>
                    <td>{guest.name}</td>

                    <td>{getGuestAllowanceText(guest.guest_limit)}</td>

                    <td>
                      <a
                        className="invitation-link"
                        href={invitationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Open Invitation
                      </a>
                    </td>

                    <td>
                      <button
                        type="button" className="text-button"
                        onClick={() => handleCopyLink(guest.invitation_token)}
                      >
                        Copy Link
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      )}

      {/* Reset */}
      {(guests.length > 0 || createdGuests.length > 0) && (
        <section className="reset-row">
          <button type="button" className="secondary-button" onClick={handleReset}>
            Start Over
          </button>
        </section>
      )}
    </div>
  );
}
