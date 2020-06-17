import {AnyAction} from 'redux';
import {CLUSTER_DESCRIPTION} from "../actions/clusterOverview.actions";

export default function clusterOverview(state: any = {}, action: AnyAction) {
  let newState = {...state};

  switch (action.type) {
    case CLUSTER_DESCRIPTION:
      newState.description = action.description;
      return newState;
    default:
      return state;
  }
}
