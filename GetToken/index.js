const openTok = require("../_opentok");

/**
 * Gets or creates a session based on the provided parameters
 * @param sessionId Unqiue name of the session to join
 * @param userName Name to display for user
 */
module.exports = async function (context, req) {
    context.log('GetToken trigger processed a request.');

    if (!(req.body && req.body.sessionId)) {
        context.res = {
            status: 400,
            body: "Please pass a sessionId in the request body"
        };
    }

    if (!(req.body && req.body.userName)) {
        context.res = {
            status: 400,
            body: "Please pass a userName in the request body"
        };
    }

    const sessionId = req.query.sessionId || req.body.sessionId;
    const userName = req.query.userName || req.body.userName;

    const token = openTok.createToken(sessionId, userName);
    context.res = {
        body: {
            sessionId,
            token
        }
    }
};
