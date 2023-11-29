import type { Bank, TopupInput } from "../interfaces/wallet";

export interface UserTransactionDetail {
  UUID: string;
  email: string;
  username: string;
}

abstract class TransactionUtils {
  protected generateOrderId(UUID: string) {
    return `WP-${UUID}-${Math.round(new Date().getTime() / 1000)}`;
  }
}

export class GenerateBankTransaction extends TransactionUtils {
  public payment_type: "bank_transfer";
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
  }: TopupInput & UserTransactionDetail) {
    super();
    this.payment_type = payment_type;
    this.item_name = item_name;
    this.amount = amount;
    this.bank = bank;
    this.UUID = UUID;
    this.email = email;
    this.username = username;
  }

  public generateParameter() {
    return {
      payment_type: this.payment_type,
      transaction_details: {
        gross_amount: this.amount,
        order_id: this.generateOrderId(this.UUID),
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
