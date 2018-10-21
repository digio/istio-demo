import React, { Component } from 'react'
import Client from './images/client.svg';
import Microservices from './images/microservices.svg';
import Background from './images/background.svg';
import Ingress from './images/ingress.svg';
import { 
    Wrapper,
    BackgroundImageWrapper,
    BackgroundLabel,
    ClientImageWrapper,
    ClientLabel,
    IngressImageWrapper,
    IngressLabel,
    MicroservicesImageWrapper,
    MicroservicesLabel
 } from './style';

class Architecture extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            index: 0,
            items: [
                {
                    component: <BackgroundImageWrapper src={Background} />,
                    index: 0
                },
                {
                    component: <ClientImageWrapper src={Client} />,
                    index: 1
                },
                {
                    component: <IngressImageWrapper src={Ingress} />,
                    index: 2
                },
                {
                    component: <MicroservicesImageWrapper src={Microservices} />,
                    index: 3
                }
            ]
        };
        this.handleKeyPress = this.handleKeyPress.bind(this);
        
    }
    handleKeyPress(e) {
        console.log(e)
        e.preventDefault()
        // this.setState({ index: 1})
        if (e.key === 'ArrowUp') {
            this.setState(prevState => ({ index: (prevState.index < 4 ? prevState.index + 1 : 0)}))
        } else if (e.key === 'ArrowDown') {
            this.setState(prevState => ({ index: (prevState.index > 0 ? prevState.index - 1 : 4)}))
        }
        
        // console.log(this.state.index)
    }
    componentDidMount() {
        document.addEventListener('keydown',this.handleKeyPress, false);
    }
    componentWillUnmount() {
        document.removeEventListener('keydown',this.handleKeyPress, false);
    }

    render() {
        console.log(this.state.index)
        return (<Wrapper >
            <ClientImageWrapper src={Client} selected={this.state.index===1}/>
            <ClientLabel selected={this.state.index===1} >
                <p>React WebApp (this presentation)</p>
            </ClientLabel>
            <BackgroundImageWrapper src={Background} selected={this.state.index===2}/>
            <BackgroundLabel selected={this.state.index===2} >
                <p>Docker-for-Mac, running Kubernetes + Istio control plane</p>
                <p> + observability tooling</p></BackgroundLabel>
            <IngressImageWrapper src={Ingress} selected={this.state.index===3}/>
            <IngressLabel selected={this.state.index===3}>
                <p>Ingress Gateway, allowing traffic</p><p>into the Kubernetes cluster</p>
            </IngressLabel>
            <MicroservicesImageWrapper src={Microservices} selected={this.state.index===4}/>
            <MicroservicesLabel selected={this.state.index===4} >
                <p>Deployed microservices within kubernetes cluster</p>
                <p>sidecar loaded to allow traffic steering.</p>
                <p>each deployment is labeled with</p><p>a different <b>version: 0.0.x</b> key-value label</p>
            </MicroservicesLabel>
        </Wrapper>)
    }
}

export default Architecture;