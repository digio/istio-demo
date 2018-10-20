// Import React
import React from 'react'

// Import Spectacle Core tags
import {
  Deck,
  Heading,
  Slide,
  Image,
  Text
} from 'spectacle'
import CodeSlide from 'spectacle-code-slide'
// Import theme
import createTheme from 'spectacle/lib/themes/default'
import App from '../app/App'
import Architecture from '../components/Architecture/index.jsx';
import Logo from '../assets/logo.svg'
import Github from '../assets/github.svg';

import 'normalize.css'
const vsCode = require('raw-loader!../assets/example.code.js')
const theme = createTheme(
  {
    primary: 'white',
    frontPage: '#6d95e1',
    secondary: '#1F2022',
    tertiary: '#03A9FC',
    quaternary: '#CECECE',
    codeBackground: '#72a0f5',
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
      (
        <Deck
          contentWidth={1400}
          contentHeight={1200}
          transition={['zoom', 'slide']}
          transitionDuration={500}
          theme={theme}
        >
          <Slide transition={['zoom']} bgColor='frontPage'>
            <Image src={IstioLogo} width={150} />
            <Heading size={1} caps lineHeight={1} textColor='secondary'>
              Demo
            </Heading>
            <Text margin='10px 0 0' textColor='quaternary' size={1} bold>
              Enabling canary deployments and rollbacks with Istio
            </Text>
          </Slide>
          <Slide transition={['zoom']} bgColor='primary'>
            <Heading size={1} caps lineHeight={1} textColor='secondary'>
              Architecture
            </Heading>
            <Architecture />
          </Slide>
          <CodeSlide
            transition={['slide']}
            padding={0}
            lang='yaml'
            bgColor='codeBackground'
            textColor='primary'
            code={require('raw-loader!../assets/canary.dr.yaml')}
            ranges={[
              { loc: [0, 17], title: 'DestinationRule' },
              { loc: [0, 1], title: 'New mesh API' },
              { loc: [1, 2], title: 'Custom Resource Definitions (CRDs)' },
              { loc: [6, 7], note: 'cluster resolvable hostname' },
              { loc: [7, 10], title: 'mTLS', note: 'mutual TLS between services' },
              { loc: [10, 17], title: 'Subsets' },
              { loc: [11, 14], note: 'match version: v1 of Pod label', title: 'Subsets' },
              { loc: [14, 17], note: 'match version: v2 of Pod label', title: 'Subsets' }
            ]}
          /> */}
          {/* <CodeSlide
            transition={['fade']}
            padding={0}
            lang='yaml'
            bgColor='codeBackground'
            textColor='primary'
            code={require('raw-loader!../assets/canary.vs.yaml')}
            ranges={[
              { loc: [0, 19], title: 'Default VirtualService' },
              { loc: [1, 2], title: 'Custom Resource Definition (CRD)' },
              { loc: [6, 9], title: 'Gateway Selector', note: 'gateways and sidecars we want this VirtualService policy to exist on' },
              { loc: [10, 11], title: 'Destination Host', note: 'the destination hostname we want this VirtualService to apply on' },
              { loc: [14, 15], title: 'Destination Host', note: 'must match the hostname specified in DestinationRule' },
              { loc: [15, 16], note: 'use the subset named "v1", which is defined in DestinationRule', title: 'Subsets' },
              { loc: [18, 19], note: 'send 100% of the traffic to v1 of the microservice', title: 'Subsets' }
            ]}
          /> */}
          <Slide
            maxWidth={1600}
            transition={['fade']}
            align='flex-start flex-start'
            bgColor='secondary'
            textColor='primary'
          >
            <Image
              src={IstioLogo}
              width={150}
              style={{ animation: 'App-logo-spin infinite 20s linear' }}
            />
            <Heading size={1} caps lineHeight={1} textColor='white'>
              Canary Demo
            </Heading>
            <App />
          </Slide>
          {/* <CodeSlide
            transition={['slide']}
            padding={0}
            lang='yaml'
            bgColor='codeBackground'
            textColor='primary'
            // code={vsCode}
            code={require('raw-loader!../assets/canary-90-10.vs.yaml')}
            ranges={[
              { loc: [0, 28], title: 'Canary VirtualService' },
              { loc: [1, 2], title: 'Custom Resource Definition (CRD)' },
              { loc: [6, 9], title: 'Gateway Selector', note: 'gateways and sidecars we want this VirtualService policy to exist on' },
              { loc: [10, 11], title: 'Destination Host', note: 'the destination hostname we want this VirtualService to apply on'},
              { loc: [13, 19], note: 'route 90% of traffic to "v1" of microservice', title: 'Primary Route' },
              { loc: [19, 25], note: 'route 10% of traffic to "v2" of microservice', title: 'Canary Route' },
              { loc: [25, 28], note: 'retry request 5 times before returning 500 error', title: 'Enable Retry' }
            ]}
          /> */}
          <Slide
            align='flex-start flex-start'
            transition={['fade']}
            transitionDuration={1000}
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
            transitionDuration={1000}
            bgColor='secondary'
            textColor='primary'
          >
            <div
              style={{
                display: 'inline',
                textAlign: 'center',
                flexDirection: 'column',
                alignContent: 'center',
                height: 1000
              }}
            >
              <Heading size={1} fit caps lineHeight={1} textColor='white'>
                Grafana (Metrics)
              </Heading>
            </div>
            <div style={{ marginTop: 100 }}>
              <iframe
                width='100%'
                height={950}
                src={`http://grafana.local:${NODE_PORT}`}
              />
            </div>
          </Slide>
          <Slide
            align='flex-start flex-start'
            transition={['fade']}
            bgColor='secondary'
            transitionDuration={1000}
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
          <Slide
            maxWidth={1600}
            transition={['fade']}
            align='flex-start flex-start'
            bgColor='secondary'
            textColor='primary'
          >
              <Image
                src={IstioLogo}
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
          <Slide transition={['fade']} bgColor='frontPage' textColor='secondary'>
              <Image
                  src={IstioLogo}
                  width={150}
                />
              <Heading size={1} caps lineHeight={1} textColor='secondary'>
              END
              </Heading>

            </Slide>
          <Slide transition={['fade']} bgColor='primary' textColor='secondary'>
              <Heading size={1} fit caps lineHeight={1} textColor='secondary'>
                Thanks for Listening!
              </Heading>
              <Text textColor="#03a9f4" textSize="2.5em" margin="50px 0px 0px 20px" bold>
              Questions?
              </Text>
              <div style={{ display: 'inline-flex' }} >
              <Image
                margin="0"
                style={{ display: 'inline-flex'}}
                src={Github}
                width={50}
                maxWidth={50}
                maxHeight={50}
                // style={{ animation: 'App-logo-spin infinite 20s linear' }}
              />
              <Text style={{ display: 'inline-flex', alignSelf: 'center' }} textSize="1em" margin="0px 0px 0px 20px" bold>
              github.com/mantel-digio/istiodemo
              </Text>
              </div>
              
          </Slide>
        </Deck>
      )
    )
  }
}
