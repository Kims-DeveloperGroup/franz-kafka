import {AnyAction} from 'redux';
import {CONSUME_MESSAGE, START_CONSUME, STOP_CONSUME} from "../actions/consumer.actions";
import avro from 'avro-js';
import SnappyJS from 'snappyjs'
const MAX_MESSAGE_COUNT = 100;

let emptyConsumer = {consumer: null, topic: '', matchRegex: '', message: [], matched: [], messageFormat: '', avroSchema: '', avroParser: null};
export default function consumer(state: any = emptyConsumer, action: AnyAction) {
  const newState = { ...state };
  switch (action.type) {
    case START_CONSUME:
      newState.consumer = action.consumer;
      newState.topic = action.topic;
      newState.message = [];
      newState.matchRegex = action.matchRegex;
      newState.matched = [];
      newState.messageFormat = action.messageFormat;
      return newState;
    case CONSUME_MESSAGE:
      if (newState.messageFormat.toLowerCase() === 'json') {
        action.message.value = JSON.stringify(action.message.value);
      } else if(newState.messageFormat.toLowerCase() === 'avro') {
        // todo: Decode avro.sch here
      }
      if (newState.message.length > MAX_MESSAGE_COUNT) {
        newState.message = newState.message.slice(newState.message.length - MAX_MESSAGE_COUNT, newState.message.length);
      }
      newState.message.push(action.message);

      if (action.message.matched) {
        newState.matched.push(action.message);
      }

      return newState;
    case STOP_CONSUME:
      if (state.consumer) {
        state.consumer.disconnect();
      }
      newState.consumer = null;
      newState.topic = '';
      if (action.flushMsg) {
        newState.message = [];
        newState.matched = [];
        newState.matchRegex = '';
      }
      return newState;
    default:
      return state;
  }
}
