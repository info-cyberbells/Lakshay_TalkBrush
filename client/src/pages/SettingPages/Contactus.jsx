import { useState } from 'react';
import { Mail, Send, CheckCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ContactUs = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState(null);

    const navigate = useNavigate();


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitted(false);

    if (!formData.name || !formData.email || !formData.message) {
      setError("Please fill out all fields.");
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        setError("Please enter a valid email address.");
        return;
    }

    setIsSubmitting(true);

   
    setTimeout(() => {
      console.log('Form Submitted:', formData);
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', message: '' });

      // Reset submitted state after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000); 

    }, 2000); 
  };

  return (
<div className="min-h-screen w-full lg:ml-60 mt-12 lg:mr-56 bg-gray-50 flex justify-center items-start p-4 font-inter">
      <div className=" bg-white p-8 rounded-xl shadow-md">
        
        {/* Back Button */}
        <button 
          onClick={handleGoBack}
          className="flex items-center cursor-pointer text-gray-500 hover:text-red-600 mb-6 transition duration-150 p-2 -ml-2 rounded-lg"
          aria-label="Go back to the previous page"
        >
          <ArrowLeft size={20} className="mr-2" />
          <span className="font-medium text-sm">Go Back</span>
        </button>
 
        <div className="flex items-center space-x-4 mb-6">
          <Mail size={32} className="text-red-600" />
          <h1 className="text-3xl font-extrabold text-gray-900">
            Contact Us
          </h1>
        </div>

        <p className="text-gray-600 mb-8">
          We'd love to hear from you! Send us a message and we'll get back to you as soon as possible.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
          
          <input type="text" name="fakeName" autoComplete="off" className="hidden" />
          <input type="email" name="fakeEmail" autoComplete="off" className="hidden" />

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Your Name
            </label>
            <input
              type="text"
              name="name"
              autoComplete="off"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 transition duration-150"
              placeholder="John Doe"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              autoComplete="off"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 transition duration-150"
              placeholder="you@example.com"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              name="message"
              id="message"
              autoComplete="off"
              rows="4"
              value={formData.message}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 transition duration-150 resize-none"
              placeholder="How can we help you?"
              disabled={isSubmitting}
            ></textarea>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex justify-center">
          {isSubmitted ? (
            <div className="flex items-center justify-center p-3 text-base font-semibold text-green-700 bg-green-100 rounded-lg shadow-md transition duration-300">
                <CheckCircle size={20} className="mr-2" />
                Message Sent Successfully!
            </div>
          ) : (
            <button
              type="submit"
              className={` flex cursor-pointer justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-lg font-medium text-white transition duration-300 ${isSubmitting ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <svg className="animate-spin -ml-1 mt-5 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <Send size={20} className="mr-2" />
              )}
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          )}
            </div>

        </form>
      </div>
    </div>
  );
};

export default ContactUs;
