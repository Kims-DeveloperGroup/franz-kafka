import {Dispatch, GetState} from '../reducers/types';

export const CLUSTER_DESCRIPTION = 'CLUSTER_DESCRIPTION';

export function clusterDescription(description: any) {
  return {
    type: CLUSTER_DESCRIPTION,
    description
  }
}

export function getClusterDescription() {
  return (dispatch: Dispatch, getState: GetState) => {
    return getState()
      .kafka.client.admin()
      .describeCluster()
      .then(res => dispatch(clusterDescription(res)))
  };
}
