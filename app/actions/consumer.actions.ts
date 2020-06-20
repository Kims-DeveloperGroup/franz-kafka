import {Dispatch, GetState} from '../reducers/types';

export const CONSUME_MESSAGE = 'CONSUME_MESSAGE';
export const START_CONSUME = 'START_CONSUME';

export function consumeMessage(message: any) {
  return {
    type: CONSUME_MESSAGE,
    message
  }
}

export function startConsume(topic: string) {
  return {
    type: START_CONSUME,
    topic
  }
}

export function consumeTopic(topicToConsume, groupId) {
  return (dispatch: Dispatch, getState: GetState) => {
    dispatch(startConsume(topicToConsume));

    let consumer = getState().kafka.client.consumer({ groupId: groupId });
    consumer.connect()
      .then(async () => {
        await consumer.subscribe({ topic: topicToConsume, fromBeginning: true });
        await consumer.run({
          eachMessage: async ({ topic, partition, message }) => {
            dispatch(consumeMessage({
              key: message.key.toString(),
              value: message.value.toString(),
              topic: topic,
              partition: partition
            }))
          },
        })
      });
  };
}
