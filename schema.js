import { gql } from "apollo-server";
const typeDefs = gql`
  type Query {
    users: [user]
    quotes: [quoteWithName]
    user(_id: ID!): user
    iquotes(by: ID!): [quote]
    myprofile : user
  }

  type user {
    _id: ID!
    firstName: String
    lastName: String
    email: String
    password: String
    quotes: [quote]
  }
  type quote{
      name: String!
      by : String!
  }

  type quoteWithName {
    name: String
    by: IdName
  }

  type IdName {
      _id: String
      firstName: String
      lastName: String
  }

  type Token {
    token: String
  }

  type Mutation {
    signupUser(userNew: UserInput!): user
    signinUser(UserSignin: UserSigninInput!): Token
    createQuote(name: String!): String
  }

  input UserInput {
    firstName: String!
    lastName: String!
    email: String!
    password: String!
  }
  input UserSigninInput {
    email: String!
    password: String!
  }
`;

export default typeDefs;