require("dotenv").config();

const OpenTok = require("opentok");

const opentok = new OpenTok(
  process.env.OPENTOKAPIKEY,
  process.env.OPENTOKAPISECRET
);

module.exports = {
  /**
   * Creates an OpenTok session
   * @param archiveMode Archive settings for the session. Defaults to 'none'
   * @param location Optional location hint
   * @param mediaMode Media settings the session should use. Defaults to 'routed''
   * @param p2pPreference Peer 2 peer preference. Not used currently
   */
  createSession: async function createSession(
    archiveMode,
    location,
    mediaMode,
    p2pPreference
  ) {
    return new Promise((resolve, reject) => {
      opentok.createSession(
        {
          mediaMode
        },
        function(err, session) {
          if (err) reject(err);
          console.log(session.sessionId);
          resolve(session.sessionId);
        }
      );
    });
  },

  /**
   * Creates an OpenTok token
   * @param sessionId Unqiue name of the session to join
   * @param userName Name to display for user
   */
  createToken: function createToken(sessionId, userName) {
    return opentok.generateToken(sessionId, {
      role: "publisher",
      expireTime: new Date().getTime() / 1000 + 7 * 24 * 60 * 60,
      data: `name=${userName}`
    });
  }
};
