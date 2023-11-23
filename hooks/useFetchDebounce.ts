import { sleep } from "@/utils/sleep";
import axios, { AxiosRequestConfig } from "axios";
import { useEffect, useState } from "react";

export const useFetchDebounce = <T>(
  url: string,
  debounce: number,
  options?: AxiosRequestConfig<any>,
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      try {
        setLoading(true);
        await sleep(1000); // for testing purposes
        const { data } = await axios(url, options);
        setData(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }, debounce);

    return () => clearTimeout(timeout);
  }, [url, debounce, options]);

  return { data, error, loading };
};
