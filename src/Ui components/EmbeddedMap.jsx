import React from "react";

const EmbeddedMap = () => {
  return (
    <div className="relative w-full h-96 rounded-lg shadow-lg overflow-hidden">
      {/* Map Container */}
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3559.725282004515!2d73.00324791508396!3d19.186402551731095!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7951f13a78957%3A0x2e2e99c21a9c897f!2sParadise%20Tower!5e0!3m2!1sen!2sin!4v1690000000000!5m2!1sen!2sin"
        className="w-full h-full border-0"
        allowFullScreen={true}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Google Map Location"
      ></iframe>

      {/* Location Box */}
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-md p-4 text-sm max-w-xs">
        <h2 className="font-semibold text-gray-800">Paradise Tower</h2>
        <p className="text-gray-600 text-sm">
          5XQG+33X, Gokhale Rd, Naupada, Thane West, Thane, Maharashtra 400602
        </p>
        <div className="mt-2 flex justify-between items-center">
          <a
            href="https://www.google.com/maps/dir//Paradise+Tower"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 text-sm underline"
          >
            Directions
          </a>
          <span className="text-yellow-500 text-sm font-semibold">
            2.7 ★
          </span>
        </div>
        <p className="text-gray-500 text-xs">230 reviews</p>
      </div>
    </div>
  );
};

export default EmbeddedMap;
