const faunaDB = require("../_fauna");
const openTok = require("../_opentok");

/**
 * Gets or creates a session based on the provided parameters
 * @param sessionName Unique name of the session to join
 * @param mediaMode Media settings the session should use. Defaults to 'routed'
 * @param archiveMode Archive settings for the session. Defaults to 'manual'
 * @param location Optional location hint
 */
module.exports = async function(context, req) {
  context.log("GetSession trigger processed a request.");

  if (req.query.sessionName || (req.body && req.body.sessionName)) {
    let sessionName = req.query.sessionName || req.body.sessionName;
    sessionName = sessionName.toLowerCase();

    let session = await faunaDB.getSession(sessionName);

    if (session) {
      console.log(`session: ${session.sessionId}`);
      context.res = {
        headers: {
          "Access-Control-Allow-Origin": "*"
        },
        body: session
      };
    } else {
      const archiveMode =
        req.query.archiveMode || (req.body && req.body.archiveMode) || "manual";
      const location =
        req.query.location || (req.body && req.body.location) || undefined;
      const mediaMode =
        req.query.mediaMode || (req.body && req.body.mediaMode) || "routed";
      const p2pPreference =
        req.query["p2p.preference"] ||
        (req.body && req.body.p2p && req.body.p2p.preference) ||
        "disabled";

      const sessionId = await openTok.createSession(
        archiveMode,
        location,
        mediaMode,
        p2pPreference
      );

      if (sessionId) {
        console.log(`session: ${sessionId}`);
        session = await faunaDB.createSession(sessionId, sessionName);
        context.res = {
          headers: {
            "Access-Control-Allow-Origin": "*"
          },
          body: session
        };
      } else {
        context.res = {
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": "*"
          },
          body: "Unable to create or retrieve session."
        };
      }
    }
  } else {
    context.res = {
      status: 400,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body:
        "Please pass a sessionName on the query string or in the request body"
    };
  }
};
