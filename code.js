

// ======================================================
// PARTICIPANT LOGO REGISTRATION WEB APP
// ======================================================

// These will be created automatically
const SPREADSHEET_NAME = "Participant Registration Responses";
const SHEET_NAME = "Responses";
const FOLDER_NAME = "Participant Logos";


// ======================================================
// OPEN WEBSITE
// ======================================================

function doGet() {

  return HtmlService
    .createHtmlOutput(getHTML())
    .setTitle("Participant Registration")
    .setXFrameOptionsMode(
      HtmlService.XFrameOptionsMode.ALLOWALL
    );

}


// ======================================================
// GET OR CREATE GOOGLE SHEET
// ======================================================

function getSpreadsheet() {

  const properties =
    PropertiesService.getScriptProperties();

  let spreadsheetId =
    properties.getProperty("SPREADSHEET_ID");


  // If spreadsheet already exists
  if (spreadsheetId) {

    try {

      return SpreadsheetApp.openById(
        spreadsheetId
      );

    } catch (e) {

      // If deleted, create a new one
      properties.deleteProperty(
        "SPREADSHEET_ID"
      );

    }

  }


  // Create spreadsheet
  const spreadsheet =
    SpreadsheetApp.create(
      SPREADSHEET_NAME
    );


  const sheet =
    spreadsheet.getSheets()[0];


  sheet.setName(SHEET_NAME);


  // Add headers
  sheet.appendRow([
    "Timestamp",
    "Name",
    "Mobile Number",
    "Logo File Name",
    "Logo URL"
  ]);


  // Format header
  sheet
    .getRange(1, 1, 1, 5)
    .setFontWeight("bold");


  sheet.setFrozenRows(1);


  // Save ID
  properties.setProperty(
    "SPREADSHEET_ID",
    spreadsheet.getId()
  );


  return spreadsheet;

}


// ======================================================
// GET OR CREATE DRIVE FOLDER
// ======================================================

function getFolder() {

  const properties =
    PropertiesService.getScriptProperties();


  let folderId =
    properties.getProperty("FOLDER_ID");


  // Existing folder
  if (folderId) {

    try {

      return DriveApp.getFolderById(
        folderId
      );

    } catch (e) {

      properties.deleteProperty(
        "FOLDER_ID"
      );

    }

  }


  // Create folder
  const folder =
    DriveApp.createFolder(
      FOLDER_NAME
    );


  properties.setProperty(
    "FOLDER_ID",
    folder.getId()
  );


  return folder;

}


// ======================================================
// SUBMIT FORM
// ======================================================

function submitForm(data) {

  try {

    // ----------------------------------------
    // NAME
    // ----------------------------------------

    const name =
      String(data.name || "").trim();


    if (name === "") {

      throw new Error(
        "Please enter your name."
      );

    }


    // ----------------------------------------
    // MOBILE
    // ----------------------------------------

    const mobile =
      String(data.mobile || "").trim();


    const mobilePattern =
      /^[6-9][0-9]{9}$/;


    if (!mobilePattern.test(mobile)) {

      throw new Error(
        "Please enter a valid 10-digit mobile number."
      );

    }


    // ----------------------------------------
    // LOGO
    // ----------------------------------------

    if (
      !data.logoBase64 ||
      !data.logoName
    ) {

      throw new Error(
        "Please upload your logo."
      );

    }


    // ----------------------------------------
    // FILE EXTENSION
    // ----------------------------------------

    const originalName =
      String(data.logoName);


    const extension =
      originalName
        .split(".")
        .pop()
        .toLowerCase();


    const allowedExtensions = [
      "png",
      "jpg",
      "jpeg"
    ];


    if (
      !allowedExtensions.includes(
        extension
      )
    ) {

      throw new Error(
        "Only PNG, JPG and JPEG files are allowed."
      );

    }


    // ----------------------------------------
    // MIME TYPE
    // ----------------------------------------

    let mimeType;


    if (extension === "png") {

      mimeType = "image/png";

    } else {

      mimeType = "image/jpeg";

    }


    // ----------------------------------------
    // REMOVE DATA URL PREFIX
    // ----------------------------------------

    const base64 =
      data.logoBase64
        .replace(
          /^data:image\/[a-zA-Z]+;base64,/,
          ""
        );


    // ----------------------------------------
    // DECODE FILE
    // ----------------------------------------

    const bytes =
      Utilities.base64Decode(
        base64
      );


    // ----------------------------------------
    // CREATE FILE
    // ----------------------------------------

    const blob =
      Utilities.newBlob(
        bytes,
        mimeType,
        originalName
      );


    // ----------------------------------------
    // DRIVE FOLDER
    // ----------------------------------------

    const folder =
      getFolder();


    // ----------------------------------------
    // SAVE FILE
    // ----------------------------------------

    const file =
      folder.createFile(blob);


    const fileUrl =
      file.getUrl();


    // ----------------------------------------
    // GOOGLE SHEET
    // ----------------------------------------

    const spreadsheet =
      getSpreadsheet();


    const sheet =
      spreadsheet.getSheetByName(
        SHEET_NAME
      );


    // ----------------------------------------
    // SAVE DATA
    // ----------------------------------------

    sheet.appendRow([
      new Date(),
      name,
      mobile,
      originalName,
      fileUrl
    ]);


    // ----------------------------------------
    // RETURN SUCCESS
    // ----------------------------------------

    return {
      success: true,
      message:
        "Registration submitted successfully!"
    };


  } catch (error) {

    return {
      success: false,
      message: error.message
    };

  }

}


// ======================================================
// HTML WEBSITE
// ======================================================

function getHTML() {

  return `

<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<meta name="viewport"
content="width=device-width, initial-scale=1.0">

<title>
Participant Registration
</title>


<style>

* {
  box-sizing: border-box;
}


body {

  margin: 0;

  font-family:
    Arial,
    sans-serif;

  background:
    linear-gradient(
      135deg,
      #eef4ff,
      #f8fbff
    );

  min-height: 100vh;

  display: flex;

  justify-content: center;

  align-items: center;

  padding: 20px;

}


.card {

  width: 100%;

  max-width: 500px;

  background: white;

  padding: 35px;

  border-radius: 20px;

  box-shadow:
    0 15px 40px
    rgba(0,0,0,0.10);

}


h1 {

  text-align: center;

  margin: 0 0 10px;

  color: #1f2937;

}


.subtitle {

  text-align: center;

  color: #6b7280;

  font-size: 14px;

  margin-bottom: 30px;

}


.form-group {

  margin-bottom: 22px;

}


label {

  display: block;

  margin-bottom: 8px;

  font-weight: bold;

  color: #374151;

}


input {

  width: 100%;

  padding: 13px;

  border: 1px solid #d1d5db;

  border-radius: 10px;

  font-size: 15px;

  outline: none;

}


input:focus {

  border-color: #4285f4;

  box-shadow:
    0 0 0 3px
    rgba(66,133,244,0.12);

}


input[type="file"] {

  padding: 10px;

  background: #f9fafb;

}


.help {

  margin-top: 7px;

  font-size: 12px;

  color: #6b7280;

}


button {

  width: 100%;

  padding: 14px;

  border: none;

  border-radius: 10px;

  background: #4285f4;

  color: white;

  font-size: 16px;

  font-weight: bold;

  cursor: pointer;

}


button:hover {

  background: #3367d6;

}


button:disabled {

  background: #9ca3af;

  cursor: not-allowed;

}


#loading {

  display: none;

  text-align: center;

  margin-top: 15px;

  color: #555;

}


#message {

  display: none;

  margin-top: 20px;

  padding: 13px;

  border-radius: 10px;

  text-align: center;

  font-size: 14px;

}


.success {

  display: block !important;

  background: #dcfce7;

  color: #166534;

}


.error {

  display: block !important;

  background: #fee2e2;

  color: #991b1b;

}

</style>

</head>


<body>


<div class="card">


<h1>
Participant Registration
</h1>


<p class="subtitle">

Enter your details and upload your logo.

</p>


<form id="form">


<!-- NAME -->

<div class="form-group">

<label>
Name *
</label>

<input
type="text"
id="name"
placeholder="Enter your name"
required
>

</div>


<!-- MOBILE -->

<div class="form-group">

<label>
Mobile Number *
</label>

<input
type="tel"
id="mobile"
placeholder="Enter 10-digit mobile number"
maxlength="10"
required
>

</div>


<!-- LOGO -->

<div class="form-group">

<label>
Upload Logo *
</label>

<input
type="file"
id="logo"
accept=".png,.jpg,.jpeg,image/png,image/jpeg"
required
>

<div class="help">

PNG, JPG or JPEG only.
Maximum file size: 5 MB.

</div>

</div>


<!-- BUTTON -->

<button
type="submit"
id="submitBtn">

Submit Registration

</button>


</form>


<div id="loading">

Uploading logo... Please wait.

</div>


<div id="message"></div>


</div>



<script>


// ==================================================
// FORM SUBMISSION
// ==================================================

document
.getElementById("form")
.addEventListener(
"submit",
function(event) {

  event.preventDefault();


  const name =
    document
    .getElementById("name")
    .value
    .trim();


  const mobile =
    document
    .getElementById("mobile")
    .value
    .trim();


  const logo =
    document
    .getElementById("logo")
    .files[0];


  // ----------------------------------------
  // NAME VALIDATION
  // ----------------------------------------

  if (!name) {

    showMessage(
      "Please enter your name.",
      false
    );

    return;

  }


  // ----------------------------------------
  // MOBILE VALIDATION
  // ----------------------------------------

  const mobilePattern =
    /^[6-9][0-9]{9}$/;


  if (!mobilePattern.test(mobile)) {

    showMessage(
      "Please enter a valid 10-digit mobile number.",
      false
    );

    return;

  }


  // ----------------------------------------
  // LOGO VALIDATION
  // ----------------------------------------

  if (!logo) {

    showMessage(
      "Please select your logo.",
      false
    );

    return;

  }


  // ----------------------------------------
  // FILE TYPE
  // ----------------------------------------

  const allowedTypes = [
    "image/png",
    "image/jpeg"
  ];


  if (
    !allowedTypes.includes(
      logo.type
    )
  ) {

    showMessage(
      "Only PNG, JPG and JPEG files are allowed.",
      false
    );

    return;

  }


  // ----------------------------------------
  // FILE SIZE
  // ----------------------------------------

  const maxSize =
    5 * 1024 * 1024;


  if (
    logo.size > maxSize
  ) {

    showMessage(
      "Logo must be smaller than 5 MB.",
      false
    );

    return;

  }


  // ----------------------------------------
  // READ FILE
  // ----------------------------------------

  const reader =
    new FileReader();


  reader.onload =
  function(e) {


    const data = {

      name: name,

      mobile: mobile,

      logoName: logo.name,

      logoBase64: e.target.result

    };


    // Disable button

    document
    .getElementById(
      "submitBtn"
    )
    .disabled = true;


    document
    .getElementById(
      "loading"
    )
    .style.display = "block";


    // ----------------------------------------
    // SEND TO GOOGLE APPS SCRIPT
    // ----------------------------------------

    google.script.run

    .withSuccessHandler(
    function(response) {


      document
      .getElementById(
        "submitBtn"
      )
      .disabled = false;


      document
      .getElementById(
        "loading"
      )
      .style.display = "none";


      if (
        response.success
      ) {


        showMessage(
          response.message,
          true
        );


        document
        .getElementById(
          "form"
        )
        .reset();


      } else {


        showMessage(
          response.message,
          false
        );

      }

    })


    .withFailureHandler(
    function(error) {


      document
      .getElementById(
        "submitBtn"
      )
      .disabled = false;


      document
      .getElementById(
        "loading"
      )
      .style.display = "none";


      showMessage(
        "Error: " + error.message,
        false
      );


    })


    .submitForm(data);


  };


  reader.readAsDataURL(logo);

});



// ==================================================
// SHOW MESSAGE
// ==================================================

function showMessage(
  text,
  success
) {

  const message =
    document.getElementById(
      "message"
    );


  message.innerText =
    text;


  message.className =
    success
      ? "success"
      : "error";


  message.style.display =
    "block";

}

</script>


</body>

</html>

`;

}
