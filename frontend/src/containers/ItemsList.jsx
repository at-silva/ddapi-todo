import React, { useEffect, useState } from "react";
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import { useLocalStorage } from "../hooks/useLocalStorage";
import { ddapiQuery } from "../ddapi";
import { onError } from "../libs/errorLib";
import { BsArrowRepeat } from "react-icons/bs";
import './ItemsList.css';
import ListItem from "./ListItem";

export default function TodoItemList(props) {
    const [token] = useLocalStorage('token', '');
    const [isLoading, setIsLoading] = useState(false);
    const [items, setItems] = useState([]);
    const { deleteOnClick } = props;

    useEffect(() => { (async () => { await fetchItems(props.listId) })(); }, [])

    const fetchItems = async (listId) => {
        const query = {
            DDAPIID: 'select-list-items',
            sql: `select 
                    list_item_id id, 
                    list.list_id listId,
                    list_item_description description,
                    list_item_completed completed
                  from 
                    list_item 
                    inner join list on list.list_id = list_item.list_id
                  where 
                    list_item.user_id = :sub
                    and list.list_id = :listId`,
            params: {
                listId,
            },
            paramsSchema: {
                sub: { type: "string" },
                listId: { type: "number" },
            }
        };

        try {
            const data = await ddapiQuery(query, token)
            setItems(data ?? []);
        } catch (error) {
            onError(error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleItemEvent = () => {
        fetchItems(props.listId);
    }

    const renderItem = (item) => (
        <ListItem key={item.id} item={item} onDeleted={handleItemEvent} onUpdated={handleItemEvent} deleteOnClick={deleteOnClick} />
    )

    return (
        <Card.Body className="ItemsList">
            {isLoading ?
                (
                    <BsArrowRepeat className="spinning" />
                ) : (
                    <ListGroup as="ul">
                        {items?.map(renderItem)}
                        <ListGroupItem action variant="primary" href={`/todo/${props.listId}/new`}> New Item</ListGroupItem>
                    </ListGroup>
                )}
        </Card.Body>
    );
}
