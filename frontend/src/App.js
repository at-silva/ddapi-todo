
import React from "react";
import './App.css';
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Routes from "./Routes";
import { useHistory } from "react-router-dom";
import { useLocalStorage } from "./hooks/useLocalStorage";

function App() {
    const history = useHistory();
    const [token, setToken] = useLocalStorage('token', '');

    function handleLogout() {
        setToken('');
        history.push('/login');
    }

    return (
        <div className="App container py-3">
            <Navbar collapseOnSelect bg="light" expand="md" className="mb-3">
                <Navbar.Brand href="/" className="font-weight-bold text-muted">
                    TODO
                </Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                    <Nav>
                        {token ?
                            (
                                <React.Fragment>
                                    <Nav.Link href="/todo">My Lists</Nav.Link>
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
            <Routes token={token} setToken={setToken} />
        </div>
    );
}

export default App;
