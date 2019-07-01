export function getPreviousRevisionId(revisionList, selectedRevisionId) {
  // selected revision is "unsaved changes"
  if (selectedRevisionId === undefined) {
    return revisionList.length ? revisionList[0].id : undefined;
  }

  const selectedRevisionIndex = revisionList.findIndex(
    r => r.id === selectedRevisionId
  );
  return revisionList.length - selectedRevisionIndex >= 2
    ? revisionList[selectedRevisionIndex + 1].id
    : undefined;
}

export function getRevisionIdsNeededForDisplay(notebookHistory) {
  const { revisionList, selectedRevisionId, revisionContent } = notebookHistory;
  const previousRevisionId = getPreviousRevisionId(
    revisionList,
    selectedRevisionId
  );
  return [selectedRevisionId, previousRevisionId].filter(
    revisionId =>
      revisionId !== undefined &&
      (!revisionContent || revisionContent[revisionId] === undefined)
  );
}
