var express = require("express");
var router = express.Router();
const fetch = require("node-fetch");

router.post("/", async function (req, res) {
  let tags = [];
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
  let maxRating = 1500; //get from request
  let minRating = 1300; //get from request
  let problemCount = 10;

  // submissions of User
  let urlToGetAllSubmissions =
    "https://codeforces.com/api/user.status?handle=" +
    userId +
    "&from=1&count=1000";

  let submissions = await fetch(urlToGetAllSubmissions);
  let submissionsResponse = await submissions.json();

  let allCorrectSubmissions = new Set();
  submissionsResponse.result.forEach((item) => {
    if (item.verdict === "OK") {
      let problemID = item.problem.contestId + item.problem.index;
      allCorrectSubmissions.add(problemID);
    }
  });

  //console.log(allCorrectSubmissions);

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
          name: problem.name,
        });
      }
    }
  });

  // get the req number of unique unsolved problems
  // iterate over the total problems length and find a random number till the curProblemCount not equal to reProblemsCount

  let totalProblems = problemsWithGivenTagsAndRating.length;
  let alreadyGeneratedRandomNumbers = [];
  let finalListOfProblems = [];
  let curProblemCount = 0;
  let reqProblemsCount = 10; //get from request

  //console.log("Total Problems", totalProblems);

  while (
    curProblemCount != reqProblemsCount &&
    alreadyGeneratedRandomNumbers.length < totalProblems
  ) {
    const random = Math.floor(Math.random() * totalProblems);
    if (alreadyGeneratedRandomNumbers.includes(random) === false) {
      alreadyGeneratedRandomNumbers.push(random);
      // Created a problem ID to check if already solved : "1234A"
      let currentProblemID =
        problemsWithGivenTagsAndRating[random].contestId +
        problemsWithGivenTagsAndRating[random].index;
      if (allCorrectSubmissions.has(currentProblemID) == false) {
        //console.log("cur", currentProblemID);
        let finalProblem = {
          contestId: problemsWithGivenTagsAndRating[random].contestId,
          index: problemsWithGivenTagsAndRating[random].index,
          name: problemsWithGivenTagsAndRating[random].name,
          tags: problemsWithGivenTagsAndRating[random].tags,
          rating: problemsWithGivenTagsAndRating[random].rating,
          link:
            "https://codeforces.com/problemset/problem/" +
            problemsWithGivenTagsAndRating[random].contestId +
            "/" +
            problemsWithGivenTagsAndRating[random].index,
        };

        finalListOfProblems.push(finalProblem);
        curProblemCount += 1;
      } else {
        // console.log("Problem Already Solved");
      }
    }
  }

  console.log(finalListOfProblems);

  let finalresult = {
    result: finalListOfProblems,
  };

  res.json(finalresult);
});

module.exports = router;
