import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Helper wajib untuk shadcn/ui
// Gabungkan class Tailwind dengan aman tanpa konflik
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format harga ke Rupiah
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

// Format tanggal ke format Indonesia
export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateString))
}

// Buat URL WhatsApp dari nomor
export function makeWhatsAppUrl(phoneNumber: string, message?: string): string {
  const cleaned = phoneNumber.replace(/\D/g, '').replace(/^0/, '62')
  const encoded = message ? `?text=${encodeURIComponent(message)}` : ''
  return `https://wa.me/${cleaned}${encoded}`
}
