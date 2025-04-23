import { useState, useEffect } from "react";

import privacyPolicyimg from "../../assets/images/fingerprint-and-loupe.jpg";
const PrivacyPolicyContent = () => {
  const sections = [
    { id: "information-collection", title: "1. Information Collection" },
    { id: "use-of-information", title: "2. Use of Information" },
    { id: "data-security", title: "3. Data Security" },
    { id: "data-retention", title: "4. Data Retention" },
    { id: "third-party-disclosure", title: "5. Third-Party Disclosure" },
    { id: "your-rights", title: "6. Your Rights" },
    { id: "updates-policy", title: "7. Updates to the Policy" },
  ];

  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      let currentSection = "";
      sections.forEach((section) => {
        const element = document.getElementById(section.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            currentSection = section.id;
          }
        }
      });
      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="flex flex-col md:flex-row gap-6 px-7 pt-5 pb-5 lg:px-[50px] lg:pt-10 lg:pb-10">
      <div className="hidden md:block md:w-1/4 lg:w-1/5">
        <div className="sticky top-20 bg-white p-7 shadow-md rounded-xl w-fit min-w-[180px]">
          <h4 className="font-avenir-black text-gray-700">TABLE OF CONTENTS</h4>
          <ul className="mt-4 space-y-2 list-none!">
            {sections.map((section) => (
              <li key={section.id}>
                <button
                  onClick={() => {
                    const element = document.getElementById(section.id);
                    if (element) {
                      const offset = 80;
                      const elementPosition =
                        element.getBoundingClientRect().top + window.scrollY;
                      window.scrollTo({
                        top: elementPosition - offset,
                        behavior: "smooth",
                      });
                    }
                  }}
                  className={`block w-full text-left text-sm font-medium ${
                    activeSection === section.id
                      ? "text-primary font-bold"
                      : "text-gray-600"
                  } hover:text-primary`}
                >
                  {section.title}
                </button>
              </li>
            ))}
          </ul>
        
        </div>
      </div>

      <div className="md:w-3/4 md:mr-5 lg:w-4/5 lg:mr-15">
        <div className="flex items-center gap-3">
          <img
            src={privacyPolicyimg}
            alt="privacy-policy"
            className="w-15 h-15"
          />
          <p className="text-3xl md:text-3xl lg:text-5xl font-avenir-black leading-none">
            Privacy<span className="text-primary"> Policy</span>
          </p>
        </div>

        <br />
        <div>
          <p className="text-gray-500 text-sm">
            Last Updated on March 03, 2023
          </p>
        </div>

        <div className="mt-5 lg:mt-10">
          At FullSuite (“Company”), we are committed to protecting the privacy
          and security of your personal information. This Data Privacy Policy
          outlines how we collect, use, store, dispose and protect your personal
          data. By accessing our website and/or submitting your information
          directly to the Company, you agree and consent to the use, collection,
          processing, storage, and disposal of your personal data as outlined in
          this Privacy Policy. The Company is committed to being transparent
          about how it collects and uses that data and to meeting its data
          protection obligations.
        </div>

        <section id="information-collection" className="mt-8">
          <h3 className="font-avenir-black">1. Information Collection</h3>
          <p className="text-gray-700 mt-2">
            We collect the following personal information from clients through
            our website and forms. The Company may also collect personal data
            about you from third parties, who use tracking and analytic
            technology. We collect the following information from you:
          </p>
          <ul className="mt-2 text-gray-700 list-disc list-inside">
            <li>Name</li>
            <li>Email Address</li>
            <li>Phone Number</li>
            <li>Curriculum Vitae/Resume</li>
            <li>Web-behavior information while on our website</li>
          </ul>
        </section>

        <section id="use-of-information" className="mt-8">
          <h3 className="font-avenir-black">2. Use of Information</h3>
          <p className="text-gray-700 mt-2">
            The information you provide to Fullsuite will be used solely for
            providing the service that you expect from Fullsuite and for
            responding to your messages when you visit our Website. We may also
            use your information for statistical analysis and to improve our
            services.
          </p>
        </section>

        <section id="data-security" className="mt-8">
          <h3 className="font-avenir-black">3. Data Security</h3>
          <p className="text-gray-700 mt-2">
            FullSuite takes data security seriously and implements
            industry-standard measures to protect your personal information from
            unauthorized access, disclosure, or alteration. Access to your data
            is restricted to authorized personnel only.
          </p>
        </section>

        <section id="data-retention" className="mt-8">
          <h3 className="font-avenir-black">4. Data Retention</h3>
          <p className="text-gray-700 mt-2">
            Your personal information will be retained for as long as necessary
            to fulfill the purposes for which it was collected or as required by
            law.
          </p>
        </section>

        <section id="third-party-disclosure" className="mt-8">
          <h3 className="font-avenir-black">5. Third-Party Disclosure</h3>
          <p className="text-gray-700 mt-2">
            FullSuite may share your personal information with third-party
            service providers or partners. Fullsuite’s service providers act on
            its behalf. We have pronounced contractual terms with each service
            provider to protect the confidentiality and security of your
            information.
          </p>
        </section>

        <section id="your-rights" className="mt-8">
          <h3 className="font-avenir-black">6. Your Rights</h3>
          <p className="text-gray-700 mt-2">
            You have the right to be informed of the purpose, use, and
            collection of your data. You have the right to obtain a copy of,
            move, or transfer any personal information relating to you. You have
            the right to object or to withhold consent with regard to the
            collection and processing of personal information.You have the right
            to suspend, withdraw or order the blocking, removal or destruction
            of your personal information. You may claim compensation if you
            suffered damages due to inaccurate, incomplete, outdated, false,
            unlawfully obtained or unauthorized use of personal information,
            considering any violation of your rights and freedoms as data
            subject. You have the right to dispute and have corrected any
            inaccuracy or error in the personal information we process about
            you. If you feel that your personal information has been misused,
            maliciously disclosed, or improperly disposed of, or that any of
            your data privacy rights have been violated, you have a right to
            file a complaint with the National Privacy Commission of the
            Philippines. If you have any questions or concerns regarding your
            data, please contact our Data Protection Officer at{" "}
            <a
              href="mailto:dpo@fullsuite.ph"
              className="text-primary no-underline"
            >
              dpo@fullsuite.ph
            </a>
          </p>
        </section>

        <section id="updates-policy" className="mt-8">
          <h3 className="font-avenir-black">7. Updates to the Policy</h3>
          <p className="text-gray-700 mt-2">
            FullSuite reserves the right to update this Data Privacy Policy to
            reflect changes in our data practices or legal requirements. We
            encourage you to review this policy periodically for any updates. By
            continuing to use our website and providing your personal
            information, you acknowledge that you have read and understood this
            Data Privacy Policy and consent to the processing of your data as
            described herein. FullSuite reserves the right to update this Data
            Privacy Policy to reflect changes in our data practices or legal
            requirements. We encourage you to review this policy periodically
            for any updates.
          </p>
        </section>

       
      </div>
    </div>
  );
};

export default PrivacyPolicyContent;
