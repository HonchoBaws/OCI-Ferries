// Paystack configuration and utilities
export const PAYSTACK_CONFIG = {
  publicKey: 'pk_test_6902dc46b7f610c7fda12308c8d4736030863dcd',
  currency: 'NGN',
  channels: ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer']
};

export interface PaystackPaymentData {
  email: string;
  amount: number; // Amount in kobo (multiply by 100)
  reference: string;
  metadata: {
    bookingId: string;
    userId: string;
    routeId: string;
    seats: number;
    customerName: string;
  };
}

export interface PaystackResponse {
  message: string;
  reference: string;
  status: string;
  trans: string;
  transaction: string;
  trxref: string;
}

// Generate unique payment reference
export const generatePaymentReference = (): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `OCI_${timestamp}_${random}`;
};

// Initialize Paystack payment
export const initializePaystackPayment = (
  paymentData: PaystackPaymentData,
  onSuccess: (response: PaystackResponse) => void,
  onClose: () => void
): void => {
  // @ts-ignore - PaystackPop is loaded via script tag
  if (typeof PaystackPop !== 'undefined') {
    // @ts-ignore
    const handler = PaystackPop.setup({
      key: PAYSTACK_CONFIG.publicKey,
      email: paymentData.email,
      amount: paymentData.amount,
      currency: PAYSTACK_CONFIG.currency,
      ref: paymentData.reference,
      channels: PAYSTACK_CONFIG.channels,
      metadata: paymentData.metadata,
      callback: onSuccess,
      onClose: onClose
    });
    
    handler.openIframe();
  } else {
    console.error('Paystack script not loaded');
    alert('Payment system not available. Please try again later.');
  }
};