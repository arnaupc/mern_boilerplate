import React from 'react';
import _ from 'lodash';


export default class LogsList extends React.Component {

  renderItems() {
    // Recollim props sense todos
    const logs = this.props.logs;

    if(_.isString(logs)) {
      return (
        <span dangerouslySetInnerHTML={{ __html: this.props.logs}}></span>
      );
    } else {
      return _.map(logs, (log, index) => {
        console.log(logs);
        return (
          <div className="log">
            <span className="date">{ log.timestamp }</span><br/>
            <span className="text">{ log.message }</span>
          </div>
        );
      });
    }
  }

  render() {
    return (
      <pre>
        { this.renderItems() }
      </pre>
    );
  }
}
