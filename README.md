# CalcCheck Indenter
A collection of utilities for [CalcCheckWeb](http://calccheck.mcmaster.ca/CalcCheckDoc/)

- Press Ctrl+Alt+V to copy line from two lines up to current line
- Press Ctrl+Shift+K to clear currently selected line(s) (similar to VS Code)
- Displays warning on navigation away from unsaved notebook (provided syntax or proof check has been run since last save)

#### Removed features 
- Converts Tab key presses inside CalcCheckWeb cells to 2 spaces (on lines that contain whitespace only)
- Automatically indents more than 2 spaces based upon indentation level of line above

## Installing from the Web Store

https://chrome.google.com/webstore/detail/calccheck-indenter/bbkojflhldpidbhpkknnniajcojmbecf/

## Installing from Source

1. Download or clone repository
2. Go to chrome://extensions/
3. Enable "Developer mode"
4. Click "Load unpacked"
5. Select directory of extracted extension
6. Reload any previously open CalcCheck notebooks
