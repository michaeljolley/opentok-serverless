const faunadb = require('faunadb'),
    q = faunadb.query;

require('dotenv').config();

const client = new faunadb.Client({
    secret: process.env.FAUNADB_SECRET
});

module.exports = async function (context, req) {
    context.log('SessionMonitorCallback trigger function processed a request.');

    if (req.query.name || (req.body && req.body.name)) {
        context.res = {
            // status: 200, /* Defaults to 200 */
            body: "Hello " + (req.query.name || req.body.name)
        };
    }
    else {
        context.res = {
            status: 400,
            body: "Please pass a name on the query string or in the request body"
        };
    }
};