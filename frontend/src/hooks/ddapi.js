import DDAPI_SIGNATURES from '../ddapi';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { onError } from '../libs/errorLib';
import { useAppContext } from '../libs/contextLib';

function prepareBody(q) {
    if (!q.params) {
        q = { ...q, params: {} };
        const required = [];
        for (const prop in q.paramsSchema) {
            required.push(prop);
        }

        q.paramsSchema = {
            type: "object",
            required,
            properties: {
                ...q.paramsSchema,
            }
        }
    }

    return JSON.stringify({
        ...q,
        sqlSignature: DDAPI_SIGNATURES[q.DDAPIID + "_sql"],
        paramsSchemaSignature: DDAPI_SIGNATURES[q.DDAPIID + "_params_schema"],
        paramsSchema: JSON.stringify(q.paramsSchema),
        params: JSON.stringify(q.params)
    });
}

export const useSqlQuery = async (query) => {
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState(null);
    const { token } = useAppContext();

    setIsLoading(true);
    axios.post('http://localhost:8080/query', prepareBody(query), {
        headers: { Authorization: `Bearer ${token}` }
    }).then(response => {
        setData(response.data.data);
        setIsLoading(false);
    }).catch(error => {
        onError(error);
        setIsLoading(false);
    });


    //     async function onLoad() {
    //     const getListByUserQuery = {
    //         DDAPIID: "get-lists-by-sub",
    //         sql: `select list_id listId, user_id userId, list_title title, list_created_at createdAt from list where user_id = :sub`,
    //         paramsSchema: {
    //             type: "object",
    //             required: ["sub"],
    //             properties: {
    //                 sub: {
    //                     type: "string"
    //                 },
    //             }
    //         }
    //     };

    //     try {
    //         const result = await axios({
    //             method: 'post',
    //             url: 'http://localhost:8080/query',
    //             data: prepareBody(getListByUserQuery),
    //             headers: {
    //                 Authorization: `Bearer ${token}`
    //             }
    //         });
    //         console.log({ result });
    //     } catch (e) {
    //         onError(e);
    //     }
    // };


    return [isLoading, data];
};
