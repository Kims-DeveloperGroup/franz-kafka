import {AnyAction} from 'redux';
import {TOPICS} from "../actions/topics.actions";
import {ITopicMetadata} from "kafkajs";

export default function topics(state: ITopicMetadata[] = [], action: AnyAction) {
  switch (action.type) {
    case TOPICS:
      return action.topics;;
    default:
      return state;
  }
}
