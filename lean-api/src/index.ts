require("dotenv").config();
import { GraphQLServer, PubSub } from "graphql-yoga";
import { connect } from "mongoose";
import { default as typeDefs } from "./typeDefs";
import { default as resolvers } from "./resolvers";
import { User } from "./schemas";

const pubsub = new PubSub();

const { DB_NAME, DB_HOST, DB_PORT } = process.env;

connect(`mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const options = {
  port: 3001,
  endpoint: "/graphql",
  subscriptions: "/subscriptions",
};
const server = new GraphQLServer({
  typeDefs,
  resolvers,
  context: (req) => ({
    userId: req.request && req.request.headers.l,
    user: req.request && User.findById(req.request.headers.l),
    pubsub,
    ...req,
  }),
});
server
  .start(options, () => {
    console.log("Server is running on localhost:" + options.port);
  })
  .catch((err) => console.error("connection Error", err));
