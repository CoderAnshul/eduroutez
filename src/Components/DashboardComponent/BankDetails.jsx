import React, { useState } from 'react';

const BankDetails = () => {
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [ifscCode, setIfscCode] = useState('');

  const handleUpdate = (e) => {
    e.preventDefault();
    // Add your logic to update bank details here
    console.log('Bank Name:', bankName);
    console.log('Account Number:', accountNumber);
    console.log('Account Holder Name:', accountHolderName);
    console.log('IFSC Code:', ifscCode);
    alert('Bank details updated successfully!');
  };

  return (
    <div className="p-6 bg-gray-50 border border-gray-300 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-700">Update Bank Details</h2>
      <form onSubmit={handleUpdate}>
        {/* Bank Name */}
        <div className="mb-4">
          <label htmlFor="bankName" className="block text-sm font-medium text-gray-700">
            Bank Name
          </label>
          <input
            type="text"
            id="bankName"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            className="mt-1 block max-w-2/5 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-red-300 focus:border-red-600"
            placeholder="Enter bank name"
            required
          />
        </div>

        {/* Account Number */}
        <div className="mb-4">
          <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700">
            Account Number
          </label>
          <input
            type="text"
            id="accountNumber"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            className="mt-1 block max-w-2/5 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-red-300 focus:border-red-600"
            placeholder="Enter account number"
            required
          />
        </div>

        {/* Account Holder Name */}
        <div className="mb-4">
          <label htmlFor="accountHolderName" className="block text-sm font-medium text-gray-700">
            Account Holder Name
          </label>
          <input
            type="text"
            id="accountHolderName"
            value={accountHolderName}
            onChange={(e) => setAccountHolderName(e.target.value)}
            className="mt-1 block max-w-2/5 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-red-300 focus:border-red-600"
            placeholder="Enter account holder name"
            required
          />
        </div>

        {/* IFSC Code */}
        <div className="mb-4">
          <label htmlFor="ifscCode" className="block text-sm font-medium text-gray-700">
            IFSC Code
          </label>
          <input
            type="text"
            id="ifscCode"
            value={ifscCode}
            onChange={(e) => setIfscCode(e.target.value)}
            className="mt-1 block max-w-2/5 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-red-300 focus:border-red-600"
            placeholder="Enter IFSC code"
            required
          />
        </div>

        {/* Update Button */}
        <div>
          <button
            type="submit"
            className="max-w-2/5 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring focus:ring-red-300 focus:ring-opacity-50"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default BankDetails;
