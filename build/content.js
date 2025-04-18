/* global chrome */

// Wrapping the script in a self-invoking function to prevent redeclaration errors
(function() {
  // Check if the page is PaygOps or Zendesk
  const isPaygopsPage = window.location.href.includes("paygops.com/leads/");
  const isZendeskPage = window.location.href.includes("zendesk.com/agent/tickets/");
  const isConnexPage = window.location.href.includes("oneacrefund-cxm.cnx1.cloud/work");

  if (isPaygopsPage) {
    // Function to scrape data
    function scrapePaygOpsData() {
      let fullName = "";
      let nationalId = "";
      let salesTerritoryFull = "";
      let salesTerritory = "";
      let dukaZone = "";
      let phoneNumber = "";
      let age = "";
      let dob = "";
      let status = "";
      let comment = "";
      let firstName = "";
      let surname = "";

      // 🔍 Extract from icon-labeled fields
      const icons = document.querySelectorAll("i.material-symbols-rounded.tiny");
      icons.forEach((icon) => {
        const label = icon.textContent.trim();
        const fieldWrapper = icon.closest(".report-field");
        if (!fieldWrapper) return;

        const valueEl =
          fieldWrapper.querySelector("var") ||
          fieldWrapper.querySelector("span.report-field-limit");
        const value = valueEl?.innerText.trim() || "";

        switch (label) {
          case "account_circle":
            fullName = value;
            break;
          case "badge":
            nationalId = value;
            break;
          case "home":
            salesTerritoryFull = value;
            const parts = salesTerritoryFull.split("<").map((p) => p.trim());
            salesTerritory = parts[0] || "";
            dukaZone = parts.find((p) => p.toLowerCase().includes("duka")) || "";
            break;
          case "insert_invitation":
            age = value;
            const year = new Date().getFullYear();
            if (!isNaN(parseInt(age))) {
              dob = `${year - parseInt(age)}`; // Calculate year of birth
            }
            break;
        }
      });

      // 📞 Get phone number
      const phoneIcon = [...document.querySelectorAll("i.material-symbols-rounded.tiny")]
        .find((i) => i.textContent.trim() === "call");
      if (phoneIcon) {
        const phoneContainer = phoneIcon.closest(".report-field");
        if (phoneContainer) {
          const phoneAnchor = phoneContainer.querySelector("a[href^='tel:']");
          phoneNumber = phoneAnchor?.textContent.trim() || "";
        }
      }

      // 🏷️ Status & Comment
      const statusField = [...document.querySelectorAll(".report-field-limit, .report-field, strong, span, div")]
        .find(el => el.textContent.includes("Status:"));

      if (statusField) {
        const statusText = statusField.textContent.split("Status:")[1]?.trim();
        if (statusText) {
          const statusBeforeNext = statusText.split("eventNext")[0].trim();
          status = statusBeforeNext || "N/A";
        }
      }

      // 📝 Comment
      const commentIcon = [...document.querySelectorAll("i.material-symbols-rounded")]
        .find((i) => i.textContent.trim() === "description");

      if (commentIcon) {
        const commentField = commentIcon.closest(".report-field");
        if (commentField) {
          const commentText = commentField.querySelector("span.report-field-limit")?.textContent.trim();
          comment = commentText && commentText !== "-" ? commentText : "N/A";
        }
      }

      // 🏷️ Client Name: Concatenate First Name + Surname
      const firstNameField = [...document.querySelectorAll(".report-field-limit, .report-field, strong, span")]
        .find(el => el.textContent.includes("First Name:"));
      if (firstNameField) {
        firstName = firstNameField.textContent.split("First Name:")[1]?.trim();
      }

      const surnameField = [...document.querySelectorAll(".report-field-limit, .report-field, strong, span")]
        .find(el => el.textContent.includes("Surname:"));
      if (surnameField) {
        surname = surnameField.textContent.split("Surname:")[1]?.trim();
      }

      const clientName = `${firstName} ${surname}`.trim();

      // 🆔 Lead ID from URL
      const urlParts = window.location.href.split("/");
      const leadId = urlParts[urlParts.length - 1] || "";

      // ✅ Send only when main fields are captured
      if (firstName && surname && nationalId && salesTerritory && phoneNumber) {
        const scrapedData = {
          clientName, 
          fullName,
          nationalId,
          accountNumber: nationalId,
          leadId,
          phoneNumber,
          salesTerritory,
          dukaZone,
          dob,
          status,
          comment,
        };

        console.log("[MacroMate] ✅ Scraped Data:", scrapedData);

        // Save the scraped data to chrome.storage.local (extension's storage)
        chrome.storage.local.set({ 'scrapedData': scrapedData }, function() {
          console.log("[MacroMate] ✅ Data saved to extension's storage.");
        });

        // Send to popup for display
        chrome.runtime.sendMessage({ type: "SCRAPED_DATA", data: scrapedData });
      }
    }

    // Function to monitor page and start scraping when elements are available
    function monitorPageForData() {
      const interval = setInterval(() => {
        const reportFields = document.querySelectorAll(".report-field");
        if (reportFields.length > 0) {
          clearInterval(interval);
          scrapePaygOpsData();
        }
      }, 1000);
    }

    // Start monitoring when on PaygOps page
    monitorPageForData();
  }


  if (isConnexPage) {
    // Function to extract phone number from Connex
    const extractPhoneNumberFromConnex = () => {
      const paragraphs = document.querySelectorAll("p");
      const phoneRegex = /\+?2547\d{8}/; // Match with or without +
      let foundConnexPhoneNumber = null;
 
      for (const p of paragraphs) {
        const match = p.textContent.match(phoneRegex);
        if (match) {
          // Remove "+" if it exists
          foundConnexPhoneNumber = match[0].replace("+", "");
 
          console.log("[MacroMate] 📞 Phone number found in Connex:", foundConnexPhoneNumber);
 
          // Save it to chrome storage
          chrome.storage.local.set({ connexPhone: foundConnexPhoneNumber }, () => {
            console.log("[MacroMate] ✅ Connex phone saved to storage.");
          });
 
          break; // stop after first match
        }
      }
    };
 
    // Watch for DOM changes – likely when a new call arrives
    const observer = new MutationObserver((mutationsList, observer) => {
      for (const mutation of mutationsList) {
        if (mutation.type === "childList" || mutation.type === "subtree") {
          extractPhoneNumberFromConnex();
        }
      }
    });
 
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
 
    console.log("[MacroMate] 🔍 Connex observer active.");
  }
 

  


  if (isZendeskPage) {
    // Wait for the DOM to load and the editor to be available
    const waitForEditor = setInterval(() => {
      const editorEl = document.querySelector('[data-test-id="omnicomposer-rich-text-ckeditor"]');
      const editorInstance = editorEl?.ckeditorInstance;
  
      if (editorInstance) {
        clearInterval(waitForEditor); // Stop checking once the editor is found
        console.log("✅ Found CKEditor instance!");
  
        // Retrieve the scraped data from Chrome storage
        chrome.storage.local.get("scrapedData", (result) => {
          const scrapedData = result.scrapedData;
  
          if (scrapedData) {
            console.log("📝 Pasting data into Zendesk:", scrapedData); // Log the data being pasted
  
            // Log each field to inspect the data
            console.log("Client Name:", scrapedData.clientName);
            console.log("National ID:", scrapedData.nationalId);
            console.log("Phone Number:", scrapedData.phoneNumber);
  
            // Format the content as proper HTML for CKEditor
            const formattedHTML = `
              <p><strong>Account Number:</strong> ${scrapedData.accountNumber}</p>
              <p><strong>Client Name:</strong> ${scrapedData.clientName}</p>
              <p><strong>Lead ID:</strong> ${scrapedData.leadId}</p>
              <p><strong>National ID:</strong> ${scrapedData.nationalId}</p>
              <p><strong>Phone:</strong> ${scrapedData.phoneNumber}</p>
              <p><strong>DOB:</strong> ${scrapedData.dob}</p>
              <p><strong>Sales Territory:</strong> ${scrapedData.salesTerritory}</p>
              <p><strong>Duka Zone:</strong> ${scrapedData.dukaZone}</p>
              <p><strong>Status:</strong> ${scrapedData.status}</p>
              <p><strong>Status Comment:</strong> ${scrapedData.comment}</p>
            `;
  
            // ✅ Use CKEditor API to inject the data into the editor
            editorInstance.setData(formattedHTML);
  
            // Optional: focus the editor
            editorInstance.editing.view.focus();
  
            console.log("✅ Data successfully pasted into Zendesk editor!");
  
            // Notify background script that data has been pasted
            chrome.runtime.sendMessage({ type: "DATA_PASTED", status: "Data pasted into Zendesk!" });
          } else {
            console.log("❌ Error: No data found in storage for Zendesk!");
          }
        });
      } else {
        console.log("❌ CKEditor instance not found.");
      }
    }, 500); // Wait for the editor to be available
  }
  
  
})();
