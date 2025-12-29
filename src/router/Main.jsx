import React from 'react';
import { Route, Switch } from 'wouter';
import Home from './routes/Home';

const Router = () => {
  return (
    <Switch>
      <Route path="/" component={Home} />
    </Switch>
  );
}

export default Router;