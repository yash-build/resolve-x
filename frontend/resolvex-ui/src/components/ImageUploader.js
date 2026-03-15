import React, { useState } from "react";

/*
==========================================
RESOLVEX IMAGE UPLOADER COMPONENT
==========================================

Features:

• select images
• max 2 images
• preview images
• remove images
• validation
*/

const MAX_IMAGES = 2;

const ImageUploader = ({ onImagesChange }) => {

  const [images, setImages] = useState([]);

  /* ===============================
     HANDLE FILE SELECT
  =============================== */

  const handleFileChange = (event) => {

    const files = Array.from(event.target.files);

    if (images.length + files.length > MAX_IMAGES) {
      alert("Maximum 2 images allowed.");
      return;
    }

    const updatedImages = [...images, ...files];

    setImages(updatedImages);

    if (onImagesChange) {
      onImagesChange(updatedImages);
    }

  };

  /* ===============================
     REMOVE IMAGE
  =============================== */

  const removeImage = (index) => {

    const updatedImages = images.filter(
      (_, i) => i !== index
    );

    setImages(updatedImages);

    if (onImagesChange) {
      onImagesChange(updatedImages);
    }

  };

  return (

    <div className="space-y-4">

      {/* Upload Button */}

      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500
        file:mr-4 file:py-2 file:px-4
        file:rounded file:border-0
        file:text-sm file:font-semibold
        file:bg-blue-50 file:text-blue-700
        hover:file:bg-blue-100"
      />

      {/* Preview Images */}

      <div className="grid grid-cols-2 gap-4">

        {images.map((image, index) => (

          <div
            key={index}
            className="relative border rounded-lg overflow-hidden"
          >

            <img
              src={URL.createObjectURL(image)}
              alt="preview"
              className="w-full h-32 object-cover"
            />

            <button
              onClick={() => removeImage(index)}
              className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded"
            >
              Remove
            </button>

          </div>

        ))}

      </div>

    </div>
  );

};

export default ImageUploader;