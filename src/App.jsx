/* global chrome */
import { useEffect, useState, useRef } from "react";
import macros from "./macros";
import "./index.css";

function App() {
  const [status, setStatus] = useState("");
  const [scraped, setScraped] = useState(null);
  const [selectedMacro, setSelectedMacro] = useState("");
  const [selectedComment, setSelectedComment] = useState(null);
  const [callerPhone, setCallerPhone] = useState("");
  const [filledMacro, setFilledMacro] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMacroGenerated, setIsMacroGenerated] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const listener = (msg) => {
      if (msg.type === "SCRAPED_DATA") {
        setScraped(msg.data);
        setStatus("✅ Data fetched Successfully!");
      }
    };
    chrome.runtime.onMessage.addListener(listener);
    return () => chrome.runtime.onMessage.removeListener(listener);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFetch = () => {
    chrome.storage.local.get("scrapedData", (result) => {
      if (result.scrapedData) {
        setScraped(result.scrapedData);
        setStatus("✅ Data fetched successfully");
        return;
      }

      chrome.runtime.sendMessage({ type: "SCRAPE_DATA" }, (response) => {
        if (chrome.runtime.lastError || !response || !response.data) {
          setStatus(
            "❌ Could not connect to PaygOps. Are you on the right page?"
          );
          return;
        }

        setScraped(response.data);
        setStatus("✅ Data fetched successfully!");

        chrome.storage.local.set({ scrapedData: response.data }, () => {
          console.log("Data saved to local storage");
        });
      });
    });
  };

  const applyMacro = (macroKey) => {
    setSelectedMacro(macroKey);
    setSearchQuery("");
    setDropdownOpen(false);
    setCallerPhone("");
    setSelectedComment(null);
    setFilledMacro("");
  };

  const handleGenerateMacro = () => {
    setFilledMacro(""); // Clear existing

    const macro = macros[selectedMacro];
    if (macro && scraped) {
      let finalText = macro.template(
        scraped,
        callerPhone,
        selectedComment?.message || ""
      );

      // Adding space before "Comments:"
      finalText = finalText.replace(/Comments:/g, "\n\nComments:");

      setFilledMacro(finalText.trim());
      setIsMacroGenerated(true);
    }
  };

  const filteredMacros = Object.keys(macros).filter((key) =>
    key.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
    className="extension-container"
    style={{ height: dropdownOpen ? "600px" : "auto" }}
  >
      <h2>🍀 MacroMate</h2>

      <button className="btn-scrape" onClick={handleFetch}>
        🔍 Fetch Data from PaygOps
      </button>

      {status && (
        <p className="status-msg">
          <strong>{status}</strong>
        </p>
      )}

      {scraped && (
        <>
          <div className="scraped-box">
            <p>
              <strong>🙍‍♀️ Name:</strong> {scraped.clientName}
            </p>
            <p>
              <strong>🆔 National ID / Account #:</strong> {scraped.nationalId}
            </p>
            <p>
              <strong>📌 Status:</strong> {scraped.status}
            </p>

            {/* Requestor Section */}
            <div className="requestor-row">
              <p>
                <strong>🪪 Requestor:</strong>{" "}
                {`${scraped.clientName || ""} ${scraped.nationalId || ""}`}
              </p>
              <button
                className="btn-copy-requestor"
                onClick={() => {
                  navigator.clipboard
                    .writeText(
                      `${scraped.clientName || ""} ${scraped.nationalId || ""}`
                    )
                    .then(() => {
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    });
                }}
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>

          <div className="macrobar-wrapper" ref={dropdownRef}>
            {dropdownOpen ? (
              <input
                type="text"
                className="macro-search"
                placeholder="Search macros..."
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            ) : (
              <div
                className="macrobar-label"
                onClick={() => setDropdownOpen(true)}
              >
                <p>{selectedMacro || "🧾 Select Macro"}</p>
                <p>⮟</p>
              </div>
            )}

            {dropdownOpen && (
              <div className="macrobar-dropdown">
                {filteredMacros.length > 0 ? (
                  filteredMacros.map((key) => (
                    <div
                      key={key}
                      className="macrobar-item"
                      onClick={() => applyMacro(key)}
                    >
                      {key}
                    </div>
                  ))
                ) : (
                  <div className="macrobar-no-result">No matching macros</div>
                )}
              </div>
            )}
          </div>

          {/* Caller Phone Input */}
          {selectedMacro && (
            <div className="caller-section">
              <input
                type="text"
                className="caller-input"
                value={callerPhone}
                onChange={(e) => setCallerPhone(e.target.value)}
                placeholder="📞 Enter caller number"
              />
            </div>
          )}

          {/* Comment Selection */}
          {selectedMacro && macros[selectedMacro]?.comments && (
            <div className="comment-section">
              <p>
                <strong>💬🗨️ Choose a Comment: </strong>
              </p>
              {macros[selectedMacro].comments.map((comment, idx) => (
                <div
                  key={idx}
                  className={`comment-option ${
                    selectedComment?.label === comment.label ? "active" : ""
                  }`}
                  onClick={() => setSelectedComment(comment)}
                >
                  <strong>{comment.label}</strong>
                  <p>{comment.message.slice(0, 200)}...</p>
                </div>
              ))}
            </div>
          )}

          {/* Generate Macro Button */}
          {selectedMacro && (
            <div className="centred">
              <button className="btn-generate" onClick={handleGenerateMacro}>
                ✍️ {isMacroGenerated ? "Update Macro" : "Generate Macro"}
              </button>
            </div>
          )}

          {/* Macro Output and Copy */}
          {filledMacro && (
            <>
              <textarea
                className="macro-output"
                readOnly
                value={filledMacro}
                onFocus={(e) => e.target.select()}
              />

              <button
                className="btn-copy"
                onClick={() => {
                  navigator.clipboard.writeText(filledMacro).then(() => {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  });
                }}
              >
                {copied ? "✅ Copied!" : "📋 Copy"}
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default App;
