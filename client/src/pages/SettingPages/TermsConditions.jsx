import { FileText, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TermsAndConditions = () => {
    const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen  lg:ml-60 mt-12 lg:mr-56 bg-gray-50 p-4 md:p-8 font-inter">
      <div className=" mx-auto bg-white p-6 md:p-10 rounded-xl shadow-lg">
        
        {/* Back Button */}
        <button 
          onClick={handleGoBack}
          className="flex items-center cursor-pointer text-gray-500 hover:text-teal-600 mb-6 transition duration-150 p-2 -ml-2 rounded-lg"
          aria-label="Go back to the previous page"
        >
          <ArrowLeft size={20} className="mr-2" />
          <span className="font-medium text-sm">Go Back</span>
        </button>

        <div className="flex items-center space-x-4 mb-8 border-b pb-4">
          <FileText size={32} className="text-teal-600" />
          <h1 className="text-3xl font-extrabold text-gray-900">
            Terms and Conditions
          </h1>
        </div>

        <p className="text-sm text-gray-500 mb-6">
          Last updated: November 20, 2025
        </p>

        <section className="space-y-6 text-gray-700">
          <h2 className="text-xl font-bold text-gray-800 border-l-4 border-teal-500 pl-3">1. Agreement to Terms</h2>
          <p>
            By accessing or using our service, you agree to be bound by these Terms and Conditions and all policies incorporated by reference. If you do not agree to all of these terms, do not use our service.
          </p>

          <h2 className="text-xl font-bold text-gray-800 border-l-4 border-teal-500 pl-3 pt-4">2. Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms at any time. We will notify you of any changes by posting the new Terms on this page. Your continued use of the service after any such changes constitutes your acceptance of the new Terms.
          </p>

          <h2 className="text-xl font-bold text-gray-800 border-l-4 border-teal-500 pl-3 pt-4">3. User Obligations</h2>
          <p>
            You agree not to use the service for any purpose that is unlawful or prohibited by these Terms. This includes, but is not limited to, unauthorized commercial communications, posting malicious code, or harassing other users.
          </p>
          
          <h2 className="text-xl font-bold text-gray-800 border-l-4 border-teal-500 pl-3 pt-4">4. Limitation of Liability</h2>
          <p>
            The service is provided on an "AS IS" and "AS AVAILABLE" basis. We make no warranties, expressed or implied, regarding the operation of the service or the information, content, or materials included therein. To the fullest extent permissible by applicable law, we disclaim all warranties.
          </p>
          
          <h2 className="text-xl font-bold text-gray-800 border-l-4 border-teal-500 pl-3 pt-4">5. Governing Law</h2>
          <p>
            These Terms shall be governed and construed in accordance with the laws of the jurisdiction where the company is headquartered, without regard to its conflict of law provisions.
          </p>
        </section>

      </div>
    </div>
  );
};
export default TermsAndConditions;
