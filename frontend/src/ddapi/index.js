import { DDAPI_SIGNATURES } from './signatures';


export function prepareBody(q) {
    if (!q.params) {
        q = { ...q, params: {} };
    }

    return JSON.stringify({
        ...q,
        sqlSignature: DDAPI_SIGNATURES[q.DDAPIID + "_sql"],
        paramsSchemaSignature: DDAPI_SIGNATURES[q.DDAPIID + "_params_schema"],
        paramsSchema: JSON.stringify(q.paramsSchema),
        params: JSON.stringify(q.params)
    });
}
