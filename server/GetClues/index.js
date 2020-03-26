const faunaDB = require("../_fauna");

module.exports = async function(context, req) {
  context.log("GetClues trigger processed a request.");

  if (req.body && req.body.topic) {
    const topic = req.body.topic;
    const clues = await faunaDB.getClues(topic);

    context.res = {
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: {
        clues
      }
    };
  } else {
    context.res = {
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      status: 400,
      body: "Please pass a topic in the request body"
    };
  }
};
