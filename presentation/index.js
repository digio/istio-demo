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

// Import theme
import createTheme from 'spectacle/lib/themes/default'
import App from '../app/App'
import Logo from '../assets/logo.svg'

// Require CSS
require('normalize.css')

const theme = createTheme(
  {
    primary: 'white',
    secondary: '#1F2022',
    tertiary: '#03A9FC',
    quaternary: '#CECECE'
  },
  {
    primary: 'Montserrat',
    secondary: 'Helvetica'
  }
)

export default class Presentation extends React.Component {
  render () {
    return (
      <Deck
        contentWidth={1600}
        transition={['zoom', 'slide']}
        transitionDuration={500}
        theme={theme}
      >
        <Slide transition={['zoom']} bgColor='primary'>
          <Image src={Logo} width={300} />
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
        <Slide maxWidth={1600} transition={['fade']} align="flex-start flex-start" bgColor='secondary' textColor='primary'>
          <Image src={Logo} width={300} style={{ animation: "App-logo-spin infinite 20s linear"}}/>
          <Heading size={1} caps lineHeight={1} textColor='white'>
            Canary Demo
          </Heading>
          <App />
        </Slide>
      </Deck>
    )
  }
}
