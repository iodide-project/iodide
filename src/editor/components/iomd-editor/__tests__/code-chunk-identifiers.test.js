import { fetchIdentifiers, cssIdentifiers } from "../code-chunk-identifiers";

describe("fetchIdentifiers", () => {
  [
    [
      [
        `js: https://cdnjs.cloudflare.com/ajax/libs/d3/4.10.2/d3.js
text: csvDataString = https://data.sfgov.org/api/views/5cei-gny5/rows.csv?accessType=DOWNLOAD
text: mydata = RepTree.jsx`
      ],
      ["mydata", "csvDataString"]
    ],
    [
      [
        `// NOTE js style comments are allowed as well
js: https://cdnjs.cloudflare.com/ajax/libs/d3/4.10.2/d3.js
css: https://www.exmpl.co/a_stylesheet.css  // end of line comments are ok too`
      ],
      []
    ],
    [
      [
        `%%
// invalid line no highligh


text: csvDataString = https://www.exmpl.co/a_csv_file.csv    //comment
arrayBuffer: bigDataframe = https://www.exmpl.co/a_binary.arrow
        // fsdf
json: jsonData = https://www.exmpl.co/a_json_file.json
blob: blobData = https://www.exmpl.co/a_binary_blob.arrow`
      ],
      ["csvDataString", "bigDataframe", "jsonData", "blobData"]
    ],
    [
      [
        `%%
// invalid line no highligh


text: csvDataString = https://www.exmpl.co/a_csv_file.csv    //comment
arrayBuffer: bigDataframe = https://www.exmpl.co/a_binary.arrow
        // fsdf
json: jsonData = https://www.exmpl.co/a_json_file.json
blob: blobData = https://www.exmpl.co/a_binary_blob.arrow`,

        `json: jsonData = https://www.exmpl.co/a_json_file.json
blob: blobData = https://www.exmpl.co/a_binary_blob.arrow`,

        `text: csvDataString = https://www.exmpl.co/a_csv_file.csv 
arrayBuffer: bigDataframe = https://www.exmpl.co/a_binary.arrow
blob: blobData = https://www.exmpl.co/a_binary_blob.arrow`
      ],
      ["csvDataString", "bigDataframe", "jsonData", "blobData"]
    ]
  ].forEach(([chunkContents, identifiersArray], i) => {
    it(`Should give correct results for case ${i}`, () => {
      expect(fetchIdentifiers(chunkContents)).toEqual(
        new Set(identifiersArray)
      );
    });
  });
});

describe("cssIdentifiers", () => {
  [
    [
      [
        `
div#notebook-header {
    z-index: 1000;
}

div#editor-react-root{
    /*needed to ensure that the div grows to full height*/
  flex-grow: 1;
  display: flex;
  overflow: hidden; /* needed to ensure the contents are restriced in size */
}

iframe#eval-frame {
    border: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
}

.pane-content {
  flex-grow: 1;
  height: 100%;
  overflow: auto;
}

div.declared-variables-list {
  padding: 15px;
}`
      ],
      [
        "notebook-header",
        "editor-react-root",
        "eval-frame",
        "pane-content",
        "declared-variables-list"
      ]
    ]
  ].forEach(([chunkContents, identifiersArray], i) => {
    it(`Should give correct results for case ${i}`, () => {
      expect(cssIdentifiers(chunkContents)).toEqual(new Set(identifiersArray));
    });
  });
});
