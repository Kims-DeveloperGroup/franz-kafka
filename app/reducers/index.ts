import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import counter from './counter';
import kafka from "./kafka.reducer";
import clusterOverview from "./clusterOverview.reducer";
import topics from "./topics.reducer";
import consumerGroups from './consumerGroups.reducer';
import topicDetail from "./topicsDetail.reducer";
import consumerGroupDetail from "./consumerGroupDetail.reducer";
import consumer from "./consumer.reducer";

export default function createRootReducer(history: History) {
  return combineReducers({
    router: connectRouter(history),
    counter,
    kafka,
    clusterOverview,
    topics,
    consumerGroups,
    topicDetail,
    consumerGroupDetail,
    consumer
  });
}
