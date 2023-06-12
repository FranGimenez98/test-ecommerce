import React, { useState } from "react";
import { SketchPicker } from "react-color";

interface ColorOptions {
  defaultColor: string;
  onClose: any;
}

const EditColorPicker = ({ defaultColor, onClose }: ColorOptions) => {
  const [color, setColor] = useState(defaultColor);
  const [editColorName, setEditColorName] = useState("");
  const [showModal, setShowModal] = useState(true);

  const handleChange = (newColor: any) => {
    setColor(newColor.hex);
  };

  const handleSave = () => {
    onClose({
      name: editColorName,
      color
    });
    setShowModal(false);
  };

  const handleCancel = () => {
    onClose(null);
    setShowModal(false);
  };

  return (
    <>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="flex items-center mb-4">
              <label className="mr-2">Color Name:</label>
              <input
                type="text"
                value={editColorName}
                onChange={(e) => setEditColorName(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1"
              />
            </div>
            <SketchPicker color={color} onChange={handleChange} />
            <div className="mt-4 flex justify-end">
              <button
                className="bg-gray-200 rounded-md px-4 py-2 mr-2"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 rounded-md px-4 py-2 text-white"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      {showModal && (
        <div
          className="modal-overlay"
          onClick={handleCancel}
          style={{ zIndex: 9999 }}
        />
      )}
    </>
  );
};

export default EditColorPicker;
