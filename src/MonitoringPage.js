import React, { Component } from 'react';
import './App.css';
import Sidebar from './Sidebar.js';
import MonitoringShow from './MonitoringShow.js';
import { Grid, Col } from 'react-bootstrap';
import { Route } from 'react-router-dom';
import queryString from 'query-string';
import Toggle from 'react-bootstrap-toggle';

/**
 *  Monitoring (top level) page component
 */
class MonitoringPage extends Component {
  constructor(props) {
    super();
    this.state = {
      toggleContainers: true
    };
  }

  /**
   * Gets called once component has mounted. Fetches containers.
   */
  componentDidMount() {
    this.getContainersAndHosts();
  }

  getContainersAndHosts = () => {
    this.props.httpGetContainers();
    this.props.httpGetHosts();
  }

  toggleContainers = () => {
    const toggleContainers = !this.state.toggleContainers;
    this.setState({ toggleContainers: toggleContainers });
  }

  /**
   * Renders the component.
   * @returns {jsx} component html code
   */
  render() {
    return (
      <Grid>
        <Col xs={3} md={2}>
          <Toggle
            onClick={this.toggleContainers}
            on={<b>Containers</b>}
            off={<b>Hosts</b>}
            size="md"
            onstyle="success"
            offstyle="info"
            active={this.state.toggleContainers}
            className="ToggleBtn"
          />
          <Sidebar
            parent={this.state.toggleContainers ?
                    'monitoring/containers' : 'monitoring/hosts'}
            refresh={this.getContainersAndHosts}
            items={this.state.toggleContainers ?
                   this.props.containers : this.props.hosts}
            icon={this.state.toggleContainers ?
                  'fa fa-cube' : 'fa fa-server'}
          />
        </Col>
        <Col xs={9} md={10}>
          <Route
            path={this.state.toggleContainers ?
                  '/monitoring/containers/show' : '/monitoring/hosts/show'}
            render={() => <MonitoringShow
                            id={queryString.parse(window.location.search).id}
                            httpGetHosts={this.httpGetHosts}
                            hosts={this.state.hosts}
                            httpGetContainers={this.httpGetContainers}
                            containers={this.state.containers}
                            httpRequest={this.props.httpRequest}
                            toggleContainers={this.state.toggleContainers}
                          />}
          />
        </Col>
      </Grid>
    )
  }
}

export default MonitoringPage;