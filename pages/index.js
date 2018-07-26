import React, { Component } from 'react'
import Head from 'next/head'

export default class extends Component {

  constructor(props) {
    super(props)
    this.state = {}
  }

  renderMap(data, priceByZipCode) {
    let svg = svg = d3.select('svg')
    const path = d3.geo.path()
    const expectedZipCodes = [
      '60622',
      '60640',
      '60611',
      '60631',
      '60657',
      '60659',
      '60605',
      '60601',
      '60614',
      '60654',
      '60625',
      '60626',
      '60661',
      '60613',
      '60615',
      '60656',
      '60630',
      '60647',
      '60610',
      '60642',
      '60634',
      '60660',
      '60618',
      '60641',
      '60645',
      '60607',
      '60606',
      '60616',
      '60201',
      '60202'
    ]

    const toolTipStyle = {
      position: 'absolute',
      textAlign: 'center',
      width: '60px',
      height: '28px',
      padding: '2px',
      font: '12px sans-serif',
      background: 'lightsteelblue',
      border: '0px',
      borderRadius: '8px',
      pointerEvents: 'non'
    }

    const div = d3.select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0)
      .style(toolTipStyle)

    const geometries = data.objects.data.geometries.filter(item => expectedZipCodes.includes(item.properties.ZCTA5CE10))
    const newData = Object.assign({}, data)
    newData.objects.data.geometries = geometries
    svg
      .attr('viewBox', '602 181 1 6')
      .attr('width', 600)
      .attr('height', 600)
      .selectAll('path')
      .data(topojson.feature(data, data.objects.data).features)
      .enter()
      .append('path')
      .attr('stroke', '#666')
      .attr('stroke-width', 0.02)
      .attr('fill', 'red')
      .attr('pointer-events', 'all')
      .attr('data-zip', d => d.properties.ZCTA5CE10)
      .attr('d', path)
      .on('mouseover', (d) => {
        const price = priceByZipCode[d.properties.ZCTA5CE10][0].price
        const zipCode = d.properties.ZCTA5CE10
        div.transition()
          .duration(200)
          .style('opacity', .9);
        div.html(`${zipCode} \n ${price}`)
          .style('left', (d3.event.pageX) + 'px')
          .style('top', (d3.event.pageY - 28) + 'px');
      })
      .on('mouseout', (d) => {
        div.transition()
            .duration(500)
            .style('opacity', 0);
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
    console.log('componentDidMount')
    queue()
      .defer(d3.csv, '/static/1BD_Listing_Chicago_Zip.csv')
      .defer(d3.json, '/static/data.topo.json')
      .await((error, prices, zips) => {
          const priceByZipCode = this.getPriceByZipCode(prices)
          this.renderMap(zips, priceByZipCode)
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
