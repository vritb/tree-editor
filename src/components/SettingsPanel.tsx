import React, { useState } from 'react';
import { setUndoRedoDepthLimit } from '../config/te-config';

interface SettingsPanelProps {
  undoRedoDepthLimit: number;
  setUndoRedoDepthLimit: (newLimit: number) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  undoRedoDepthLimit,
  setUndoRedoDepthLimit,
}) => {
  const [depthLimit, setDepthLimit] = useState<number>(undoRedoDepthLimit);

  const handleDepthLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLimit = parseInt(e.target.value, 10);
    setDepthLimit(newLimit);
    setUndoRedoDepthLimit(newLimit);
  };

  return (
    <div className="settings-page">
      <h2 className="font-semibold">Settings</h2>
      <div className="mt-2">
        <label className="block text-sm">
          Undo/Redo Depth Limit
          <input
            type="number"
            value={depthLimit}
            onChange={handleDepthLimitChange}
            className="border p-1 rounded w-full text-sm focus:outline-none focus:ring"
          />
        </label>
      </div>
    </div>
  );
};

export default SettingsPanel;
