import log from "loglevel";
import { createClient } from "redis";

const { REDIS_HOSTNAME, REDIS_PORT } = process.env;

if (!REDIS_HOSTNAME) {
  throw new Error("Please pass REDIS_HOSTNAME in env variables");
}
const [host, port] = REDIS_HOSTNAME.split(":");

log.info("Redis", host, port, REDIS_PORT);

const client = createClient({ socket: { host, port: Number(port || REDIS_PORT) } });

client.connect();

client.on("error", (error) => {
  log.error("error from redis", error);
});

client.on("ready", () => {
  log.info("Connected to redis");
});

export default client;
