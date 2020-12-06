import React, { useEffect, useState, Fragment } from "react";
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import "./Lists.css";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { ddapiExec, ddapiQuery } from "../ddapi";
import { onError } from "../libs/errorLib";
import { BsArrowRepeat } from "react-icons/bs";
import ItemsList from "./ItemsList";
import LoaderButton from '../components/LoaderButton';

export default function Lists(props) {
    const { match: { params } } = props;
    const [token] = useLocalStorage('token', '');
    const [isLoading, setIsLoading] = useState(false);
    const [items, setItems] = useState([]);
    const [active, setActive] = useState(params?.listId ?? "0");
    const [deleteOnClick, setDeleteOnClick] = useState(false);

    useEffect(() => { (async () => { await fetchItems() })(); }, [])

    const fetchItems = async () => {
        const query = {
            DDAPIID: 'select-lists',
            sql: `select 
                    list_id id, 
                    list_title title 
                  from 
                    list 
                  where 
                     user_id = :sub`,
            paramsSchema: {
                sub: { type: "string" },
            }
        }

        try {
            setIsLoading(true);
            const data = await ddapiQuery(query, token)
            setItems(data ?? []);
        } catch (error) {
            onError(error);
        } finally {
            setIsLoading(false);
        }
    }

    const deleteList = async (listId) => {
        const stmt = {
            DDAPIID: 'delete-list',
            sql: `
                delete from list_item where user_id = :sub and list_id = :listId;
                delete from list where user_id = :sub and list_id = :listId;
            `,
            params: {
                listId,
            },
            paramsSchema: {
                sub: { type: "string" },
                listId: { type: "number" },
            }
        }

        try {
            setIsLoading(true);
            await ddapiExec(stmt, token)
        } catch (error) {
            onError(error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleSelectedChanged = async (listId) => {
        if (listId && deleteOnClick) {
            await deleteList(Number(listId));
            fetchItems();
        }
        setActive(listId?.toString() ?? "0");
        console.log(listId)
    }

    const renderItem = (list) => {
        let title = list.title;
        if (deleteOnClick) {
            title = `❌ ${list.title}`
        }

        return (
            <Card key={list.id}>
                <Card.Header>
                    <Accordion.Toggle as={Button} variant="link" eventKey={list.id.toString()} className="text-capitalize">
                        {title}
                    </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey={list.id.toString()}>
                    {list.id.toString() === active ?
                        (
                            <ItemsList listId={list.id} deleteOnClick={deleteOnClick} />
                        ) : (
                            <Card.Body className="ItemsList"></Card.Body>
                        )}
                </Accordion.Collapse>
            </Card>);
    }

    return (
        <div className="Lists">
            <h1>
                {isLoading ? (<BsArrowRepeat className="spinning" />) : (<Fragment>My Lists</Fragment>)}
            </h1>
            <ButtonGroup>
                {(!deleteOnClick ? (
                    <React.Fragment>
                        <LoaderButton type="button" variant="outline-primary" href="/todo/new">
                            New List</LoaderButton>
                        <LoaderButton type="button" variant="outline-danger" onClick={() => setDeleteOnClick(true)}>
                            ❌ Delete</LoaderButton>
                    </React.Fragment>
                ) : (
                        <LoaderButton type="button" variant="outline-primary" onClick={() => setDeleteOnClick(false)}>
                            ⬅️ Back</LoaderButton>
                    ))}
            </ButtonGroup>
            <br />
            <br />
            <br />
            <Accordion defaultActiveKey={active} onSelect={listId => handleSelectedChanged(listId)}>
                {items.map(renderItem)}
            </Accordion>
        </div >
    );
}
