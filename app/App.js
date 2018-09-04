import React, { Component } from 'react'
import axios from 'axios'
import styled from 'styled-components'
import logo from '../assets/logo.svg'
import './App.css'

const colorDict = {
  blue: '#435cea',
  red: '#ea4366',
  green: '#65d8a5'
}
const BoxViewWrapper = styled.div`
  text-align: center;
  justify-content: center;
  .box-view {
    display: flex;
    flex-wrap: wrap;
    margin: auto;
    justify-content: center;
    width: 900px;
  }
  .version {
    padding-left: 5px;
    text-overflow: ellipsis;
    /* Required for text-overflow to do anything */
    white-space: nowrap;
    overflow: hidden;
  }

  .refresh-button {
    border-radius: 20px;
    width: 160px;
    height: 50px;
    margin-top: 30px;
    background: black;
    color: white;
    border: black;
    outline: none;
   
  }
  .refresh-button:hover {
    box-shadow: 0 5px #666;
  }
  .refesh-button:focus {
    text-decoration: none;
    outline: none;
    border: none;
    box-shadow: none;
    outline-style: none;
    
  }
  .refresh-button:active {
    text-decoration: none;
    outline: none;
    border: none;
    box-shadow: none;
    outline-style: none;
    box-shadow: 0 5px #666;
    transform: translateY(4px);
  }
  
`
const BoxWrapper = styled.div`
  background: ${props => colorDict[props.color]};
  width: 150px;
  height: 50px;
  margin: 10px;
  
  border-radius: 10px;
  border: 2px solid black;
  display: flex;
  justify-content: center;
  align-content: center;
  flex-direction: column; /* column | row */
`

const Box = props => {
  return (
    <BoxWrapper color={props.data.color}>
      <div className='version'>
        {props.data.version}
      </div>
    </BoxWrapper>
  )
}
class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      box_requests: Array(25),
      boxes: []
    }
  }

  _loadData () {
    const path = 'color'
    const box_requests = Array(25)
    for (let i = 0; i < box_requests.length; i++) {
      box_requests[i] = axios
        .create({
          baseURL: 'http://localhost:8080/api',
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          params: {
            rando: `${Math.random()}`
          },
          crossdomain: true
        })
        .get(path)
    }
    axios
      .all(box_requests)
      .then(response =>
        this.setState({ boxes: response.map(response => response.data) })
      )
  }
  componentDidMount () {
    this._loadData()
  }
  reloadData () {
    this._loadData()
    this.forceUpdate()
  }
  render () {
    console.log(this.state.boxes)
    const boxView = this.state.boxes.map((data, index) => (
      <Box key={`${index}`} data={data} />
    ))
    return (
      <div className='App'>
        <BoxViewWrapper>
          <div className='box-view'>
            {boxView}
          </div>
          <button onClick={() => this.reloadData()} className='refresh-button'>
            Refresh
          </button>
        </BoxViewWrapper>
      </div>
    )
  }
}

export default App
