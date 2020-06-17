import {AnyAction} from 'redux';
import {CONSUMER_GROUP_DETAIL} from "../actions/consumerGroupDetail.actions";

export default function consumerGroupDetail(state: any = {}, action: AnyAction) {
  switch (action.type) {
    case CONSUMER_GROUP_DETAIL:
      return action.groupDetail;
    default:
      return state;
  }
}
