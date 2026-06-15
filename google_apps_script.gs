/**
 * Google Apps Script Web App Code
 * 
 * Instructions:
 * 1. Open the Google Sheet where you want to save details.
 * 2. Go to Extensions -> Apps Script.
 * 3. Delete any existing code and paste this code.
 * 4. Click Save (Disk icon).
 * 5. Click "Deploy" -> "New deployment".
 * 6. Under "Select type", click the Gear icon and select "Web app".
 * 7. Set:
 *    - Description: "Velmurugan Oil Shop Lead Logger"
 *    - Execute as: "Me (your-email@gmail.com)"
 *    - Who has access: "Anyone" (This is required so the website can post to it without authentication)
 * 8. Click "Deploy".
 * 9. Copy the "Web app URL" and make sure it matches the GOOGLE_SHEET_SCRIPT_URL in your script.js.
 */

function doPost(e) {
  try {
    // Open the active sheet
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Parse the incoming JSON payload
    var data = JSON.parse(e.postData.contents);
    var name = data.name || "";
    var phone = data.phone || "";
    var orderList = data.orderList || "";
    var total = data.total || "";
    var timestamp = new Date();
    
    // Check if sheet has headers. If sheet is empty, create headers first.
    var lastRow = sheet.getLastRow();
    if (lastRow === 0) {
      sheet.appendRow(["Timestamp", "Customer Name", "Phone Number", "Order Details", "Total Amount"]);
      lastRow = 1;
    }
    
    // Determine the next row to write to.
    // If lastRow is 1 (only header exists), write to row 2 (no gap needed for the first customer).
    // If lastRow > 1 (already has customer details), leave a 2-line gap and write to lastRow + 3.
    var targetRow = (lastRow > 1) ? (lastRow + 3) : 2;
    
    // Write details to the target row
    sheet.getRange(targetRow, 1).setValue(timestamp);
    sheet.getRange(targetRow, 2).setValue(name);
    sheet.getRange(targetRow, 3).setValue(phone);
    sheet.getRange(targetRow, 4).setValue(orderList);
    sheet.getRange(targetRow, 5).setValue(total);
    
    // Format cell border or styling if desired, or keep it plain.
    // Return a success JSON response
    return ContentService.createTextOutput(JSON.stringify({ "status": "success", "row": targetRow }))
                         .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    // Return error JSON response
    return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": error.toString() }))
                         .setMimeType(ContentService.MimeType.JSON);
  }
}
