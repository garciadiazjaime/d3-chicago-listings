import React, { Component } from 'react'

import { getPricesFor } from '../lib/place'
import { renderHistoricalPrice } from '../lib/d3'
import { mostAffordable, mostExpensive, priceRange, containerStyle } from '../styles/main'

class ZipCodePage extends Component {

  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    queue()
      .defer(d3.csv, '/static/1BD_Listing_Chicago_Zip.csv')
      .await((error, prices) => {
        const zipCode = window.location.search.replace('?q=', '')
        const data = getPricesFor(prices, zipCode)
        renderHistoricalPrice(Object.entries(data))
        const zipCodes = prices.map(item => item['Zip Code']).filter(item => item)
        this.setState({
          prices,
          zipCodes,
          zipCode
        })
      })
  }

  onChangeHandler(zipCode) {
    window.location = `/zip-code?q=${zipCode}`
  }

  renderZipCodes() {
    const { zipCode, zipCodes } = this.state
    if (zipCode && zipCodes && zipCodes.length) {
      return (
        <select value={zipCode} onChange={(event) => this.onChangeHandler(event.target.value)}
          style={{ margin: '0 0 0 15px', fontSize: '20px' }}>
          { zipCodes.map(item => (<option value={item} key={item}>{item}</option>))}
        </select>
      )
    }
    return null
  }

  render() {
    const { zipCode } = this.state
    return (<div style={containerStyle}>
      <h1>Historical prices for {zipCode}, <small>last 10 years.</small></h1>
      <div style={priceRange}>
        <span style={mostAffordable} /> Most Affordable
        <span style={mostExpensive} /> Most Expensive
        {this.renderZipCodes()}
      </div>
      <svg width="960" height="500"></svg>
      <div id="tooltip"></div>
      <div>
        <a href={`https://www.google.com/maps/place/Chicago,+IL+${zipCode}`} target="_blank">See in Google Maps</a> <br />
        <a href={`https://www.trulia.com/for_sale/${zipCode}_zip/1p_beds/`} target="_blank">See Listings</a>
      </div>
    </div>)
  }
}

export default ZipCodePage
