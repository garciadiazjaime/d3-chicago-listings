import React, { Component } from 'react'
import Router from 'next/router'

import { getPricesFor } from '../lib/place'
import { renderHistoricalPrice } from '../lib/d3'
import { mostAffordable, mostExpensive, priceRange, containerStyle } from '../styles/main'

export default class extends Component {

  constructor(props) {
    super(props)
    this.state = {}
  }

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
        const zipCodes = prices.map(item => item['Zip Code']).filter(item => item)
        this.setState({
          prices,
          zipCodes
        })
      })
  }

  onChangeHandler(zipCode) {
    window.location = `/zip-code?q=${zipCode}`
  }

  renderZipCodes() {
    const { zipCode } = this.props
    const { zipCodes } = this.state
    if (zipCodes && zipCodes.length) {
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
    const { zipCode } = this.props
    return (<div style={containerStyle}>
      <h1>Historical prices for {zipCode}, <small>last 10 years.</small></h1>
      <div style={priceRange}>
        <span style={mostAffordable} /> Most Affordable
        <span style={mostExpensive} /> Most Expensive
        {this.renderZipCodes()}
      </div>
      <svg width="960" height="500"></svg>
      <div id="tooltip"></div>
    </div>)
  }
}
