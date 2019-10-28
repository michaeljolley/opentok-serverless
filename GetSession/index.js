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
 * @param sessionName Unqiue name of the session to join
 * @param mediaMode Media settings the session should use. Defaults to 'routed'
 * @param archiveMode Archive settings for the session. Defaults to 'manual'
 * @param location Optional location hint
 */
module.exports = async function (context, req) {
    context.log('GetSession trigger processed a request.');

    if (req.query.sessionName || (req.body && req.body.sessionName)) {

        const sessionName = req.query.sessionName || req.body.sessionName;
        let sessionId = undefined;

        try {
            // lookup session based on name in faunadb.
            const session = await getSession(sessionName);
            console.log(session);
            sessionId = session.sessionId;
        }
        catch (err) {
            console.log(err);
        }

        if (!sessionId) { // if not, create it & save to faunadb
            const archiveMode = req.query.archiveMode || (req.body && req.body.archiveMode) || 'manual';
            const location = req.query.location || (req.body && req.body.location) || undefined;
            const mediaMode = req.query.mediaMode || (req.body && req.body.mediaMode) || 'routed';
            const p2pPreference = req.query['p2p.preference'] || (req.body && req.body.p2p && req.body.p2p.preference) || 'disabled';

            sessionId = await createSession(archiveMode, location, mediaMode, p2pPreference);

            if (sessionId) {
                console.log(`session: ${sessionId}`);
                await saveSession(sessionId, sessionName);
                context.res = {
                    body: {
                        sessionId,
                        sessionName: sessionName.toLowerCase()
                    }
                }
            }
            else {
                context.res = {
                    status: 400,
                    body: "Unable to create or retrieve session."
                };
            }
        } else {

            console.log(`session: ${sessionId}`);
            await saveSession(sessionId, sessionName);
            context.res = {
                body: {
                    sessionId,
                    sessionName: sessionName.toLowerCase()
                }
            }
        }
    }
    else {
        context.res = {
            status: 400,
            body: "Please pass a sessionName on the query string or in the request body"
        };
    }
};

/**
 * Creates an OpenTok session
 * @param archiveMode Archive settings for the session. Defaults to 'none'
 * @param location Optional location hint
 * @param mediaMode Media settings the session should use. Defaults to 'routed'
 */
async function createSession(archiveMode, location, mediaMode, p2pPreference) {
    return new Promise((resolve, reject) => {
        opentok.createSession({
            mediaMode
        }, function (err, session) {
            if (err) reject(err);
            console.log(session.sessionId);
            resolve(session.sessionId);
        });
    });
}

/**
 * Gets a session (if it exists) from faunaDB
 * @param {string} sessionName user friendly name representing the session
 */
async function getSession(sessionName) {
    return new Promise((resolve, reject) => {
        client.query(
            q.Get(
                q.Match(q.Index('sessionName_sessions'), sessionName.toLowerCase())
            )
        )
            .then((ret) => resolve(ret))
            .catch(err => reject(err));
    });
}

/**
 * Saves a session to faunaDB
 * @param {string} sessionId  sessions unique identifer
 * @param {string} sessionName user friendly name representing the session
 */
async function saveSession(sessionId, sessionName) {
    return new Promise((resolve, reject) => {

        client.query(
            q.Create(
                q.Collection('sessions'), {
                data: {
                    sessionId,
                    sessionName: sessionName.toLowerCase()
                }
            })
        )
            .then((ret) => resolve(ret.data))
            .catch(err => reject(err));
    });
}