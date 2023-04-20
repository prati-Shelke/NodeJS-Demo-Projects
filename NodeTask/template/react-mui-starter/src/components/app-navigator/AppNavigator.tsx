import React from "react";
import Routes from "../../routes/routes";
import { Redirect, Route, Router, Switch } from "react-router-dom";
import { paths, routes } from "../../routes/routes.config";
import history from "../../routes/history";
import AuthLayout from "../../layouts/Auth/AuthLayout";
import AppLayout from "../../layouts/App/AppLayout";
import PageNotFound from "../../pages/auth/page-not-found/page-not-found";
import "./AppNavigator.scss";
import { authenticationService } from "../../utils/auth.service";

export type AppNavigatorProps = any;

export const AppNavigator = (props: AppNavigatorProps) => {
  return (
    <Router history={history}>
      <Switch>
        <Redirect key="default" exact from="/" to={paths.home}></Redirect>
        {routes.map((item, index) => {
          if (item.path.includes("auth/")) {
            if (
              authenticationService.currentUserValue &&
              !authenticationService.currentUserValue._pre
            ) {
              return (
                <Redirect
                  exact
                  key={index}
                  from={item.path}
                  to={paths.home}
                ></Redirect>
              );
            } else {
              return (
                <Route
                  exact
                  path={item.path}
                  key={index}
                  component={item.component}
                >
                  <AuthLayout key={index} />
                </Route>
              );
            }
          } else {
            return (
              <Routes
                exact
                path={item.path}
                key={index}
                component={item.component}
              >
                <AppLayout key={index} path={item.path} />
              </Routes>
            );
          }
        })}
        <Route component={PageNotFound} />
      </Switch>
    </Router>
  );
};
