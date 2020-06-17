import {AnyAction} from 'redux';
import {Kafka} from "kafkajs";
import {KAFKA} from "../actions/kafka.actions";

const defaultKafkaConfig = {
  clientId: 'jafka',
  brokers: ['10.179.5.115:9092'],
  connectionTimeout: 3000
};

export default function kafka(state: Kafka = new Kafka(defaultKafkaConfig), action: AnyAction) {
  switch (action.type) {
    case KAFKA:
      return action.kafka;
    default:
      return state;
  }
}
