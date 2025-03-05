import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    question: "How long is the hiring process?",
    answer:
      "Once you have sent your application and have attended all the interviews, we will be sending the full list of pre-employment requirements you will need.",
  },
  {
    question:
      "I am a first-time jobseeker, should I have my requirements ready before I apply?",
    answer:
      "Once you have sent your application and have attended all the interviews, we will be sending the full list of pre-employment requirements you will need.",
  },
  {
    question:
      "I got a low score in the Test-gorilla, does that mean I am no longer fit to apply?",
    answer:
      "Once you have sent your application and have attended all the interviews, we will be sending the full list of pre-employment requirements you will need.",
  },
  {
    question: "What are the pre-employment requirements needed?",
    answer:
      "Once you have sent your application and have attended all the interviews, we will be sending the full list of pre-employment requirements you will need.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 px-4 mb-20 lg:max-w-4xl xl:max-w-7xl">
      <h2 className="font-avenir-black text-lg md:text-xl text-primary">
        Frequently Asked Questions
      </h2>
      <div className="border-t border-primary">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b border-primary">
            <button
              className="flex justify-between items-center w-full py-4 text-left text-black font-avenir-black text-xs md:text-sm lg:text-base"
              onClick={() => toggleFAQ(index)}
            >
              <span>{faq.question}</span>
              {openIndex === index ? (
                <ChevronUp className="w-5 h-5 text-primary" />
              ) : (
                <ChevronDown className="w-5 h-5 text-primary" />
              )}
            </button>
            {openIndex === index && (
              <p className="px-4 pb-4 text-black text-xs md:text-sm lg:text-base">
                {faq.answer}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
