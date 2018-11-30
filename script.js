// Global variables

var lastUpdate = 0;
var lastSave = 0;

function handleKeyDown(el, event) {
  // Copy contents of two lines above to current line
  // Run only when Ctrl+Alt+V is pressed
  if (event.keyCode === 86 && event.ctrlKey && event.altKey) {
    let text = el.value;
    let lines = text.substr(0, el.selectionStart).split("\n");
    let currentLine = lines[lines.length - 1];
    let lastLine = lines[lines.length - 3];
    if (lines.length >= 3) {
      // Check if user has already indented and if so, use that indentation instead
      if (currentLine[0] === " ") {
        document.execCommand("insertText", false, lastLine.trim());
      } else {
        document.execCommand("insertText", false, lastLine);
      }
    }
  }

  // Update last time changes were made
  // Run only when Ctrl+Enter is pressed
  if (event.keyCode === 13 && event.ctrlKey) {
    lastUpdate = Date.now();
  }

  // Clear current line / currently selected lines
  // Run only when Ctrl+Shift+K is pressed
  if (event.keyCode === 75 && event.ctrlKey && event.shiftKey) {
    let text = el.value;
    let startPos = Math.max(el.selectionStart - 1, 0);
    let endPos = el.selectionEnd;
    // Find start of line
    while (startPos > 0 && text[startPos] !== "\n") startPos -= 1;
    // Find end of line
    while (endPos < text.length && text[endPos] !== "\n") endPos += 1;

    el.selectionStart = startPos;
    el.selectionEnd = endPos;
    document.execCommand("insertText", false, startPos ? "\n" : "");
  }
}

// Observe changes to list of saves
let savesObserver = new MutationObserver(() => {
  // Select lastest save
  lastSave = document.querySelector("body>div>ul>li:last-child");
  // Grab date from save
  lastSave = lastSave.innerHTML
    .match(
      /\d{4}\-\d{2}\-\d{2}_\d{2}:\d{2}:\d{2}/
      // ^ yyyy-mm-dd_hh:mm:ss
    )[0]
    .replace("_", " ");
  lastSave = Date.parse(lastSave);
});

// Observe additions/deletions of cells
let bodyObserver = new MutationObserver(() => {
  let cells = document.querySelectorAll("textarea");
  cells.forEach(el => {
    el.onkeydown = handleKeyDown.bind(null, el);
  });

  // Watch div which contains saves for changes (no class or id to select !@#)
  savesObserver.observe(document.querySelector("body>div"), {
    childList: true
  });
});

// Run code once body has been populated with cells and re-run code if a cell is added
bodyObserver.observe(document.body, {
  childList: true
});

// Ask user if they want to discard changes before navigating away
window.onbeforeunload = () => {
  // Assuming both user and server are in the same timezone
  if (lastSave < lastUpdate) {
    return "Do you really want to close?";
  }
};
