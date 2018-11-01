// Global variables

var lastUpdate = 0;
var lastSave = 0;

function handleKeyDown(el, event) {
  // Convert Tab key presses to 2 spaces
  // Run only when Tab key is pressed alone
  if (event.keyCode === 9 && !(event.shiftKey || event.ctrlKey)) {
    let text = el.value;
    let lines = text.substr(0, el.selectionStart).split("\n");
    let currentLine = lines[lines.length - 1];
    let lineAbove = lines[lines.length - 2];
    // Don't run if there are any non-space characters on the current line
    if (currentLine.match(/[^ ]/) === null) {
      // Make first Tab press on blank line to catch up to indentation level of line above
      if (
        lines.length > 2 &&
        currentLine.match(/[ ]/) === null &&
        currentLine.length === 0
      ) {
        let nonSpaceChars = new RegExp(/[^ ]/);
        let firstNonSpaceChar = nonSpaceChars.exec(lineAbove);
        let lastChar = lineAbove[lineAbove.length - 1];
        let offset = -2;
        // Indent further if line above is a hint
        if (lastChar === "⟩") offset = 2;
        document.execCommand(
          "insertText",
          false,
          " ".repeat(Math.max(firstNonSpaceChar.index + offset, 2))
        );
      } else {
        document.execCommand("insertText", false, "  ");
      }
    }
  }

  // Copy contents of two lines above to current line
  // Run only when Ctrl+B is pressed
  if (event.keyCode === 66 && event.ctrlKey) {
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

  if (event.keyCode === 75 && event.ctrlKey && event.shiftKey) {
    let text = el.value;
    let startPos = el.selectionStart - 1;
    let endPos = el.selectionEnd - 1;
    while (text[startPos] !== "\n") startPos -= 1;
    while (text[endPos] !== "\n") endPos += 1;
    el.selectionStart = startPos;
    el.selectionEnd = endPos;
    document.execCommand("insertText", false, newText);
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
