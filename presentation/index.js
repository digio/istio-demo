// Import React
import React from 'react'

// Import Spectacle Core tags
import {
  BlockQuote,
  Cite,
  Deck,
  Heading,
  ListItem,
  List,
  Quote,
  Slide,
  Image,
  Text
} from 'spectacle'
import CodeSlide from 'spectacle-code-slide'
// Import theme
import createTheme from 'spectacle/lib/themes/default'
import App from '../app/App'
import Logo from '../assets/logo.svg'

// Require CSS
// require('normalize.css')
import 'normalize.css'
// import vsCode from '../assets/canary.vs.yaml'
// import vsCode from '../assets/example.code.js'
const vsCode = require('raw-loader!../assets/example.code.js')
const theme = createTheme(
  {
    primary: 'white',
    secondary: '#1F2022',
    tertiary: '#03A9FC',
    quaternary: '#CECECE',
    codeBackground: '#1c2d4c',
  },
  {
    primary: 'Montserrat',
    secondary: 'Helvetica'
  }
)

export default class Presentation extends React.Component {
  render () {
    const NODE_PORT = 30129
    return (
      // <Spectacle>
      // <Deck
      //   contentWidth={1600}
      //   transition={['zoom', 'slide']}
      //   transitionDuration={500}
      //   theme={theme}
      // >
      // <CodeSlide
      //       transition={['']}
      //       lang="js"
      //       // code={vsCode}
      //       code={require("raw-loader!../assets/canary.vs.yaml")}
      //       ranges={[
      //         { loc: [0, 3], title: "Walking through some code" },
      //         { loc: [0, 1], title: "The Beginning" },
      //         { loc: [1, 2] },
      //         { loc: [1, 2], note: "Heres a note!" },
      //         { loc: [2, 3] },
      //       ]}/>
      // </Deck>
      // </Spectacle>
      (
        <Deck
          contentWidth={1600}
          transition={['zoom', 'slide']}
          transitionDuration={500}
          theme={theme}
        >
          <Slide transition={['zoom']} bgColor='primary'>
            <Image src={Logo} width={150} />
            <Heading size={1} caps lineHeight={1} textColor='secondary'>
              MeBank
            </Heading>
            <Text margin='10px 0 0' textColor='tertiary' size={1} bold>
              Enabling canary deployments and rollbacks with Istio
            </Text>
          </Slide>
          <Slide transition={['fade']} bgColor='tertiary'>
            <Heading size={6} textColor='primary' caps>Typography</Heading>
            <Heading size={1} textColor='secondary'>Heading 1</Heading>
            <Heading size={2} textColor='secondary'>Heading 2</Heading>
            <Heading size={3} textColor='secondary'>Heading 3</Heading>
            <Heading size={4} textColor='secondary'>Heading 4</Heading>
            <Heading size={5} textColor='secondary'>Heading 5</Heading>
            <Text size={6} textColor='secondary'>Standard text</Text>
          </Slide>
          <Slide transition={['fade']} bgColor='primary' textColor='tertiary'>
            <Heading size={6} textColor='secondary' caps>Standard List</Heading>
            <List>
              <ListItem>Item 1</ListItem>
              <ListItem>Item 2</ListItem>
              <ListItem>Item 3</ListItem>
              <ListItem>Item 4</ListItem>
            </List>
          </Slide>
          <Slide transition={['fade']} bgColor='secondary' textColor='primary'>
            <BlockQuote>
              <Quote>Example Quote</Quote>
              <Cite>Author</Cite>
            </BlockQuote>
          </Slide>
          <Slide
            maxWidth={1600}
            transition={['fade']}
            align='flex-start flex-start'
            bgColor='secondary'
            textColor='primary'
          >
            <Image
              src={Logo}
              width={150}
              style={{ animation: 'App-logo-spin infinite 20s linear' }}
            />
            <Heading size={1} caps lineHeight={1} textColor='white'>
              Canary Demo
            </Heading>
            <App />
          </Slide>
          <CodeSlide
            transition={['']}
            lang='yaml'
            bgColor='codeBackground'
            textColor='primary'
            // code={vsCode}
            code={require('raw-loader!../assets/canary.vs.yaml')}
            ranges={[
              { loc: [0, 3], title: 'Walking through some code' },
              { loc: [0, 1], title: 'The Beginning' },
              { loc: [1, 2] },
              { loc: [1, 2], note: 'Heres a note!' },
              { loc: [2, 3] }
            ]}
          />
          <Slide
            align='flex-start flex-start'
            transition={['fade']}
            bgColor='secondary'
            textColor='primary'
          >
            <div
              style={{
                display: 'inline',
                textAlign: 'center',
                flexDirection: 'column',
                alignContent: 'center',
                width: 1100
              }}
            >
              <Heading size={1} fit caps lineHeight={1} textColor='white'>
                Jaeger (Distributed Tracing)
              </Heading>
            </div>
            <div style={{ marginTop: 100 }}>
              <iframe
                width='100%'
                height={1000}
                src={`http://tracing.local:${NODE_PORT}`}
              />
            </div>
          </Slide>
          <Slide
            align='flex-start flex-start'
            transition={['fade']}
            bgColor='secondary'
            textColor='primary'
          >
            <div
              style={{
                display: 'inline',
                textAlign: 'center',
                flexDirection: 'column',
                alignContent: 'center',
                width: 1100
              }}
            >
              <Heading size={1} fit caps lineHeight={1} textColor='white'>
                Grafana (Metrics)
              </Heading>
            </div>
            <div style={{ marginTop: 100 }}>
              <iframe
                width='100%'
                height={900}
                src={`http://grafana.local:${NODE_PORT}`}
              />
            </div>
          </Slide>
          <Slide
            maxWidth={1600}
            transition={['fade']}
            align='flex-start flex-start'
            bgColor='secondary'
            textColor='primary'
          >
              <Image
                src={Logo}
                width={150}
                width={150}
                style={{
                  animation: 'App-logo-spin infinite 20s linear'
                }}
              />
            <Heading size={1} caps lineHeight={1} textColor='white'>
              Canary Demo
            </Heading>
            <App />
          </Slide>
          <Slide
            align='flex-start flex-start'
            transition={['fade']}
            bgColor='secondary'
            textColor='primary'
          >
            <div
              style={{
                display: 'inline',
                textAlign: 'center',
                flexDirection: 'column',
                alignContent: 'center',
                width: 1100
              }}
            >
              <Heading size={1} fit caps lineHeight={1} textColor='white'>
                Kiali (Mesh Observability)
              </Heading>
            </div>
            <div style={{ marginTop: 100 }}>
              <iframe
                width='100%'
                height={1000}
                src={`http://kiali.local:${NODE_PORT}/console/service-graph/istio-system?layout=cose-bilkent&duration=60&edges=requestsPerSecond&graphType=versionedApp`}
              />
            </div>
          </Slide>
          <Slide transition={['fade']} bgColor='secondary' textColor='primary'>
            <div
              style={{
                display: 'inline',
                textAlign: 'center',
                flexDirection: 'column',
                alignContent: 'center',
                width: 1100
              }}
            >
              <Heading size={1} fit caps lineHeight={1} textColor='white'>
                Q&A
              </Heading>
            </div>
          </Slide>
        </Deck>
      )
    )
  }
}
