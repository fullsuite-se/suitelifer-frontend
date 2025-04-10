import { useState } from "react";

const PageToggle = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(0);

  const buttonBase =
    "px-4 py-2 rounded-lg cursor-pointer transition border text-sm w-full md:w-auto";
  const activeStyles = "bg-primary/10 text-primary font-avenir-black";
  const inactiveStyles = "border border-gray-300 bg-white";

  const ActiveComponent = tabs[activeTab].component;

  return (
    <div className="max-w-[1200px] mx-auto p-4">
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {tabs.map((tab, index) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(index)}
            className={`${buttonBase} ${
              activeTab === index ? activeStyles : inactiveStyles
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <ActiveComponent />
    </div>
  );
};

export default PageToggle;
