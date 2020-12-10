import DDAPI_SIGNATURES from './signatures';

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