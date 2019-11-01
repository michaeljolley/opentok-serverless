const faunaDB = require("../_fauna");
const openTok = require("../_opentok");

module.exports = async function(context, req) {
  context.log("SessionMonitorCallback trigger function processed a request.");

  if (req.body) {
    const payload = req.body;

    let sessionRecord = await faunaDB.getRecord(payload.sessionId);

    if (sessionRecord) {
      let members = sessionRecord.data.members;

      switch (payload.event) {
        case "connectionCreated":
          members++;
          break;

        case "connectionDestroyed":
          members--;
          break;
      }

      if (members < 0) {
        members = 0;
      }

      sessionRecord.data.members = members;

      await faunaDB.updateSession(sessionRecord);
    }
  }

  context.res = {
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    body: "Ok"
  };
};
