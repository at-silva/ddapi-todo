import axios from 'axios';
import { useEffect, useState } from 'react';
import { onError } from '../libs/errorLib';
import { useAppContext } from '../libs/contextLib';
import { prepareBody } from '../ddapi';

export const useNewListForm = (lists, setLists) => {
    const [inputs, setInputs] = useState({});
    const [isLoading, setIsLoading] = useState({});
    const { token } = useAppContext();

    const handleSubmit = (event) => {
        if (event) {
            event.preventDefault();
        }

        const query = {
            DDAPIID: `list-insert`,
            sql: `insert into list(
                    user_id, 
                    list_title, 
                    list_created_at
                  ) values(
                    :sub, 
                    :title, 
                    date('now')
                  )`,
            params: {
                title: inputs.title,
            },
            paramsSchema: {
                sub: { type: "string" },
                title: {
                    type: "string",
                    minLength: 1,
                    maxLength: 100,
                },
            }
        };

        // axios.post('http://localhost:8080/exec', prepareBody(query), {
        //     headers: { Authorization: `Bearer ${token}` }
        // }).then(response => {
        //     lists = [...lists, {
        //         title: inputs.title,
        //         id: response.data.data.lastInsertedId
        //     }];
        //     setLists(lists);
        //     setIsLoading(false);
        // }).catch(error => {
        //     onError(error);
        //     setIsLoading(false);
        // });
    }

    // const handleInputChange = (event) => {
    //     event.persist();
    //     setInputs(inputs => ({ ...inputs, [event.target.name]: event.target.value }));
    // }
    // return { handleSubmit, handleInputChange, inputs, isLoading };
}

// export const useSqlQuery = async (query) => {
//     const [isLoading, setIsLoading] = useState(false);
//     const [data, setData] = useState(null);
//     const { token } = useAppContext();

//     setIsLoading(true);
//     axios.post('http://localhost:8080/query', prepareBody(query), {
//         headers: { Authorization: `Bearer ${token}` }
//     }).then(response => {
//         setData(response.data.data);
//         setIsLoading(false);
//     }).catch(error => {
//         onError(error);
//         setIsLoading(false);
//     });

//     return [isLoading, data];
// };
