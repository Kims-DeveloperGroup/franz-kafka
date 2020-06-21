import {AnyAction} from 'redux';
import {CONSUME_MESSAGE, START_CONSUME, STOP_CONSUME} from "../actions/consumer.actions";

const MAX_MESSAGE_COUNT = 100;

let emptyConsumer = {consumer: null, topic: '', message: []};
export default function consumer(state: any = emptyConsumer, action: AnyAction) {
  const newState = { ...state };
  switch (action.type) {
    case START_CONSUME:
      newState.consumer = action.consumer;
      newState.topic = action.topic;
      newState.message = [];
      return newState;
    case CONSUME_MESSAGE:
      action.message.value = JSON.parse(action.message.value);
      if (newState.message.length > MAX_MESSAGE_COUNT) {
        newState.message = newState.message.slice(newState.message.length - MAX_MESSAGE_COUNT, newState.message.length);
      }
      newState.message.push(action.message);
      return newState;
    case STOP_CONSUME:
      if (state.consumer) {
        state.consumer.disconnect();
      }
      newState.consumer = null;
      newState.topic = '';
      if (action.flushMsg) {
        newState.message = [];
      }
      return newState;
    default:
      return state;
  }
}
