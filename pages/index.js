import React, { Component } from 'react'
import Head from 'next/head'


export default class extends Component {
  
  componentDidMount() {
    console.log('componentDidMount')
    d3.csv('/static/db.csv', data => {
      console.log('data', data);
    })
  }

  render() {
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
