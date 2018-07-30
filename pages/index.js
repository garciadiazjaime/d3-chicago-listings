import React, { Component } from 'react'
import Head from 'next/head'
import Router from 'next/router'
import { expectedZipCodes } from '../config/base'
import { getColorRange } from '../lib/d3'
import { mostAffordable, mostExpensive, priceRange, containerStyle, toolTipStyle, titleStyle } from '../styles/main'

let interval = null

function getExpectedZipCodes(data = [], zipCodes = []) {
  const geometries = data.objects.data.geometries.filter(item => zipCodes.includes(item.properties.ZCTA5CE10))
  const newData = Object.assign({}, data)
  newData.objects.data.geometries = geometries
  return newData
}

function getZipCodePricesFrom(prices, date) {
  const pricesByDate = {}
  Object.keys(prices).forEach(zipCode => {
    pricesByDate[zipCode] = prices[zipCode].find(item => item.date === date)
  })
  return pricesByDate
}

function getPriceRange(pricesByDate) {
  const prices = [Infinity, 0]
  Object.keys(pricesByDate).forEach(zipCode => {
    const price = parseInt(pricesByDate[zipCode].price)
    if (price) {
      if (prices[0] > price) {
        prices[0] = price
      }
      if (price > prices[1]) {
        prices[1] = price
      }
    }
  })
  return prices
}

function getDatesFromZipCodes(zipCodes) {
  const firstKey = Object.keys(zipCodes)[0]
  return zipCodes[firstKey].map(item => item.date)
}

function getFill(d, pricesByDate) {
  const priceRange = getPriceRange(pricesByDate)
  const colors = getColorRange(priceRange)
  const zipCode = d.properties.ZCTA5CE10
  const price = parseInt(pricesByDate[zipCode].price)
  return price ? colors(price) : '#FFF'
}

function getStrokeWidth(d, pricesByDate) {
  const priceRange = getPriceRange(pricesByDate)
  const zipCode = d.properties.ZCTA5CE10
  const price = parseInt(pricesByDate[zipCode].price)
  return priceRange.includes(price) ? 0.05 : 0.01
}

function updatePricesForDate(pricesByDate) {
  d3
    .selectAll('path')
    .attr('fill', d => getFill(d, pricesByDate))
    .attr('stroke-width', d => getStrokeWidth(d, pricesByDate))
    .on('mouseover', d => onTooltipHover(d, pricesByDate))
}

function onTooltipHover(d, pricesByDate) {
  const zipCode = d.properties.ZCTA5CE10
  const price = parseInt(pricesByDate[d.properties.ZCTA5CE10].price)
  const div = d3.select('#tooltip')
      .style('opacity', 0)
      .style(toolTipStyle)

  div.transition()
    .duration(200)
    .style('opacity', .8);
  div.html(`${zipCode} ${price && `<br /> $${price.toLocaleString()}` || ''}`)
    .style('left', (d3.event.pageX + 10) + 'px')
    .style('top', (d3.event.pageY - 38) + 'px');
}

function onTooltipOut() {
  d3.select('#tooltip')
    .transition()
    .duration(100)
    .style('opacity', 0);
}

function getFirstDate(zipCodePrices) {
  const firstZipCode = Object.keys(zipCodePrices)[0]
  return zipCodePrices[firstZipCode][0].date
}

function getDates(zipCodePrices) {
  const firstZipCode = Object.keys(zipCodePrices)[0]
  return zipCodePrices[firstZipCode].map(item => item.date)
}

function getNextDate(dates, date) {
  const currentIndex = dates.findIndex(item => item === date)
  const nextIndex = currentIndex && dates.length - 1 === currentIndex ? 0 : currentIndex + 1
  return dates[nextIndex || 0]
}

export default class extends Component {

  constructor(props) {
    super(props)
    this.state = {}
  }

  renderMap(zipCodes = [], priceByZipCode = {}, date = '') {
    const newData = getExpectedZipCodes(zipCodes, expectedZipCodes)
    const pricesByDate = getZipCodePricesFrom(priceByZipCode, date)

    let svg = svg = d3.select('svg')
    const path = d3.geo.path()

    svg
      .attr('viewBox', '602 181 1 6')
      .attr('width', 600)
      .attr('height', 600)
      .selectAll('path')
      .data(topojson.feature(newData, newData.objects.data).features)
      .enter()
      .append('path')
      .attr('stroke', '#666')
      .attr('stroke-width', d => getStrokeWidth(d, pricesByDate))
      .attr('fill', d => getFill(d, pricesByDate))
      .attr('pointer-events', 'all')
      .attr('d', path)
      .on('mouseover', d => onTooltipHover(d, pricesByDate))
      .on('click', d => {
        const zipCode = d.properties.ZCTA5CE10
        Router.push(`/zip-code?q=${zipCode}`)
      })
  }

  getPriceByZipCode(data) {
    const priceByZipCode = {}
    Object.keys(data).forEach(key => {
      let zipCode = ''
      let prices = []
      if (!isNaN(key)) {
        Object.keys(data[key]).forEach(date => {
          if (date === 'Zip Code') {
            zipCode = data[key][date]
          } else {
            prices.push({
              date,
              price: data[key][date]
            })
          }
        })
        priceByZipCode[zipCode] = prices
      }
    })
    return priceByZipCode
  }

  componentDidMount() {
    queue()
      .defer(d3.csv, '/static/1BD_Listing_Chicago_Zip.csv')
      .defer(d3.json, '/static/data.topo.json')
      .await((error, prices, zips) => {
          const priceByZipCode = this.getPriceByZipCode(prices)
          const date = getFirstDate(priceByZipCode)
          this.renderMap(zips, priceByZipCode, date)
          const dates = getDatesFromZipCodes(priceByZipCode)
          this.setState({
            date,
            dates,
            priceByZipCode
          })
      })
  }

  onDateChange(date) {
    const { priceByZipCode } = this.state
    const prices = getZipCodePricesFrom(priceByZipCode, date)
    onTooltipOut()
    updatePricesForDate(prices)
    this.setState({
      date
    })
  }

  renderDates(date) {
    const { dates } = this.state
    if (date && dates && dates.length) {
      return (
        <select value={date} onChange={(event) => this.onDateChange(event.target.value)}
          style={{ margin: '0 0 0 15px', fontSize: '20px' }}>
          { dates.map(item => (<option value={item} key={item}>{item}</option>))}
        </select>
      )
    }
    return null
  }

  onAnimationStartClickHanlder() {
    if (!interval) {
      interval = setInterval(() => {
        const { date, priceByZipCode } = this.state
        const dates = getDates(priceByZipCode)
        const nextDate = getNextDate(dates, date)
        this.onDateChange(nextDate)
      }, 100)
    }
  }

  onAnimationStopClickHanlder() {
    clearInterval(interval)
    interval = null
  }

  render() {
    const { date, priceByZipCode } = this.state
    return (
      <div style={containerStyle}>
        <Head>
          <title>Chicago 1-Bedroom Apartment Prices (last 10 years)</title>
        </Head>
        <h1 style={titleStyle}>Chicago 1-Bedroom Apartment Prices, <small>last 10 years.</small></h1>
        <div style={priceRange}>
          <span style={mostAffordable} /> Most Affordable
          <span style={mostExpensive} /> Most Expensive
          {this.renderDates(date)}
        </div>
        <div>
          <button onClick={this.onAnimationStartClickHanlder.bind(this)} style={{ fontSize: '14px' }}>Start Animation</button>
          <button onClick={this.onAnimationStopClickHanlder.bind(this)} style={{ fontSize: '14px' }}>Stop Animation</button>
        </div>
        <svg></svg>
        <div id="tooltip"></div>
        <div>Note: Click a zone to see more details.</div>
      </div>
    )
  }
}
