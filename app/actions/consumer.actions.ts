import {Dispatch, GetState} from '../reducers/types';

export const CONSUME_MESSAGE = 'CONSUME_MESSAGE';
export const START_CONSUME = 'START_CONSUME';
export const STOP_CONSUME = 'STOP_CONSUME';

export function messageConsume(message: any) {
  return {
    type: CONSUME_MESSAGE,
    message
  }
}

export function consumerStart(consumer: any, topic: string) {
  return {
    type: START_CONSUME,
    consumer,
    topic
  }
}

export function consumerStop(flushMsg:boolean) {
  return {
    type: STOP_CONSUME,
    flushMsg
  }
}

export function stopConsume(flushMsg:boolean = true) {
  return (dispatch: Dispatch) => dispatch(consumerStop(flushMsg))
}

export function consumeTopic(topicToConsume, groupId, fromBeginning = false) {
  return (dispatch: Dispatch, getState: GetState) => {
    let consumer = getState().kafka.client.consumer({ groupId: groupId });
    consumer.connect()
      .then(async () => {
        dispatch(consumerStart(consumer, topicToConsume));
        await consumer.subscribe({ topic: topicToConsume, fromBeginning: fromBeginning });
        await consumer.run({
          eachMessage: async ({ topic, partition, message }) => {
            dispatch(messageConsume({
              key: message.key.toString(),
              value: message.value.toString(),
              offset: message.offset,
              timeStamp: message.timestamp,
              topic: topic,
              partition: partition
            }))
          },
        })
      });
  };
}
