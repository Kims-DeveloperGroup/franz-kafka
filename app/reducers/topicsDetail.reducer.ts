import {AnyAction} from 'redux';
import {TOPIC_DETAIL} from "../actions/topic.detail.actions";

export default function topicDetail(state: any = {}, action: AnyAction) {
  switch (action.type) {
    case TOPIC_DETAIL:
      return action;
    default:
      return state;
  }
}
