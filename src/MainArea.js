import React, { Component } from 'react';
import './App.css';
// import Containers from './Containers.js';
import Hosts from './Hosts.js';
import { Well } from 'react-bootstrap';

const LoadingView = () =>
  <Well bsSize="small" className="Console">
    Loading...
  </Well>

const ErrorView = () =>
  <Well bsSize="small" className="Console">
    Error loading data. Try refreshing.
  </Well>

class MainArea extends Component {
  constructor(props) {
    super();
    this.state = {
      url: 'http://127.0.0.1:8000/',  // Replace in production
      loading: false,
      error: false,
      containers: [],
      hosts: []
    };
  }

  componentDidMount() {
    this.refresh();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.page !== nextProps.page) {
      this.refresh(nextProps.page);
    }
  }

  refresh = (page = this.props.page) => {
    switch (page) {
      case 'containers':
        this.httpGetContainers();
        break;
      case 'hosts':
        this.httpGetHosts();
        break;
      default: break;
    }
  }

  httpRequest = (method, path, body, callbackFunction) => {
    this.setState({
      loading: true
    });
    fetch(this.state.url + path, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.props.accessToken}`
      },
      body: body
    })
    .then(response => {
      console.log('Request response: ', response);  // Remove in production
      const contentType = response.headers.get("content-type");
      if(contentType && contentType.includes("application/json")) {
        return response.json();
      }
      return {};
    })
    .then(json => {
      console.log('Response body: ', json);  // Remove in production
      callbackFunction(json);
    })
    .then(() => {
      this.setState({
        loading: false,
        error: false
      });
    })
    .catch(error => {
      console.log('Request failed: ', error); // Remove in production
      this.setState({
        loading: false,
        error: true
      });
    });
  }

  httpGetContainers = () => {};

  httpGetHosts = () => {
    this.httpRequest('GET', 'hosts', {}, json => {
      this.setState({
        hosts: json
      })
    })
  }

  showStatus = () => {
    if (this.state.loading)
      return <LoadingView />;
    else if (this.state.error)
      return <ErrorView />;
  }

  showPage = () => {
    switch (this.props.page) {
      case 'containers':
        return <div></div>
      case 'hosts':
      return <Hosts
                accessToken={this.props.accessToken}
                hosts={this.state.hosts}
                refresh={this.refresh}
                httpRequest={this.httpRequest}
              />;
      default:
        return <div></div>
    }
  }

  render() {
    return (
      <div>
        {this.showStatus()}
        {this.showPage()}
      </div>
    )
  }
}

export default MainArea;
