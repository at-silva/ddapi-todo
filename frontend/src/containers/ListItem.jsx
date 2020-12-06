import React, { useState } from "react";
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import { useLocalStorage } from "../hooks/useLocalStorage";
import { ddapiQuery } from "../ddapi";
import { onError } from "../libs/errorLib";
import { BsArrowRepeat } from "react-icons/bs";
import './ListItem.css';

export default function ListItem(props) {
    const [token] = useLocalStorage('token', '');
    const [isLoading, setIsLoading] = useState(false);
    const { item, deleteOnClick, onDeleted, onUpdated } = props;

    const deleteListItem = async (listItemId) => {
        const query = {
            DDAPIID: 'delete-list-item',
            sql: `delete from 
                    list_item
                  where 
                    list_item.user_id = :sub
                    and list_item_id = :listItemId`,
            params: {
                listItemId,
            },
            paramsSchema: {
                sub: { type: "string" },
                listItemId: { type: "number" },
            }
        };

        try {
            await ddapiQuery(query, token)
            onDeleted(listItemId);
        } catch (error) {
            onError(error);
        } finally {
            setIsLoading(false);
        }
    }

    const updateCompleted = async (listItemId, completed) => {
        const query = {
            DDAPIID: 'update-list-item-completed',
            sql: `update 
                    list_item
                  set
                    list_item_completed = :completed,
                    list_item_completed_at = date('now')
                  where 
                    list_item.user_id = :sub
                    and list_item_id = :listItemId`,
            params: {
                listItemId,
                completed,
            },
            paramsSchema: {
                sub: { type: "string" },
                completed: { type: "number" },
                listItemId: { type: "number" },
            }
        };

        try {
            await ddapiQuery(query, token)
            onUpdated(listItemId)
        } catch (error) {
            onError(error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleItemClick = (listItemId, completed) => {
        if (deleteOnClick) {
            deleteListItem(listItemId);
        } else {
            const toggled = completed === 1 ? 0 : 1;
            updateCompleted(listItemId, toggled);
        }
    }

    let variant = "";
    let description = `⬜ ${item.description}`;
    if (item.completed) {
        description = `✅ ${item.description}`;
        variant = "success";
    }
    if (deleteOnClick) {
        description = `❌ ${item.description}`;
    }

    return (
        <ListGroupItem className="ListItem" variant={variant} action key={item.id} onClick={() => handleItemClick(item.id, item.completed)}>
            {isLoading ?
                (
                    <BsArrowRepeat className="spinning" />
                ) : (description)}
        </ListGroupItem>
    );
}
