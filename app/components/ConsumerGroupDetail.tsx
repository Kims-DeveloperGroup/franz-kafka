import React, {Component} from 'react';
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import {Link} from "react-router-dom";
import routes from "../constants/routes.json";
import {getConsumerGroupDetail} from "../actions/consumerGroupDetail.actions";

type Props = {
  topicDetail: any,
  consumerGroupDetail: any
  getConsumerGroupDetail: (groupId: string, topic: string) => void,
  location: any
};

function mapStateToProps(state: any) {
  return {
    consumerGroupDetail: state.consumerGroupDetail,
    topicDetail: state.topicDetail
  };
}
function mapDispatchToProps(dispatch: Dispatch) {
  return bindActionCreators(
    {
      getConsumerGroupDetail: getConsumerGroupDetail
    },
    dispatch
  );
}

export class ConsumerGroupDetail extends Component<Props> {

  componentDidMount(): void {
    const {getConsumerGroupDetail, location, topicDetail} = this.props;
    getConsumerGroupDetail(location.search.split("=")[1], topicDetail.topic)
  }

  render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const {location, consumerGroupDetail} = this.props;
    const groupId = location.search.split("=")[1];
    return (
      <div>
        <Link to={routes.HOME}>to HOME</Link>
        <div>Consumer Detail</div>
        <h1>{groupId}</h1>
        <h4>State: {consumerGroupDetail.state}</h4>
        <h4>Members</h4>
        <ul>
          {
            consumerGroupDetail.members && consumerGroupDetail.members
              .map(member =>
                <li
                  key={member.memberId}>
                  Member id: {member.memberId} <br/>
                  Host: {member.clientHost}<br/>
                  <ul>
                    {
                      Object.keys(member.memberAssignment.partitions).map(topic =>{
                        return member.memberAssignment.partitions[topic].map(part =>
                          <li
                          key={part.partition}>
                          Partition: {part.partition} {' '} currOffset: {part.offset} endOffset: {part.topicOffset.offset} lag: {parseInt(part.topicOffset.offset) - parseInt(part.offset)}
                        </li>)
                      })
                    }
                  </ul>
                  <br/>
                </li>)
          }
        </ul>
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(ConsumerGroupDetail);
