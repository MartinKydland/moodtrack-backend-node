const User = require("../model/user/user");
const Auth = require("../middleware/auth");

module.exports.userResolvers = {
  Query: {
    async user(parent, args, context, info) {
      return Auth.requireOwnership(
        args._id || null,
        parent,
        args,
        context,
        info,
        resolveFindUser
      );
    },
    async users(parent, args, context, info) {
      return Auth.requireAdmin(parent, args, context, info, resolveFindUsers);
    },
  },
  Mutation: {
    registerUser(parent, args, context, info) {
      // Register is a public action, no need to secure this mutation.
      return Auth.registerNewUser(args);
    },
    createUser(parent, args, context, info) {
      return Auth.requireAdmin(parent, args, context, info, resolveCreateUser);
    },
    modifyUser(parent, args, context, info) {
      return Auth.requireOwnership(
        args._id || null,
        parent,
        args,
        context,
        info,
        resolveModifyUser
      );
    },
    unregisterUser(parent, args, context, info) {
      return Auth.requireAdmin(
        parent,
        args,
        context,
        info,
        resolveUnregisterUser
      );
    },
    recreateUsers(parent, args, context, info) {
      return Auth.requireAdmin(
        parent,
        args,
        context,
        info,
        Auth.recreateUsersFromAuth
      );
    },
  },
};

const resolveUnregisterUser = async function (parent, args, context, info) {
  try {
    return await Auth.deleteUserFromDbAndAuth(args._id);
  } catch (error) {
    return error;
  }
};

const resolveCreateUser = async function (parent, args, context, info) {
  try {
    const params = args.user;
    params.creationDate = new Date();
    console.log(params.creationDate);
    return await User.createUser(params);
  } catch (error) {
    console.log(error);
    return error;
  }
};

const resolveFindUser = async function (parent, args, context, info) {
  try {
    if (args._id) {
      return await User.findUserById(args._id);
    } else if (args.email) {
      return await User.findUserByEmail(args.email);
    } else throw new Error("No valid/usable args for finding user");
  } catch (error) {
    console.log(error);
    return error;
  }
};

const resolveFindUsers = async function (parent, args, context, info) {
  try {
    return await User.findUsers(args);
  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports.resolveFindAllUsers = async function (
  parent,
  args,
  context,
  info
) {
  try {
    return await User.fetchAllUsers();
  } catch (error) {
    console.log(error);
    return error;
  }
};

const resolveModifyUser = async function (parent, args, context, info) {
  try {
    const _id = args._id;
    const params = args.user;
    return await User.updateUser(_id, params);
  } catch (error) {
    console.log(error);
    return error;
  }
};
