import React from "react";
import "./Todo.css";
import { prepareBody } from '../ddapi';
import { useEffect } from "react";
import axios from "axios";
import { onError } from "../libs/errorLib";
import { useState } from "react";
import { useAppContext } from "../libs/contextLib";

export default function Home() {

    const [lists, setLists] = useState([]);
    const { token } = useAppContext();

    useEffect(() => {
        onLoad();
    }, [lists]);

    async function onLoad() {
        const getListByUserQuery = {
            DDAPIID: "get-lists-by-sub",
            sql: `select list_id listId, user_id userId, list_title title, list_created_at createdAt from list where user_id = :sub`,
            paramsSchema: {
                type: "object",
                required: ["sub"],
                properties: {
                    sub: {
                        type: "string"
                    },
                }
            }
        };

        try {
            const result = await axios({
                method: 'post',
                url: 'http://localhost:8080/query',
                data: prepareBody(getListByUserQuery),
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log({ result });
        } catch (e) {
            onError(e);
        }
    };


    return (
        <div className="Todo">
            <h1>TODOs</h1>
        </div>
    );
}
