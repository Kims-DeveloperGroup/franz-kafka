import { Kafka } from 'kafkajs';
import { Dispatch, GetState } from '../reducers/types';

export const KAFKA = 'KAFKA';

export function bootstrapKafka(client: Kafka, url: string) {
  return {
    type: KAFKA,
    client,
    url
  };
}

export function connectKafkaCluster(url: string) {
  return (dispatch: Dispatch, getState: GetState) => {
    Promise.all([
      getState().kafka.client.admin().disconnect()
    ]);

    const kafka = new Kafka({
      clientId: 'jafka',
      brokers: url.split(','),
      connectionTimeout: 3000
    });
    return kafka
      .admin()
      .connect()
      .then(() => dispatch(bootstrapKafka(kafka, url)));
  };
}
