import React, { Component } from 'react'
import Head from 'next/head'


export default class extends Component {

  constructor(props) {
    super(props)
    this.state = {}
  }
  
  componentDidMount() {
    console.log('componentDidMount')
    // const priceByZipCode = {}
    // d3.csv('/static/1BD_Listing_Chicago_Zip.csv')
    //   .then(data => {
    //     Object.keys(data).forEach(key => {
    //       let zipCode = ''
    //       let prices = []
    //       if (!isNaN(key)) {
    //         Object.keys(data[key]).forEach(date => {
    //           if (date === 'Zip Code') {
    //             zipCode = data[key][date]
    //           } else {
    //             prices.push({
    //               date,
    //               price: data[key][date]
    //             })
    //           }
    //         })
    //         priceByZipCode[zipCode] = prices
    //       }
    //     })
    //     const zipCodes = Object.keys(priceByZipCode)

    //     d3.select('#data')
    //       .selectAll('p')
    //       .data(zipCodes)
    //       .enter().append('p')
    //       .text(zipCode => {
    //         return `${zipCode}: ${JSON.stringify(priceByZipCode[zipCode][0])}`
    //       })

    //     this.setState({
    //       priceByZipCode
    //     })
    //   })

    // let svg = svg = d3.select('svg')
    let svg = svg = d3.select('svg')
    const path = d3.geo.path()
    // const path = d3.geoPath()

    // queue()
    //   .defer(d3.json, '/static/10m.json')
    //   .await((error, data) => {
    //     console.log('data', data)
    //     // svg.append('path')
    //     //   .attr('stroke', '#aaa')
    //     //   .attr('stroke-width', 0.5)
    //     //   .attr('d', path(topojson.mesh(data, data.objects.states)))
        
    //     // svg.append('path')
    //     //   .attr('stroke', '#aaa')
    //     //   .attr('stroke-width', 0.5)
    //     //   .attr('d', path(topojson.mesh(data, data.objects.counties)))
    //   })

    queue()
      .defer(d3.json, '/static/zips.json')
      .await((error, data) => {
        console.log('data', topojson)
        svg.append('g')
          .selectAll('path')
          .data(
            topojson
            // .filter(data, item => {
            //   console.log('here', item)
            //   return true
            // })
            .feature(data, data.objects.zip_codes_for_the_usa).features
          )
          .enter().append('path')
          .attr('stroke', '#aaa')
          .attr('stroke-width', 0.5)
          .attr('fill', 'none')
          .attr('d', path)
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
        <svg width="960" height="600" fill="none" stroke="#000" strokeLinejoin="round" strokeLinecap="round"></svg>
      </div>
    )
  }
}
