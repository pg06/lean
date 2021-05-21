import { GraphQLServer } from "graphql-yoga";
import { connect } from "mongoose";
import { default as typeDefs } from "./src/typeDefs";
import { default as resolvers } from "./src/resolvers";

connect(`mongodb://localhost:27017/myappdb`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const options = { port: 3001, endpoint: "/graphql" };
const server = new GraphQLServer({ typeDefs, resolvers });
server
  .start(options, () =>
    console.log("Server is running on localhost:" + options.port)
  )
  .catch((err) => console.error("connection Error", err));
