declare module "midtrans-client" {
  interface CoreApiConfig {
    isProduction: boolean;
    serverKey: string;
    clientKey: string;
  }

  interface ChargeResp {
    order_id: string;
    gross_amount: string;
    payment_type: string;
    transaction_time: string;
    fraud_status: string;
    permata_va_number?: string;
    merchant_id: string;
    masked_card?: string;
    signature_key: string;
    status_code: string;
    transaction_id: string;
    transaction_status: string;
    status_message: string;
  }

  class CoreApi {
    constructor(config: CoreApiConfig);

    charge(payload: Record<string, any>): Promise<ChargeResp>;
  }

  export { CoreApi };
}
