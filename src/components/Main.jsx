import React from 'react';
import { useSelector } from 'react-redux';
import LoginForm from './LoginForm';
import Router from '../router/Main';

export default function Main() {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return <Router />;
}
