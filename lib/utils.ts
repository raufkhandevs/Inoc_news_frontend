import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const truncateText = (text: string, maxLength: number = 20) => {
  if (text.length <= maxLength) return text
  return `${text.substring(0, maxLength)}...`
}
