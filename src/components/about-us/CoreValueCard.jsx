const CoreValueCard = ({icon, text, className}) => {
  return (
    <div className={`${className} shadow-md bg-white hover:bg-primary group transition-all duration-300 aspect-square min-w-30 w-[30%] sm:w-[25%] lg:w-[15vw] rounded-2xl flex flex-col items-center justify-center gap-1`}>
      {icon}
      <p className="text-center text-[12px] sm:text-sm md:text-lg xl:text-xl p-2 text-primary group-hover:text-white">
        {text}
      </p>
    </div>
  );
};

export default CoreValueCard;
