import React from "react";
import PageBanner from "../Ui components/PageBanner";
import { ContactusForm } from "../Components/ContactusForm";
import EmbeddedMap from "../Ui components/EmbeddedMap";

const Contactuspage = () => {
  return (
    <>
      <PageBanner pageName="Get In Touch" currectPage="Contact us" />
      <div className="px-[4vw] py-[2vw] flex flex-col items-start">
        <div className="flex justify-center w-full items-center flex-wrap py-10 bg-white">
          {/* Our Location */}
          <div className="flex flex-1 flex-col items-center justify-center bg-[#FFEFEE] w-1/3 p-6 h-44  min-w-[300px] rounded-md">
            <div className="mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-8 h-8 text-pink-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 15.75l-4.95-2.8a2.1 2.1 0 010-3.8l13.8-7.8a2.1 2.1 0 012.1 0l4.95 2.8a2.1 2.1 0 010 3.8l-13.8 7.8a2.1 2.1 0 01-2.1 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800">
              Our Location
            </h3>
            <p className="text-sm text-gray-600 mt-2 text-center">
              Office No. 603, 6th floor, Paradise Tower, Gokhale Rd, next to
              McDonaldʼs, Naupada, Thane West, Thane, Maharashtra 400602
            </p>
          </div>

          {/* Telephone */}
          <div className="flex flex-1 flex-col items-center justify-center bg-[#ECEDFF] w-1/3 p-6 h-44 min-w-[300px] rounded-md">
            <div className="mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-8 h-8 text-blue-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.75 4.75v1.5a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25v-1.5m-3.5 5.5a5.5 5.5 0 11-11 0"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Telephone</h3>
            <p className="text-sm text-gray-600 mt-2 text-center">
              (+91) 9594669999 <br />
              (+91) 9594941234
            </p>
          </div>

          {/* Send Email */}
          <div className="flex flex-1 flex-col items-center justify-center bg-[#EAFEFF] w-1/3 p-6 h-44  min-w-[300px] rounded-md">
            <div className="mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-8 h-8 text-teal-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 8l9 6 9-6m0 10.5a2.5 2.5 0 01-2.5 2.5H5.5a2.5 2.5 0 01-2.5-2.5V6a2.5 2.5 0 012.5-2.5h12.5a2.5 2.5 0 012.5 2.5v10.5z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Send Email</h3>
            <p className="text-sm text-gray-600 mt-2 text-center">
              contact@eduroutez.com
            </p>
          </div>
        </div>

        <ContactusForm />
        <EmbeddedMap />
      </div>
    </>
  );
};

export default Contactuspage;
