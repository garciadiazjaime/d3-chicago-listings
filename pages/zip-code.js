import React, { Component } from 'react'

import { getPricesFor } from '../lib/place'
import { renderHistoricalPrice } from '../lib/d3'
import { mostAffordable, mostExpensive, priceRange, containerStyle } from '../styles/main'

export default class extends Component {

  static getInitialProps ({ query }) {
    return {
      zipCode: query.q
    }
  }

  componentDidMount() {
    queue()
      .defer(d3.csv, '/static/1BD_Listing_Chicago_Zip.csv')
      .await((error, prices) => {
        const { zipCode } = this.props
        const data = getPricesFor(prices, zipCode)
        renderHistoricalPrice(Object.entries(data))
      })
  }

  render() {
    const { zipCode } = this.props
    return (<div style={containerStyle}>
      <h1>Historical prices for {zipCode}, <small>last 10 years.</small></h1>
      <div style={priceRange}>
        <span style={mostAffordable} /> Most Affordable
        <span style={mostExpensive} /> Most Expensive
      </div>
      <svg width="960" height="500"></svg>
      <div id="tooltip"></div>
    </div>)
  }
}
