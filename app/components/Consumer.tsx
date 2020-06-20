import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators, Dispatch} from 'redux';
import {ITopicMetadata, Kafka} from 'kafkajs';
import {consumeTopic, stopConsume} from "../actions/consumer.actions";
import './consumer.styles.scss';
import {getTopicDetails} from "../actions/topic.detail.actions";

type Props = {
  topics: ITopicMetadata[],
  location: any,
  kafkaClient: Kafka,
  consumeTopic: (topic: string, groupId: string) => void,
  stopConsume: () => void,
  getTopicDetails: (topic) => void,
  consumer: any
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

  render(): JSX.Element {
    const {location, stopConsume, history, consumer, topicDetail, topics} = this.props;
    return (
      <div className='consumer'>
        <button onClick={() => history.goBack()}>Back</button>
        <h1>{consumer.topic ? `Consuming ${consumer.topic}` : 'Consumer'}</h1>
        <div>
          <select name="topic" defaultValue={location.search.split("=")[1]}
                  ref={e => this.selectedTopic = e}
                  onChange={() => stopConsume()}>
            <option value="">Select topic</option>
            {
              topics.map(topic => <option key={topic.name} value={topic.name}>{topic.name}</option>)
            }
          </select>
          <button onClick={() => consumer.topic ? stopConsume() : this.startConsume()}>{consumer.topic ? "Stop" : "Start"}</button>
          <ul key={consumer.topic} className='messages'>
            {
              consumer.message.map(msg => <li key={`${msg.offset}-${msg.partition}`}>partition: {msg.partition}: {msg.offset}<br/> message: {JSON.stringify(msg.value)}</li>)
            }
          </ul>
        </div>
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Consumer);
