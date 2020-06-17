import React from 'react';
import { Switch, Route } from 'react-router-dom';
import routes from './constants/routes.json';
import App from './containers/App';
import HomePage from './containers/HomePage';
import CounterPage from './containers/CounterPage';
import ClusterOverview from "./components/ClusterOverview";
import TopicDetail from "./components/TopicDetail";
import ConsumerGroupDetail from "./components/ConsumerGroupDetail";
import ConnectionOverview from "./components/ConnectionOverview";

export default function Routes() {
  return (
    <App>
      <Switch>
        <Route path={routes.COUNTER} component={ConnectionOverview} />
        <Route path={routes.CLUSTER_OVERVIEW} component={ClusterOverview} />
        <Route path={routes.TOPIC_DETAIL} component={TopicDetail} />
        <Route path={'/consumer-group-detail'} component={ConsumerGroupDetail} />
        <Route path={routes.HOME} component={HomePage} />
      </Switch>
    </App>
  );
}
