const NQEdge = require("../model/nqgraph/nq-edge");
const Auth = require("../middleware/auth");

/***
 * Resolver functions for notification questionnaire edges.
 * Simple functions which pass through the input received
 * from the GraphQL request. All params (parent, args, context, info)
 * are passed through in order to make callbacks look the same
 * to auth functions. In order to extend these resolvers,
 * deconstruct (e.g '{ parent, args }') the arguments passed to the
 * callback or define all parameters for your function.
 */
module.exports.nqEdgeResolvers = {
  Query: {
    edge(parent, args, context, info) {
      // TODO: Implement edge query.
      return null;
    },
    edges(parent, args, context, info) {
      return Auth.requireAdmin(parent, args, context, info, resolveGetEdges);
    },
  },
  Mutation: {
    createEdge(parent, args, context, info) {
      return Auth.requireAdmin(
        parent,
        args,
        context,
        info,
        resolveCreateNqEdge
      );
    },
    editEdge(parent, args, context, info) {
      return Auth.requireAdmin(parent, args, context, info, resolveEditNqEdge);
    },
    deleteEdge(parent, args, context, info) {
      return Auth.requireAdmin(
        parent,
        args,
        context,
        info,
        resolveDeleteNqEdge
      );
    },
  },
};

const resolveCreateNqEdge = async function (parent, args, context, info) {
  try {
    const arg = args.edge;
    return await NQEdge.createEdge(arg);
  } catch (error) {
    return error;
  }
};

const resolveDeleteNqEdge = async function (parent, args, context, infogs) {
  try {
    return await NQEdge.deleteEdge(args);
  } catch (error) {
    return error;
  }
};

const resolveEditNqEdge = async function (parent, args, context, info) {
  try {
    const id = args._id;
    const params = args.edge;
    return await NQEdge.updateEdge(id, params);
  } catch (error) {
    return error;
  }
};

const resolveGetEdge = async function (parent, args, context, info) {
  try {
    return null;
  } catch (error) {
    return error;
  }
};

const resolveGetEdges = async function (parent, args, context, info) {
  try {
    return await NQEdge.getEdges(args);
  } catch (error) {
    return error;
  }
};

/**
 * Marks the edge as archived.
 * @param {*} parent
 * @param {*} args
 * @param {*} context
 * @param {*} info
 * @returns the archived edge object.
 */
const resolveArchiveEdge = async function (parent, args, context, info) {
  try {
    const id = args._id;
    return await NQEdge.updateEdge(id, { isArchived: true });
  } catch (error) {
    return error;
  }
};
