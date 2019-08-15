export const makeSuggestionList = (wordList, itemKind, sharedProps) =>
  wordList.map(word => ({
    label: word,
    kind: itemKind,
    insertText: word,
    ...sharedProps
  }));
