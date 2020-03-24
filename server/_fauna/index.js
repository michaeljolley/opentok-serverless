const faunadb = require("faunadb"),
  q = faunadb.query;

require("dotenv").config();

const client = new faunadb.Client({
  secret: process.env.FAUNADBSECRET
});

/**
 * Gets a session (if it exists) from faunaDB
 * @param {string} sessionName user friendly name representing the session
 */
async function getRecordBySessionName(sessionName) {
  return new Promise((resolve, reject) => {
    client
      .query(
        q.Get(
          q.Match(q.Index("sessionName_sessions"), sessionName.toLowerCase())
        )
      )
      .then(ret => resolve(ret))
      .catch(err => reject(err));
  });
}

/**
 * Gets a session (if it exists) from faunaDB
 * @param {string} sessionId  sessions unique identifer
 */
async function getRecordBySessionId(sessionId) {
  return new Promise((resolve, reject) => {
    client
      .query(q.Get(q.Match(q.Index("sessionId_sessions"), sessionId)))
      .then(ret => resolve(ret))
      .catch(err => reject(err));
  });
}

module.exports = {
  /**
   * Gets all sessions
   */
  getSessions: async function getSessions() {
    return new Promise((resolve, reject) => {
      client
        .query(
          q.Map(
            q.Paginate(q.Match(q.Index("all_sessions"))),
            q.Lambda("session", q.Get(q.Var("session")))
          )
        )
        .then(ret => resolve(ret.data.map(m => m.data)))
        .catch(err => resolve([]));
    });
  },

  /**
   * Gets a session (if it exists) from faunaDB
   * @param {string} sessionName user friendly name representing the session
   */
  getSession: async function getSession(sessionName) {
    return new Promise((resolve, reject) => {
      getRecordBySessionName(sessionName)
        .then(ret => resolve(ret.data))
        .catch(err => resolve(undefined));
    });
  },

  /**
   * Gets a session (if it exists) from faunaDB
   * @param {string} sessionId  sessions unique identifer
   */
  getRecord: async function getRecord(sessionId) {
    return getRecordBySessionId(sessionId);
  },

  /**
   * Creates a session in faunaDB
   * @param {string} sessionId  sessions unique identifer
   * @param {string} sessionName user friendly name representing the session
   */
  createSession: async function createSession(sessionId, sessionName) {
    return new Promise((resolve, reject) => {
      client
        .query(
          q.Create(q.Collection("sessions"), {
            data: {
              sessionId,
              sessionName: sessionName.toLowerCase(),
              members: 0
            }
          })
        )
        .then(ret => resolve(ret.data))
        .catch(err => reject(err));
    });
  },

  /**
   * Saves a session to faunaDB
   * @param {sessionRecord} sessionRecord  session to save
   */
  updateSession: async function updateSession(sessionRecord) {
    return new Promise((resolve, reject) => {
      client
        .query(
          q.Replace(q.Ref(q.Collection("sessions"), sessionRecord.ref.id), {
            data: sessionRecord.data
          })
        )
        .then(ret => resolve(ret.data))
        .catch(err => reject(err));
    });
  }
};
