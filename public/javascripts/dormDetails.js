async function init() {
  await loadIdentity();
  loadDormInfo();
}

async function loadDormInfo() {
  const urlParams = new URLSearchParams(window.location.search);
  const dormname = urlParams.get("dorm");
  console.log(dormname)

  let dormInfoJson;
  try {
    let response = await fetch(`api/v1/dormInfo?dormname=${dormname}`);
    dormInfoJson = await response.json();
  } catch (error) {
    dormInfoJson = {
      status: "error",
      error: error,
    };
  }

  if (dormInfoJson.status == "error") {
    document.getElementById("comments_box").innerText =
      "There was an error: " + dormInfoJson.error;
  } else {
    let dormsHtml = `
    <section  class="news">
      <div class="container">
        <div class="news-details">
          <div class="section-header text-center">
            <h2>About this Dorm</h2>
            <br>
            
          </div>
    `;
    dormsHtml += `${dormInfoJson[0].htmlPreview}
          <br>
          <div class="section-header text-center">  
            <h2>
							All comments
            </h2>
          </div>
          <br>
          `;

    dormsHtml += dormInfoJson[0].comments
      .map((dormInfo) => {
        return `    
            <div class="comments-area">
              <ol class="comment-list">
                <li  class="comment">
                  <div  class="comment-body xtra-comment-body">
                    <div class="comment-content">
                      <b class="fn">
                        <a href="#">${dormInfo.username}
                          <span>${dormInfo.created_date}</span>
                        </a>
                      </b>
                      <div class="reply">
                        <span class="heart-button-span ${
                          myIdentity ? "" : "d-none"
                        }">${
          dormInfo.likes && dormInfo.likes.includes(myIdentity)
            ? `<button class="heart_button" onclick='unlikeComment("${dormInfo._id}")'>&#x2665;</button>`
            : `<button class="heart_button" onclick='likeComment("${dormInfo._id}")'>&#x2661;</button>`
        }
                        </span>
                        <span class="delete_btn_span ${
                          myIdentity == dormInfo.username ? "" : "d-none"
                        }"><button onclick='deletePost("${dormInfo._id}")'
                        }">Delete</button></span>
                        <span title="${dormInfo.likes}"> ${
          dormInfo.likes ? `${dormInfo.likes.length}` : 0
        } likes 
                        </span> &nbsp; &nbsp;
                      </div>
                      <p>
                      <div id="comments-${dormInfoJson[0].dormId}">${
          dormInfo.comment
        }</div>    
                      </p>
                    </div> 
                  </div> 
                </li>
              </ol>
            </div>

                
                `;
      })
      .join("\n");
    dormsHtml += `
    <div class="contact-form blog-single-form ${myIdentity ? "" : "d-none"}" >
        <h3>Post Your Rating and Comment</h3>
          <div class="row">
            <div class="col-sm-6 col-xs-12">
              <div class="form-group">
                <h3>Rating: </h3>
                <select id="ratingnum">
                    <option value = 0>0</option>
                    <option value = 1>1</option>
                    <option value = 2>2</option>
                    <option value = 3>3</option>
                    <option value = 4>4</option>
                    <option value = 5>5</option>
                </select>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-12">
              <div class="form-group">
                <div id="comment_rating_div"> 
                  <h3>Comment: </h3>
                    <textarea class="form-control" id="commentInput" rows="7" placeholder="Message" ></textarea>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-12">
              <div class="single-contact-btn">
                <button onclick='postRatingComment("${
                  dormInfoJson[0].dormId
                }")' class="contact-btn" href="#" role="button">Post Rating and Comment</button>
              </div>
            </div>
          </div>    
      </div>
      </div>
      </div>
      </section>
      
      `;

    document.getElementById("comments_box").innerHTML = dormsHtml;
  }
}

function getCommentHTML(commentJSON) {
  return commentJSON
    .map((commentInfo) => {
      return `
        <div class="individual-comment-box">
            <div>${escapeHTML(commentInfo.comment)}</div>
            <div>${commentInfo.username}</a>, ${commentInfo.created_date}</div>
        </div>`;
    })
    .join(" ");
}

async function postRatingComment(buildingID) {
  console.log(buildingID);
  let newComment = document.getElementById(`commentInput`).value;
  let newRating = parseInt(document.getElementById(`ratingnum`).value);

  try {
    let response = await fetch(`api/v1/comments`, {
      method: "POST",
      body: JSON.stringify({
        buildingID: buildingID,
        newComment: newComment,
        newRating: newRating,
      }),
      headers: { "Content-Type": "application/json" },
    });
    let responesJSON = await response.json();
    if (responesJSON.status == "error") {
      console.log("error:" + responesJSON.error);
    } else {
      console.log("sth")
      // loadDormInfo();
    }
    return responesJSON;
  } catch (error) {
    console.log("error:" + error);
  }
}

async function likeComment(commentID) {
  try {
    let response = await fetch(`api/v1/likeComment`, {
      method: "POST",
      body: JSON.stringify({ commentID: commentID }),
      headers: { "Content-Type": "application/json" },
    });
    let responesJSON = await response.json();
    if (responesJSON.status == "error") {
      console.log("error:" + responesJSON.error);
    } else {
      loadDormInfo();
    }
    return responesJSON;
  } catch (error) {
    console.log("error:" + error);
  }
}

async function unlikeComment(commentID) {
  try {
    let response = await fetch(`api/v1/unlikeComment`, {
      method: "POST",
      body: JSON.stringify({ commentID: commentID }),
      headers: { "Content-Type": "application/json" },
    });
    let responesJSON = await response.json();
    if (responesJSON.status == "error") {
      console.log("error:" + responesJSON.error);
    } else {
      loadDormInfo();
    }
    return responesJSON;
  } catch (error) {
    console.log("error:" + error);
  }
}

async function deletePost(commentID) {
  try {
    let response = await fetch(`api/v1/comments`, {
      method: "DELETE",
      body: JSON.stringify({ commentID: commentID }),
      headers: { "Content-Type": "application/json" },
    });
    let responesJSON = await response.json();
    if (responesJSON.status == "error") {
      console.log("error:" + responesJSON.error);
    } else {
      loadDormInfo();
    }
  } catch (error) {
    console.log("error:" + error);
  }
}
