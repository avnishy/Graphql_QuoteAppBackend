import { ApolloServer } from "apollo-server";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import typeDefs from "./schema.js";
import mongoose from "mongoose";
import { JWT_SECRET, MONGO_URL } from "./config.js";
import jwt from "jsonwebtoken";

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("Connected", () => {
  console.log("Connected to mongodb");
});

mongoose.connection.on("Error", (err) => {
  console.log("Error ", err);
});

//import models here
import "./models/Quotes.js";
import "./models/User.js";

import resolvers from "./resolvers.js";

//Middleware Function Definition
const context = ({ req }) => {
  const { authorization } = req.headers;
  if (authorization) {
    const { userID } = jwt.verify(authorization, JWT_SECRET);
    return { userID };
  }
}

const server = new ApolloServer({
  typeDefs: typeDefs,
  resolvers: resolvers,
  context ,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground],
});

server.listen(8080).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
