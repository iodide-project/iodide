export function closeModals() {
  return {
    type: "SET_MODAL_STATE",
    modalState: "MODALS_CLOSED"
  };
}

export function toggleModal(modalStateWhenOn) {
  return (dispatch, getState) => {
    dispatch({
      type: "SET_MODAL_STATE",
      modalState:
        getState().modalState === modalStateWhenOn
          ? "MODALS_CLOSED"
          : modalStateWhenOn
    });
  };
}

export function toggleHistoryModal() {
  return toggleModal("HISTORY_MODAL");
}

export function toggleHelpModal() {
  return toggleModal("HELP_MODAL");
}

export function toggleFileModal() {
  return toggleModal("FILE_MODAL");
}
