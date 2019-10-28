const OpenTok = require('opentok');
const faunadb = require('faunadb'),
    q = faunadb.query;

require('dotenv').config();

const client = new faunadb.Client({
    secret: process.env.FAUNADB_SECRET
});

const opentok = new OpenTok(
    process.env.OPENTOK_API_KEY,
    process.env.OPENTOK_API_SECRET);

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

    const token = createToken(sessionId, userName);
    context.res = {
        body: {
            sessionId,
            token
        }
    }
};

/**
 * Creates an OpenTok token
 * @param sessionId Unqiue name of the session to join
 * @param userName Name to display for user
 */
function createToken(sessionId, userName) {
    return opentok.generateToken(sessionId, {
        role: userName.toLowerCase() === 'michael jolley' ? 'moderator' : 'subscriber',
        expireTime: (new Date().getTime() / 1000) + (7 * 24 * 60 * 60),
        data: `name=${userName}`
    });
}