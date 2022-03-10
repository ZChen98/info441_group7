async function init(){

    await loadIdentity();
    loadAllDorm();
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
    document.getElementById("dorm_box").innerHTML = dormHtml;
}

async function searchDorm() {
    let dormName = document.getElementsByName("txt")[0].value;
    dormName = dormName.trim()
    //to lower case
    let response_new = await fetch(`api/v1/dorms`);
    let dormJson = await response_new.json();
    dormJson.forEach(element => {
        if (dormName.toLowerCase() == element.dormName.toLowerCase()) {
            dormName = element.dormName
        }
    });
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