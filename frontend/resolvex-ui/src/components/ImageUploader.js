import React, { useState } from "react";

/*
=====================================================
ResolveX Image Uploader
=====================================================

Features

• Max 2 images
• Image preview
• Remove image
• Validation
=====================================================
*/

function ImageUploader({ onImagesSelected }) {

  const [images, setImages] = useState([]);



  const handleImageChange = (e) => {

    const files = Array.from(e.target.files);

    if (files.length + images.length > 2) {

      alert("Maximum 2 images allowed");

      return;
    }

    const updated = [...images, ...files];

    setImages(updated);

    onImagesSelected(updated);
  };



  const removeImage = (index) => {

    const updated = images.filter((_, i) => i !== index);

    setImages(updated);

    onImagesSelected(updated);
  };



  return (

    <div className="mt-4">

      <label className="block font-medium mb-2">
        Upload Issue Images (max 2)
      </label>

      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageChange}
        className="mb-3"
      />



      {/* Preview Grid */}

      <div className="grid grid-cols-2 gap-3">

        {images.map((img, index) => (

          <div key={index} className="relative">

            <img
              src={URL.createObjectURL(img)}
              alt="preview"
              className="rounded shadow w-full h-32 object-cover"
            />

            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-1 right-1 bg-red-500 text-white px-2 rounded"
            >
              ✕
            </button>

          </div>

        ))}

      </div>

    </div>

  );
}

export default ImageUploader;