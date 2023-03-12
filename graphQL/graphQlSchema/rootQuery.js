const { GraphQLObjectType } = require("graphql");
const { WebsitesQueryType } = require("./websites/websitesQuery");
const OwnersQueryType = require("./owners/ownersQuery");

const RootQueryType = new GraphQLObjectType({
  name: "RootQueryType",
  description: "Root Query",
  fields: () => ({
    websites: {
      type: WebsitesQueryType,
      description: "Websites Query",
      resolve: () => ({}),
    },
    owners: {
      type: OwnersQueryType,
      description: "Owners Query",
      resolve: () => ({}),
    },
  }),
});

module.exports = RootQueryType;
