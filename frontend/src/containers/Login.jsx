import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import LoaderButton from "../components/LoaderButton";
import "./Login.css";
import { useHistory } from "react-router-dom";
import { onError } from "../libs/errorLib";
import { ddapiLogin } from "../ddapi";

export default function Login(props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { setToken } = props;
    const history = useHistory();

    function validateForm() {
        return email.length > 0 && password.length > 0;
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setIsLoading(true);
        try {
            const newToken = await ddapiLogin(email, password);
            setToken(newToken);
            history.push('/todo');
        } catch (e) {
            onError(e);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="Login">
            <h3>Login</h3>
            <Form onSubmit={handleSubmit}>
                <Form.Group size="lg" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    />
                </Form.Group>
                <Form.Group size="lg" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </Form.Group>
                <LoaderButton block size="lg" type="submit" isLoading={isLoading} disabled={!validateForm()}>
                    Login</LoaderButton>
            </Form>
        </div>
    );
}