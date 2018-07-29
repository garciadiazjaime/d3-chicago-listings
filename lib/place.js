export function getPricesFor(prices, zipCode) {
  const data = prices.find(item => item['Zip Code'] === zipCode)
  delete data['Zip Code']
  return data
}
