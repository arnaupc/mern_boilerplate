// Dependencies
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';

// Auth
import auth from '../../lib/auth';

// Components


class App extends Component {

  static propTypes = {
    children: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      loggedIn: auth.loggedIn()
    };
  }

  componentWillMount() {
    //console.log(this.props);
    this.checkAuthentication(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location !== this.props.location) {
      this.checkAuthentication(nextProps);
    }
  }

  checkAuthentication(params) {
    const { history, location } = params;
    const allowedPaths = [
      '/',
    ];

    if (!auth.loggedIn() && !_.includes(allowedPaths, params.location.pathname)) {
      return history.replace({ pathname: '/login' }, { from: location });
    } else {
      this.setState({ loggedIn: auth.loggedIn() });
    }
  }

  render() {
    const {children} = this.props;

    return (
      <div className="app">
        {children}
      </div>
    );
  }
}

export default withRouter(App);
