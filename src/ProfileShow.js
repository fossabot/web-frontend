import React, { Component } from 'react';
import './App.css';
import ProfileEdit from './ProfileEdit.js';
import { Table, Button } from 'react-bootstrap';
import queryString from 'query-string';
import { Redirect } from 'react-router-dom';

class ProfileShow extends Component {
  constructor(props) {
    super();
    this.state = {
      editView: false,
      profile: {
        id: '',
        name: '',
        description: '',
        config: {},
        devices: {},
        host_id: [],
        container_id: []
      }
    }
  }

  componentDidMount () {
    this.httpGetProfile();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.id !== this.props.id) {
      this.httpGetProfile();
    }
  }

  toggleEditView = () => {
    this.setState({ editView: !this.state.editView });
  }

  httpGetProfile = () => {
    const id = queryString.parse(window.location.search).id;
    this.props.httpRequest('GET', `profiles/${id}`, null, obj => {
      this.setState({
        profile: obj.jsonData
      })
    });
  }

  httpDeleteProfile = () => {
    const id = queryString.parse(window.location.search).id;
    this.props.httpRequest('DELETE', `profiles/${id}`, null, () => {
        this.props.httpGetProfiles();
        this.setState({ redirect: true });
      }
    );
  }

  render() {
    return (
      <div>
        {this.state.redirect && <Redirect from="/profiles/show" exact to="/profiles" />}
        <Table bordered responsive striped>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{this.state.profile.name}</td>
              <td>{this.state.profile.description}</td>
              {/* TODO find host and container names by id and join into string */}
            </tr>
          </tbody>
        </Table>
        <Table bordered responsive striped>
          <thead>
            <tr>
              <th>Config</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{JSON.stringify(this.state.profile.config)}</td>
            </tr>
          </tbody>
        </Table>
        <Table bordered responsive striped>
          <thead>
            <tr>
              <th>Devices</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{JSON.stringify(this.state.profile.devices)}</td>
            </tr>
          </tbody>
        </Table>
        <Button
          type="button"
          className="Button"
          onClick={() => this.toggleEditView()}
        >
          <i className="fa fa-edit"></i> Edit Profile
        </Button>
        <Button
          type="button"
          className="Button"
          onClick={() => this.httpDeleteProfile()}
        >
          <i className="fa fa-trash"></i> Delete Profile
        </Button>
        {this.state.editView &&
          <ProfileEdit
            profile={this.state.profile}
            httpGetProfiles={this.props.httpGetProfiles}
            httpRequest={this.props.httpRequest}
          />
        }
      </div>
    )
  }
}

export default ProfileShow;
