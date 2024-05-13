export interface PaymentData {
  project: any;
  card_token: string;
  user_contact_email: any;
  user_name: any;
  description: string;
  price: string;
  currency: string;
  order_id: string;
  user_phone: string;
  result_url: any;
  success_url: any;
  failure_url: any;
  ip: string;
  signature?: string;
}

export interface TransactionStatusData {
  project: string;
  payment_id: string;
  signature?: string;
}

export interface RefundTransactionData {
  result_url: string;
  payment_id: string;
  project?: string;
  signature?: string;
}

export interface RefundTransactionStatusData {
  refund_id: string;
  project: string;
  signature?: string;
}
