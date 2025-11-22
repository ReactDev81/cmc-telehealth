declare module 'react-native-razorpay' {
  export interface RazorpayPrefillOptions {
    email?: string;
    contact?: string;
    name?: string;
  }

  export interface RazorpayThemeOptions {
    color?: string;
  }

  export interface RazorpayRetryOptions {
    enabled?: boolean;
    max_count?: number;
  }

  export interface RazorpayCheckoutOptions {
    key: string;
    amount: string | number;
    currency?: string;
    name?: string;
    description?: string;
    order_id?: string;
    image?: string;
    prefill?: RazorpayPrefillOptions;
    notes?: Record<string, string>;
    theme?: RazorpayThemeOptions;
    retry?: RazorpayRetryOptions;
    send_sms_hash?: boolean;
    modal?: {
      confirm_close?: boolean;
      animation?: boolean;
      handleback?: boolean;
    };
  }

  export interface RazorpaySuccessResponse {
    razorpay_payment_id: string;
    razorpay_order_id?: string;
    razorpay_signature?: string;
    [key: string]: unknown;
  }

  export interface RazorpayErrorResponse {
    code?: string | number;
    description?: string;
    reason?: string;
    source?: string;
    step?: string;
    metadata?: unknown;
    message?: string;
    [key: string]: unknown;
  }

  export interface ExternalWalletSelectionData {
    external_wallet: string;
  }

  namespace RazorpayCheckout {
    function open(options: RazorpayCheckoutOptions): Promise<RazorpaySuccessResponse>;
    function onExternalWalletSelection(
      callback: (data: ExternalWalletSelectionData) => void
    ): void;
  }

  export default RazorpayCheckout;
}

