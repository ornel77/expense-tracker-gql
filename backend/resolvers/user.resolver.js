import bcrypt from 'bcryptjs';
import { users } from '../dummyData/data.js';
import User from '../models/user.model.js';

const userResolver = {
  Mutation: {
    signUp: async (_, { input }, context) => {
      try {
        const { username, gender, password, name } = input;
        if (!username || !gender || !password || !name) {
          throw new Error('All fields are required');
        }
        // check is user already in database
        const existingUser = await User.findOne({ username });
        if (existingUser) {
          throw new Error('User already exists');
        }

        // else we proceed the signup by hashing pwd
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hasn(password, salt);

        // https://avatar-placeholder.iran.liara.run/
        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

        const newUser = new User({
          username,
          name,
          password: hashedPassword,
          gender,
          profilePicture: gender === 'male' ? boyProfilePic : girlProfilePic,
        });

        await newUser.save();
        await context.login(newUser);
        return newUser;
      } catch (error) {
        console.error('Error in signUp: ', err);
        throw new Error(err.message || 'Internal server error');
      }
    },
    login: async (_, { input }, context) => {
      try {
        const { username, password } = input;
        if (!username || !password) {
          throw new Error('All fields are required');
        }
        const { user } = context.authenticate('graphql-local', {
          username,
          password,
        });

        await context.login(user);
        return user;
      } catch (error) {
        console.error('Error in login: ', err);
        throw new Error(err.message || 'Internal server error');
      }
    },
    logout: async (_, _, context) => {
      try {
        await context.logout();
        req.session.destroy((err) => {
          if (err) throw err;
        });
        res.clearCookie('connect.sid');
        return { message: 'Loggout successfully' };
      } catch (error) {
        console.error('Error in logout: ', err);
        throw new Error(err.message || 'Internal server error');
      }
    },
  },

  Query: {
    // users: (_, _, { req, res }) => {
    //   return users;
    // },
    authUser: async (_, _, context) => {
      try {
        const user = await context.getUser();
        return user;
      } catch (error) {
        console.error('Error in authUser: ', err);
        throw new Error(err.message || 'Internal server error');
      }
    },
    user: async (_, { userId }) => {
      try {
        const user = await User.findById(userId);
        return user;
      } catch (error) {
        console.error('Error in user query: ', err);
        throw new Error(err.message || 'Error getting user');
      }
    },
  },
  // TODO => ADD user/transaction relation
};

export default userResolver;
