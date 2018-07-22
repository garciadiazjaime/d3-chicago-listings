import React, { Component } from 'react'
import Head from 'next/head'


export default class extends Component {

  constructor(props) {
    super(props)
    this.state = {}
  }
  
  componentDidMount() {
    console.log('componentDidMount')
    const priceByZipCode = {}
    d3.csv('/static/1BD_Listing_Chicago_Zip.csv')
      .then(data => {
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
        const zipCodes = Object.keys(priceByZipCode)

        d3.select("body")
          .selectAll("p")
          .data(zipCodes)
          .enter().append("p")
          .text(zipCode => {
            return `${zipCode}: ${JSON.stringify(priceByZipCode[zipCode][0])}`
          });

        this.setState({
          priceByZipCode
        })
      })
  }

  render() {
    const { priceByZipCode } = this.state
    console.log('priceByZipCode', priceByZipCode)
    return (
      <div>
        <Head>
          <title>My page title</title>
        </Head>
        Welcome to next.js!
      </div>
    )
  }
}
