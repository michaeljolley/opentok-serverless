const topics = ["Movies", "Animals", "Songs", "Actors"];

module.exports = async function(context, req) {
  context.log("GetTopic trigger processed a request.");

  let topic = topics[Math.floor(Math.random() * topics.length)];

  context.res = {
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    body: {
      topic
    }
  };
};
