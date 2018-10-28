function typeInTextarea(el, newText) {
  // taken from https://stackoverflow.com/questions/11076975/insert-text-into-textarea-at-cursor-position-javascript
  let start = el.selectionStart;
  let end = el.selectionEnd;
  let text = el.value;
  let before = text.substring(0, start);
  let after = text.substring(end, text.length);
  el.value = before + newText + after;
  el.selectionStart = el.selectionEnd = start + newText.length;
  el.focus();
}

let bodyObserver = new MutationObserver(() => {
  let cells = document.querySelectorAll("textarea");
  cells.forEach(el => {
    el.addEventListener("keydown", event => {
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
            typeInTextarea(
              el,
              " ".repeat(Math.max(firstNonSpaceChar.index + offset, 2))
            );
          } else {
            typeInTextarea(el, "  ");
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
            typeInTextarea(el, lastLine.trim());
          } else {
            typeInTextarea(el, lastLine);
          }
        }
      }
    });
  });
});

// Run code once body has been populated with cells and re-run code if a cell is added
bodyObserver.observe(document.body, {
  childList: true
});
