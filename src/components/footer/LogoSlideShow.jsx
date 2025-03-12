import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import logoSOC from "../../assets/logos/logo-soc.svg";

const LogoSlideshow = ({ logos, size }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [logoSize, setLogoSize] = useState(size);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % logos.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [logos.length]);

  return (
    <div
      className={`w-${size} ${size} overflow-hidden flex items-center justify-center`}
    >
      <motion.img
        key={logos[currentIndex]}
        src={logos[currentIndex]}
        alt={`Logo ${currentIndex}`}
        className="w-full h-full object-cover"
        initial={{ opacity: 0.7, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0.7, scale: 0.95 }}
        transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
      />
    </div>
  );
};

const FetchLogos = ({ size }) => {
  const localLogos = [
    "https://images.credly.com/images/c01111e1-7226-4475-9efa-302fa24a453c/image.png",
    "https://www.sharetru.com/hs-fs/hubfs/webp%20compressed%20images%202023/soc2-badge.webp?width=600&height=500&name=soc2-badge.webp",
    "https://prepzo-production.s3.amazonaws.com/image/9886702a-a675-41b3-9519-9459de28546c/Cisco-Certified-Network-Associate-%28CCNA%29.png",
    "https://d1.awsstatic.com/training-and-certification/certification-badges/AWS-Certified-Solutions-Architect-Associate_badge.3419559c682629072f1eb968d59dea0741772c0f.png",
    "https://www.dumpscollection.net/template/eclike/dumpscollection.net/media/cert/heroku-architect.png",
    logoSOC,
  ];

  return <LogoSlideshow logos={localLogos} size={size} />;
};

export default FetchLogos;
