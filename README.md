## Project Structure

* `index.html`: The main HTML file for the web page.
* `style.css`: Custom CSS for basic styling (Tailwind CSS is primarily used via CDN).
* `script.js`: The JavaScript code responsible for fetching data from Google Apps Script and dynamically rendering the image cards.
* `Code.gs` (Google Apps Script): The server-side script deployed as a web app, which reads data from the Google Sheet and serves it as JSON.

---

## TESTING

You can interact with the live demo and see changes in real-time by modifying the linked Google Sheet.

**1. Live Website:**
Visit the deployed website: [https://shyam-723.github.io/Sheets_Image_Test/](https://shyam-723.github.io/Sheets_Image_Test/)

**2. Google Sheet for Data:**
Access the Google Sheet here: [https://docs.google.com/spreadsheets/d/1bB0maBAWEPVrCn7GQntGRSnt3-nOfSoQrAGDU38CAqY/edit](https://docs.google.com/spreadsheets/d/1bB0maBAWEPVrCn7GQntGRSnt3-nOfSoQrAGDU38CAqY/edit)

**How to Test:**

1.  Open the Google Sheet (`ImageTest` tab).
2.  **Add a new row** under the existing data.
3.  In the `Image URL` column, **paste a public, direct, and embeddable image link.**
    * **Avoid:** Imgur gallery links, Google Drive viewer links, or images copied directly from Google Image Search, as these often have hotlinking restrictions and will not display.
4.  Optionally, add content to the `Link` and `Caption` columns for that row.
5.  **Save the Google Sheet** (changes are auto-saved).
6.  **Refresh the live website** in your browser.

You should see your new image appear on the website!

---

## Relevant Code

### Google Apps Script (`Code.gs`)

This script runs as a web app, fetching data from your Google Sheet and serving it as a JSON array.
The way to access this normally is under:
Google Sheet -> Extensions -> App Scripts

When you're done with the coding, you can then deploy the website, where a url is given to you. I've put that URL in the javascript section which acts as an API. 
The code below is the Google Sheet Script that allows the webpage to read the Sheet.

```javascript
function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet1'); // Ensure this is your correct sheet tab name
// NOTE:
// This isn't the Sheet name at the very top, rather the sheet at the bottom, which by default is 'SheetX'

  const data = sheet.getDataRange().getValues();

  if (data.length === 0) {
    return ContentService.createTextOutput(JSON.stringify({ error: "Sheet is empty." })).setMimeType(ContentService.MimeType.JSON);
  }

  const headers = data[0];
  const imageUrlColumnIndex = headers.indexOf('Image URL'); // Case-sensitive
  const linkColumnIndex = headers.indexOf('Link');           // Case-sensitive
  const captionColumnIndex = headers.indexOf('Caption');     // Case-sensitive

  // Basic validation for essential columns
  if (imageUrlColumnIndex === -1) {
    return ContentService.createTextOutput(JSON.stringify({ error: "Column 'Image URL' not found in the header row." })).setMimeType(ContentService.MimeType.JSON);
  }

  const carouselData = [];
  for (let i = 1; i < data.length; i++) { // Start from 1 to skip headers
    const row = data[i];
    carouselData.push({
      imageUrl: row[imageUrlColumnIndex],
      // Use the actual column data if found, otherwise default to empty string
      link: (linkColumnIndex !== -1 && row[linkColumnIndex] !== undefined) ? row[linkColumnIndex] : '',
      caption: (captionColumnIndex !== -1 && row[captionColumnIndex] !== undefined) ? row[captionColumnIndex] : ''
    });
  }

  return ContentService.createTextOutput(JSON.stringify(carouselData))
         .setMimeType(ContentService.MimeType.JSON);
}

