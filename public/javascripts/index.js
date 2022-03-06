async function init(){

    // await loadIdentity();
    loadDorm();
}

async function loadDorm() {
    let dormJson;
    console.log(111);
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
        let dormHtml = dormJson.map(dormInfo => {
            return `
            <div class="dorm">
                ${dormInfo.htmlPreview}
            </div>`
        }).join("\n");
        console.log(dormHtml)
        document.getElementById("dorm_box").innerHTML = dormHtml;
    }
}