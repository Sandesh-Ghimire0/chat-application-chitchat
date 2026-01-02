import type { AxiosRequestConfig } from "axios";
import { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL

interface UseFetchResult<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
    refetch: (config?: AxiosRequestConfig) => Promise<void>;
}

export function useFetch<T = any>(
    url: string,
    options?: AxiosRequestConfig
): UseFetchResult<T> {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async (config?: AxiosRequestConfig) => {
        setLoading(true);
        setError(null);

        try {
            const res = await axios<T>(`${BASE_URL}/${url}`, {...options, ...config});
            setData(res.data);
        } catch (err: any) {
            setError(err.message || "something went wrong");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
    
        fetchData();
    }, [fetchData]);

    return { data, loading, error, refetch: fetchData };
}
