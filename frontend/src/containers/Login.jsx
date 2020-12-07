import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import LoaderButton from "../components/LoaderButton";
import "./Login.css";
import { useAppContext } from "../libs/contextLib";
import axios from 'axios';
import { useHistory } from "react-router-dom";
import { onError } from "../libs/errorLib";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { userHasAuthenticated, setToken } = useAppContext();
    const [isLoading, setIsLoading] = useState(false);
    const history = useHistory();

    function validateForm() {
        return email.length > 0 && password.length > 0;
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setIsLoading(true);
        try {
            const result = await axios({
                method: 'post',
                url: 'http://localhost:8080/login',
                data: {
                    usr: email,
                    pwd: password,
                }
            });

            userHasAuthenticated(true);
            setToken(result.data.data);
            history.push('/todo');

        } catch (e) {
            setIsLoading(false);
            onError(e);
        }
    }

    return (
        <div className="Login">
            <h3>Login</h3>
            <Form onSubmit={handleSubmit}>
                <Form.Group size="lg" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        autoFocus
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Form.Group>
                <Form.Group size="lg" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>
                <LoaderButton
                    block
                    size="lg"
                    type="submit"
                    isLoading={isLoading}
                    disabled={!validateForm()}
                >Login</LoaderButton>
            </Form>
        </div>
    );
}