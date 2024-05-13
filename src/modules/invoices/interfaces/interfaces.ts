export interface InvoiceData {
  project: string;
  currency: string;
  description: string;
  failure_url: string;
  ip: string;
  order_id: string;
  price: string;
  result_url: string;
  success_url: string;
  user_contact_email: string;
  user_name: string;
  user_phone: string;
  signature?: string;
}

export interface InvoiceStatusData {
  project: string;
  invoice_id: string;
  signature?: string;
}
