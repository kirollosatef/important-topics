const express = require("express");
const fetch = require("node-fetch");
const morgan = require("morgan");
const redis = require("redis");
const PORT = 3000;
const REDIS_PORT = 6379;
const app = express();
app.use(morgan("dev"));
const _1H = 3600;

var test = 0;

console.log(test);

app.get("/counter", () => {
  test = test + 1;
  res.json(test);
});

const client = redis.createClient();

const getRepos = (req, res, next) => {
  const { username } = req.params;
  console.log("Fetching data...!!");
  client.get(username, async (err, data) => {
    if (err) console.log(err);
    if (data != null) {
      console.log("cache hit...!!");
      res.json(JSON.parse(data));
    } else {
      console.log("cache messedup...!!");
      const data = await fetch(
        `https://api.github.com/users/${username}/repos`
      );
      const repos = await data.json();
      client.setex(username, _1H, JSON.stringify(repos));
      return res.json(repos);
    }
  });
};

const getOrSetCache = (key, cb) => {
  return new Promise((resolve, reject) => {
    client.get(key, async (err, data) => {
      if (err) reject(err);
      if (data != null) {
        console.log("cache hit...!!");
        resolve(JSON.parse(data));
      } else {
        console.log("cache messedup...!!");
        const result = await cb();
        client.setex(key, _1H, JSON.stringify(result));
        resolve(result);
      }
    });
  });
};

app.get("/github/:username", getRepos);

app.listen(PORT, () => {
  console.log(`server running in port ${PORT} !!`);
});
