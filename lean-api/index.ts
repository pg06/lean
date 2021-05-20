import { GraphQLServer } from "graphql-yoga";
import { connect } from "mongoose";

connect(`mongodb://localhost:27017/myappdb`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const typeDefs = `
  type Query {
    hello(name: String): String!
  }
`

const resolvers = {
  Query: {
    hello: (_, { name }) => `Hello ${name || 'World'}`,
  },
}

const options = { port: 3001, endpoint: '/graphql' };
const server = new GraphQLServer({ typeDefs, resolvers });
server.start(options, () => console.log(
  'Server is running on localhost:' + options.port
)).catch(err => console.error('connection Error', err));