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
          <script src="/static/d3.v3.min.js"></script>
          <script src="/static/queue.v1.min.js"></script>
          <script src="/static/topojson-client.js"></script>
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
