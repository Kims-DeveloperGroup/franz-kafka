import { CompressionTypes, CompressionCodecs } from 'kafkajs';
import { Dispatch, GetState } from '../reducers/types';
import { SnappyCodec } from 'kafkajs-snappy';
CompressionCodecs[CompressionTypes.Snappy] = SnappyCodec;

export const CONSUME_MESSAGE = 'CONSUME_MESSAGE';
export const START_CONSUME = 'START_CONSUME';
export const STOP_CONSUME = 'STOP_CONSUME';

export function messageConsume(message: any) {
  return {
    type: CONSUME_MESSAGE,
    message
  }
}

export function consumerStart(consumer: any, topic: string, matchRegex: string, messageFormat: string, avroSchema: string) {
  return {
    type: START_CONSUME,
    consumer,
    topic,
    matchRegex,
    messageFormat,
    avroSchema
  };
}

export function consumerStop(flushMsg:boolean) {
  return {
    type: STOP_CONSUME,
    flushMsg
  }
}

export function stopConsume(flushMsg:boolean = true) {
  return (dispatch: Dispatch, getState: GetState) => {
    getState().consumer.consumer && getState().consumer.consumer.describeGroup()
      .then(group =>  getState().kafka.client.admin().deleteGroups([group.groupId]));
    dispatch(consumerStop(flushMsg));
  }
}

export function consumeTopic(topicToConsume, groupId, fromBeginning = false, regexLiteral = '', messageFormat: string, avroSchema: string = "") {
  return (dispatch: Dispatch, getState: GetState) => {
    let consumer = getState().kafka.client.consumer({ groupId: groupId });
    const regex = new RegExp(regexLiteral);
    consumer.connect()
      .then(async () => {
        dispatch(consumerStart(consumer, topicToConsume, regexLiteral, messageFormat, avroSchema));
        await consumer.subscribe({ topic: topicToConsume, fromBeginning: fromBeginning });
        await consumer.run({
          eachMessage: async ({ topic, partition, message }) => {
            const value = message.value && message.value.toString();
            let matched = false;
            if (regexLiteral) {
              matched = value.match(regex) !== null
            }
            await dispatch(messageConsume({
              key: message.key.toString(),
              value: value,
              offset: message.offset,
              timeStamp: message.timestamp,
              topic: topic,
              partition: partition,
              matched: matched
            }));
          },
        })
      });
  };
}
