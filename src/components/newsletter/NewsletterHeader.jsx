const NewsletterHeader = ({year=new Date().toISOString()}) => {
  function formatToMonthYear(isoString) {
    const date = new Date(isoString);
    return date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  }

  const formattedDate = formatToMonthYear(year);

  return (
    <header className="flex flex-col">
      <div className="flex items-center justify-end">
        <div className="size-[1.3vh] bg-primary rounded-full"></div>
        <div className="w-[30%] h-[0.25vh] bg-primary"></div>
      </div>
      <div className="px-[5%] md:px-[10%] xl:px-[15%]">
        <p className="header-text self-end flex justify-end font-avenir-black ">
          <span className="text-gray-400">the</span>{" "}
          <span className="text-primary">suite</span>
          <span className="">letter</span>
          <span className="text-primary">.</span>
        </p>
        <div className="-mt-[2%] lg:-mt-[1%] flex items-center">
          <div className="flex items-center">
            <div className="size-[1.3vh] bg-primary rounded-full"></div>
            <div className="w-[2ch] lg:w-[5vh] h-[0.25vh] bg-primary"></div>
          </div>
          <p className="whitespace-nowrap flex-shrink-0 px-2 caption text-primary">
            {formattedDate}, issue
          </p>
          <div className="w-full h-[0.25vh] bg-primary"></div>
          <p className="whitespace-nowrap flex-shrink-0 px-2 caption text-gray-500">
            Fresh and Bright, Your Monthly Insight!
          </p>
        </div>
      </div>
    </header>
  );
};

export default NewsletterHeader;
