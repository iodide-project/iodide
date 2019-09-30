import React from "react";
import { render } from "react-dom";
import UniversalRouter from "universal-router";

import "font-awesome/css/font-awesome.css";
import "../shared/style/base";
import "./style/base";

import HomePage from "./pages/home-page";
import UserPage from "./pages/user-page";
import RevisionsPage from "./pages/revisions-page";

const pageData = JSON.parse(document.getElementById("pageData").textContent);

// create a header message if we're a staging site
const headerMessage = pageData.isStaging
  ? `You are in Iodide's staging environment, intended for testing and development. The production site is here: <a href="${pageData.productionServerURL}">${pageData.productionServerURL}</a>`
  : "";

const routes = [
  {
    name: "index",
    path: "",
    action: () => (
      <HomePage
        isStaging={pageData.isStaging}
        headerMessage={headerMessage}
        userInfo={pageData.userInfo}
        notebookList={pageData.notebookList}
      />
    )
  },
  {
    name: "user",
    path: "/:username",
    action: () => (
      <UserPage
        headerMessage={headerMessage}
        userInfo={pageData.userInfo}
        thisUser={pageData.thisUser}
        notebookList={pageData.notebookList}
      />
    )
  },
  {
    name: "revisions",
    path: "/notebooks/:notebookId/revisions/",
    action: () => (
      <RevisionsPage
        headerMessage={headerMessage}
        userInfo={pageData.userInfo}
        ownerInfo={pageData.ownerInfo}
        revisions={pageData.revisions}
        files={pageData.files}
      />
    )
  }
];

const router = new UniversalRouter(routes);

router.resolve({ pathname: window.location.pathname }).then(content => {
  render(content, document.getElementById("page"));
});
