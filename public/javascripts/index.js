let filteredJson = null;

async function init(){

    await loadIdentity();
    loadDorm(filteredJson);
    populateSelect();
}

async function loadDorm(filteredJson) {
    let dormJson;

    // console.log(111);
    try{
        let response = await fetch(`api/v1/dorms`);
        dormJson = await response.json();
        if (filteredJson != null) {
            dormJson = filteredJson;
        }
        // console.log(dormJson);
    }catch(error){
        dormJson =  {
            status: "error",
            error: "There was an error: " + error
        };
    }
    // console.log(dormJson)
    if(dormJson.status == "error"){
        document.getElementById("dorm_box").innerText = "There was an error: " + dormJson.error;
    }else{
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
}

async function populateSelect() {
    let dormJson;
    // console.log(111);
    try{
        let response = await fetch(`api/v1/dorms`);
        dormJson = await response.json();
        // console.log(dormJson);
    }catch(error){
        dormJson =  {
            status: "error",
            error: "There was an error: " + error
        };
    }
    // console.log(dormJson)
    if(dormJson.status == "error"){
        document.getElementById("dorm_box").innerText = "There was an error: " + dormJson.error;
    }else{
        //populate select
        let select = document.getElementById("dormselect");

        dormJson.forEach((dorm, index) => {
            let optionEle = document.createElement("option");
            optionEle.value = dorm.dormName;
            optionEle.innerHTML = dorm.dormName;
            select.appendChild(optionEle);
            // console.log(optionEle)
        });
    }    
}

async function displaySelectedDorm() {
    try{
        let select = document.getElementById("dormselect");
        let dormName = select.value;
        let response = await fetch(`api/v1/filterDorms`, 
            { method: "POST", body: JSON.stringify({dormName: dormName}), headers: {'Content-Type': 'application/json'}})
        let responesJSON = await response.json();
        console.log(responesJSON)
        if(responesJSON.status == "error"){
            console.log("error:" + responesJSON.error);
        }else{
            filteredJson = responesJSON;
            loadDorm(filteredJson);
            //reset filter
            filteredJson = null;
        }
        return responesJSON;
    }catch(error){
        console.log("error:" + error);
    }
}

