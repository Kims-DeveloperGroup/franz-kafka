import { AnyAction } from 'redux';
import { Kafka } from 'kafkajs';
import { KAFKA } from '../actions/kafka.actions';

const defaultKafkaConfig = {
  clientId: 'jafka',
  brokers: ['127.0.0.1:9092'],
  connectionTimeout: 3000
};

export default function kafka(
  state: { client: Kafka; url: string } = {
    client: new Kafka(defaultKafkaConfig),
    url: '127.0.0.1:9092'
  },
  action: AnyAction
) {
  switch (action.type) {
    case KAFKA:
      return { client: action.client, url: action.url };
    default:
      return state;
  }
}
