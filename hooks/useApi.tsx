import axios, { AxiosError, AxiosRequestConfig, Method } from 'axios';
import { useCallback, useState } from 'react';


const axiosInstance = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_BASE_URL, 
    // timeout: 30000, 
});

const useAxios = <T = unknown>(
    initialUrl: string | null = null,
    method: Method = 'get',
    options: AxiosRequestConfig = {},
) => {

    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [status, setStatus] = useState<number | null>(null);


    const fetchData = useCallback(
        async (requestData: AxiosRequestConfig = {}) => {
            setLoading(true);
            setError(null);

            try {
                const response = await axiosInstance.request<T>({
                    url: requestData.url ?? initialUrl ?? undefined,
                    method,
                    ...options,
                    ...requestData, 
                });

                setData(response.data as T);
                setStatus(response.status);
                return response; 
            } catch (err) {
                const axiosError = err as AxiosError<{ message?: string }>;
                const errorMessage = axiosError.response?.data?.message || 'Something went wrong. Please try again.';
                const statusCode = axiosError.response?.status || null;

                console.log(err)

                setStatus(statusCode);
                setError(errorMessage);

            } finally {
                setLoading(false);
            }
        },
        [initialUrl, method, options]
    );

    return { data, loading, error, status, fetchData };
};

export default useAxios;