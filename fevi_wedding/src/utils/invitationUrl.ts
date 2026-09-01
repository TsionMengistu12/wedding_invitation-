export function normalizeInvitationToken(token: string): string {
  const trimmed = token.trim();

  try {
    return decodeURIComponent(trimmed);
  } catch {
    return trimmed;
  }
}

export function getInvitationUrl(token: string): string {
  const normalized = normalizeInvitationToken(token);
  return `${window.location.origin}/invite/${encodeURIComponent(normalized)}`;
}

export function parseInvitationToken(input: string): string | null {
  const trimmed = input.trim();

  if (!trimmed) {
    return null;
  }

  try {
    const url = new URL(trimmed);
    const parts = url.pathname.split("/").filter(Boolean);
    const inviteIndex = parts.indexOf("invite");

    if (inviteIndex !== -1 && parts[inviteIndex + 1]) {
      return normalizeInvitationToken(parts[inviteIndex + 1]);
    }
  } catch {
    // Not a URL — treat the scanned value as the raw token.
  }

  return normalizeInvitationToken(trimmed);
}
