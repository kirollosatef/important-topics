const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
require("dotenv").config();
const User = require("../model/user.model");

const googleClientID = process.env.CLIENT_ID || "";
const googleClientSecret = process.env.CLIENT_SECRET || "";

passport.use(
  new GoogleStrategy(
    {
      callbackURL: "/auth/google/redirect",
      clientID: googleClientID,
      clientSecret: googleClientSecret,
    },
    (accessToken, refreshToken, profile, done) => {
      /// passport callback function
      /// accessToken: this is the token that we can use to access the user's profile info
      /// refreshToken: this is the token that we can use to refresh the accessToken
      /// profile: this is the user's profile information
      /// done: this is the callback function that we need to call once we are done with the passport callback function
      //// console.log("passport callback function");
      //// console.log(profile);
      const newUser = {
        username: profile.displayName,
        googleId: profile.id,
      };
      // check if user already exists in our db
      User.findOne({ googleId: profile.id }).then((currentUser) => {
        if (currentUser) {
          // already have the user
          console.log("user is: " + currentUser);
          
        } else {
          // if not, create user in our db
          new User(newUser).save().then((data) => {
            console.log("user created succesfully: " + data);
          });
        }
      });
      //// User.find().then((data) => {
      ////   console.log(data);
      //// });
    }
  )
);
