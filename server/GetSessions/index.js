const faunaDB = require("../_fauna");

/**
 * Gets all sessions
 */
module.exports = async function(context, req) {
  context.log("GetSessions trigger processed a request.");

  const sessions = await faunaDB.getSessions();

  context.res = {
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    body: sessions
  };
};
