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

  let allProblemsWithTag = await fetch(url);
  let allProblemsWithTagInJson = await allProblemsWithTag.json();

  let userId = "bittuBhaiya"; //get from the request
  let maxRating = 1800; //get from request
  let minRating = 1500; //get from request
  let problemCount = 10;

  // submissions of User
  let urlToGetAllSubmissions =
    "https://codeforces.com/api/user.status?handle=" +
    userId +
    "&from=1&count=1000";

  let submissions = await fetch(urlToGetAllSubmissions);
  let submissionsResponse = await submissions.json();

  let allCorrectSubmissions = [];
  submissionsResponse.result.forEach((item) => {
    if (item.verdict === "OK") {
      allCorrectSubmissions.push({
        contestId: item.problem.contestId,
        index: item.problem.index,
      });
    }
  });

  let problemsWithGivenTagsAndRating = []; //with contain an object { constestId : Number, Index : string}
  allProblemsWithTagInJson.result.problems.forEach((problem) => {
    //console.log(problem);

    if (problem.rating !== undefined) {
      if (problem.rating <= maxRating && problem.rating >= minRating) {
        problemsWithGivenTagsAndRating.push({
          contestId: problem.contestId,
          index: problem.index,
          rating: problem.rating,
          tags: problem.tags,
        });
      }
    }
  });

  res.send(problemsWithGivenTagsAndRating);
});

module.exports = router;
