console.log("%cIndex.js active", "color:yellow;font-size:18px;");

let loadingInterval;

let f = document.getElementById("form-ca2");
let modalLaunchBtn = document.getElementById("launchModalBtn");
let downloadAgainLink = document.getElementById("dAgainButton");
let studentNameField = document.getElementById("sName");
let titleField = document.getElementById("title");
let cusromNameField = document.getElementById("cName");
let makautRollField = document.getElementById('mRoll');
let classRollPart1Field = document.getElementById('cRoll1');
let classRollPart2Field = document.getElementById('cRoll2');
let classRollPart3Field = document.getElementById('cRoll3');
let displayRollField = document.getElementById('displayRoll');

// fillTestingValues();

f.addEventListener("submit", function () {
    console.log("Form Submit Button Clicked");
    event.preventDefault();
    toggleLoading();

    // Version 5 on Mar 8, 10:30 PM
    const API = "https://script.google.com/macros/s/AKfycbwbOMO3PuiOpQCKra95q3cHLJKp3R1AxuUsQTaCnOJjOTgtk4Vj32i-HRB6ItYhW6kQKg/exec";

    let mRoll = makautRollField.value.trim();
    let sName = studentNameField.value.trim();
    let sRoll = updateRoll();
    let title = document.getElementById("title").value.trim();
    let subject = document.getElementById("subjectCode").value.trim();
    let sem = document.getElementById("sem").value.trim();
    let cName = cusromNameField.value.trim();


    // Set FILE Name in mRoll Field
    if (cName === '') {
        cName = "null";
    }
    else if (cName === "null") {
        alert(`File name can't be "null" `);
        toggleLoading();
        return;
    } else {
        if (String(cName).length <= 3) {
            alert("Please give a valid name");
            toggleLoading();
            return;
        }
    }



    // Prepare parameters for fetch
    let primaryFormData = { mRoll, sName, sRoll, title, subject, sem, cName };
    let formData = new FormData();
    for (let key in primaryFormData)
        formData.append(key, primaryFormData[key]);

    let params = { method: "POST", body: formData };

    // make http request through fetch
    fetch(API, params).then(res => res.text()).then((_data) => {
        let res;
        try {
            res = JSON.parse(_data);
        } catch (error) {
            alert("An unexpected error occured. Conact Admin");
        }
        console.log(res);

        let status = res.status;

        if (status == "success") {
            let downloadUrl = res.url;
            showSuccessModal(downloadUrl);

            displayRollField.value = '22-CSE-';
            cusromNameField.placeholder = "Default filename = Your MAKAUT Roll";

            f.reset();
        } else {
            alert("An unexpected error occured. Contact admin");
        }

        toggleLoading();
    }).catch((error) => {
        toggleLoading();
        alert("An unexpected error occurred during connecting to the Server");
        console.log(`ERROR Fetch : ${error}`);
    });

});

classRollPart1Field.addEventListener("change", updateRoll);
classRollPart2Field.addEventListener("change", updateRoll);
classRollPart3Field.addEventListener("input", updateRoll);



//  Secondary Functions

function toggleLoading() {
    let submitBtn = document.getElementById("submitBtn");
    if (submitBtn.innerText === "SUBMIT") {
        submitBtn.innerText = "Loading..";
        loadingInterval = setInterval(() => {
            submitBtn.innerText += ".";
        }, 2000);
        submitBtn.setAttribute("disabled", true);
    } else {
        if (loadingInterval !== undefined)
            clearInterval(loadingInterval);
        submitBtn.innerText = "SUBMIT";
        submitBtn.removeAttribute("disabled");
    }
}


function showSuccessModal(downloadUrl) {
    window.location.replace(downloadUrl);

    downloadAgainLink.href = downloadUrl;
    modalLaunchBtn.click();
}


function updateRoll() {
    let part1 = String(classRollPart1Field.value).trim();
    let part2 = String(classRollPart2Field.value).trim();
    let part3 = String(classRollPart3Field.value).trim();

    let classRoll = `${part1}-${part2}-${part3}`;
    classRoll = String(classRoll).toUpperCase();

    displayRollField.innerText = classRoll;
    // cusromNameField.placeholder = `Default filename = ${classRoll}`;

    return classRoll;
}




// Fill Some Random values in the form for testing purpose
function fillTestingValues() {
    studentNameField.value = "Jhon HELLO";
    makautRollField.value = "148003897";
    classRollPart3Field.value = "068";
    titleField.value = "This is a Demo Title"
}


