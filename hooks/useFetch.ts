import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";

export const useFetch = (url: string, options?: { method: string }) => {
  const [data, setData] = useState<AxiosResponse<any, any> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await axios(url, { method: options?.method });
        setData(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    })();
  }, [url, options]);

  return { data, error, loading };
};
