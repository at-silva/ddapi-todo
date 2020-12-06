import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home";
import Login from "./containers/Login";
import NewList from "./containers/NewList";
import Signup from "./containers/Signup";
import Lists from "./containers/Lists";
import NewListItem from './containers/NewListItem'

export default function Routes(props) {
    return (
        <Switch>
            <Route exact path="/login">
                <Login setToken={props.setToken} />
            </Route>
            <Route exact path="/signup" component={Signup} >
                <Signup setToken={props.setToken} />
            </Route>
            <Route exact path="/todo/new" component={NewList} />
            <Route exact path="/todo/:listId" component={Lists} />
            <Route exact path="/todo/:listId/new" component={NewListItem} />
            <Route exact path="/todo" component={Lists} />
            <Route exact path="/" component={Home} />
        </Switch>
    );
}
