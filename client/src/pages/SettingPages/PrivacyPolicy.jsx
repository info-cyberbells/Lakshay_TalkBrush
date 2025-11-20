import { Shield, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {

  const navigate = useNavigate();
  
  const handleGoBack = () => {
      navigate(-1);
  };

  return (
    <div className="min-h-screen lg:ml-60 mt-12 lg:mr-56 bg-gray-50 p-4 md:p-8 font-inter">
      <div className=" mx-auto bg-white p-6 md:p-10 rounded-xl shadow-lg">
        
        {/* Back Button */}
        <button 
          onClick={handleGoBack}
          className="flex items-center cursor-pointer text-gray-500 hover:text-indigo-600 mb-6 transition duration-150 p-2 -ml-2 rounded-lg"
          aria-label="Go back to the previous page"
        >
          <ArrowLeft size={20} className="mr-2" />
          <span className="font-medium text-sm">Go Back</span>
        </button>

        <div className="flex items-center space-x-4 mb-8 border-b pb-4">
          <Shield size={32} className="text-indigo-600" />
          <h1 className="text-3xl font-extrabold text-gray-900">
            Privacy Policy
          </h1>
        </div>

        <p className="text-sm text-gray-500 mb-6">
          Effective Date: November 15, 2025
        </p>

        <section className="space-y-6 text-gray-700">
          <h2 className="text-xl font-bold text-gray-800 border-l-4 border-indigo-500 pl-3">1. Information We Collect</h2>
          <p>
            We collect several types of information for various purposes to provide and improve our service to you.
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>**Personal Data:** Includes name, email address, phone number, and other identifiers when voluntarily provided.</li>
            <li>**Usage Data:** Information on how the service is accessed and used, such as IP address, browser type, and pages visited.</li>
            <li>**Cookies:** We use cookies and similar tracking technologies to track activity on our service and hold certain information.</li>
          </ul>

          <h2 className="text-xl font-bold text-gray-800 border-l-4 border-indigo-500 pl-3 pt-4">2. Use of Data</h2>
          <p>
            The collected data is used for purposes including: providing and maintaining the service, notifying you about changes, enabling interactive features, providing customer support, monitoring usage, and detecting/preventing technical issues.
          </p>

          <h2 className="text-xl font-bold text-gray-800 border-l-4 border-indigo-500 pl-3 pt-4">3. Data Security</h2>
          <p>
            The security of your data is important to us, but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
          </p>
          
          <h2 className="text-xl font-bold text-gray-800 border-l-4 border-indigo-500 pl-3 pt-4">4. Your Data Protection Rights</h2>
          <p>
            Depending on your location, you may have the right to access, update, or delete the personal information we hold about you. Please contact us to exercise these rights.
          </p>
        </section>

      </div>
    </div>
  );
};
export default PrivacyPolicy;
