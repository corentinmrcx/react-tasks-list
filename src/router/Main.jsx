import React from 'react';
import { Route, Switch } from 'wouter';
import Home from './routes/Home';
import TaskListDetails from './routes/TaskListDetails';

const Router = () => {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/lists/:id" component={TaskListDetails} />
    </Switch>
  );
}

export default Router;