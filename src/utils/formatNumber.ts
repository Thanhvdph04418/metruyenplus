export const formatNumberSocial = (number: number) =>
  Intl.NumberFormat('en', { notation: 'compact' }).format(number)

export function formatCurrency(currency: number) {
  return new Intl.NumberFormat('de-DE').format(currency)
}

export const formatNumber = (num: number): string => {
  if (num === null || num === undefined) return '0'

  if (num < 1000) return num.toString()

  const units = ['', 'K', 'M', 'B']
  const order = Math.floor(Math.log10(num) / 3)
  const unitName = units[order]
  const value = num / Math.pow(1000, order)

  // Format to 1 decimal place if there's a decimal part
  return value.toFixed(value % 1 === 0 ? 0 : 1) + unitName
}
