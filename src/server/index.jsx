import React from 'react';
import { render } from 'react-dom';
import UniversalRouter from 'universal-router'

import 'font-awesome/css/font-awesome.css'
import '../shared/style/base'
import './style/base'

import HomePage from './pages/home-page'
import LoginPage from './pages/login-page'
import UserPage from './pages/user-page'
import RevisionsPage from './pages/revisions-page'

const pageData = JSON.parse(document.getElementById('pageData').textContent);

const routes = [
  { name: 'index', path: '', action: () => <HomePage userInfo={pageData.userInfo} notebookList={pageData.notebookList} /> },
  { name: 'login', path: '/login', action: () => <LoginPage /> },
  { name: 'user', path: '/:username', action: () => <UserPage userInfo={pageData.userInfo} thisUser={pageData.thisUser} notebookList={pageData.notebookList} /> },
  {
    name: 'revisions',
    path: '/notebooks/:notebookId/revisions/',
    action: () => (<RevisionsPage
      userInfo={pageData.userInfo}
      ownerInfo={pageData.ownerInfo}
      revisions={pageData.revisions}
      files={pageData.files}
    />),
  },
];

const router = new UniversalRouter(routes)

router.resolve({ pathname: window.location.pathname }).then((content) => {
  render(content, document.getElementById('page'))
})
