let myIdentity = undefined;

const escapeHTML = (str) =>
  str.replace(
    /[&<>'"]/g,
    (tag) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;",
      }[tag])
  );

async function loadIdentity() {
  let identityInfo;
  try {
    let response = await fetch(`api/v1/getIdentity`);
    identityInfo = await response.json();
  } catch (error) {
    identityInfo = {
      status: "error",
      error: "There was an error: " + error,
    };
  }

  let identity_div = document.getElementById("identity_div");
  if (identityInfo.status == "error") {
    myIdentity = undefined;
    identity_div.innerHTML = `<div>
        <button onclick="loadIdentity()">retry</button>
        Error loading identity: <span id="identity_error_span"></span>
        </div>`;
    document.getElementById("identity_error_span").innerText =
      identityInfo.error;
    // if (document.getElementById("comment_rating_div")) {
    //   document.getElementById("comment_rating_div").classList.add("d-none");
    // }
    // Array.from(document.getElementsByClassName("new-comment-box")).forEach(
    //   (e) => e.classList.add("d-none")
    // );
    Array.from(document.getElementsByClassName("heart-button-span")).forEach(
      (e) => e.classList.add("d-none")
    );
    Array.from(document.getElementsByClassName("delete_btn_span")).forEach(
      (e) => e.classList.add("d-none")
    );
  } else if (identityInfo.status == "loggedin") {
    myIdentity = identityInfo.userInfo.username;
    identity_div.innerHTML = `
        <p> ${identityInfo.userInfo.username} </p>
        <a href="signout" class="btn btn-danger" role="button">Log out</a>`;
    // if (document.getElementById("comment_rating_div")) {
    //   document.getElementById("comment_rating_div").classList.remove("d-none");
    // }
    // Array.from(document.getElementsByClassName("new-comment-box")).forEach(
    //   (e) => e.classList.remove("d-none")
    // );
    Array.from(document.getElementsByClassName("heart-button-span")).forEach(
      (e) => e.classList.remove("d-none")
    );
    Array.from(document.getElementsByClassName("delete_btn_span")).forEach(
      (e) => e.classList.remove("d-none")
    );
  } else {
    //loggedout
    myIdentity = undefined;
    let heart_btn = document.getElementsByClassName("heart-button-span");
    let delete_btn = document.getElementsByClassName("delete_btn_span");
    console.log(heart_btn)
    console.log(delete_btn)
    identity_div.innerHTML = `
        <a href="signin" class="btn btn-primary" role="button">Log in</a>`;
    // if (document.getElementById("comment_rating_div")) {
    //   document.getElementById("comment_rating_div").classList.add("d-none");
    // }
    Array.from(document.getElementsByClassName("heart-button-span")).forEach(
      (e) => e.classList.remove("d-none")
    );
    Array.from(document.getElementsByClassName("delete_btn_span")).forEach(
      (e) => e.classList.remove("d-none")
    );
  }
}
