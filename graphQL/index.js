const express = require("express");
const app = express();
const port = 3000;
const morgan = require("morgan");
app.use(morgan("dev"));
const { graphqlHTTP } = require("express-graphql");
const { GraphQLSchema } = require("graphql");
const RootQueryType = require("./graphQlSchema/rootQuery");

const schema = new GraphQLSchema({
  query: RootQueryType,
});

app.use(
  "/graphql",
  graphqlHTTP({
    graphiql: true /* process.env.ENV === "dev" */,
    schema: schema,
  })
);

app.get("/", (req, res) => res.send("Hello yasta!"));

app.listen(port, () => console.log(`Server listening on port ${port}!`));
