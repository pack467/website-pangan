export interface TransactionAttributes {
  userId: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  readonly UUID: string;
  readonly signature: string;
  createdAt: Date;
  updatedAt: Date;
}

export type TransactionType = "Top up" | "Payment";

export type TransactionStatus =
  | "Pending"
  | "Success"
  | "Cancel"
  | "Refund"
  | "Failed"
  | "Expired"
  | "Deny"
  | "Settlement"
  | "Disbursement";
