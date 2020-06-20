import React, {Component} from 'react';
import {connect} from "react-redux";
import {getTopicDetails} from "../actions/topic.detail.actions";
import {bindActionCreators, Dispatch} from "redux";
import routes from "../constants/routes.json";
import {Button} from "./Common/Button";

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
        <div>
          <Button text='Back to Cluster Overview' onClick={() => history.push(routes.CLUSTER_OVERVIEW)} theme='medium'/>
        </div>
        <h1>Topic Detail <h2>{topic}</h2></h1>
        <h2>&lt;ConsumerGroup&gt;</h2>
        {topicDetail.topicConsumerGroups && topicDetail.topicConsumerGroups.map(group =>
        <div key={group.groupId}>
          <div>------------------------</div>
          <h3 className='selectable'
              onClick={()=> history.push('/consumer-group-detail?groupId=' + group.groupId)}>
            {group.groupId}
          </h3>
          <div><h4>&lt;State&gt;:</h4> {group.state}</div>
          <div><h4>&lt;Members&gt;:</h4> {group.members.length}</div>
        </div>
        )}
        <br/><br/>
        <h3>&lt;Partions&gt;</h3>
        <div><h4>{topicDetail.topicMetadata && `count:${Object.values(topicDetail.topicMetadata).length}`}</h4></div>
        <ul  className='ul-40'>
          {topicDetail.topicMetadata && Object.values(topicDetail.topicMetadata)
            .map(partition =>
              <li className='highlight' key={partition.partitionId}>
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
