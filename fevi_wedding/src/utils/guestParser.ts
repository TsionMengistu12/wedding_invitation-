import type { GuestUploadRow } from "../types/guest";
import type { AnnouncementType } from "../types/invitation";

function parseCSVLine(line: string): string[] {
  const values: string[] = [];
  let current = "";
  let insideQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (character === '"') {
      if (insideQuotes && line[index + 1] === '"') {
        current += '"';
        index += 1;
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

  if (insideQuotes) throw new Error("The CSV contains an unmatched quotation mark.");
  values.push(current);
  return values;
}

export function parseGuestCSV(
  csv: string,
  announcementType: AnnouncementType,
): GuestUploadRow[] {

  if(
    announcementType !== "bride" &&
    announcementType !== "groom"
  )throw new Error(
    "Please Select either the bride's guests or the groom's guests. ",
  );

  const lines = csv.replace(/^\uFEFF/, "").split(/\r?\n/).filter((line) => line.trim());
  if (lines.length < 2) throw new Error("The CSV must contain a header and at least one guest.");

  const headers = parseCSVLine(lines[0]).map((header) => header.trim().toLowerCase());
  if (headers.length !== 2 || headers[0] !== "name" || headers[1] !== "guest_limit") {
    throw new Error("CSV must contain exactly these columns: name, guest_limit");
  }

  const names = new Set<string>();
  return lines.slice(1).map((line, index) => {
    const rowNumber = index + 2;
    const values = parseCSVLine(line);
    if (values.length !== 2) throw new Error(`Row ${rowNumber}: expected name and guest_limit.`);

    const name = values[0].trim();
    const guestLimit = Number(values[1].trim());
    if (!name) throw new Error(`Row ${rowNumber}: name is required.`);

    if (!Number.isInteger(guestLimit) || ![1, 2, 3].includes(guestLimit)) {
      throw new Error(`Row ${rowNumber}: guest_limit must be 1, 2, or 3.`);
    }

    const normalizedName = name.toLocaleLowerCase();
    if (names.has(normalizedName)) throw new Error(`Row ${rowNumber}: duplicate guest name "${name}".`);
    names.add(normalizedName);
    return { name, guest_limit: guestLimit, announcement_type: announcementType };
  });
}
