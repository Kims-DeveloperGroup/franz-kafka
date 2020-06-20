import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import {ITopicMetadata, Kafka} from 'kafkajs';
import {consumeTopic} from "../actions/consumer.actions";

type Props = {
  topics: ITopicMetadata[],
  location: any,
  kafkaClient: Kafka,
  consumeTopic: (topic: string, groupId: string) => void,
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
    consumeTopic
  }, dispatch);
}

export class Consumer extends Component<Props> {
  componentDidMount(): void {
    const {location, consumeTopic} = this.props;
    console.log(location.search.split("=")[1]);
    consumeTopic(location.search.split("=")[1], "group-jafka");
  }

  render(): JSX.Element {
    const {location, consumer} = this.props;
    return (
      <div>
        <h1>{location.search.split('=')[1]}</h1>
        <div>
          <select name="topic" defaultValue="">
            <option value="">Select topic</option>
          </select>
          <div>{consumer.topic}</div>
          <ul key={consumer.topic}>
            {
              consumer.message.map(msg => <li key={`${msg.value.sessionToken}-${msg.value.time}`}>{msg.key}</li>)
            }
          </ul>
        </div>
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Consumer);
