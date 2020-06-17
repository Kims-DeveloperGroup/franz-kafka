import {Dispatch, GetState} from '../reducers/types';
import {GroupOverview} from "kafkajs";

export const CONSUMER_GROUPS = 'CONSUMER_GROUPS';

export function consumerGroups(groups: GroupOverview[]) {
  return {
    type: CONSUMER_GROUPS,
    groups
  }
}

export function getConsumerGroups() {
  return (dispatch: Dispatch, getState: GetState) => {
    return getState().kafka
      .admin()
      .listGroups()
      .then(res => dispatch(consumerGroups(res.groups)))
  };
}
