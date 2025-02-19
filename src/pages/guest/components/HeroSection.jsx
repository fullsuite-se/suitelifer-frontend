import image_01 from "../../../assets/images/image_01.svg";
import image_02 from "../../../assets/images/image_02.svg"
import image_03 from "../../../assets/images/image_03.svg"
import image_04 from "../../../assets/images/image_04.svg"
import logo_fs_full from "../../../assets/logos/logo-fs-full.svg"
import {
  ChevronDownIcon,
  MinusIcon,
  PlusIcon,
  CheckIcon,
  Bars2Icon
} from "@heroicons/react/24/outline";

const HeroSection = () => {
  return (
    <section className="Hero">
      {/* HERO SECTION */}
      <div className=" grid grid-cols-12 grid-rows-12 md:grid-rows-10 gap-5">
        {/* blue thingy */}
        <div className="blue-thingy bg-primary col-start-1 col-end-2 row-start-1 row-end-3 rounded-r-[20px] sm:rounded-r-[150px] md:rounded-r-[150px]"></div>
        {/* image 1 */}
        <div className="col-start-3 col-end-7 row-start-1 row-end-5">
          <img
            className="opacity-40 rounded-4xl w-full h-full object-cover"
            src={image_01}
            alt="A girl having a call"
          />
        </div>
        {/* image 2 */}
        <div className="col-start-7 col-end-13 row-start-1 row-end-5">
          <img
            className="rounded-l-4xl object-center w-full h-full object-cover"
            src={image_02}
            alt="Three developers"
          />
        </div>
        {/* image 3 */}
        <div className="col-start-2 col-end-12 row-start-5 row-end-13 md:row-end-11">
          <img
            className="rounded-4xl w-full h-full object-cover"
            src={image_03}
            alt="Two entrepreneurs"
          />
        </div>
        {/* image 4 */}
        <div className="col-start-12 col-end-13 row-start-5 row-end-9 md:row-end-8">
          <img
            className="rounded-l-4xl w-full h-full object-cover"
            src={image_04}
            alt="A company building"
          />
        </div>
        {/* green thingy */}
        <div className="bg-secondary opacity-70 col-start-12 col-end-13 row-start-9 row-end-13 rounded-l-4xl md:row-start-8 md:row-end-11"></div>
      </div>
    </section>
  );
};

export default HeroSection;
