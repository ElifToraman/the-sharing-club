import React from "react";
import {
    BrowserRouter as Router,
    Route,
    Redirect,
    Switch
} from "react-router-dom";

import User from "./user/pages/User";
import NewTask from "./tasks/components/NewTask";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import UpdateTask from "./tasks/components/UpdateTask";
import Auth from "./user/pages/Auth";
import GroupDetails from "./groups/pages/GroupDetails";
import Groups from "./groups/pages/Groups";
import {AuthContext} from "./shared/context/auth-context";
import {useAuth} from "./shared/hooks/auth-hook";
import UserGroups from "./groups/pages/UserGroups";

const App = () => {
    const {token, login, logout, userId, groupId} = useAuth();
    let routes;

    if(token) {
        routes = (
            <Switch>
                <Route exact path="/" >
                    <User />
                </Route>
                <Route exact path="/groups">
                    <Groups />
                </Route>
                <Route exact path="/my-groups">
                    <UserGroups />
                </Route>
                <Route exact path="/groups/:groupId/details">
                    <GroupDetails />
                </Route>
                <Route exact path="/groups/:groupId/tasks/new">
                    <NewTask />
                </Route>
                <Route exact path="/tasks/:taskId">
                    <UpdateTask />
                </Route>
                <Redirect to="/"></Redirect>
            </Switch>
        );
    } else {
        routes = (
            <Switch>
                <Route exact path="/auth">
                    <Auth />
                </Route>
            </Switch>
        );
    }
    return (
      <AuthContext.Provider
          value={{
              isLoggedIn: !!token,
              token: token,
              userId: userId,
              groupId: groupId,
              login: login,
              logout:logout
          }}
      >
          <Router>
              <MainNavigation />
              <main>{routes}</main>
          </Router>
      </AuthContext.Provider>
  );
};

export default App;
