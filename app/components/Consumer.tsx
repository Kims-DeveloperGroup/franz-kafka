import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators, Dispatch} from 'redux';
import {ITopicMetadata, Kafka} from 'kafkajs';
import {consumeTopic, stopConsume} from "../actions/consumer.actions";
import './consumer.styles.scss';
import {getTopicDetails} from "../actions/topic.detail.actions";
import {History} from 'history';
import {Button} from "./Common/Button";

type Props = {
  topics: ITopicMetadata[],
  location: any,
  kafkaClient: Kafka,
  consumeTopic: (topic: string, groupId: string) => void,
  stopConsume: () => void,
  getTopicDetails: (topic: string) => void,
  consumer: any,
  history: History,
  topicDetail: any
};

function mapStateToProps(state: any) {
  return {
    topics: state.topics,
    topicDetail: state.topicDetail,
    kafkaClient: state.kafka.client,
    consumer: state.consumer
  };
}
function mapDispatchToProps(dispatch: Dispatch) {
  return bindActionCreators({
    consumeTopic,
    stopConsume,
    getTopicDetails
  }, dispatch);
}

export class Consumer extends Component<Props> {
  componentDidMount(): void {
  }

  componentWillUnmount(): void {
    this.props.stopConsume();
  }

  startConsume(): void {
    const {consumeTopic, getTopicDetails} = this.props;
    let topic = this.selectedTopic.value;
    consumeTopic(topic, "group-jafka");
    getTopicDetails(topic);
  }

  render(): React.ReactElement {
    const {location, stopConsume, history, consumer, topicDetail, topics} = this.props;
    return (
      <div className='consumer'>
        <div>
          <Button text='Back' onClick={() => history.goBack()} theme='medium'/>
        </div>
        <h1>{consumer.topic ? `Consuming ${consumer.topic}` : 'Consumer'}</h1>
        <div>
          <div><h3>Topic offsets: {topicDetail.topicMetadata && topicDetail.topicMetadata.length}</h3></div>
          <ul className='ul-20'>
            {topicDetail.topicMetadata && topicDetail.topicMetadata.map(partitionMetadata => <li key={partitionMetadata.partitionId}>
              partition-{partitionMetadata.partitionId}: {partitionMetadata.offset.offset}</li>)}
          </ul>
        </div>
        <div>
          <select name="topic" defaultValue={location.search.split("=")[1]}
                  ref={e => this.selectedTopic = e}
                  onChange={() => stopConsume()}>
            <option value="">Select topic</option>
            {
              topics.map(topic => <option key={topic.name} value={topic.name}>{topic.name}</option>)
            }
          </select>
          <Button text={consumer.topic ? "Stop" : "Start"} theme='small'
                  onClick={() => consumer.topic ? stopConsume() : this.startConsume()}/>
          <ul key={consumer.topic} className='messages ul-40'>
            {
              consumer.message.map(msg => <li className='message' key={`${msg.offset}-${msg.partition}`}>
                <div>
                  <h3 className='colored'>partition-{msg.partition}: {msg.offset}</h3><br/>
                  <div className='highlight'>&lt;timestamp&gt;: <span>{msg.timeStamp}</span></div>
                  <div className='highlight'>&lt;message&gt;:<br/> {JSON.stringify(msg.value)}</div>
                </div>
              </li>)
            }
          </ul>
        </div>
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Consumer);
