import { BookOpenIcon, ClockIcon } from "@heroicons/react/24/outline";

const TestCardComponent = ({ title, description, url }) => {
  return (
    <div className="overflow-x-auto">
      <div className="rounded-lg p-6 shadow-sm flex flex-col h-full ">
        <div className="mb-2 ">
          <BookOpenIcon className="size-5 text-pink-500" />
        </div>
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-5">
          {description}
        </p>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={url}
          className="w-full py-2 px-4 rounded-full text-center text-black border border-black/25 hover:bg-accent-2 hover:text-white no-underline cursor-pointer"
        >
          Go to Test
        </a>
      </div>
    </div>
  );
};

export default TestCardComponent;
