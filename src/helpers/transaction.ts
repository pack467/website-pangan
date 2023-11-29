import type { Bank, PaymentType, TopupInput } from "../interfaces/wallet";

export interface UserTransactionDetail {
  UUID: string;
  email: string;
  username: string;
}

abstract class TransactionUtils {
  protected generateOrderId(UUID: string, payment_type: PaymentType) {
    return `WP-${UUID.replace(/-/g, ".")}-${this.generateString(5)}-${
      payment_type === "Top Up" ? "T" : "P"
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
}

export class GenerateBankTransaction extends TransactionUtils {
  public payment_type: PaymentType;
  public item_name: string;
  public amount: number;
  public bank: Bank;
  public readonly UUID: string;
  public email: string;
  public username: string;
  constructor({
    payment_type,
    item_name,
    bank,
    amount,
    UUID,
    username,
    email,
  }: TopupInput & UserTransactionDetail & { item_name?: string }) {
    super();
    this.payment_type = payment_type;
    this.item_name = item_name || "Topup";
    this.amount = amount;
    this.bank = bank;
    this.UUID = UUID;
    this.email = email;
    this.username = username;
  }

  public generateParameter() {
    return {
      payment_type: "bank_transfer",
      transaction_details: {
        gross_amount: this.amount,
        order_id: this.generateOrderId(this.UUID, this.payment_type),
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
