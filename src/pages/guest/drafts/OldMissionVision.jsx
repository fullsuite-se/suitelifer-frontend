<section className="flex justify-center mb-[5%] md:mb-0 md:pb-[0%]">
<div  className="grid grid-cols-2 grid-rows-2 px-[5%] lg:max-h-[1600px]">
  {/* Mission Image */}
  <section id="our-mission">
    <div className="flex justify-end absolute md:relative">
      <div className="-translate-x-[20%] md:translate-y-[10%] md:translate-x-[10%] bg-primary/50 p-[5%] max-h-[800px] rounded-2xl lg:rounded-4xl size-[50vw] md:aspect-4/3">
        <img
          className="w-full h-full rounded-lg lg:rounded-2xl object-cover"
          src={imgMeeting}
          alt="Mission image"
        />
      </div>
    </div>
  </section>

  {/* Mission Text */}
  <article  className=" mission-vision-text flex flex-col justify-center items-start text-end">
    <div className="md:pl-[14%] pl-[0%]">
      <p className="blue-text uppercase font-avenir-black text-primary">
        FullSuite Mission
      </p>
      <p className="title font-avenir-black">
        {content.missionSlogan}
      </p>
      <p className="description">{content.mission}</p>
    </div>
  </article>

  {/* Vision Text */}
  <section id="our-vision">
    <article className="pt-[15%] -mr-7 md:mr-1 md:pt-[18%] lg:pt-[23%] md:pr-[13%] mission-vision-text flex flex-col justify-start items-start text-start">
      <p className="blue-text uppercase w-full font-avenir-black text-primary">
        Fullsuite Vision
      </p>
      <p className="title font-avenir-black w-full">
        {content.visionSlogan}
      </p>
      <p className="description">{content.vision}</p>
    </article>
  </section>
  {/* Vision Image */}
  <section>
    <div className="flex absolute md:relative overflow-hidden md:overflow-visible">
      <div className="translate-x-[20%] md:-translate-y-[10%] md:-translate-x-[10%] bg-[#DFE8CF] p-[5%] max-h-[800px] rounded-2xl lg:rounded-4xl size-[50vw] md:aspect-4/3">
        <img
          className="w-full h-full rounded-lg lg:rounded-2xl object-cover"
          src={imgBuilding}
          alt="Mission image"
        />
      </div>
    </div>
  </section>
</div>
</section>