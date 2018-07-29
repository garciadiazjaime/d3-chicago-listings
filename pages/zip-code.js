import React, { Component } from 'react'

import { getPricesFor } from '../lib/place'
import { renderHistoricalPrice } from '../lib/d3'

const containerStyle = {
  width: '1080px',
  margin: '0 auto',
  background: '#FFF',
  padding: '12px'
}

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
      <h1>Historical prices for {zipCode}</h1>
      <svg width="960" height="500"></svg>
      <div id="tooltip"></div>
    </div>)
  }
}
