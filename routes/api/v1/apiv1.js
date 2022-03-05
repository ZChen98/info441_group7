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
router.get("/dorms", function (req, res, next) {
  try {
    let allDorms = await req.db.Building.find();
    let results = [];
    allDorms.forEach((dorm) => {
      let dormName = dorm.buildingname;
      let dormLikes = dorm.likes;
      let dormId = dorm._id;
      let dormRating = dorm.rating;
      let average = (array) => array.reduce((a, b) => a + b) / array.length;
      let avgDormRating = average(dormRating);

      results.push(
        viewDorm(dormId).then((htmlReturn) => {
          return {
            dormName: dormName,
            likes: dormLikes,
            htmlPreview: htmlReturn,
            dormRating: avgDormRating,
          };
        })
        .catch((err) =>{
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
async function viewDorm(dormId) {
  let dorm = await req.db.Building.findById(dormId);
  let dormName = dorm.buildingname;
  let dormImg = "../../../public/imgs" + dormName + "jpeg";

  let htmlReturn =
    '<div style="max-width: 300px; border: solid 1px; padding: 3px; text-align: center;">';
  htmlReturn += `<h2>${dormName}</h2>`;
  htmlReturn += `<img src="${dormImg}" style="max-height: 200px; max-width: 270px;">`;
  htmlReturn += `</div>`;

  return htmlReturn;
}

// POST comment on the building
router.post("/comment", async function (req, res, next) {});

// GET comment on the building
router.get("/comment", async function (req, res, next) {});

// POST like on the comment
router.post("/likeComment", async function (req, res, next) {});

// POST Unlike on the comment (remove like)
router.post("/unlikeComment", async function (req, res, next) {});

export default router;
