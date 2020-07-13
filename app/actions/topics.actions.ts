import {Dispatch, GetState} from '../reducers/types';
import {ITopicMetadata} from "kafkajs";

export const TOPICS = 'TOPICS';

export function topics(topics: ITopicMetadata[]) {
  return {
    type: TOPICS,
    topics
  }
}

export function getTopics() {
  return (dispatch: Dispatch, getState: GetState) => {
    return getState().kafka.client
      .admin()
      .fetchTopicMetadata()
      .then(res => dispatch(topics(res.topics)))
      .catch(() => dispatch(topics([])))
  };
}

