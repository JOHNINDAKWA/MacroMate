/* global chrome */

// Store scraped data in chrome storage
let scrapedData = null;
let connexPhoneNumber = null; // Store the Connex phone number separately

// Listen for messages from the popup (Scrape and Paste actions)
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "SCRAPE_DATA") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0].id;

      // Inject content script into the page (to handle SPA behavior)
      chrome.scripting.executeScript(
        {
          target: { tabId: tabId },
          files: ["content.js"],
        },
        () => {
          // After injection, send message to content script
          chrome.tabs.sendMessage(tabId, { type: "SCRAPE_DATA" }, (response) => {
            if (chrome.runtime.lastError || !response || !response.success) {
              sendResponse({ status: "Error scraping data." });
              return;
            }

            scrapedData = response.data;
            connexPhoneNumber = response.connexPhone; // Assuming response includes the Connex phone number

            // Store both scraped data and Connex phone number in chrome storage
            chrome.storage.local.set(
              { scrapedData: scrapedData, connexPhone: connexPhoneNumber },
              () => {
                sendResponse({ status: "Data scraped!", data: scrapedData, phone: connexPhoneNumber });
              }
            );
          });
        }
      );
    });

    return true; // Required to keep the sendResponse alive for async
  }

  if (msg.type === "PASTE_DATA") {
    // Retrieve the data from chrome storage for pasting
    chrome.storage.local.get(["scrapedData", "connexPhone"], (result) => {
      const dataToPaste = result.scrapedData;
      const phoneToPaste = result.connexPhone;

      if (!dataToPaste && !phoneToPaste) {
        sendResponse({ status: "❌ Error: No data found to paste." });
        return;
      }

      console.log("Scraped Data to Paste:", dataToPaste); // Log the scraped data before sending it
      console.log("Phone Number to Paste:", phoneToPaste); // Log the phone number

      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tabId = tabs[0].id;
    
        chrome.tabs.sendMessage(tabId, { type: "FILL_ZENDESK", data: dataToPaste, phone: phoneToPaste }, (response) => {
          console.log(response); // Log the response from the content script
          sendResponse({ status: "Data pasted!" });
        });
      });
    });

    return true; // Keep the sendResponse alive for async
  }

  if (msg.type === "GET_SCRAPED_DATA") {
    // Respond with the stored scraped data from chrome storage
    chrome.storage.local.get(["scrapedData", "connexPhone"], (result) => {
      sendResponse({
        data: result.scrapedData,
        phone: result.connexPhone
      });
    });

    return true; // Keep the sendResponse alive for async
  }
});
