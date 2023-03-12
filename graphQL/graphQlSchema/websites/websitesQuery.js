const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLNonNull,
  GraphQLList,
} = require("graphql");
const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, "websites.json");
const websites = require(filePath);

const saveNewObject = async (newObject) => {
  await websites.push(newObject);
  fs.writeFile(filePath, JSON.stringify(websites), "utf8", (err) => {
    if (err) {
      console.log(err);
    }
  });
};
const updateObject = async (id, newObject) => {
  const index = websites.findIndex((website) => website.id === id);
  websites[index] = newObject;
  fs.writeFile(filePath, JSON.stringify(websites), "utf8", (err) => {
    if (err) {
      console.log(err);
    }
  });
};
const deleteObject = async (id) => {
  const index = websites.findIndex((website) => website.id === id);
  websites.splice(index, 1);
  fs.writeFile(filePath, JSON.stringify(websites), "utf8", (err) => {
    if (err) {
      console.log(err);
    }
  });
};

const WebsiteObject = new GraphQLObjectType({
  name: "Website",
  description: "This represents a websites",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    url: { type: GraphQLNonNull(GraphQLString) },
    ownerId: { type: GraphQLNonNull(GraphQLInt) },
  }),
});

const WebsitesQueryType = new GraphQLObjectType({
  name: "WebsitesQueryType",
  description: "Websites Query",
  fields: () => ({
    //* List
    list: {
      type: new GraphQLList(WebsiteObject),
      description: "List of all websites",
      resolve: () => websites,
    },
    //* Get
    get: {
      type: WebsiteObject,
      description: "Get single website",
      args: {
        id: { type: GraphQLInt },
      },
      resolve: (parent, args) => {
        return websites.find((website) => website.id === args.id);
      },
    },
    //* Create
    create: {
      type: WebsiteObject,
      description: "Create a website",
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        url: { type: GraphQLNonNull(GraphQLString) },
        ownerId: { type: GraphQLNonNull(GraphQLInt) },
      },
      resolve: (parent, args) => {
        const website = {
          id: websites.length + 1,
          name: args.name,
          url: args.url,
          ownerId: args.ownerId,
        };
        saveNewObject(website);
        return website;
      },
    },
    //* Update
    update: {
      type: WebsiteObject,
      description: "Update a website",
      args: {
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) },
        url: { type: GraphQLNonNull(GraphQLString) },
        ownerId: { type: GraphQLNonNull(GraphQLInt) },
      },
      resolve: (parent, args) => {
        const website = {
          id: args.id,
          name: args.name,
          url: args.url,
          ownerId: args.ownerId,
        };
        updateObject(args.id, website);
        return website;
      },
    },
    //* Delete
    delete: {
      type: WebsiteObject,
      description: "Delete a website",
      args: {
        id: { type: GraphQLNonNull(GraphQLInt) },
      },
      resolve: (parent, args) => {
        const website = websites.find((website) => website.id === args.id);
        deleteObject(args.id);
        return website;
      },
    },
  }),
});

module.exports = {
  WebsitesQueryType,
  WebsiteObject,
};
