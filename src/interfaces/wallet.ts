export interface WalletAttributes {
  userId: string;
  balance: number;
  readonly UUID: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TopupInput {
  payment_type: "bank_transfer";
  item_name: string;
  amount: number;
  bank: Bank;
}

export type Bank = "BCA" | "BNI" | "PERMATA" | "BRI";
