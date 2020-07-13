import React, {Component} from 'react';
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import {getConsumerGroupDetail} from "../actions/consumerGroupDetail.actions";
import {Button} from "./Common/Button";
import {History} from 'history';

type Props = {
  history: History,
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
  
  constructor(props: Readonly<Props>) {
    super(props);
    this.intervalUpdate = null;
  }

  componentDidMount(): void {
    this.fetchConsumerGroupDetail();
    clearInterval(this.intervalUpdate);
    this.intervalUpdate = setInterval(this.fetchConsumerGroupDetail.bind(this), 4000)
  }

  componentWillUnmount(): void {
    clearInterval(this.intervalUpdate);
  }

  fetchConsumerGroupDetail(): void {
    const {getConsumerGroupDetail, location, topicDetail} = this.props;
    getConsumerGroupDetail(location.search.split("=")[1], topicDetail.topic);
  }

  render(): React.ReactElement {
    const {location, consumerGroupDetail, history} = this.props;
    const groupId = location.search.split("=")[1];
    return (
      <div>
        <div>
          <Button text='Back' onClick={() => history.goBack()} theme='medium'/>
        </div>
        <h1>Group: {groupId}</h1>
        <div>
          <h2 style={{'display': 'inline'}}>Members</h2>
          <Button text='refresh' onClick={() => this.fetchConsumerGroupDetail()} theme='medium'/>
        </div>
        <div>Count: {consumerGroupDetail.members && consumerGroupDetail.members.length}</div>
        <ul className='ul-60'>
          {
            consumerGroupDetail.members && consumerGroupDetail.members
              .map(member =>
                <li
                  key={member.memberId}>
                  <div className='highlight'><h3 className='colored'>{member.memberId}</h3> </div>
                  <div className='highlight'>&lt;Host&gt;: {member.clientHost}</div>
                  <div>&lt;Offset&gt;</div>
                  <ul className='ul-40'>
                    {
                      Object.keys(member.memberAssignment.partitions).map(topic =>{
                        return member.memberAssignment.partitions[topic].map(part =>
                          <li
                            className='highlight'
                            key={part.partition}>
                            Partition: {part.partition} currOffset: {part.offset} endOffset: {part.topicOffset.offset} lag: {parseInt(part.topicOffset.offset) - parseInt(part.offset)}
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
