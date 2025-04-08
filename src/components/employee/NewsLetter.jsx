import React, { useState } from "react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

const EmployeeWorkshops = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setEmail("");
    }, 1000);
  };

  return (
    <div className="w-full mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <h1 className="text-2xl font-bold">NewsLetter</h1>
        <InformationCircleIcon className="h-5 w-5 text-gray-400" />
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex justify-center text-center items-center ">
          <img
            src="https://static.vecteezy.com/system/resources/thumbnails/026/112/779/small_2x/man-holds-newspaper-reading-news-about-latest-business-events-and-political-changes-or-financial-articles-businessman-with-newspaper-studying-economic-news-in-fresh-press-during-break-vector.jpg"
            alt="image"
            className="max-w-lg w-full h-72 object-cover rounded-2xl mb-4  flex"
          />
        </div>

        <h2 className="text-xl font-avenir-black mb-2">
          Subscribe to our NewsLetter!
        </h2>

        <p className="text-gray-600 text-sm mb-6">
          Lorem ipsum dolor sit amet ipsum consectetur adipiscing elit Ut et
          massa mi. Aliquam in hendrerit urna. Pellentque sit amet sapien.Lorem
          ipsum dolor sit amet consectetur hapsi Lorem ipsum dolor sit amet
          ipsum.
        </p>

        {isSubmitted ? (
          <div className="text-center py-4">
            <h3 className="text-lg font-medium text-primary mb-2">
              Thank you for subscribing!
            </h3>
            <p className="text-gray-600">
              We've sent a confirmation to your email.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <div className="text-md p-1 font-avenir-black">Your Email</div>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your work email here"
                className="w-full p-3 resize-none border rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary mb-4"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary/80 cursor-pointer text-white font-avenir-black py-3 px-4 rounded-md transition-colors"
            >
              {isSubmitting ? "SUBSCRIBING..." : "SUBSCRIBE"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default EmployeeWorkshops;
