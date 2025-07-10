import React, { useState } from "react";

const AccordionItem = ({ title, content, image }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border rounded mb-4 shadow">
      <button
        className="w-full text-left px-4 py-3 bg-gray-100 hover:bg-gray-200 flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium text-lg">{title}</span>
        <span>{isOpen ? "-" : "+"}</span>
      </button>
      {isOpen && (
        <div className="p-4 space-y-3">
          {image && <img src={image} alt={title} className="rounded w-full max-h-60 object-cover" />}
          <p><strong>Overview:</strong> {content.info}</p>
          <p><strong>Symptoms:</strong> {content.symptoms}</p>
          <p><strong>Precautions:</strong> {content.precautions}</p>
        </div>
      )}
    </div>
  );
};

export default AccordionItem;
