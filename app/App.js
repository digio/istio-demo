import React, { Component } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import logo from './logo.svg';
import './App.css';

const colorDict = {
  blue: '#435cea',
  red: '#ea4366',
  green: '#65d8a5',
}
const BoxViewWrapper = styled.div`
  text-align: center;
  justify-content: center;
  .box-view {
    display: flex;
    flex-wrap: wrap;
    width: 50%;
    margin: auto;
    justify-content: center;
  }
  .version {
    padding-left: 5px;
    text-overflow: ellipsis;
    /* Required for text-overflow to do anything */
    white-space: nowrap;
    overflow: hidden;
  }
`
const BoxWrapper = styled.div`
  background: ${props => colorDict[props.color]};
  width: 80px;
  height: 50px;
  margin: 10px;
  
  border-radius: 10px;
  border: 2px solid black;
  display: flex;
  justify-content: center;
  align-content: center;
  flex-direction: column; /* column | row */
`

const Box = (props) => {
  return (
    <BoxWrapper color={props.data.color}>
      <div className='version'>
      {props.data.version}
      </div>
    </BoxWrapper>
  )
}
class App extends Component {
  constructor(props) {
    super(props)
    const session = axios.create({
      baseURL: 'http://ipt.istio.meintegration.net',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    const path = 'color'
    const box_requests = Array(25)
    for (let i = 0; i < box_requests.length; i++) {
      box_requests[i] = axios.create({
        baseURL: 'http://ipt.istio.meintegration.net',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        params: {
          rando: `${Math.random()}`,
        }
      }).get(path)
    }
    this.state = {
      box_requests: box_requests,
      boxes: []
    }

  }

  _loadData() {
    axios.all(this.state.box_requests).then(response => this.setState({boxes: response.map( response => response.data)}))
  }
  componentDidMount() {
    this._loadData()
  }
  render() {
    console.log(this.state.boxes)
    const boxView = this.state.boxes.map( (data, index) => <Box key={`${index}`} data={data} />)
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <div className="App-subTitle">
            <h2>
              Canary Demo
            </h2>
          </div>
        </header>
        <BoxViewWrapper>
          <div className="box-view">
            {boxView}
          </div>
        </BoxViewWrapper>
      </div>
    );
  }
}

export default App;
