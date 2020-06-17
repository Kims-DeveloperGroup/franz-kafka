import {AnyAction} from 'redux';
import {CONSUMER_GROUPS} from "../actions/consumerGroups.actions";
import {GroupOverview} from "kafkajs";

export default function consumerGroups(state: GroupOverview[] = [], action: AnyAction) {
  switch (action.type) {
    case CONSUMER_GROUPS:
      return action.groups;
    default:
      return state;
  }
}
