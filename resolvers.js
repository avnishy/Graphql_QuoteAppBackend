import { quotes, users } from "./fakedb.js";
import { randomBytes } from "crypto";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./config.js";

const User = mongoose.model("User");
const Quote = mongoose.model("Quote");

const resolvers = {


  Query: {
    users: async () => await User.find({}),
    user: async (_, { _id }) => await User.findOne({ _id }), //First argument in user is parent Here User is an root level Entity so we pass _
    iquotes: async (_, { by }) => await Quote.find({ by }), //First argument in user is parent Here User is an root level Entity so we pass _
    quotes: async () => await Quote.find({}).populate("by","_id firstName lastName"),
  },


  user: {
    quotes: async (ur) => await Quote.find({ by: ur._id }),
  },


  Mutation: {
    signupUser: async (_, { userNew }) => {
      const user = await User.findOne({ email: userNew.email });
      if (user) {
        throw new Error("Email Already Existed");
      }
      const hashedPassword = await bcrypt.hash(userNew.password, 5);
      const newUser = new User({
        ...userNew,
        password: hashedPassword,
      });
      return await newUser.save();
    },

    signinUser: async (_, { UserSignin }) => {
      const user = await User.findOne({ email: UserSignin.email });
      if (!user) {
        throw new Error("User not found Please Register First");
      }
      const doMatch = await bcrypt.compare(UserSignin.password, user.password);
      if (!doMatch) {
        throw new Error("Email & Password Not Found");
      }
      const token = jwt.sign({ userID: user._id }, JWT_SECRET);
      return { token };
    },

    createQuote: async (_, { name }, { userID }) => {
      if (!userID) throw new Error("You Must be Logged in");
      const newQuote = new Quote({
        name,
        by: userID,
      });
      await newQuote.save();
      return "Saved Successfully";
    },
  },
};

export default resolvers;
