async function init() {
  // await loadIdentity();
  loadDormInfo();
}

async function loadDormInfo() {
  const urlParams = new URLSearchParams(window.location.search);
  const dormname = urlParams.get("dorm");

  let dormInfoJson;
  try {
    let response = await fetch(`api/v1/dormInfo?dormname=${dormname}`);
    dormInfoJson = await response.json();
  } catch (error) {
      dormInfoJson = {
          status: "error",
          error: error
      }
  }

      if (dormInfoJson.status == "error") {
          document.getElementById("comments_box").innerText =
            "There was an error: " + dormInfoJson.error;
      } else {
        console.log(dormInfoJson[0].dormId)
        let dormsHtml = `${dormInfoJson[0].htmlPreview}`;
        dormsHtml += dormInfoJson[0].comments
          .map((dormInfo) => {
            return `
            <div class="dorm">
                
                <div id="comments-${dormInfoJson[0].dormId}">
                ${dormInfo.comment}
                    <span title="${dormInfo.likes}"> ${
              dormInfo.likes ? `${dormInfo.likes.length}` : 0
            } likes </span> &nbsp; &nbsp;
            </div>
          <br>
            <div>
                <button onclick='refreshComments("${
                    dormInfoJson[0].dormId
                }")'>refresh comments</button>
                <span>${dormInfo.username}</span>
                <span>${dormInfo.created_date}</span>
            </div> 
            <div>
                  <h2>Post Your Rating and Comment</h2>
                <p>Rating: </p>
                    <select id="ratingnum">
                        <option value = 0>0</option>
                        <option value = 1>1</option>
                        <option value = 2>2</option>
                        <option value = 3>3</option>
                        <option value = 4>4</option>
                        <option value = 5>5</option>
                    </select>
                <br>
                <p>Comment: </p>
                    <input type="text" id="commentInput"/>
                    <button onclick='postRatingComment("${dormInfoJson[0].dormId}")'>Post Rating and Comment</button>
            </div>`;
          })
          .join("\n");
        document.getElementById("comments_box").innerHTML = dormsHtml;
      }
}

{/* <span class="heart-button-span ${myIdentity ? "" : "d-none"}">
${
  dormInfo.likes && dormInfo.likes.includes(myIdentity)
    ? `<button class="heart_button" onclick='unlikeComment("${dormInfo._id}")'>&#x2665;</button>`
    : `<button class="heart_button" onclick='likeComment("${dormInfo._id}")'>&#x2661;</button>`
} 
</span> */}

const escapeHTML = str => str.replace(/[&<>'"]/g, 
  tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag]));

function getCommentHTML(commentJSON) {
  return commentJSON
    .map((commentInfo) => {
      return `
        <div class="individual-comment-box">
            <div>${escapeHTML(commentInfo.comment)}</div>
            <div> - <a href="/dormDetials.html?dorm=${encodeURIComponent(
              commentInfo.username
            )}">${commentInfo.username}</a>, ${commentInfo.created_date}</div>
        </div>`;
    })
    .join(" ");
}

// async function toggleComments(buildingID) {
//   let element = document.getElementById(`comments-box-${buildingID}`);
// //   if (!element.classList.contains("d-none")) {
// //     element.classList.add("d-none");
// //   } else {
//     element.classList.remove("d-none");
//     let commentsElement = document.getElementById(`comments-${buildingID}`);
//     if (commentsElement.innerHTML == "") {
//       // load comments if not yet loaded
//       commentsElement.innerHTML = "loading...";
//       try {
//         let response = await fetch(
//           `api/v1/comments?buildingID=${buildingID}`
//         );
//         let commentsJSON = await response.json();
//         commentsElement.innerHTML = getCommentHTML(commentsJSON);
//       } catch (error) {
//         commentsElement.innerText = "error" + error;
//       }
//     }
// }

async function refreshComments(buildingID) {
  let commentsElement = document.getElementById(`comments-${buildingID}`);
  console.log(buildingID)
  commentsElement.innerHTML = "loading...";
  try {
    let response = await fetch(`api/v1/comments?buildingID=${buildingID}`);
    let commentsJSON = await response.json();
    commentsElement.innerHTML = getCommentHTML(commentsJSON);
  } catch (error) {
    commentsElement.innerText = "error" + error;
  }
}

async function postRatingComment(buildingID) {
    console.log(buildingID)
  let newComment = document.getElementById(`commentInput`).value;
  let newRating = parseInt(document.getElementById(`ratingnum`).value);
    console.log(newComment)
    console.log(typeof(newRating))

  try {
    let response = await fetch(`api/v1/comments`, {
      method: "POST",
      body: JSON.stringify({ buildingID: buildingID, newComment: newComment, newRating: newRating }),
      headers: { "Content-Type": "application/json" },
    });
    let responesJSON = await response.json();
    if (responesJSON.status == "error") {
      console.log("error:" + responesJSON.error);
    } else {
      refreshComments(buildingID);
    }
    return responesJSON;
  } catch (error) {
    console.log("error:" + error);
  }
}
