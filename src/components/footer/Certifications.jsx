import React from "react";

const Certifications = ({ certifications }) => {
  return (
    <div className="flex justify-end items-center flex-wrap gap-4">
      {certifications.map((cert, index) => (
        <img
          key={index}
          src={cert.cert_img_url}
          alt={`Certification ${index + 1}`}
          className="h-12 w-auto object-contain"
        />
      ))}
    </div>
  );
};

export default Certifications;
