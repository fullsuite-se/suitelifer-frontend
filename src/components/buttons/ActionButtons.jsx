const ActionButtons = ({ icon, handleClick }) => {
  return (
    <button className="flex p-2 hover:text-primary cursor-pointer" onClick={handleClick}>
      {icon}
    </button>
  );
};

export default ActionButtons;
