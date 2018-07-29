export function getPricesFor(prices, zipCode) {
  const data = prices.find(item => item['Zip Code'] === zipCode)
  const place = Object.assign({}, data)
  delete place['Zip Code']
  return place
}
