import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators, Dispatch} from 'redux';
import {ITopicMetadata, Kafka} from 'kafkajs';
import {consumeTopic, stopConsume} from "../actions/consumer.actions";
import './consumer.styles.scss'

type Props = {
  topics: ITopicMetadata[],
  location: any,
  kafkaClient: Kafka,
  consumeTopic: (topic: string, groupId: string) => void,
  stopConsume: () => void,
  consumer: any
};

function mapStateToProps(state: any) {
  return {
    topics: state.topics,
    kafkaClient: state.kafka.client,
    consumer: state.consumer
  };
}
function mapDispatchToProps(dispatch: Dispatch) {
  return bindActionCreators({
    consumeTopic,
    stopConsume
  }, dispatch);
}

export class Consumer extends Component<Props> {
  componentDidMount(): void {
    const {location, consumeTopic} = this.props;
    console.log(location.search.split("=")[1]);
    consumeTopic(location.search.split("=")[1], "group-jafka");
  }

  componentWillUnmount(): void {
    this.props.stopConsume();
  }

  render(): JSX.Element {
    const {location, history, consumer} = this.props;
    return (
      <div className='consumer'>
        <button onClick={() => history.goBack()}>Back</button>
        <h1>{location.search.split('=')[1]}</h1>
        <div>
          <select name="topic" defaultValue="">
            <option value="">Select topic</option>
          </select>
          <div>{consumer.topic}</div>
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
