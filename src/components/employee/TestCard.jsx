import { BookOpenIcon, ClockIcon } from "@heroicons/react/24/outline";

const TestCardComponent = ({ title, description, duration, isPrimary, text }) => {
  return (
    <div className="overflow-x-auto mb-10">
      <div className="rounded-lg p-6 shadow-sm flex flex-col h-full">
        <div className="mb-2 ">
          <BookOpenIcon className="size-5 text-pink-500" />
        </div>
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-gray-600 text-sm mb-4 flex-grow">{description}</p>
        <div className="flex items-center mb-4">
          <ClockIcon className="h-5 w-5 text-gray-500 mr-2" />
          <span className="text-gray-500 text-sm">{duration} min</span>
        </div>  
        <button
          className={`w-full py-2 px-4 rounded-full text-center transition-colors ${
            isPrimary
              ? "bg-pink-500 hover:bg-pink-600 text-white"
              : "bg-white border border-gray-300 hover:bg-gray-50 text-gray-800"
          }`}
        >
          {text}
        </button>
      </div>
    </div>
  );
};

export default TestCardComponent;
