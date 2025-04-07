/* global chrome */
import { useEffect, useState } from "react";

function App() {
  const [status, setStatus] = useState("");
  const [scraped, setScraped] = useState(null);

  // Function to scrape data
  const handleScrape = () => {
    // Check if data is available in chrome storage
    chrome.storage.local.get("scrapedData", (result) => {
      if (result.scrapedData) {
        setScraped(result.scrapedData);
        setStatus("✅ Data loaded from local storage!");
        return;
      }

      // If no data in local storage, scrape fresh data
      chrome.runtime.sendMessage({ type: "SCRAPE_DATA" }, (response) => {
        if (chrome.runtime.lastError || !response || !response.data) {
          setStatus("❌ Could not connect to PaygOps. Are you on the right page?");
          return;
        }

        setScraped(response.data); // ✅ Set state directly
        setStatus("✅ Data scraped!");
        
        // Store the scraped data in chrome storage for future use
        chrome.storage.local.set({ scrapedData: response.data }, () => {
          console.log("Data saved to local storage");
        });
      });
    });
  };

// Function to paste data into Zendesk
const handlePaste = () => {
  chrome.runtime.sendMessage({ type: "PASTE_DATA" }, (response) => {
    if (chrome.runtime.lastError) {
      setStatus("❌ Error pasting data.");
      return;
    }
    if (response && response.status === "Data pasted!") {
      setScraped(null); // Reset the scraped data after pasting
      setStatus("📋 Data pasted into Zendesk!");
    } else {
      setStatus("❌ Error: No data available to paste.");
    }
  });
};


  // ✅ Set up listener only once for SCRAPED_DATA
  useEffect(() => {
    const listener = (msg) => {
      if (msg.type === "SCRAPED_DATA") {
        setScraped(msg.data);
        setStatus("✅ Data scraped!");
      }
    };

    chrome.runtime.onMessage.addListener(listener);

    // Cleanup listener on component unmount
    return () => chrome.runtime.onMessage.removeListener(listener);
  }, []);

  return (
    <div style={{
      padding: "1rem",
      width: "300px",
      fontFamily: "Segoe UI, sans-serif",
      background: "#f4f4f4",
      borderRadius: "10px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
    }}>
      <h2 style={{ marginBottom: "1rem", color: "#333" }}>🚀 MacroMate</h2>

      <button
        onClick={handleScrape}
        style={{
          width: "100%",
          padding: "0.5rem",
          background: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "6px",
          marginBottom: "0.5rem",
          cursor: "pointer"
        }}
      >
        🔍 Scrape from PaygOps
      </button>

      <button
        onClick={handlePaste}
        style={{
          width: "100%",
          padding: "0.5rem",
          background: "#28a745",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer"
        }}
      >
        📋 Paste into Zendesk
      </button>

      {status && (
        <p style={{ marginTop: "0.5rem", color: "#555" }}>
          <strong>{status}</strong>
        </p>
      )}

      {scraped && (
        <div style={{
          marginTop: "1rem",
          padding: "0.75rem",
          background: "#fff",
          borderRadius: "6px",
          border: "1px solid #ddd"
        }}>
          <p><strong>👤 Name:</strong> {scraped.clientName}</p>
          <p><strong>🆔 National ID / Account #:</strong> {scraped.nationalId}</p>
          <p><strong>📞 Phone:</strong> {scraped.phoneNumber}</p>
          <p><strong>🧭 Sales Territory:</strong> {scraped.salesTerritory}</p>
          <p><strong>🏪 Duka Zone:</strong> {scraped.dukaZone}</p>
          <p><strong>🔢 Lead ID:</strong> {scraped.leadId}</p>
          <p><strong>🎂 DOB:</strong> {scraped.dob}</p>
          <p><strong>📌 Status:</strong> {scraped.status}</p>
          <p><strong>📝 Status Comment:</strong> {scraped.comment}</p>
        </div>
      )}
    </div>
  );
}

export default App;
