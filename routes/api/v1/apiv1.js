import express from "express";
import fs from "fs";
import fetch from "node-fetch";
import parser from "node-html-parser";
var router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.redirect("/");
});

// GET dorm info
router.get("/dorms", async function (req, res, next) {
  try {
    // console.log(111)
    let allDorms = await req.db.Building.find();
    // console.log(allDorms)
    let results = [];
    allDorms.forEach((dorm) => {
      let dormName = dorm.buildingname;
      // let dormLikes = dorm.likes;
      let dormId = dorm._id;
      let dormRating = dorm.rating;
      let average = (array) => array.reduce((a, b) => a + b) / array.length;
      let avgDormRating = average(dormRating);

      results.push(
        viewDorm(dorm, avgDormRating)
          .then((htmlReturn) => {
            return {
              dormName: dormName,
              // likes: dormLikes,
              htmlPreview: htmlReturn,
              dormRating: avgDormRating,
            };
          })
          .catch((err) => {
            console.log("Error", err);
          })
      );
    });

    Promise.all(results).then((result) => {
      res.send(result);
    });
  } catch (error) {
    res.send("error" + error);
  }
});

// html component contains dorm img and dorm name
async function viewDorm(dorm, avgDormRating) {
  // console.log(dorm)
  // let dorm = await req.db.Building.findById(dormId);
  let dormName = dorm.buildingname;
  let dormImg = "imgs/" + dormName + ".jpeg";
  let htmlReturn =
    '<div style="max-width: 300px; border: solid 1px; padding: 3px; text-align: center;">';
  htmlReturn += `<h2><div><a href="/dormDetails.html?dorm=${encodeURIComponent(
    dormName
  )}">${dormName}</a></h2>`;
  htmlReturn += `<p>Rating: ${avgDormRating}</p>`;
  htmlReturn += `<img src="${dormImg}" style="max-height: 200px; max-width: 270px;">`;
  htmlReturn += `</div>`;
  // console.log(htmlReturn)
  return htmlReturn;
}

// POST comment on the building
router.post("/comments", async function (req, res, next) {
  try {
    const Comment = new req.db.Comment({
      username: "name",
      comment: req.body.newComment,
      building: req.body.buildingID,
      created_date: Date.now(),
    });
    await Comment.save();

    let building = await req.db.Building.findById(req.body.buildingID);
    console.log(building);
    building.rating.push(req.body.newRating);
    await building.save();

    res.json({ status: "success" });
  } catch (error) {
    res.json({ error: error });
  }
});

// GET comment on the building
router.get("/comments", async function (req, res, next) {
  try {
    let buildingID = req.query.buildingID;
    let comments = await req.db.Comment.find({ building: buildingID });
    res.json(comments);
  } catch (error) {
    res.json({ error: error });
  }
});

// POST like on the comment
router.post("/likeComment", async function (req, res, next) {
  try {
    let commentID = req.body.commentID;
    let userNametoAdd = "...";
    let comment = await req.db.Comment.findById(commentID);
    // console.log(comment.likes);
    if (!comment.likes.includes(userNametoAdd)) {
      comment.likes.push(userNametoAdd);
    }
    await comment.save();
    res.json({ status: "success" });
  } catch (error) {
    res.json({ error: error });
  }
});

// POST Unlike on the comment (remove like)
router.post("/unlikeComment", async function (req, res, next) {
  try {
    let commentID = req.body.commentID;
    let userNametoRemove = "...";
    let comment = await req.db.Comment.findById(commentID);
    if (comment.likes.includes(userNametoRemove)) {
      comment.likes = comment.likes.filter((like) => {
        return like != userNametoRemove;
      });
    }
    console.log(comment.likes);
    await comment.save();
    res.json({ status: "success" });
  } catch (error) {
    res.json({ error: error });
  }
});

// DELETE comment 
router.delete("/comments", async function (req, res, next) {
  try {
    // let session = req.session;
    // if (session.isAuthenticated) {
      // let username = session.account.username;
      let username = "...";
      let commentID = req.body.commentID;
      let comment = await req.db.Comment.findById(commentID);
      // if (username == comment.username) {
        if (username == "...") {
          await req.db.Comment.deleteOne({ _id: commentID });
          res.json({ status: "success" });
        } else {
          res.json({
            status: "error",
            error: "you can only delete your own posts",
          });
        }
    // } else {
    //   res.json({
    //     status: "error",
    //     error: "not logged in",
    //   });
    // }
  } catch (error) {
    res.json({ error: error });
  }
});

//display the selected dorm
router.post("/filterDorms", async function (req, res, next) {
  try {
    let dormName = req.body.dormName;
    let dorm = await req.db.Building.find({ buildingname: dormName });
    let results = [];
    dorm.forEach((dorm) => {
      let dormName = dorm.buildingname;
      // let dormLikes = dorm.likes;
      let dormId = dorm._id;
      let dormRating = dorm.rating;
      let average = (array) => array.reduce((a, b) => a + b) / array.length;
      let avgDormRating = average(dormRating);

      results.push(
        viewDorm(dorm, avgDormRating)
          .then((htmlReturn) => {
            return {
              dormName: dormName,
              // likes: dormLikes,
              htmlPreview: htmlReturn,
              dormRating: avgDormRating,
            };
          })
          .catch((err) => {
            console.log("Error", err);
          })
      );
    });

    Promise.all(results).then((result) => {
      res.send(result);
    });
  } catch (error) {
    res.send("error" + error);
  }
});

//GET get info related to a specific dorm: dormName, htmlPreview, a list of comments [comments]
//
router.get("/dormInfo", async function (req, res, next) {
  try {
    let dormname = req.query.dormname;
    let dorm = await req.db.Building.find({ buildingname: dormname });
    let comments = await req.db.Comment.find({ building: dorm[0]._id });
    // console.log(comments)
    // console.log(dorm)
    let results = [];
    dorm.forEach((dorm) => {
      let dormName = dorm.buildingname;
      // let dormLikes = dorm.likes;
      let dormId = dorm._id;
      let dormRating = dorm.rating;
      let average = (array) => array.reduce((a, b) => a + b) / array.length;
      let avgDormRating = average(dormRating);

      results.push(
        viewDorm(dorm, avgDormRating)
          .then((htmlReturn) => {
            return {
              dormName: dormName,
              // likes: dormLikes,
              comments: comments,
              htmlPreview: htmlReturn,
              dormId: dormId,
            };
          })
          .catch((err) => {
            console.log("Error", err);
          })
      );
    });
    // console.log(comments[0])
    Promise.all(results).then((result) => {
      res.send(result);
    });
  } catch (err) {}
});
export default router;
