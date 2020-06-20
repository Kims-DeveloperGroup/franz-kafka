import React, {Component} from 'react';
import {Link} from "react-router-dom";
import routes from "../constants/routes.json";
import {clusterOverviewType} from "../reducers/types";
import {GroupOverview, ITopicMetadata} from "kafkajs";
import {bindActionCreators, Dispatch} from "redux";
import {getClusterDescription} from "../actions/clusterOverview.actions";
import {getTopics} from "../actions/topics.actions";
import {connect} from "react-redux";
import {getConsumerGroups} from "../actions/consumerGroups.actions";
import {Button} from "./Common/Button";
import {History} from 'history';


type Props = {
  history: History
  clusterOverview: clusterOverviewType
  topics: ITopicMetadata[],
  consumerGroups: GroupOverview[],
  getClusterDescription: () => void
  getTopics: () => void
  getConsumerGroups: () => void
};

function mapStateToProps(state: any) {
  return {
    clusterOverview : state.clusterOverview,
    topics: state.topics,
    consumerGroups: state.consumerGroups
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return bindActionCreators(
    {
      getClusterDescription,
      getTopics,
      getConsumerGroups
    },
    dispatch
  );
}

export class ClusterOverview extends Component<Props> {

  componentDidMount(): void {
    const {getClusterDescription, getTopics, getConsumerGroups} = this.props;
    getClusterDescription();
    getTopics();
    getConsumerGroups();
  }

  render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const {clusterOverview, topics, consumerGroups, history} = this.props;

    if (!clusterOverview.description) {
      return (
        <div>
          LOADING
          <Link to={routes.COUNTER}>to Counter</Link>
        </div>
      );
    }
    return (
      <div>
        <div>
          <Button text='Back to Connections' onClick={() => history.push(routes.CONNECTIONS)} theme='medium'/>
        </div>
        <h1>Cluster Overview</h1>
        <div><h3>&lt;Cluster ID&gt;</h3> {clusterOverview.description.clusterId}</div>
        <div>
          <h3>&lt;Brokers&gt;</h3>
          <ul  className='ul-40'>
            {clusterOverview.description.brokers.map(broker => {
              return <li key={broker.nodeId}>id: {broker.nodeId} host: {broker.host}:{broker.port}</li>
            })}
          </ul>
        </div>
        <div>
          <h3>&lt;Topics&gt;</h3>
          <ul  className='ul-40'>
            {topics.map(topic => {
              return <li
                className='selectable'
                key={topic.name}
                onClick={() => history.push('/topic-detail?topic=' +  topic.name)}>
                {topic.name} partitions: {topic.partitions.length}
                <Button theme='small'
                        text='consume'
                        onClick={() => history.push('/consumer?topic=' + topic.name)}/>
              </li>
            })}
          </ul>
        </div>
        <div>
          <h3>&lt;Consumer Groups&gt;</h3>
          <ul className='ul-40'>
            {consumerGroups.map(group => {
              return <li className='highlight' key={group.groupId}>{group.groupId}</li>
            })}
          </ul>
        </div>
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(ClusterOverview);
