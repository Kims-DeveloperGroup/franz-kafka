import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Kafka } from 'kafkajs';
import { connectKafkaCluster } from '../actions/kafka.actions';
import routes from '../constants/routes.json';

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

  render():
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | string
    | number
    | {}
    | React.ReactNodeArray
    | React.ReactPortal
    | boolean
    | null
    | undefined {
    const { connectKafkaCluster, kafka, history } = this.props;
    return (
      <div>
        <div>
          <Link to={routes.CLUSTER_OVERVIEW}>Back to the cluster</Link>
        </div>

        <div>
          url : <input ref={e => (this.url = e)} name="url" type="text" />
          <button
            onClick={() => {
              console.log(this.url.value);
              connectKafkaCluster(this.url.value).then(() =>
                history.push(routes.CLUSTER_OVERVIEW)
              );
            }}
          >
            >connect
          </button>
        </div>
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(ClusterOverview);
