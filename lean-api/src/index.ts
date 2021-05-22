import { GraphQLServer } from "graphql-yoga";
import { connect } from "mongoose";
import { default as typeDefs } from "./typeDefs";
import { default as resolvers } from "./resolvers";

connect(`mongodb://localhost:27017/myappdb10`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const options = { port: 3001, endpoint: "/graphql" };
const server = new GraphQLServer({ typeDefs, resolvers, context: () => {} });
server
  .start(options, () =>
    console.log("Server is running on localhost:" + options.port)
  )
  .catch((err) => console.error("connection Error", err));
