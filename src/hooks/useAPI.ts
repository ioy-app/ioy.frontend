import { useState, useEffect } from "react";

export default function useAPI<T>(
    url: string,
    callback: (data: T) => T,
    request: RequestInit,
    filter=[]
) {
    const [ data, setData ] = useState<T | null>(null)
    const [ isLoading, setLoading ] = useState<boolean>(true);
    const [ error, setError ] = useState<Error | null>(null);

    useEffect(() => {
        (async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(url, request),
                      json = await response.json();
                if (!response.ok)
                    throw new Error(json.msg);

                setData(callback(json));
            }
            catch(err: T | Error) { setError(err); }
            finally { setLoading(false); }
        })();
    }, [ fetch, ...filter ]);

    return [ data, isLoading, error ];
}