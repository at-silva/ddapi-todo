import React from "react";
import { useState } from "react";
import Form from "react-bootstrap/Form";
import { useHistory } from "react-router-dom";
import LoaderButton from "../components/LoaderButton";
import { ddapiExec } from "../ddapi";
import { useLocalStorage } from '../hooks/useLocalStorage';
import { onError } from "../libs/errorLib";
import './NewList.css';

export default function NewList() {
    const [title, setTitle] = useState("");
    const [token] = useLocalStorage('token', {});
    const [isLoading, setIsLoading] = useState(false);
    const history = useHistory();

    const handleSubmit = async (event) => {
        if (event) {
            event.preventDefault();
        }

        const stmt = {
            DDAPIID: `insert-list`,
            sql: `insert into list(
                    user_id, 
                    list_title, 
                    list_created_at
                  ) values(
                    :sub, 
                    :title, 
                    date('now')
                  )`,
            params: { title },
            paramsSchema: {
                sub: { type: "string" },
                title: {
                    type: "string",
                    minLength: 1,
                    maxLength: 100,
                },
            }
        };

        setIsLoading(true);
        try {
            const res = await ddapiExec(stmt, token);
            history.push(`/todo/${res.lastInsertedId}`)
        } catch (error) {
            onError(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="NewList">
            <h3>New TODO List</h3>
            <Form onSubmit={handleSubmit}>
                <Form.Group size="lg" controlId="title">
                    <Form.Label>
                        Title</Form.Label>
                    <input type="title" name="title" className="form-control" onChange={e => setTitle(e.target.value)} value={title} required />
                </Form.Group>
                <LoaderButton block size="lg" type="submit" isLoading={isLoading} disabled={title === ''}>
                    Submit</LoaderButton>
            </Form>
        </div>
    );
}
