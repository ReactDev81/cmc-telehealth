// import axios, { AxiosError, AxiosRequestConfig, Method } from 'axios';
// import { useCallback, useState } from 'react';


// const axiosInstance = axios.create({
//     baseURL: process.env.EXPO_PUBLIC_API_BASE_URL, 
//     // timeout: 60000, 
// });


// const useAxios = <T = unknown>(
//   method: Method = "get",
//   initialUrl?: string,
//   options: AxiosRequestConfig = {}
// ) => {
//   const [data, setData] = useState<T | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [status, setStatus] = useState<number | null>(null);

//   const fetchData = useCallback(
//     async (requestData: AxiosRequestConfig = {}) => {
//       setLoading(true);
//       setError(null);

//       try {
//         const response = await axiosInstance.request<T>({
//           method,
//           url: requestData.url ?? initialUrl,
//           ...options,
//           ...requestData,
//         });

//         setData(response.data);
//         setStatus(response.status);

//         return response;
//       } catch (err) {
//         const axiosError = err as AxiosError<{ message?: string }>;

//         setError(
//           axiosError.response?.data?.message ??
//             "Something went wrong. Please try again."
//         );
//         setStatus(axiosError.response?.status ?? null);

//         console.error("API Error:", axiosError);
//       } finally {
//         setLoading(false);
//       }
//     },
//     [method, initialUrl, options]
//   );

//   return { data, loading, error, status, fetchData };
// };

// export default useAxios;


import axios, { AxiosError, AxiosRequestConfig, Method } from 'axios';
import { useCallback, useRef, useState } from 'react';

const axiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
  timeout: 15000, // Reduce to 15 seconds
});

// REMOVE the interceptor - it's not helping

const useAxios = <T = unknown>(
  method: Method = "get",
  initialUrl?: string,
  initialOptions?: AxiosRequestConfig
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<number | null>(null);

  const optionsRef = useRef(initialOptions);
  optionsRef.current = initialOptions;
  const requestIdRef = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(
    async (requestData: AxiosRequestConfig = {}) => {
      const requestId = ++requestIdRef.current;

      // Cancel previous request if still pending
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();

      setLoading(true);
      setError(null);

      try {
        const response = await axiosInstance.request<T>({
          method,
          url: requestData.url ?? initialUrl,
          signal: abortControllerRef.current.signal,
          ...optionsRef.current,
          ...requestData,
          headers: {
            ...optionsRef.current?.headers,
            ...requestData.headers,
          },
        });

        if (requestId === requestIdRef.current) {
          setData(response.data);
          setStatus(response.status);
        }

        return response;
      } catch (err) {
        
        if (axios.isCancel(err)) {
          console.log('Request cancelled');
          return;
        }

        const axiosError = err as AxiosError<{ message?: string }>;

        if (requestId === requestIdRef.current) {
          let errorMessage = "Something went wrong. Please try again.";

          if (axiosError.code === 'ECONNABORTED') {
            errorMessage = "Request is taking too long. Please try again.";
          } else if (axiosError.code === 'ERR_NETWORK') {
            errorMessage = "Unable to connect. Check your internet connection.";
          } else if (axiosError.response?.data?.message) {
            errorMessage = axiosError.response.data.message;
          }

          setError(errorMessage);
          setStatus(axiosError.response?.status ?? null);
        }

        console.error("API Error:", {
          url: initialUrl,
          code: axiosError.code,
          message: axiosError.message,
        });

        throw axiosError;
      } finally {
        if (requestId === requestIdRef.current) {
          setLoading(false);
        }
      }
    },
    [method, initialUrl]
  );

  // Cleanup on unmount
  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  return { data, loading, error, status, fetchData, cancel };
};

export default useAxios;