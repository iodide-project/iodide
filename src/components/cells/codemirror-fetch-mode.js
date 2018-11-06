import CodeMirror from 'codemirror'

CodeMirror.defineSimpleMode('fetch', {
  start: [
    { regex: /\/\/.*/, token: 'comment', sol: true },
    { regex: /[\s]+\/\/.*/, token: 'comment' },
    { regex: /(blob: |text: |json: )(\w+)(\s*=\s*)(\S+)/, token: ['fetch-type', 'fetch-variable-declaration', null, 'fetch-path'] },
    { regex: /(js: |css: )(\S+)/, token: ['fetch-type', 'fetch-path'] },
    { regex: /text: |blob: |json: |js: |css: /, token: 'fetch-type' },
  ],
})

