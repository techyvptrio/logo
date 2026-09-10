function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    const name = data.name;
    const mobile = data.mobile;

    // Test response
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: "Data received successfully"
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: error.message
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}