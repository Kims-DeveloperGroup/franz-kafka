import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Kafka } from 'kafkajs';
import { connectKafkaCluster } from '../actions/kafka.actions';
import routes from '../constants/routes.json';
import * as _ from 'lodash';

type Props = {
  history: object;
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
    return cons.split('+');
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
    return (
      <div>
        <div>
          <Link to={routes.CLUSTER_OVERVIEW}>Back to the cluster</Link>
        </div>

        <div>
          url : <input ref={e => (this.url = e)} name="url" type="text" />
          <button
            onClick={() => {
              this.connectKafkaCluster(this.url.value);
            }}
          >
            connect
          </button>
          <ul>
            {this.loadRecentConnection().map(url => (
              <li onClick={() => this.connectKafkaCluster(url)}>{url}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(ClusterOverview);
