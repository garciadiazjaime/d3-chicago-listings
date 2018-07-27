import React, { Component } from 'react'
import Head from 'next/head'
import { expectedZipCodes } from '../config/base'

function getExpectedZipCodes(data = [], zipCodes = []) {
  const geometries = data.objects.data.geometries.filter(item => zipCodes.includes(item.properties.ZCTA5CE10))
  const newData = Object.assign({}, data)
  newData.objects.data.geometries = geometries
  return newData
}

function getZipCodePricesFrom(prices, date) {
  const zipCodePricesByDate = {}
  Object.keys(prices).forEach(zipCode => {
    zipCodePricesByDate[zipCode] = prices[zipCode].find(item => item.date === date)
  })
  return zipCodePricesByDate
}

function getPriceRange(pricesByDate) {
  const prices = [Infinity, 0]
  Object.keys(pricesByDate).forEach(zipCode => {
    const price = parseInt(pricesByDate[zipCode].price)
    if (prices[0] > price) {
      prices[0] = price
    }
    if (price > prices[1]) {
      prices[1] = price
    }
  })
  return prices
}

export default class extends Component {

  constructor(props) {
    super(props)
    this.state = {}
  }

  renderMap(data = [], priceByZipCode = {}, date = '') {
    const newData = getExpectedZipCodes(data, expectedZipCodes)
    const zipCodePricesByDate = getZipCodePricesFrom(priceByZipCode, date)

    let svg = svg = d3.select('svg')
    const path = d3.geo.path()

    const toolTipStyle = {
      background: '#222',
      border: '0px',
      color: '#FFF',
      font: '14px sans-serif',
      fontWeight: 'bold',
      padding: '5px',
      pointerEvents: 'non',
      position: 'absolute'
    }

    const div = d3.select('body')
      .append('div')
      .style('opacity', 0)
      .style('text-align', 'center')
      .style(toolTipStyle)

    const colors = d3.scale.linear()
        .domain(getPriceRange(zipCodePricesByDate))
        .interpolate(d3.interpolateHcl)
        .range([d3.rgb("#8bace5"), d3.rgb('#f44646')])

    svg
      .attr('viewBox', '602 181 1 6')
      .attr('width', 600)
      .attr('height', 600)
      .selectAll('path')
      .data(topojson.feature(newData, newData.objects.data).features)
      .enter()
      .append('path')
      .attr('stroke', '#666')
      .attr('stroke-width', 0.02)
      .attr('fill', d => {
        const price = zipCodePricesByDate[d.properties.ZCTA5CE10] ? zipCodePricesByDate[d.properties.ZCTA5CE10].price : 0
        return colors(price)
      })
      .attr('pointer-events', 'all')
      .attr('d', path)
      .on('mouseover', d => {
        const zipCode = d.properties.ZCTA5CE10
        const price = zipCodePricesByDate[d.properties.ZCTA5CE10] ? zipCodePricesByDate[d.properties.ZCTA5CE10].price : 0
        div.transition()
          .duration(200)
          .style('opacity', .8);
        div.html(`${zipCode} <br /> $${parseInt(price).toLocaleString()}`)
          .style('left', (d3.event.pageX) + 'px')
          .style('top', (d3.event.pageY - 28) + 'px');
      })
      .on('mouseout', d => {
        // div.transition()
        //     .duration(500)
        //     .style('opacity', 0);
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
    const date = '2018-02-28'
    queue()
      .defer(d3.csv, '/static/1BD_Listing_Chicago_Zip.csv')
      .defer(d3.json, '/static/data.topo.json')
      .await((error, prices, zips) => {
          const priceByZipCode = this.getPriceByZipCode(prices)
          this.renderMap(zips, priceByZipCode, date)
      })
  }

  render() {
    const { priceByZipCode } = this.state
    // console.log('priceByZipCode', priceByZipCode)
    return (
      <div>
        <Head>
          <title>My page title</title>
        </Head>
        <h1>Welcome to next.js!</h1>
        <div id='data'></div>
        <svg></svg>
      </div>
    )
  }
}
