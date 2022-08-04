import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const useUser = () => {
  const { data, mutate, error } = useSWR("/me", fetcher);

  return {
    user: error || !data ? null : data.name,
    mutate,
  };
};

export default useUser;
