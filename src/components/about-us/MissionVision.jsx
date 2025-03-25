const MissionVision = ({ imgMission, imgVision, missionSlogan, visionSlogan, missionContent, visionContent }) => {
    return (
      <div className="flex flex-col lg:flex-row justify-center items-center lg:items-start gap-16 p-10 relative">
        <div className="text-center max-w-md space-y-4">
          <img src={imgMission} alt="Mission Icon" className="mx-auto h-20 mb-4" />
          <h2 className="text-xl font-avenir-black">
            OUR <span className="text-[#0097B2]">MISSION</span>
          </h2><br />
          <h3 className="font-avenir-black mt-4">{missionSlogan}</h3>
          <p className="mt-4 text-gray-600 text-base sm:text-lg md:text-xl  leading-7 md:leading-10 ">
            {missionContent}
          </p>
        </div>
        
        <div className="hidden lg:block w-px h-150 mx-8 bg-gradient-to-b from-transparent via-[#0097B2] -mt-10 to-transparent"></div>
        
        
        <div className="text-center max-w-md space-y-4">
          <img src={imgVision} alt="Vision Icon" className="mx-auto h-20 mb-4" />
          <h2 className="text-xl  font-avenir-black">
            OUR <span className="text-[#0097B2]">VISION</span>
          </h2><br />
          <h3 className="font-avenir-black mt-4">{visionSlogan}</h3>
          <p className="mt-4 text-gray-600 text-base sm:text-lg md:text-xl leading-7 md:leading-10 ">
           {visionContent}
          </p>
        </div>
      </div>
    );
  };
  
  export default MissionVision;