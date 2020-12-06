import React from "react";
import { useState } from "react";
import Form from "react-bootstrap/Form";
import { useHistory } from "react-router-dom";
import LoaderButton from "../components/LoaderButton";
import { ddapiExec } from "../ddapi";
import { useLocalStorage } from '../hooks/useLocalStorage';
import { onError } from "../libs/errorLib";
import './NewListItem.css';

export default function NewTodoListItem(props) {
    const { match: { params } } = props;
    const [description, setDescription] = useState("");
    const [token] = useLocalStorage('token', {});
    const [isLoading, setIsLoading] = useState(false);
    const history = useHistory();
    const listId = Number(params.listId);

    const handleSubmit = async (event) => {
        if (event) {
            event.preventDefault();
        }

        const stmt = {
            DDAPIID: `insert-list-item`,
            sql: `insert into list_item(
                    user_id,
                    list_id, 
                    list_item_description, 
                    list_item_completed,
                    list_item_completed_at,
                    list_item_created_at
                  ) values (
                    :sub, 
                    :listId, 
                    :description,
                    0,
                    null,
                    date('now')
                  )`,
            params: {
                description,
                listId,
            },
            paramsSchema: {
                sub: { type: "string" },
                description: {
                    type: "string",
                    minLength: 1,
                    maxLength: 100,
                },
                listId: { type: "number" }
            }
        };

        setIsLoading(true);
        try {
            await ddapiExec(stmt, token);
            history.push(`/todo/${listId}`)
        } catch (error) {
            onError(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="NewListItem">
            <h3>New Item</h3>
            <Form onSubmit={handleSubmit}>
                <Form.Group size="lg" controlId="title">
                    <Form.Label>
                        Description</Form.Label>
                    <input type="title" name="title" className="form-control" onChange={e => setDescription(e.target.value)} value={description} required />
                </Form.Group>
                <LoaderButton block size="lg" type="submit" isLoading={isLoading} disabled={description === ''}>
                    Submit</LoaderButton>
            </Form>
        </div>
    );
}
