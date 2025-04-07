/* global chrome */

// Store scraped data in chrome storage
let scrapedData = null;

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

            // Store the scraped data in chrome storage
            chrome.storage.local.set({ scrapedData: scrapedData }, () => {
              sendResponse({ status: "Data scraped!", data: scrapedData });
            });
          });
        }
      );
    });

    return true; // Required to keep the sendResponse alive for async
  }

  if (msg.type === "PASTE_DATA") {
    // Retrieve the data from chrome storage for pasting
    chrome.storage.local.get("scrapedData", (result) => {
      const dataToPaste = result.scrapedData;
      
      if (!dataToPaste) {
        sendResponse({ status: "❌ Error: No data found to paste." });
        return;
      }

      console.log("Scraped Data to Paste:", dataToPaste); // Log the scraped data before sending it

      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tabId = tabs[0].id;
    
        chrome.tabs.sendMessage(tabId, { type: "FILL_ZENDESK", data: dataToPaste }, (response) => {
          console.log(response); // Log the response from the content script
          sendResponse({ status: "Data pasted!" });
        });
      });
    });

    return true; // Keep the sendResponse alive for async
  }

  if (msg.type === "GET_SCRAPED_DATA") {
    // Respond with the stored scraped data from chrome storage
    chrome.storage.local.get("scrapedData", (result) => {
      sendResponse({ data: result.scrapedData });
    });

    return true; // Keep the sendResponse alive for async
  }
});
