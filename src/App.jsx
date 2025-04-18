/* global chrome */
import { useEffect, useState, useRef } from "react";
import macros from "./macros";
import "./index.css";

function App() {
  const [status, setStatus] = useState("");
  const [scraped, setScraped] = useState(null);
  const [selectedMacro, setSelectedMacro] = useState("");
  const [selectedComment, setSelectedComment] = useState(null);
  const [filledMacro, setFilledMacro] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMacroGenerated, setIsMacroGenerated] = useState(false);

  const [callerPhone, setCallerPhone] = useState("");

  // state for the Connex call phone
  const [connexPhone, setConnexPhone] = useState("");

  // Replace the single copied state with two separate ones
  const [callerCopied, setCallerCopied] = useState(false);
  const [requestorCopied, setRequestorCopied] = useState(false);
  const [macroCopied, setMacroCopied] = useState(false);

  const dropdownRef = useRef(null);
  const macroRef = useRef(null);
  const generateBtnRef = useRef(null);


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
    chrome.storage.local.get(["scrapedData", "connexPhone"], (result) => {
      if (result.scrapedData) {
        setScraped(result.scrapedData);
        setConnexPhone(result.connexPhone || "");
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
        chrome.storage.local.set({ scrapedData: response.data });

        // then load any Connex‑scraped number
        chrome.storage.local.get("connexPhone", (r) => {
          if (r.connexPhone) setConnexPhone(r.connexPhone);
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
    setFilledMacro("");
    const macro = macros[selectedMacro];
    if (macro && scraped) {
      let finalText = macro.template(
        scraped,
        connexPhone,
        selectedComment?.message || ""
      );

      // finalText = finalText.replace(/Comments:/g, "\n\nComments:");
      setFilledMacro(finalText.trim());
      setIsMacroGenerated(true);

      // Scroll after a tiny delay to ensure macro is rendered
  setTimeout(() => {
    macroRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, 50);
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
          <div className="scraped-compact">
            {/* Name */}
            <div className="line">
              <span className="label">🙍‍♀️ Name:</span>
              <span className="value">{scraped.clientName}</span>
            </div>

            {/* Caller Phone */}
            {connexPhone && (
              <div className="line">
                <span className="label">📞 Phone:</span>
                <span className="value">{connexPhone}</span>
                <button
                  className="btn-mini"
                  onClick={() => {
                    navigator.clipboard.writeText(connexPhone).then(() => {
                      setCallerCopied(true);
                      setTimeout(() => setCallerCopied(false), 2000);
                    });
                  }}
                >
                  {callerCopied ? "✓ copied" : "📋 copy"}
                </button>
              </div>
            )}

            {/* Requestor */}
            <div className="line">
              <span className="label">🪪 Requestor:</span>
              <span className="value">
                {`${scraped.clientName || ""} ${scraped.nationalId || ""}`}
              </span>
              <button
                className="btn-mini"
                onClick={() => {
                  navigator.clipboard
                    .writeText(
                      `${scraped.clientName || ""} ${scraped.nationalId || ""}`
                    )
                    .then(() => {
                      setRequestorCopied(true);
                      setTimeout(() => setRequestorCopied(false), 2000);
                    });
                }}
              >
                {requestorCopied ? "✓ copied" : "📋 copy"}
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
                  <div className="macrobar-no-result">No matching macros. Want the macro to be added?</div>
                )}
              </div>
            )}
          </div>

          {selectedMacro && (
            <div className="caller-smart">
              <label htmlFor="connex-phone-input" className="caller-label">
                ☎️ Caller:
              </label>
              <input
                id="connex-phone-input"
                type="text"
                className="caller-smart-input"
                value={connexPhone}
                onChange={(e) => setConnexPhone(e.target.value)}
                placeholder="Enter number"
              />
              {connexPhone && (
                <button
                  className="btn-clear"
                  onClick={() => setConnexPhone("")}
                  title="Clear"
                >
                  ✖
                </button>
              )}
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
                  onClick={() => {
                    setSelectedComment(comment);
                  
                    // Scroll to generate button after comment is selected
                    setTimeout(() => {
                      generateBtnRef.current?.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                      });
                    }, 50);
                  }}
                >
                  <strong>{comment.label}</strong>
                  <p>{comment.message.slice(0, 230)}...</p>
                </div>
              ))}
            </div>
          )}

          {/* Generate Macro Button */}
          {selectedMacro && (
            <div className="centred" ref={generateBtnRef}>
              <button className="btn-generate" onClick={handleGenerateMacro}>
                ✍️ {isMacroGenerated ? "Update Macro" : "Generate Macro"}
              </button>
            </div>
          )}

          {/* Macro Output and Copy */}
          {filledMacro && (
            <div ref={macroRef}>
              <textarea
                className="macro-output"
                // readOnly
                value={filledMacro}
                onFocus={(e) => e.target.select()}
              />

              <button
                className="btn-copy"
                onClick={() => {
                  navigator.clipboard.writeText(filledMacro).then(() => {
                    setMacroCopied(true);
                    setTimeout(() => setMacroCopied(false), 2000);
                  });
                }}
              >
                {macroCopied ? "✓ Copied!" : "📋 Copy"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
