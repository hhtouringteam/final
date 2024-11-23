export function formatVND(amount) {
  const roundedAmount = Math.round(amount / 1000) * 1000
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(roundedAmount)
}
