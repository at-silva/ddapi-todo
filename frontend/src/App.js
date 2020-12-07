
import React, { useState } from "react";
import './App.css';
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Routes from "./Routes";
import { AppContext } from "./libs/contextLib";
import { useHistory } from "react-router-dom";

function App() {
    const history = useHistory();

    function handleLogout() {
        userHasAuthenticated(false);
        setToken('');
        history.push('/login');
    }

    const [isAuthenticated, userHasAuthenticated] = useState(false);
    const [token, setToken] = useState("");

    return (
        <div className="App container py-3">
            <Navbar collapseOnSelect bg="light" expand="md" className="mb-3">
                <Navbar.Brand href="/" className="font-weight-bold text-muted">
                    TODO
                </Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                    <Nav>
                        {isAuthenticated ? (
                            <React.Fragment>
                                <Nav.Link href="/todo">My TO DOs</Nav.Link>
                                <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                            </React.Fragment>
                        ) : (
                                <React.Fragment>
                                    <Nav.Link href="/signup">Signup</Nav.Link>
                                    <Nav.Link href="/login">Login</Nav.Link>
                                </React.Fragment>
                            )}
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
            <AppContext.Provider value={{ isAuthenticated, userHasAuthenticated, token, setToken }}>
                <Routes />
            </AppContext.Provider>
        </div>
    );
}

export default App;
