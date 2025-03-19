import logoSOC from "../../assets/logos/logo-soc.svg";

const Certifications = () => {
  const localLogos = [
    "https://prepzo-production.s3.amazonaws.com/image/9886702a-a675-41b3-9519-9459de28546c/Cisco-Certified-Network-Associate-%28CCNA%29.png",
    "https://d1.awsstatic.com/training-and-certification/certification-badges/AWS-Certified-Solutions-Architect-Associate_badge.3419559c682629072f1eb968d59dea0741772c0f.png",
    logoSOC,
  ];

  const baseSize = 70;
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
