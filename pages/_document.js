import Document, { Head, Main, NextScript } from 'next/document'
import { containerStyle } from '../styles/main'

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <html>
        <Head>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
          <script src="https://d3js.org/d3.v3.min.js"></script>
          <script src="http://d3js.org/queue.v1.min.js"></script>
          <script src="https://unpkg.com/topojson-client@3"></script>
        </Head>
        <body className="custom_class" style={{ margin: 0, background: '#EFFFFF' }}>
          <div style={containerStyle}>
            <nav>
              <a href="/">Home</a>&nbsp;
              <a href="/about">About the Visualization</a>
            </nav>
          </div>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}
