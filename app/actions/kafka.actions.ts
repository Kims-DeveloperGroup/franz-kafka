import {Dispatch, GetState} from '../reducers/types';
import {Kafka} from "kafkajs";

export const KAFKA = 'KAFKA';

export function bootstrapKafka(kafka:Kafka) {
  return {
    type: KAFKA,
    kafka
  }
}

export function connectKafkaCluster(url: string) {
  return (dispatch: Dispatch, getState: GetState) => {
    Promise.all([
      getState().kafka.admin().disconnect()
    ]).then(() => console.log("closed prev connection"));

    const kafka = new Kafka({
      clientId: 'jafka',
      brokers: [url],
      connectionTimeout: 3000
    });

    return kafka
      .admin()
      .connect()
      .then(() => dispatch(bootstrapKafka(kafka)))
  };
}
