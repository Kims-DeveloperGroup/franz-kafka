import React from 'react';
import {Route, Switch} from 'react-router-dom';
import routes from './constants/routes.json';
import App from './containers/App';
import HomePage from './containers/HomePage';
import ClusterOverview from './components/ClusterOverview';
import TopicDetail from './components/TopicDetail';
import ConsumerGroupDetail from './components/ConsumerGroupDetail';
import ConnectionOverview from './components/ConnectionOverview';
import Consumer from './components/Consumer';

export default function Routes() {
  return (
    <App>
      <Switch>
        <Route path={routes.CONNECTIONS} component={ConnectionOverview} />
        <Route path={routes.CLUSTER_OVERVIEW} component={ClusterOverview} />
        <Route path={routes.TOPIC_DETAIL} component={TopicDetail} />
        <Route path={routes.CONSUMER_GROUP} component={ConsumerGroupDetail} />
        <Route path={routes.CONSUMER} component={Consumer} />
        <Route path={routes.HOME} component={HomePage} />
      </Switch>
    </App>
  );
}
