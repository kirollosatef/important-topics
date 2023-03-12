const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLNonNull,
  GraphQLList,
  GraphQLSchema,
} = require("graphql");
const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, "owners.json");
const owners = require(filePath);
const websitePath = path.join(__dirname, "../websites/websites.json");
const websites = require(websitePath);
const { WebsiteObject } = require("../websites/websitesQuery");

const saveNewObject = async (newObject) => {
  await owners.push(newObject);
  fs.writeFile(filePath, JSON.stringify(owners), "utf8", (err) => {
    if (err) {
      console.log(err);
    }
  });
};
const updateObject = async (id, newObject) => {
  const index = owners.findIndex((website) => website.id === id);
  owners[index] = newObject;
  fs.writeFile(filePath, JSON.stringify(owners), "utf8", (err) => {
    if (err) {
      console.log(err);
    }
  });
};
const deleteObject = async (id) => {
  const index = owners.findIndex((website) => website.id === id);
  owners.splice(index, 1);
  fs.writeFile(filePath, JSON.stringify(owners), "utf8", (err) => {
    if (err) {
      console.log(err);
    }
  });
};

// error naming convention
const OwnerObject = new GraphQLObjectType({
  name: "Owner",
  description: "This represents a owners",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    age: { type: GraphQLNonNull(GraphQLInt) },
  }),
});

const OwnersQueryType = new GraphQLObjectType({
  name: "OwnersQueryType",
  description: "Owners Query",
  fields: () => ({
    //* List
    list: {
      type: new GraphQLList(OwnerObject),
      description: "List of all owners",
      args: {
        last: { type: GraphQLInt },
        first: { type: GraphQLInt },
      },
      resolve: (_, args) => {
        if (args.last) {
          return owners.slice(-args.last);
        } else if (args.first) {
          return owners.slice(0, args.first);
        } else {
          return owners;
        }
      },
    },
    //* Get
    get: {
      type: OwnerObject,
      description: "Get single owner",
      args: {
        id: { type: GraphQLInt },
      },
      resolve: (parent, args) => {
        return owners.find((owner) => owner.id === args.id);
      },
    },
    //* Create
    create: {
      type: OwnerObject,
      description: "Create new owner",
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        url: { type: GraphQLNonNull(GraphQLString) },
        ownerId: { type: GraphQLNonNull(GraphQLInt) },
      },
      resolve: (parent, args) => {
        const website = {
          id: owners.length + 1,
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
      type: OwnerObject,
      description: "Edit owner",
      args: {
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) },
        url: { type: GraphQLNonNull(GraphQLString) },
        ownerId: { type: GraphQLNonNull(GraphQLInt) },
      },
      resolve: (parent, args) => {
        const owner = {
          id: args.id,
          name: args.name,
          url: args.url,
          ownerId: args.ownerId,
        };
        updateObject(args.id, owner);
        return owner;
      },
    },
    //* Delete
    delete: {
      type: OwnerObject,
      description: "Remove owner",
      args: {
        id: { type: GraphQLNonNull(GraphQLInt) },
      },
      resolve: (parent, args) => {
        const owner = owners.find((owner) => owner.id === args.id);
        deleteObject(args.id);
        return owner;
      },
    },
    // find all websites where ownerId === args.id
    websites: {
      type: new GraphQLList(WebsiteObject),
      description: "List of all websites",
      args: {
        id: { type: GraphQLInt },
      },
      resolve: (parent, args) => {
        const webs = websites.filter((website) => website.ownerId === args.id);
        return webs;
        // const data =  Model.find({userId: args.id})
        // return data
      },
    },
  }),
});

module.exports = OwnersQueryType;
