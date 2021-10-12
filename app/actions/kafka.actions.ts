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
      getState()
        .kafka.client.admin()
        .disconnect()
    ]).catch(reason => {
      alert(reason);
    });

    const [brokerUrlString, connectionConfigString] = url.split('?');
    const connectionConfigProps: { [index: string]: any } = {};
    if (connectionConfigString) {
      connectionConfigProps.sasl = {};
      connectionConfigString.split(',').forEach(s => {
        const [key, value] = s.split('=');
        const [prefix, postfix] = key.split('.');
        if (prefix === 'sasl') {
          connectionConfigProps.sasl[postfix] = value;
        } else {
          connectionConfigProps[key] = value;
        }
      });
    }

    const kafka = new Kafka({
      clientId: 'franz-kafka',
      brokers: brokerUrlString.split(','),
      connectionTimeout: 3000,
      retry: {
        retries: 1
      },
      ...connectionConfigProps
    });
    return kafka
      .admin()
      .connect()
      .then(() => dispatch(bootstrapKafka(kafka, url)));
  };
}
