const ContentButtons = ({ icon, text, handleClick }) => {
  return (
    <button
      className="btn-primary rounded-md! flex items-center p-2 gap-2"
      onClick={handleClick}
    >
      {icon}
      <span className="hidden sm:flex flex-col">{text}</span>
    </button>
  );
};

export default ContentButtons;
