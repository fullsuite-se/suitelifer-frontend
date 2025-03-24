import logoSOC from "../../assets/logos/logo-soc.svg";

const Certifications = () => {
  const localLogos = [
    logoSOC,
  ];

  const baseSize = 80;
  const minSize = 30;
  const calculatedSize = Math.max(minSize, baseSize - localLogos.length * 5);

  return (
    <div className="flex justify-end items-center flex-wrap gap-4 ">
      {localLogos.map((logo, index) => (
        <img
          key={index}
          src={logo}
          alt={`Certification ${index + 1}`}
          className="transition-all duration-300"
          style={{ width: `${calculatedSize}px`, height: `${calculatedSize}px` }}
        />
      ))}
    </div>
  );
};

export default Certifications;
