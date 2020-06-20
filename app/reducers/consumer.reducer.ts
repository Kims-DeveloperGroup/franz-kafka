import {AnyAction} from 'redux';
import {CONSUME_MESSAGE, START_CONSUME} from "../actions/consumer.actions";

export default function consumer(state: any = {topic: '', message: []}, action: AnyAction) {
  const newState = { ...state };
  switch (action.type) {
    case START_CONSUME:
      newState.topic = action.topic;
      newState.message = [];
      return newState;
    case CONSUME_MESSAGE:
      action.message.value = JSON.parse(action.message.value);
      newState.message.push(action.message);
      return newState;
    default:
      return state;
  }
}
