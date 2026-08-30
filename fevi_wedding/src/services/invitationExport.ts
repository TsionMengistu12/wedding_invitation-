import { getInvitationUrl } from "../utils/invitationUrl";

interface GeneratedInvitation {
  name: string;
  guest_limit: number;
  invitation_token: string;
}

function getAllowanceText(limit: number) {
  if (limit === 1) {
    return "";
  }

  if (limit === 2) {
    return " You are welcome to bring one guest with you.";
  }

  return " You are welcome to bring two guests with you.";
}

export function generateInvitationCSV(
  invitations: GeneratedInvitation[]
) {
  const headers = [
    "Guest Name",
    "Allowed Guests",
    "Invitation Link",
    "WhatsApp Message",
  ];

  const rows = invitations.map((guest) => {
    const invitationLink = getInvitationUrl(guest.invitation_token);

    const message =
      `Hi ${guest.name}! \n\n` +
      `We are so excited to celebrate this special day with you!` +
      `${getAllowanceText(guest.guest_limit)}\n\n` +
      `Please find your digital wedding invitation below:\n\n` +
      `${invitationLink}\n\n` +
      `We can't wait to celebrate with you! 💍`;

    return [
      guest.name,
      guest.guest_limit,
      invitationLink,
      message,
    ];
  });

  const csvRows = [
    headers,
    ...rows,
  ];

  const csv = csvRows
    .map((row) =>
      row
        .map((value) => {
          const escaped = String(value)
            .replace(/"/g, '""');

          return `"${escaped}"`;
        })
        .join(",")
    )
    .join("\n");

  const blob = new Blob(
    ["\ufeff" + csv],
    {
      type: "text/csv;charset=utf-8;",
    }
  );

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;
  link.download = "wedding-invitations.csv";

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}