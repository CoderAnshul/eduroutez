import React, { useState } from 'react';
import EditProfile from '../Components/DashboardComponent/EditProfile';
import Security from '../Components/DashboardComponent/Security';
import BankDetails from '../Components/DashboardComponent/BankDetails';
import EducationalDetail from '../Components/DashboardComponent/EducationalDetail';



const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('editProfile'); // Default active tab

  const renderContent = () => {
    switch (activeTab) {
      case 'editProfile':
        return <EditProfileSection/>;
      case 'security':
        return <SecuritySection/>;
      case 'bankDetails':
        return <BankDetailsSection/>;
      case 'educations':
        return <EducationsSection/>;
      case 'experiences':
        return <ExperiencesSection/>;
      case 'skillsExpertise':
        return <SkillsExpertiseSection/>;
      default:
        return <div>Select a tab to view content</div>;
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('editProfile')}
          className={`px-4 py-2 rounded-md ${
            activeTab === 'editProfile'
              ? 'bg-red-100 text-red-600 border border-red-600'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          <i className="fa fa-user-edit mr-2"></i>Edit Profile
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2 rounded-md ${
            activeTab === 'security'
              ? 'bg-red-100 text-red-600 border border-red-600'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          <i className="fa fa-lock mr-2"></i>Security
        </button>
        <button
          onClick={() => setActiveTab('bankDetails')}
          className={`px-4 py-2 rounded-md ${
            activeTab === 'bankDetails'
              ? 'bg-red-100 text-red-600 border border-red-600'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          <i className="fa fa-university mr-2"></i>Bank Details
        </button>
        <button
          onClick={() => setActiveTab('educations')}
          className={`px-4 py-2 rounded-md ${
            activeTab === 'educations'
              ? 'bg-red-100 text-red-600 border border-red-600'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          <i className="fa fa-book mr-2"></i>Educations
        </button>
        <button
          onClick={() => setActiveTab('experiences')}
          className={`px-4 py-2 rounded-md ${
            activeTab === 'experiences'
              ? 'bg-red-100 text-red-600 border border-red-600'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          <i className="fa fa-briefcase mr-2"></i>Experiences
        </button>
        <button
          onClick={() => setActiveTab('skillsExpertise')}
          className={`px-4 py-2 rounded-md ${
            activeTab === 'skillsExpertise'
              ? 'bg-red-100 text-red-600 border border-red-600'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          <i className="fa fa-tools mr-2"></i>Skills & Expertise
        </button>
      </div>

      {/* Content Section */}
      <div className="p-4 border rounded-md bg-white shadow">{renderContent()}</div>
    </div>
  );
};

// Dummy Components for each tab
const EditProfileSection = () => <div><EditProfile/></div>;
const SecuritySection = () => <div><Security/></div>;
const BankDetailsSection = () => <div><BankDetails/></div>;
const EducationsSection = () => <div><EducationalDetail></EducationalDetail></div>;
const ExperiencesSection = () => <div>Experiences Content</div>;
const SkillsExpertiseSection = () => <div>Skills & Expertise Content</div>;

export default SettingsPage;
