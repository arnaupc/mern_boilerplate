// Dependencies
import React, {Component, Image} from 'react';
import PropTypes from 'prop-types';
import axios, { CancelToken } from 'axios';

// Components
import Timer from './timer';
import LogsList from './logs-list';

// Assets
import logo from '../../../public/img/icon-logo.svg';
import reactLogo from '../../../public/img/react-logo.svg';
import rings from '../../../public/img/rings.svg';


export default class Dev extends Component {

  constructor(props) {
    super(props);

    const default_text = 'Loading data<span class="loading"></span>';
    this.state = {
      date: Date.now(),
      env: process.env.NODE_ENV,
      //host: process.env.HOST || 'localhost',
      //port: config.port,
      os_info: default_text,
      node_info: default_text,
      mongo_info: default_text,
      logs: default_text
    };

    this.loadOsInfo = this.loadOsInfo.bind(this);
    this.loadNodeInfo = this.loadNodeInfo.bind(this);
    this.loadMongoInfo = this.loadMongoInfo.bind(this);
    this.loadLogs = this.loadLogs.bind(this);
  }

  loadOsInfo() {
    axios.get('/api/os_info', {cancelToken: this.cancelToken.token })
    .then(res => {
      this.setState({ os_info: res.data });
    });
  }

  loadNodeInfo() {
    axios.get('/api/node_info', {cancelToken: this.cancelToken.token })
    .then(res => {
      this.setState({ node_info: res.data });
    });
  }

  loadMongoInfo() {
    axios.get('/api/mongo_info', {cancelToken: this.cancelToken.token })
    .then(res => {
      this.setState({ mongo_info: res.data });
    });
  }

  loadLogs() {
    axios.get('/api/get_logs', {cancelToken: this.cancelToken.token })
    .then(res => {
      this.setState({ logs: res.data });
    });
  }

  componentWillMount() {
    // create token for cancel axios request
    this.cancelToken = CancelToken.source();
  }

  componentDidMount() {
    console.log('analogicemotion.com - #mern stack dev');

    this.loadOsInfo();
    this.loadNodeInfo();
    this.loadMongoInfo();

    this.logTimer = setInterval(
      () => this.loadLogs(),
      10000
    );
    this.loadLogs();
  }

  componentWillUnmount() {
    clearInterval(this.logTimer);
  }

  render() {
    return (
      <div className="dev">
        <div className="ribbon"></div>
        <div className="logo">
          <img src={logo} alt="logo" />
          <h4>analogicemotion - multimedia publishers &copy;</h4>
        </div>
        <p>
        </p>
        <hr/>
        <h2>
          #MERN Stack Development
          <small><Timer start={ this.state.date } /></small>
          <div className="react">
            <img src={reactLogo} alt="logo" />
          </div>
        </h2>
        <hr/>
        <p>
          <span className="icon green">&#10004;</span>
          Server running
          <br/>
          <span className="icon green">&#10004;</span>
          MongoDB connected
          <br/>
          <span className="icon green">&#x2299;</span>
          Environment: { this.state.env }
        </p>
        <hr/>
        <h3>Server</h3>
        <pre dangerouslySetInnerHTML={{ __html: this.state.os_info }}></pre>
        <hr/>
        <h3>Node.js</h3>
        <pre dangerouslySetInnerHTML={{ __html: this.state.node_info }}></pre>
        <hr/>
        <h3>MongoDB</h3>
        <pre dangerouslySetInnerHTML={{ __html: this.state.mongo_info }}></pre>
        <hr/>
        <h3><img src={rings} alt="logo" />Logs</h3>
        <LogsList logs={ this.state.logs }/>
        <hr/>
        <small>&copy; { new Date().toISOString() + ' - ' + 'analogicemotion.com' }</small>
      </div>
    );
  }
}
