import { ApolloClient, HttpLink, split, InMemoryCache } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { WebSocketLink } from "@apollo/client/link/ws";
import { setContext } from "@apollo/client/link/context";

const { REACT_APP_API_HOST, REACT_APP_API_PORT } = process.env;
const uri = `${REACT_APP_API_HOST}:${REACT_APP_API_PORT}`;

const httpLink = new HttpLink({
  uri: `http://${uri}/graphql`,
  credentials: "same-origin",
});

const wsLink = new WebSocketLink({
  uri: `ws://${uri}/subscriptions`,
  options: {
    reconnect: true,
  },
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const l = localStorage.getItem("l");
  if (!l) {
    return { headers: { ...headers } };
  }
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      l,
    },
  };
});

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === "OperationDefinition" && operation === "subscription";
  },
  wsLink,
  authLink.concat(httpLink)
);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

export default client;
