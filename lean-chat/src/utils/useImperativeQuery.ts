import { useQuery } from "@apollo/client";

const Q = (query: any) => {
  const { refetch } = useQuery(query, { skip: true });

  const imperativelyCallQuery = (variables: object) => {
    return refetch(variables);
  };

  return imperativelyCallQuery;
};

export default Q;
