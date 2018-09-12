import React from 'react';
import { render } from 'react-dom';
import UniversalRouter from 'universal-router'

import HomePage from './pages/home-page'
import LoginPage from './pages/login-page'
import UserPage from './pages/user-page'

import './style/base'

const { pageData } = window;

const routes = [
  { name: 'index', path: '', action: () => <HomePage userInfo={pageData.userInfo} notebookList={pageData.notebookList} /> },
  { name: 'login', path: '/login', action: () => <LoginPage /> },
  { name: 'user', path: '/:username', action: () => <UserPage userInfo={pageData.userInfo} thisUser={pageData.thisUser} notebookList={pageData.notebookList} /> },
];

const router = new UniversalRouter(routes)

router.resolve({ pathname: window.location.pathname }).then((content) => {
  render(content, document.getElementById('page'))
})
