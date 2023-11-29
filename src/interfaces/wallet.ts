export interface WalletAttributes {
  userId: string;
  balance: number;
  readonly UUID: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TopupInput {
  payment_type: PaymentType;
  amount: number;
  bank: Bank;
}

export type Bank = "BCA" | "BNI" | "PERMATA" | "BRI";

export type PaymentType = "Top Up" | "Payment";
