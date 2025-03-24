
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import termsOfUseimg from "../../assets/images/terms-of-use.jpg";

const TermsOfUseContent = () => {
  const sections = [
    { id: "acceptance-of-terms", title: "1. Acceptance of Terms" },
    { id: "use-of-content", title: "2. Use of Content" },
    { id: "user-conduct", title: "3. User Conduct" },
    { id: "privacy", title: "4. Privacy" },
    {
      id: "links-to-third-party-sites",
      title: "5. Links to Third-Party Sites",
    },
    { id: "disclaimer", title: "6. Disclaimer" },
    { id: "limitation-of-liability", title: "7. Limitation of Liability" },
    { id: "changes-to-terms", title: "8. Changes to Terms" },
    { id: "governing-law", title: "9. Governing Law" },
    { id: "contact-us", title: "10. Contact Us" },
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
                  src={termsOfUseimg}
                  alt="terms-of-use"
                  className="w-30 h-30"
                />
                <p className="-ml-9 text-3xl md:text-3xl lg:text-5xl font-avenir-black leading-none">
                  Terms of<span className="text-primary"> Use</span>
                </p>
              </div>
      
              <br />
        <div>
          <p className="text-gray-500 text-sm">
            Last Updated on March 03, 2023
          </p>
        </div>

        <div className="mt-5 lg:mt-10">
          Welcome to the FullSuite website. By using this website, you agree to
          comply with and be bound by the following terms and conditions of use.
          Please read these terms carefully before using the website. If you do
          not agree with these terms, please do not use this website.
        </div>

        <section id="acceptance-of-terms" className="mt-8">
          <h3 className="font-avenir-black">1. Acceptance of Terms</h3>
          <p className="text-gray-700 mt-2">
            By accessing or using this website, you acknowledge that you have
            read, understood, and agree to be bound by these terms of use. If
            you do not agree to these terms, please refrain from using the
            website.
          </p>
        </section>

        <section id="use-of-content" className="mt-8">
          <h3 className="font-avenir-black">2. Use of Content</h3>
          <p className="text-gray-700 mt-2">
            All content provided on this website is for informational purposes
            only. The content is the property of FullSuite and is protected by
            intellectual property laws. You may not reproduce, distribute,
            modify, or create derivative works from any content on this website
            without prior written consent from FullSuite.
          </p>
        </section>

        <section id="user-conduct" className="mt-8">
          <h3 className="font-avenir-black">3. User Conduct</h3>
          <p className="text-gray-700 mt-2">
            You agree to use this website only for lawful purposes and in a
            manner that does not infringe upon the rights of others. You shall
            not engage in any activity that disrupts or interferes with the
            functionality or security of the website.
          </p>
        </section>

        <section id="privacy" className="mt-8">
          <h3 className="font-avenir-black">4. Privacy</h3>
          <p className="text-gray-700 mt-2">
            Your use of this website is also governed by our{" "}
            <Link to={"/privacy-policy"} className="text-primary no-underline">
              Privacy Policy
            </Link>
            , which can be found here. Please review the{" "}
            <Link to={"/privacy-policy"} className="text-primary no-underline">
              Privacy Policy
            </Link>{" "}
            to understand how your personal information is collected, used, and
            protected.
          </p>
        </section>

        <section id="links-to-third-party-sites" className="mt-8">
          <h3 className="font-avenir-black">5. Links to Third-Party Sites</h3>
          <p className="text-gray-700 mt-2">
            This website may contain links to third-party websites. These links
            are provided for your convenience only, and FullSuite does not
            endorse or control the content of these linked sites. We are not
            responsible for the accuracy, legality, or quality of any content on
            third-party sites.
          </p>
        </section>

        <section id="disclaimer" className="mt-8">
          <h3 className="font-avenir-black">6. Disclaimer</h3>
          <p className="text-gray-700 mt-2">
            The content on this website is provided "as is" and without
            warranties of any kind, whether express or implied. FullSuite does
            not guarantee the accuracy, completeness, or reliability of the
            content. Your use of this website is at your own risk.
          </p>
        </section>

        <section id="limitation-of-liability" className="mt-8">
          <h3 className="font-avenir-black">7. Limitation of Liability</h3>
          <p className="text-gray-700 mt-2">
            To the extent permitted by law, FullSuite shall not be liable for
            any direct, indirect, incidental, consequential, or punitive damages
            arising from your use of this website.
          </p>
        </section>
        <section id="changes-to-terms" className="mt-8">
          <h3 className="font-avenir-black">8. Changes to Terms</h3>
          <p className="text-gray-700 mt-2">
            FullSuite reserves the right to modify these terms of use at any
            time without prior notice. It is your responsibility to review these
            terms periodically for updates. Your continued use of the website
            after any changes indicates your acceptance of the modified terms.
          </p>
        </section>
        <section id="governing-law" className="mt-8">
          <h3 className="font-avenir-black">9. Governing Law</h3>
          <p className="text-gray-700 mt-2">
            These terms of use are governed by and construed in accordance with
            the laws of the Philippines, without regard to its conflict of law
            principles.
          </p>
        </section>
        <section id="contact-us" className="mt-8">
          <h3 className="font-avenir-black">10. Contact Us</h3>
          <p className="text-gray-700 mt-2">
            If you have any questions or concerns about these terms of use,
            please contact us at{" "}
            <a
              href="mailto:infosec@fullsuite.ph"
              className="text-primary no-underline"
            >
              infosec@fullsuite.ph
            </a>
            .
          </p>
        </section>

        
      </div>
    </div>
  );
};

export default TermsOfUseContent;
