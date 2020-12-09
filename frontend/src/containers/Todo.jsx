import React from "react";
import "./Todo.css";
import { prepareBody } from '../ddapi';
import { useEffect } from "react";
import axios from "axios";
import { onError } from "../libs/errorLib";
import { useState } from "react";
import { useAppContext } from "../libs/contextLib";
import { useSqlQuery } from "../hooks/ddapi";

export default function Home() {

    const query = {
        DDAPIID: "get-lists-by-sub",
        sql: `select 
                list_id listId, 
                user_id userId, 
                list_title title, 
                list_created_at createdAt 
              from 
                list 
              where 
                user_id = :sub`,
        paramsSchema: {
            sub: { type: "string" },
        }
    };

    const [isLoading, lists] = useSqlQuery(query);

    useEffect(() => {
        onLoad();
    }, [lists]);

    async function onLoad() {
    };


    return (
        <div className="Todo">
            <h1>TODOs</h1>
        </div>
    );
}
