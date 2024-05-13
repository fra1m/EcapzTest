export interface P2PData {
  project: string;
  price: string;
  currency: string;
  order_id: string;
  result_url: string;
  redirect_url: string;
  signature?: string;
}

export interface P2P_StatusData {
  project: string;
  p2p_id: string;
  signature?: string;
}
