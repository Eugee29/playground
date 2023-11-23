import { sleep } from "@/utils/sleep";
import axios from "axios";
import { useEffect, useState } from "react";

export const useFetch = <T>(url: string, options?: { method?: string }) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        await sleep(1e3); // 1 sec delay for testing purposes
        const { data } = await axios(url, { method: options?.method });
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
