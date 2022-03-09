// let filteredJson = null;

async function init(){

    await loadIdentity();
    loadAllDorm();
    // populateSelect();
}

async function loadAllDorm() {
    document.getElementById("search-input").value = ''
    try{
        let response = await fetch(`api/v1/dorms`);
        let dormJson = await response.json();
        if(dormJson.status == "error"){
            document.getElementById("dorm_box").innerText = "There was an error: " + dormJson.error;
        }else{
            renderDorm(dormJson)
        }
    }catch(error){
        dormJson =  {
            status: "error",
            error: "There was an error: " + error
        };
    }
}

async function renderDorm(dormJson) {
    let dormHtml = dormJson.map(dormInfo => {
        return `
        <div class="col-sm-3 col-xs-12">
            ${dormInfo.htmlPreview}
        </div>`
    }).join("\n");
    // console.log(dormHtml)
    document.getElementById("dorm_box").innerHTML = dormHtml;
    //reset select
    // let select = document.getElementById("dormselect");
    // select.selectedIndex = 0;
}

// async function populateSelect() {
//     let dormJson;
//     // console.log(111);
//     try{
//         let response = await fetch(`api/v1/dorms`);
//         dormJson = await response.json();
//         // console.log(dormJson);
//     }catch(error){
//         dormJson =  {
//             status: "error",
//             error: "There was an error: " + error
//         };
//     }
//     // console.log(dormJson)
//     if(dormJson.status == "error"){
//         document.getElementById("dorm_box").innerText = "There was an error: " + dormJson.error;
//     }else{
//         //populate select
//         let select = document.getElementById("dormselect");

//         dormJson.forEach((dorm, index) => {
//             let optionEle = document.createElement("option");
//             optionEle.value = dorm.dormName;
//             optionEle.innerHTML = dorm.dormName;
//             select.appendChild(optionEle);
//             // console.log(optionEle)
//         });
//     }    
// }

// async function displaySelectedDorm() {
//     try{
//         let select = document.getElementById("dormselect");
//         let dormName = select.value;
//         let response = await fetch(`api/v1/filterDorms`, 
//             { method: "POST", body: JSON.stringify({dormName: dormName}), headers: {'Content-Type': 'application/json'}})
//         let responesJSON = await response.json();
//         console.log(responesJSON)
//         if(responesJSON.status == "error"){
//             console.log("error:" + responesJSON.error);
//         }else{
//             filteredJson = responesJSON;
//             loadDorm(filteredJson);
//             //reset filter
//             filteredJson = null;
//         }
//         return responesJSON;
//     }catch(error){
//         console.log("error:" + error);
//     }
// }

async function searchDorm() {
    let dormName = document.getElementsByName("txt")[0].value;
    dormName = dormName.trim()
    console.log(dormName)
    if(dormName !== null) {
        try{
            let response = await fetch(`api/v1/filterDorms?dormName=${dormName}`)
            let responseJSON = await response.json();
            console.log(responseJSON)
            if(responseJSON.status == "error"){
                console.log("error:" + responseJSON.error);
            } else if(responseJSON.status === "empty") {
                document.getElementById("dorm_box").innerHTML = "No result found. Try a different building name!";
            }else{
                let responseArray = [responseJSON]
                renderDorm(responseArray);
            }
            return responseJSON;
        }catch(error){
            console.log("error:" + error);
        }
    }
}