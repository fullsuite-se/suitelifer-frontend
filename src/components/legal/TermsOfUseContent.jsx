import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import termsOfUseimg from "../../assets/images/terms-of-use.jpg";
import toast from "react-hot-toast";
import api from "../../utils/axios";

const TermsOfUseContent = () => {
  const [terms, setTerms] = useState([]);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const response = await api.get("/api/get-all-terms");
        setTerms(response.data.terms);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch Terms of Use");
      }
    };
    fetchTerms();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      let currentSection = "";
      terms.forEach((term) => {
        const element = document.getElementById(`term-${term.terms_id}`);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            currentSection = `term-${term.terms_id}`;
          }
        }
      });
      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [terms]);

  return (
    <div className="flex flex-col md:flex-row gap-6 px-7 pt-5 pb-5 lg:px-[50px] lg:pt-10 lg:pb-10">
      <div className="hidden md:block md:w-1/4 lg:w-1/5">
        <div className="sticky top-20 bg-white p-7 shadow-md rounded-xl w-fit min-w-[180px]">
          <h4 className="font-avenir-black text-gray-700">TABLE OF CONTENTS</h4>
          <ul className="mt-4 space-y-2 list-none!">
            {terms.map((term) => (
              <li key={term.terms_id}>
                <button
                  onClick={() => {
                    const element = document.getElementById(
                      `term-${term.terms_id}`
                    );
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
                    activeSection === `term-${term.terms_id}`
                      ? "text-primary font-bold"
                      : "text-gray-600"
                  } hover:text-primary`}
                >
                  {term.title}
                </button>
              </li>
            ))}
            <li>
              <button
                onClick={() => {
                  const element = document.getElementById("contact-us");
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
                  activeSection === "contact-us"
                    ? "text-primary font-bold"
                    : "text-gray-600"
                } hover:text-primary`}
              ></button>
            </li>
          </ul>
        </div>
      </div>

      <div className="md:w-3/4 md:mr-5 lg:w-4/5 lg:mr-15">
        <div className="flex items-center gap-3">
          <img src={termsOfUseimg} alt="terms-of-use" className="w-30 h-30" />
          <p className="-ml-9 text-3xl md:text-3xl lg:text-5xl font-avenir-black leading-none">
            Terms of<span className="text-primary"> Use</span>
          </p>
        </div>

        <p className="text-gray-500 text-sm mt-3">
          Last Updated on March 03, 2023
        </p>

        <div className="mt-5 lg:mt-10">
          Welcome to the FullSuite website. By using this website, you agree to
          comply with and be bound by the following terms and conditions. Please
          read them carefully.
        </div>

        {terms.map((term, index) => (
          <section
            key={term.terms_id}
            id={`term-${term.terms_id}`}
            className="mt-8"
          >
            <h3 className="font-avenir-black">{`${index + 1}. ${
              term.title
            }`}</h3>
            <div
              className="text-gray-700 mt-2 whitespace-pre-line"
              dangerouslySetInnerHTML={{
                __html: term.description,
              }}
            />
          </section>
        ))}
      </div>
    </div>
  );
};

export default TermsOfUseContent;
