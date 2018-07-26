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

    queue()
      .defer(d3.json, '/static/data.topo.json')
      .await((error, data) => {
        const geometries = data.objects.data.geometries.filter(item => expectedZipCodes.includes(item.properties.ZCTA5CE10))
        const newData = Object.assign({}, data)
        newData.objects.data.geometries = geometries
        svg
          .attr("viewBox", "602 181 1 6")
          .attr("width", 600)
          .attr("height", 600)
          .append("g")
          .attr("class", "counties")
          .selectAll('path')
          .data(topojson.feature(data, data.objects.data).features)
          .enter()
          .append('path')
          .attr('stroke', '#666')
          .attr('stroke-width', 0.02)
          .attr('fill', 'none')
          .attr("class", "zip")
          .attr("data-zip", d => d.properties.ZCTA5CE10)
          .attr('d', path)
          .on("mouseover", (d) => {
            console.log('mouseover')
          })
          .on("mouseout", (d) => {
            console.log('mouseout', d)
          })
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
