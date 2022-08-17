import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const useUser = () => {
  const { data, mutate, error } = useSWR("/me", fetcher);

  //console.log("USESWR!");
  //console.log(data, mutate, error);
  return {
    username: error || !data?.username ? null : data.username,
    mutate,
  };
};

export default useUser;
