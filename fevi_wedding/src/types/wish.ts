export interface Wish {
  id: string;
  author_name: string;
  wish_message: string;
  created_at: string;
}

export interface PendingWish extends Wish {
  guest_name: string | null;
  invitation_token: string;
  status: "pending" | "approved" | "rejected";
}

export interface SubmitWishResult {
  success: boolean;
  message: string;
}

export interface ModerateWishResult {
  success: boolean;
  message: string;
}
