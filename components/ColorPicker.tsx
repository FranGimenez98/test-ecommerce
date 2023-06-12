import React, { useState } from "react";
import { RiSave3Fill } from "react-icons/ri";
import { SketchPicker } from "react-color";

export default function ColorPicker() {
  const [selectedColorHex, setSelectedColorHex] = useState("#FFF");
  const [colorName, setColorName] = useState("");
  const [isNameValid, setIsNameValid] = useState(true);
  const [nameErrorMessage, setNameErrorMessage] = useState("");

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
      // No cumplen los requisitos de validación, salir de la función
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
        // Aquí puedes realizar cualquier acción adicional después de guardar el color
      } else {
        console.error("Error al guardar el color");
        // Aquí puedes manejar el caso de error, si es necesario
      }
    } catch (error) {
      console.error(error);
      // Aquí puedes manejar el caso de error, si ocurre una excepción
    }
  };

  return (
    <div className="bg-white p-3 rounded-lg shadow-2xl justify-center">
      <div className="flex flex-row w-[94%] mb-4 justify-between">
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
          } text-white py-2 px-2 rounded`}
        >
          <RiSave3Fill size="1.4rem" />
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
