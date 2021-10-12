import React, {Component} from 'react';
import {bindActionCreators, Dispatch} from 'redux';
import {connect} from 'react-redux';
import {Kafka, KafkaJSError} from 'kafkajs';
import {connectKafkaCluster} from '../actions/kafka.actions';
import routes from '../constants/routes.json';
import * as _ from 'lodash';
import {Button} from "./Common/Button";
import {History} from 'history';
import {TextInput} from "./Common/TextInput";

type Props = {
  history: History;
  connectKafkaCluster: (url: string) => void;
  kafka: Kafka;
};

function mapStateToProps(state: any) {
  return {
    kafka: state.kafka
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return bindActionCreators(
    {
      connectKafkaCluster
    },
    dispatch
  );
}

export class ClusterOverview extends Component<Props> {
  private url: string;
  constructor(props: Readonly<Props>) {
    super(props);
    this.url = '';
  }

  loadRecentConnection() {
    let cons = localStorage.getItem('connections');
    if (!cons) {
      cons = '';
    }
    return cons.split('+').slice(0, cons.split('+').length);
  }

  addRecentConnections(url: string) {
    let recentConnections = this.loadRecentConnection();
    recentConnections.push(url);
    recentConnections = _.uniq(recentConnections);
    localStorage.setItem('connections', recentConnections.join('+'));
  }

  private connectKafkaCluster(url: string) {
    if (!url) {
      alert('Please enter url');
      return;
    }
    const { connectKafkaCluster, history } = this.props;
    this.addRecentConnections(url);
    connectKafkaCluster(url)
      .then(() => history.push(routes.CLUSTER_OVERVIEW))
      .catch((reason: KafkaJSError) => {
        alert(reason.message);
      });
  }

  render(): React.ReactElement {
    const { history } = this.props;
    return (
      <div>
        <div>
          <Button
            text="Back Home"
            onClick={() => history.push(routes.HOME)}
            theme="medium"
          />
        </div>
        <div>
          <h1>Connections</h1>
          URL :
          <TextInput
            refer={e => {
              this.url = e;
            }}
            placeholder="127.0.0.1:9092,127.0.0.1:9093"
          />
          <Button
            text="connect"
            theme="small"
            onClick={() => this.connectKafkaCluster(this.url.value)}
          />
          <ul className="ul-40">
            {this.loadRecentConnection().map(url => (
              <li key={url}>
                <span>{url}</span>
                <Button
                  text="reconnect"
                  onClick={() => this.connectKafkaCluster(url)}
                  theme="small"
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(ClusterOverview);
