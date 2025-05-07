const DEFAULT_UNDO_REDO_DEPTH_LIMIT = 20;

let undoRedoDepthLimit = DEFAULT_UNDO_REDO_DEPTH_LIMIT;

export const getUndoRedoDepthLimit = () => undoRedoDepthLimit;

export const setUndoRedoDepthLimit = (newLimit: number) => {
  undoRedoDepthLimit = newLimit;
};
