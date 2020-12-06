import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import LoaderButton from "../components/LoaderButton";
import "./Signup.css";
import { useHistory } from "react-router-dom";
import { onError } from "../libs/errorLib";
import { ddapiSignup } from "../ddapi";
import { ddapiExec } from "../ddapi";

export default function Signup(props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { setToken } = props;
    const history = useHistory();

    function validateForm() {
        return email.length > 0 && password.length > 0 && password === passwordConfirmation;
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setIsLoading(true);
        try {
            const newToken = await ddapiSignup(email, password);
            setToken(newToken);
            const stmt1 = {
                DDAPIID: 'insert-default-list',
                sql: `insert into list(user_id, list_title, list_created_at) values(:sub, :title, date('now'))`,
                params: {
                    title: "🛒 Groceries 🛒"
                },
                paramsSchema: {
                    title: {
                        type: "string",
                        minLength: 1,
                        maxLength: 100,
                    }
                }
            };
            const resp1 = await ddapiExec(stmt1, newToken);
            console.log(resp1);

            const items = ['🍕 Pizza!!!', 'Ice Cream', 'Orange Juice 🍊', '🍎🍎🍎 (to keep the doctor away)'];
            const completed = [0, 1, 0, 0];
            for (let i = 0; i < items.length; i++) {
                const stmt2 = {
                    DDAPIID: 'insert-default-list-items',
                    sql: `insert into list_item(user_id, list_id, list_item_description, list_item_completed, list_item_created_at) 
                        values(:sub, :list_id, :description, :completed, date('now'))`,
                    params: {
                        list_id: resp1.lastInsertedId,
                        description: items[i],
                        completed: completed[i]
                    },
                    paramsSchema: {
                        list_id: { type: "number" },
                        description: {
                            type: "string",
                            minLength: 1,
                            maxLength: 100,
                        },
                        completed: { type: "number" }
                    }
                }
                await ddapiExec(stmt2, newToken);
            }

            history.push(`/todo/${resp1.lastInsertedId}`);
        } catch (e) {
            onError(e);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="Signup">
            <h3>Signup</h3>
            <Form onSubmit={handleSubmit}>
                <Form.Group size="lg" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </Form.Group>
                <Form.Group size="lg" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </Form.Group>
                <Form.Group size="lg" controlId="password">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control type="password" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} />
                </Form.Group>
                <LoaderButton block size="lg" type="submit" isLoading={isLoading} disabled={!validateForm()}>
                    Signup</LoaderButton>
            </Form>
        </div>
    );
}