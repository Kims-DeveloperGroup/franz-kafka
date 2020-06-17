import React, {Component} from 'react';
import {connect} from "react-redux";
import {getTopicDetails} from "../actions/topic.detail.actions";
import {bindActionCreators, Dispatch} from "redux";
import {Link} from "react-router-dom";
import routes from "../constants/routes.json";

type Props = {
  topicDetail: any,
  getTopicDetails: (topic: string) => void,
  location: any
};

function mapStateToProps(state: any) {
  return {
    topicDetail: state.topicDetail
  };
}
function mapDispatchToProps(dispatch: Dispatch) {
  return bindActionCreators(
    {
      getTopicDetails: getTopicDetails
    },
    dispatch
  );
}

export class TopicDetail extends Component<Props> {

  componentDidMount(): void {
    const {getTopicDetails, location} = this.props;
    getTopicDetails(location.search.split("=")[1]);
  }

  render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const {topicDetail, location, history} = this.props;
    const topic = location.search.split("=")[1];
    return (
      <div>
        <Link to={routes.HOME}>to HOME</Link>
        <div>Topic Detail <span>{topic}</span></div>
        <h1>ConsumerGroup</h1>
        {topicDetail.topicConsumerGroups && topicDetail.topicConsumerGroups.map(group =>
        <div
          key={group.groupId}
          onClick={()=> history.push('/consumer-group-detail?groupId=' + group.groupId)}>
          <div>------------------------</div>
          <h3>{group.groupId}</h3>
          <div>state: {group.state}</div>
          <div>members: {group.members.length}</div>
        </div>
        )}
        <h3>Partions</h3>
        <ul>
          {topicDetail.topicMetadata && Object.values(topicDetail.topicMetadata)
            .map(partition =>
              <li key={partition.partitionId}>
                {partition.partitionId}:
                offset:{partition.offset.low}-{partition.offset.high}{' '}
                leader: {partition.leader}{' '}
                isr: {partition.isr}{' '}
                replica: {partition.replicas}
              </li>)}
        </ul>
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(TopicDetail);
