import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home";
import Login from "./containers/Login";
import Signup from "./containers/Signup";
import Todo from "./containers/Todo";

export default function Routes() {
    return (
        <Switch>
            <Route exact path="/login">
                <Login />
            </Route>
            <Route exact path="/signup">
                <Signup />
            </Route>
            <Route exact path="/todo">
                <Todo />
            </Route>
            <Route exact path="/">
                <Home />
            </Route>
        </Switch>
    );
}
