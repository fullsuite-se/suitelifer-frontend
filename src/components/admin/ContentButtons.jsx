
const ContentButtons = ({ icon, text, handleClick }) => {
  return (

    <button
    className="btn-primary flex items-center p-2 gap-2"
    onClick={handleClick}
  >
    {icon}
    <span className="hidden sm:flex">{text}</span>
  </button>
  );
};

export default ContentButtons;
