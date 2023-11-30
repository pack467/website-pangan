import type { ItemDetails } from "../interfaces/product";
import type { Bank, PaymentType, TopupInput } from "../interfaces/wallet";

export interface UserTransactionDetail {
  UUID: string;
  email: string;
  username: string;
}

export interface GeneratePaymentTransactionProps {
  items: ItemDetails[];
  bank: Bank;
  totalTransaction: number;
}

abstract class TransactionUtils {
  public bank: Bank;
  public readonly UUID: string;
  public email: string;
  public username: string;
  public payment_type: PaymentType;

  constructor({
    bank,
    UUID,
    username,
    email,
    payment_type,
  }: UserTransactionDetail & { bank: Bank; payment_type: PaymentType }) {
    this.bank = bank;
    this.UUID = UUID;
    this.email = email;
    this.username = username;
    this.payment_type = payment_type;
  }

  protected generateOrderId() {
    return `WP-${this.UUID.replace(/-/g, ".")}-${this.generateString(5)}-${
      this.payment_type === "Top Up" ? "T" : "P"
    }`;
  }

  private generateString(length: number) {
    let result = "";
    let characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < length; i++)
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    return result;
  }

  public bankTransfer() {
    switch (this.bank) {
      case "BCA":
        return {
          bank: this.bank,
          free_text: {
            inquiry: [
              {
                id: "selesaikan pembayaranmu",
                en: "finish your payment",
              },
            ],
          },
        };
      case "BNI":
        return {
          bank: this.bank,
          description: `payment`,
        };
      case "PERMATA":
        return {
          bank: this.bank,
        };
      case "BRI":
        return {
          bank: this.bank,
        };
      default:
        return {};
    }
  }
}

export class GenerateBankTransaction extends TransactionUtils {
  public item_name: string;
  public amount: number;

  constructor({
    payment_type,
    item_name,
    bank,
    amount,
    UUID,
    username,
    email,
  }: TopupInput & UserTransactionDetail & { item_name?: string }) {
    super({ UUID, username, email, bank, payment_type });
    this.item_name = item_name || "Topup";
    this.amount = amount;
  }

  public generateParameter() {
    return {
      payment_type: "bank_transfer",
      transaction_details: {
        gross_amount: this.amount,
        order_id: this.generateOrderId(),
      },
      customer_details: {
        email: this.email,
        first_name: this.username,
      },
      item_details: [
        {
          price: this.amount,
          quantity: 1,
          name: this.item_name,
          merchant_name: "WP",
        },
      ],
    };
  }

  public bodyRequest() {
    const {
      transaction_details,
      payment_type,
      item_details,
      customer_details,
    } = this.generateParameter();
    return {
      transaction_details,
      payment_type,
      item_details,
      customer_details,
      bank_transfer: this.bankTransfer(),
    };
  }
}

export class GeneratePaymentTransaction extends TransactionUtils {
  public items: ItemDetails[];
  public totalTransaction: number;
  constructor({
    items,
    username,
    UUID,
    email,
    bank,
    totalTransaction,
  }: GeneratePaymentTransactionProps & UserTransactionDetail) {
    super({ UUID, username, email, bank, payment_type: "Payment" });
    this.items = items;
    this.totalTransaction = totalTransaction;
  }

  public generateParameter() {
    return {
      payment_type: "bank_transfer",
      transaction_details: {
        gross_amount: this.totalTransaction,
        order_id: this.generateOrderId(),
      },
      customer_details: {
        email: this.email,
        first_name: this.username,
      },
      item_details: this.items,
    };
  }

  public bodyRequest() {
    const {
      transaction_details,
      payment_type,
      item_details,
      customer_details,
    } = this.generateParameter();
    return {
      transaction_details,
      payment_type,
      item_details,
      customer_details,
      bank_transfer: this.bankTransfer(),
    };
  }
}
