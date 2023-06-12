import React, { useState } from "react";
import { RiSave3Fill } from "react-icons/ri";
import { SketchPicker } from "react-color";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";

interface ColorPickerProps {
  onClose: () => void;
}

export default function ColorPicker({ onClose }: ColorPickerProps) {
  const [selectedColorHex, setSelectedColorHex] = useState("#FFF");
  const [colorName, setColorName] = useState("");
  const [isNameValid, setIsNameValid] = useState(true);
  const [nameErrorMessage, setNameErrorMessage] = useState("");
  const router = useRouter();

  const handleColorChange = (color: any) => {
    setSelectedColorHex(color.hex);
  };

  const handleNameChange = (event: any) => {
    const { value } = event.target;
    const isValid = value.length <= 10;
    setIsNameValid(isValid);
    setColorName(value);
    if (!isValid) {
      setNameErrorMessage("No se permite más de 10 caracteres");
    } else {
      setNameErrorMessage("");
    }
  };

  const handleSaveColor = async () => {
    if (!isNameValid || !selectedColorHex) {
      return;
    }
    try {
      const colorData = {
        name: colorName,
        color: selectedColorHex,
      };
      const response = await fetch("/api/color", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(colorData),
      });
      if (response.ok) {
        console.log("Color guardado exitosamente");
        toast.success(`Color ${colorData.name} was created`);
        onClose();
        router.push("/admin/colors");
      } else {
        console.error("Error al guardar el color");
        toast.error(`This color or name is already created`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-white p-3 rounded-lg shadow-2xl justify-center">
      <div className="flex flex-row w-[94%] mb-4 justify-between items-center">
        <input
          type="text"
          value={colorName}
          onChange={handleNameChange}
          placeholder="Nombre del color"
          className="p-2 border border-gray-300 rounded-lg w-[75%] ml-2"
        />
        {!isNameValid && (
          <p className="text-red-500 text-sm mb-2">{nameErrorMessage}</p>
        )}
        <button
          onClick={handleSaveColor}
          disabled={!isNameValid || !selectedColorHex}
          className={`${
            isNameValid && selectedColorHex
              ? "bg-blue-500 hover:bg-blue-600"
              : "bg-gray-300 cursor-not-allowed"
          } text-white py-2 px-2 rounded h-9`}
        >
          <RiSave3Fill size="1.2rem" />
        </button>
      </div>
      <SketchPicker
        color={selectedColorHex}
        onChangeComplete={handleColorChange}
        className="ml-3"
      />
    </div>
  );
}
