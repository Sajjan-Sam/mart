import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amountInPaise: number): string {
  const rupees = amountInPaise / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(rupees);
}

export function formatPhoneNumber(phone: string): string {
  // Ensure phone starts with +91
  if (phone.startsWith('+91')) {
    return phone;
  }
  return `+91${phone}`;
}

export function createWhatsAppLink(phone: string, productName: string): string {
  const formattedPhone = formatPhoneNumber(phone);
  const message = `Hi! I'm interested in buying your ${productName} that I saw on HostelMart. Is it still available?`;
  return `https://wa.me/${formattedPhone.replace('+', '')}?text=${encodeURIComponent(message)}`;
}

export function getUrgencyColor(urgency: string): string {
  switch (urgency) {
    case 'high':
      return 'bg-red-100 text-red-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'low':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'low':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}
