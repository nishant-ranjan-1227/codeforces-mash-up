var express = require("express");
var router = express.Router();
const fetch = require("node-fetch");

router.get("/", async function (req, res) {
  let tags = ["math", "dp"];
  let url = "https://codeforces.com/api/problemset.problems";

  if (tags.length !== 0) {
    url += "?tags=";
    for (var i = 0; i < tags.length; i++) {
      url += tags[i];
      if (i !== tags.length - 1) {
        url += ";";
      }
    }
  }

  let userId = "bittuBhaiya"; //get from the request
  let urlToGetAllSubmisions = "https://codeforces.com/api/user.status?handle=Fefer_Ivan&from=1&count=10"

  await console.log(url);

  let data = await fetch(url);

  let response = await data.json();

  console.log(response);

  res.send(response);
});

module.exports = router;
