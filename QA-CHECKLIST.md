# things to check before accepting a PR (particularly a major one)

## client changes

### baseline stuff
- do all tests pass?
- do linters pass?
- does CI pass?

### things to check manually:
When going through the following checklist, keep the browser console open. There should not be any errors in the console!

a rigourous check will verify that the items listed below work as expected in:
1. localhost in client only mode (`npm run simple-serve`)
2. localhost in server mode (`npm start` or `npm build` and also `make up`)
3. standalone archive mode (opening an html file directly from the filesystem)

- does the notebook open?
- does the notebook look as expected, no obvious UI regression?
- does it load in a reasonable time? (all panes in the editor and iframe)
- do all visible UI controls (menus and buttons) work as expected?
- does "run all" work on at least a couple complicated notebooks
    - including at least one Pyodide notebook
    - including a notebook that tests the iodide stdlib
        - environment freeze/unfreeze
        - output text, element
        - evalQueue
- does report view work as expected?
    - entering report view?
    - returning to explore view from report view?
    - do these transitions happen quickly?
- does opening a notebook that defaults to report view work?
    - is the report loaded quickly?
    - does returning to explore view from report view work correctly?
- can the title be changed?
- help available and pane look ok?
- does communication with the server happen correctly?
    - login/logout
    - save/load
- does exporting an archive produce a runnable notebook?
    -does exporting an archive in report view produce a working notebook that opens in report view and runs-all?
