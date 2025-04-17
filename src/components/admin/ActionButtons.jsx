const ActionButtons = ({ icon, handleClick }) => {
  return (
    <button className="flex p-2" onClick={handleClick}>
      {icon}
    </button>
  );
};

export default ActionButtons;
