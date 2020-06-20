import React, { Component } from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Kafka } from 'kafkajs';
import { connectKafkaCluster } from '../actions/kafka.actions';
import routes from '../constants/routes.json';
import * as _ from 'lodash';
import { Button } from "./Common/Button";
import { History } from 'history';
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
  constructor(props: Readonly<Props>) {
    super(props);
    this.url = '';
  }

  loadRecentConnection() {
    let cons = localStorage.getItem('connections');
    if (!cons) {
      cons = '';
    }
    return cons.split('+').slice(0, cons.split('+').length - 1);
  }

  addRecentConnections(url: string) {
    let recentConnections = this.loadRecentConnection();
    recentConnections.push(url);
    recentConnections = _.uniq(recentConnections);
    localStorage.setItem('connections', recentConnections.join('+'));
  }

  private connectKafkaCluster(url: string) {
    const { connectKafkaCluster, history } = this.props;
    this.addRecentConnections(url);
    connectKafkaCluster(url)
      .then(() => history.push(routes.CLUSTER_OVERVIEW))
      .catch(() => alert('Connection fail'));
  }

  render(): any {
    const {history} = this.props;
    return (
      <div>
        <div>
          <Button text='Back Home' onClick={() => history.push(routes.HOME)} theme='medium'/>
        </div>

        <div>
          URL : <TextInput refer={e => (this.url = e)} placeholder='127.0.0.1:9092,127.0.0.1:9093'/>
          <Button text='connect'
                  theme='small'
                  onClick={() => this.connectKafkaCluster(this.url.value)}/>
          <ul>
            {this.loadRecentConnection().map(url => (
              <li>
                <span>{url}</span>
                <Button text='reconnect' onClick={() => this.connectKafkaCluster(url)} theme='small'/>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(ClusterOverview);
