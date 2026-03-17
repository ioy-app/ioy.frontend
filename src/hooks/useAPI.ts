import fetchAPI from "@/api";
import { useState, useEffect } from "react";

export default function useAPI<T>(
	url: string,
	request: RequestInit,
	callback: (data: T) => T,
	filter = [],
) {
	const [data, setData] = useState<T | null>(null);
	const [isLoading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		(async () => {
			setLoading(true);
			setError(null);
			try {
				const response = await fetchAPI(url, request),
					json = await response.json();
				if (!response.ok) throw new Error(json.msg);

				if (callback) setData(callback(json));
				else setData(json);
			} catch (err) {
				setError(err);
			} finally {
				setLoading(false);
			}
		})();
	}, [url, ...filter]);

	return [data, isLoading, error];
}
