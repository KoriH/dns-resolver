const dgram = require("node:dgram");
const server = dgram.createSocket("udp4");

const ROOT_SERVERS = ["198.41.0.4"];

server.on("error", (err) => {
  console.error("server error");
  server.close();
});

server.on("message", (msg, rinfo) => {
  console.log("server got ${msg} from ${rinfo}");
  HandleResponse(msg, rinfo);
});

server.on("listening", () => {
  const address = server.address();
});

server.bind(53);
