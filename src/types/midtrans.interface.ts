export interface MidtransWebhookPayload {
    // 1. Base
    order_id: string; // ID pesanan unik dari backend kamu
    transaction_id: string; // ID transaksi otomatis dari sistem Midtrans
    transaction_status:
        | "settlement"
        | "capture"
        | "pending"
        | "deny"
        | "cancel"
        | "expire";
    gross_amount: string; // Total nominal uang (berbentuk String, contoh: "50000.00")
    payment_type: "qris" | "gopay" | "shopeepay" | "bank_transfer" | string;
    status_code: string; // Kode status (contoh: "200" jika sukses)
    status_message: string; // Pesan status dari Midtrans
    transaction_time: string; // Waktu transaksi (YYYY-MM-DD HH:MM:SS)
    merchant_id: string; // ID Merchant Midtrans kamu
    signature_key: string; // Kode keamanan untuk validasi (SHA512)
    currency: "IDR" | string; // Mata uang

    // 2. Optional
    fraud_status?: 'accept' | 'challenge' | 'deny'; 
    va_numbers?: Array<{
        va_number: string; // Nomor VA untuk bayar (bisa kamu log ke konsol)
        bank: "bca" | "bni" | "bri" | "permata" | string;
    }>;
    acquirer?: string; // Bank penyedia QRIS (misal: "gopay")
}
