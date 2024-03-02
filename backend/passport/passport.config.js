import passport from 'passport';

import bcryptjs from 'bcryptjs';
import User from '../models/user.model.js';
import { GraphQLLocalStrategy } from 'graphql-passport';

export const configurePassport = async () => {
  // serialize the User Object to create the session when someon log or singup
  passport.serializeUser((user, done) => {
    console.log('serializing the user');
    done(null, user._id);
  });

  // deserialize the User when we logout
  passport.deserializeUser(async (id, done) => {
    console.log('deserializing user');
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  passport.use(
    // login
    new GraphQLLocalStrategy(async (username, password, done) => {
        try {
            const user = await User.findOne({ username });
            if (!user) {
                throw new Error("Invalid username or password");
            }
            const validPassword = await bcrypt.compare(password, user.password);

            if (!validPassword) {
                throw new Error("Invalid username or password");
            }

            return done(null, user);
        } catch (err) {
            return done(err);
        }
    })
);
};
