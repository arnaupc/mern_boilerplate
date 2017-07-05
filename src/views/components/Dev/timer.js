// Dependencies
import React, { Component } from 'react';

export default class Timer extends Component {

  constructor(props) {
    super(props);

    this.state = {
      elapsed: 0,
      text: 'Waiting for component load...'
    }
  }

  componentDidMount() {
    this.timer = setInterval(
      () => this.tick(),
      100
    );
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  tick() {
    const elapsed = new Date() - this.props.start;
    const seconds = (elapsed / 1000).toFixed(1);
    const minutes = (seconds / 60).toFixed(0);
    let text = `This container was loaded <b>${seconds} seconds</b> ago.`;

    if (seconds>120) {
      text = `This container was loaded <b>${minutes} minutes</b> ago.`;
    }

    this.setState({
      elapsed: elapsed,
      text: text
    });
  }

  render() {
    return (
        <span dangerouslySetInnerHTML={{ __html: this.state.text }} />
    );
  }
};
