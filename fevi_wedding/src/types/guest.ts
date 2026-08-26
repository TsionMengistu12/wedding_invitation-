export interface Guest{
    id: string;
    name: string;
    invitation_token: string;
    guest_limit: number;
    guests_checked_in: number;
    checked_in: boolean;
    checked_in_at: string | null;
    created_at: string;
}
export interface GuestUploadRow{
    name: string;
    guest_limit: number;
}