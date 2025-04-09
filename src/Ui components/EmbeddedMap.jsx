import React from "react";

const EmbeddedMap = () => {
  return (
    <div className="relative w-full h-96 rounded-lg shadow-lg overflow-hidden">
      {/* Map Container */}
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d3606.257513240857!2d72.9727626749325!3d19.187727098456037!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sOffice%20No.%20603%2C%206th%20floor%2C%20Paradise%20Tower%2C%20Gokhale%20Rd%2C%20next%20to%20McDonald%CA%BCs%2C%20Naupada%2C%20Thane%20West%2C%20Thane%2C%20Maharashtra%20400602!5e1!3m2!1sen!2sin!4v1743496390901!5m2!1sen!2sin"
        className="w-full h-full border-0"
        allowFullScreen={true}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Google Map Location"
      ></iframe>

      {/* Location Box */}
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-md p-4 text-sm max-w-xs">
        {/* <h2 className="font-semibold text-gray-800">Paradise Tower</h2> */}
        <p className="text-gray-600 text-sm">
          Office No. 603, 6th floor, Paradise Tower, Gokhale Rd, next to
          McDonaldʼs, Naupada, Thane West, Thane, Maharashtra 400602
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
          <span className="text-yellow-500 text-sm font-semibold">2.7 ★</span>
        </div>
        <p className="text-gray-500 text-xs">230 reviews</p>
      </div>
    </div>
  );
};

export default EmbeddedMap;
