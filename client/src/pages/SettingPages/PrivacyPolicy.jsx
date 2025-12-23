import { Shield, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen lg:ml-60 mt-12 lg:mr-56 bg-gray-50 p-4 md:p-8 font-inter">
      <div className="mx-auto bg-white p-6 md:p-10 rounded-xl shadow-lg">

        {/* Back Button */}
        <button
          onClick={handleGoBack}
          className="flex items-center cursor-pointer text-gray-500 hover:text-indigo-600 mb-6 transition duration-150 p-2 -ml-2 rounded-lg"
          aria-label="Go back to the previous page"
        >
          <ArrowLeft size={20} className="mr-2" />
          <span className="font-medium text-sm">Go Back</span>
        </button>

        <div className="mb-8 border-b pb-4 text-center">
          <div className="flex items-center justify-center space-x-4">
            <Shield size={32} className="text-indigo-600" />
            <h1 className="text-3xl font-extrabold text-gray-900">
              Privacy Policy & Terms of Service
            </h1>
          </div>

          <div className="mt-2 text-sm text-gray-600">
            <strong>TALKBrush</strong>
          </div>
        </div>



        <p className="text-sm text-gray-500 mb-8">
          <strong>Last Updated: 18 December 2025</strong>
        </p>

        <div className="space-y-8 text-gray-700 leading-relaxed">
          <section>
            <p className="mb-4">
              Welcome to TALKBrush, an accent adapter and virtual meeting platform. TALKBrush is an app developed and operated by <b>SMART NEURO DILIGENCE</b>. For privacy purposes, TALKBrush is responsible for the collection and handling of your data in accordance with this policy.
            </p>
            <p className="mb-4">
              TALKBrush complies with the <b>Australian Privacy Principles (APPs)</b> under the <b>Privacy Act 1988 (Cth)</b> for the collection, use, disclosure, and storage of personal information. We are also committed to fulfilling applicable obligations under Apple and Google Play's app store privacy requirements, ensuring a safe, transparent experience as you use our services.
            </p>
            <p>
              This document outlines our <b>Privacy Policy and Terms of Service ("Terms")</b>. By accessing or using TALKBrush, you agree to be bound by these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-indigo-500 pl-3 mb-4">Table of Contents</h2>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>Information We Collect</li>
              <li>Legal Basis for Data Processing</li>
              <li>How We Use Your Information</li>
              <li>Profile Photos</li>
              <li>Microphone Access</li>
              <li>Third-Party Services</li>
              <li>International Data Transfer</li>
              <li>Data Access and Sharing</li>
              <li>Data Security</li>
              <li>Data Retention and Deletion</li>
              <li>Data Breach Notification</li>
              <li>Your Rights</li>
              <li>Children's Privacy and Eligibility</li>
              <li>User Responsibilities</li>
              <li>Termination</li>
              <li>Intellectual Property</li>
              <li>Limitation of Liability</li>
              <li>Governing Law</li>
              <li>Changes to This Policy</li>
              <li>Disclaimer</li>
              <li>Contact Us</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-indigo-500 pl-3 mb-4">1. Information We Collect</h2>
            <p className="mb-4">
              When you create an account with TALKBrush, we collect the following personal information:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>Name</li>
              <li>Email address</li>
              <li>Mobile number (optional)</li>
              <li>Home suburb (optional)</li>
              <li>Company/organization you attend</li>
            </ul>
            <p className="mb-4">
              If you use our audio or profile features, we may also request access to your device's microphone, camera, or photo library. See below for how this information is used.
            </p>
            <p>
              We may also collect limited device and usage information (e.g., IP address, app version, crash logs) to improve app functionality.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-indigo-500 pl-3 mb-4">2. Legal Basis for Data Processing</h2>
            <p className="mb-4">
              We process your personal information based on the following legal grounds:
            </p>
            <ul className="list-disc list-inside space-y-3 ml-4">
              <li>
                <strong>Consent:</strong> We rely on your consent to collect and use optional or sensitive data, such as access to your microphone, camera, or photo library when using translation or related features. You can withdraw your consent at any time via your device settings or by contacting us.
              </li>
              <li>
                <strong>Legitimate Interest:</strong> We process your information to improve the performance of the TALKBrush app, analyze user engagement, develop new features, and ensure the security and stability of our services. We believe this use is proportionate, reasonable, and does not override your rights.
              </li>
              <li>
                <strong>Contract Fulfilment:</strong> Some personal data is processed to allow us to provide our core translation services, manage your account, process payments (if applicable), and fulfill the terms of service you agree to when using the app.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-indigo-500 pl-3 mb-4">3. How We Use Your Information</h2>
            <p className="mb-4">We use your information to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>Provide live translation services during conversations, meetings, or events.</li>
              <li>Enable you to manage your personal profile and access all app features.</li>
              <li>Share relevant details with authorised service providers or partners only when necessary to deliver or improve TALKBrush services.</li>
              <li>Monitor overall app usage trends and meet business performance indicators (KPIs). This may include (but is not limited to) tracking engagement with features and evaluating service quality.</li>
              <li>Monitor usage trends to improve app functionality and user experience.</li>
            </ul>
            <p>
              We do not collect personal data without your knowledge, and we only use the information for the purposes outlined in this document. We do not use your data for third-party advertising or sell your personal information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-indigo-500 pl-3 mb-4">4. Profile Photos</h2>
            <p className="mb-4">
              If you choose to upload a profile photo within TALKBrush, we may request access to your device's:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>Camera (to take a photo)</li>
              <li>Photo Library (to select an image)</li>
            </ul>
            <p className="mb-4">
              Adding a photo is optional and only used within your personal profile. It is not shared, published or used for marketing purposes.
            </p>
            <p>
              You may revoke this permission at any time via your device settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-indigo-500 pl-3 mb-4">5. Microphone Access</h2>
            <p className="mb-4">
              Microphone access is required to provide real-time <b>audio accent</b> directly to your device.
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>Access is used only during active translation sessions.</li>
              <li>Audio is not recorded, stored, or reused beyond what is necessary for real-time translation.</li>
            </ul>
            <p>
              You may withdraw microphone access at any time via device settings, however translation will not occur while this feature is disabled.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-indigo-500 pl-3 mb-4">6. Third-Party Services</h2>
            <p className="mb-4">
              TALKBrush uses the following third-party services strictly for core functionality:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li><strong>Microsoft Azure</strong> – Servers located in Melbourne, Australia, used to host core application services.</li>
              <li><strong>MongoDB Atlas (hosted by Amazon Web Services)</strong> – Database services located in Sydney, Australia, used to store and manage user data securely.</li>
            </ul>
            <p className="mb-4">
              These services are essential for delivering features such as real-time translation, speech-to-text, and text-to-speech functionality in response to user-initiated actions.
            </p>
            <p className="mb-4">
              We do <b>not</b> share your personal information (such as your name, email, or mobile number) with service providers for marketing, advertising, or any other secondary purposes. The data processed through these services is limited to what is necessary to fulfil your requests and ensure proper operation of the app.
            </p>
            <p>
              All data handling is performed in accordance with strict security and privacy standards.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-indigo-500 pl-3 mb-4">7. International Data Transfer</h2>
            <p className="mb-4">
              All personal data collected through the TALKBrush app is stored and managed on servers located <b>within Australia</b> (see "Section 6. Third-Party Services" for more details).
            </p>
            <p className="mb-4">
              While we do not store or process data on servers located outside Australia, users accessing the app from overseas may transmit data to our Australian servers. This means that cross-border data transfers may occur when international users interact with the app.
            </p>
            <p>
              We ensure that all such transfers are handled securely, using encrypted transmission protocols (e.g., TLS 1.2+) to protect your information as it is sent to our servers in compliance with applicable privacy laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-indigo-500 pl-3 mb-4">8. Data Access and Sharing</h2>
            <p className="mb-4">Your data is accessible only to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>Authorised TALKBrush staff and contractors who require access to deliver or improve the service.</li>
              <li>Trusted third-party service providers (such as cloud hosting, payment processing, or analytics services) strictly for operational purposes.</li>
            </ul>
            <p>
              All access to data is governed by strict confidentiality agreements and secured through appropriate technical and organisational measures.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-indigo-500 pl-3 mb-4">9. Data Security</h2>
            <p className="mb-4">
              We use industry-standard technical and organisational safeguards, including:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>TLS 1.2+ and SSL encryption for secure data transmission</li>
              <li>Data encryption at rest and in transit</li>
              <li>Role-based access control to limit internal data access</li>
              <li>Regular secure backups</li>
              <li>Authentication protocols to protect user accounts</li>
            </ul>
            <p>
              We continually assess and upgrade our security to match best practices; however, we are unable to guarantee absolute protection of data and metrics. TALKBrush cannot accept responsibility for the security or information you send to or receive from us over the Internet, or for any unauthorised access or use of that information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-indigo-500 pl-3 mb-4">10. Data Retention and Deletion</h2>
            <p className="mb-4">
              We retain your personal data only for as long as necessary for its intended purpose. You may delete your account by:
            </p>
            <div className="mb-4">
              <p className="font-semibold mb-2">Option 1: In-App</p>
              <ul className="list-disc list-inside ml-4 mb-3">
                <li>Go to Settings &gt; Account &gt; Delete Account</li>
              </ul>
              <p className="font-semibold mb-2">Option 2: By Email</p>
              <ul className="list-disc list-inside ml-4">
                <li>
                  Send a request to{" "}
                  <a
                    href="mailto:info@talkbrush.com"
                    className="text-indigo-600 font-semibold hover:underline"
                  >
                    info@talkbrush.com
                  </a>
                </li>                <li>Include your full name and registered email</li>
              </ul>
            </div>
            <p>
              Your data will be deleted within <b>30 days</b> unless we are legally required to retain it for a longer period.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-indigo-500 pl-3 mb-4">11. Data Breach Notification</h2>
            <p>
              In the event of a data breach which is considered likely to result in serious harm, we will notify affected users and the Office of the Australian Information Commissioner (OAIC) in accordance with the Notifiable Data Breaches (NDB) scheme.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-indigo-500 pl-3 mb-4">12. Your Rights</h2>
            <p className="mb-4">You have the right to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Access and correct your personal data</li>
              <li>Request deletion of your account and personal data</li>
              <li>Withdraw consent to data collection (e.g., camera, microphone)</li>
              <li>Lodge a complaint with the OAIC if you believe your data has been mishandled</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-indigo-500 pl-3 mb-4">13. Children's Privacy and Eligibility</h2>
            <p className="mb-4">
              You must be <b>at least 13 years old</b> to use the app. Users <b>under 18</b> must have parental or guardian consent.
            </p>
            <p>
              We do not knowingly collect data from children under 13. If we become aware of such data collection, we will prioritise deleting the information from our server.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-indigo-500 pl-3 mb-4">14. User Responsibilities</h2>
            <p className="mb-4">You agree to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Provide accurate and truthful information during sign-up</li>
              <li>Use the app only for lawful purposes and in accordance with these Terms</li>
              <li>Keep your login credentials secure</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-indigo-500 pl-3 mb-4">15. Termination</h2>
            <p className="mb-4">We may suspend or terminate your account if:</p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>You breach these Terms</li>
              <li>You misuse the services</li>
              <li>Termination is required for legal or security reasons</li>
            </ul>
            <p>
              If we suspend or terminate your account, it will be deleted from our servers. You may also delete your account at any time by contacting support or using the in-app settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-indigo-500 pl-3 mb-4">16. Intellectual Property</h2>
            <p>
              TALKBrush and its contents are the property of SMART NEURO DILIGENCE. All rights reserved. You may not copy, modify, or distribute any part of the app without written consent.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-indigo-500 pl-3 mb-4">17. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, <b>SMART NEURO DILIGENCE</b>, its staff, and app developers are not liable for indirect, incidental, or consequential damages arising from app use.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-indigo-500 pl-3 mb-4">18. Governing Law</h2>
            <p>
              These Terms are governed by the laws of South Australia, Australia. Disputes will be handled under the jurisdiction of South Australian courts.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-indigo-500 pl-3 mb-4">19. Changes to This Policy</h2>
            <p className="mb-4">
              We may revise these Terms and Privacy Policy from time to time.
            </p>
            <p className="mb-4">
              We will notify you of significant changes via the app or email, and the amended version will be made available on our website at{" "}
              <a
                href="https://talkbrush.com/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 font-semibold hover:underline"
              >
                https://talkbrush.com/privacy-policy
              </a>            </p>
            <p>
              Continued use of TALKBrush following notification of such changes will be taken as acceptance of the updated Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-indigo-500 pl-3 mb-4">20. Disclaimer</h2>
            <p>
              TALKBrush is provided "as is" and "as available". We do not guarantee uninterrupted service or completely accurate translations.
            </p>
          </section>

          <section className="bg-gray-50 p-6 rounded-lg border-l-4 border-indigo-500">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">21. Contact Us</h2>
            <p className="mb-4">
              If you have any questions, requests, or concerns regarding these Terms or our Privacy Policy, please contact us at:
            </p>
            <div className="space-y-2">
              <p>
                <strong>Email:</strong>{" "}
                <a
                  href="mailto:info@talkbrush.com"
                  className="text-indigo-600 font-semibold hover:underline"
                >
                  info@talkbrush.com
                </a>
              </p>              <p><strong>Mailing Address:</strong><br />
                TALKBrush c/o Smart Neuro Diligence<br />
                1-3 Cypress Gr, Mount Barker<br />
                South Australia, 5251<br />
                AUSTRALIA</p>
            </div>
            <p className="mt-4 text-sm text-gray-600">
              TALKBrush is developed and operated by <b>SMART NEURO DILIGENCE (ABN: 43808121024)</b>, an Australian registered company.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;