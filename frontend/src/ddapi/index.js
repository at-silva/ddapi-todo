import { DDAPI_SIGNATURES } from './signatures';
import axios from 'axios';

function prepareBody(q) {
    if (!q.params) {
        q = { ...q, params: {} };
    }

    if (!q.paramsSchema) {
        q = { ...q, paramsSchema: {} };
    }

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

    return JSON.stringify({
        ...q,
        sqlSignature: DDAPI_SIGNATURES[q.DDAPIID + "_sql"],
        paramsSchemaSignature: DDAPI_SIGNATURES[q.DDAPIID + "_params_schema"],
        paramsSchema: JSON.stringify(q.paramsSchema),
        params: JSON.stringify(q.params)
    });
}

export const ddapiExec = async (stmt, token) => {
    const resp = await axios({
        method: "POST",
        url: `${process.env.REACT_APP_BACKEND_URL}/exec?${stmt.DDAPIID}`,
        headers: {
            Authorization: `Bearer ${token}`
        },
        data: prepareBody(stmt),
    });

    return resp.data;
}

export const ddapiQuery = async (query, token) => {
    const resp = await axios({
        method: "POST",
        url: `${process.env.REACT_APP_BACKEND_URL}/query?${query.DDAPIID}`,
        headers: {
            Authorization: `Bearer ${token}`
        },
        data: prepareBody(query),
    });

    return resp.data.data;
}

export const ddapiLogin = async (email, password) => {
    const result = await axios({
        method: 'POST',
        url: `${process.env.REACT_APP_BACKEND_URL}/login`,
        data: {
            usr: email,
            pwd: password,
        }
    });

    return result.data.data;
}

export const ddapiSignup = async (email, password) => {
    const result = await axios({
        method: 'POST',
        url: `${process.env.REACT_APP_BACKEND_URL}/user`,
        data: {
            usr: email,
            pwd: password,
        }
    });

    return result.data.data;
}