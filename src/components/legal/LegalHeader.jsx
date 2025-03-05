import { ArrowDown } from "lucide-react";

export default function LegalHeader({ image, heading, sectionId }) {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen">
      <img src={image} alt={heading} className="w-32 md:w-40 lg:w-48" />

      <p className="mt-10 text-3xl md:text-3xl lg:text-5xl font-avenir-black">
        {heading.split(" ").map((word, index) => (
          <span
            key={index}
            className={index === 1 ? "text-primary" : "text-black"}
          >
            {word}{" "}
          </span>
        ))}
      </p>

      <button
        onClick={() =>
          document
            .getElementById(sectionId)
            ?.scrollIntoView({ behavior: "smooth" })
        }
        className="mt-50 p-2 rounded-full hover:bg-primary/20 transition"
      >
        <div className="p-3 bg-white rounded-full shadow-md flex items-center justify-center">
          <ArrowDown className="text-primary w-6 h-6 animate-bounce" />
        </div>
      </button>
    </div>
  );
}
