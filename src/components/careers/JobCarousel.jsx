import React, { useState, useEffect } from "react";
import api from "../../utils/axios";
import JobPost from "./JobPost";
import { Swiper, SwiperSlide, useSwiperSlide } from "swiper/react";

import {
  Navigation,
  Pagination,
  EffectCoverflow,
  EffectCards,
} from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import "swiper/css/effect-cards";

// const jobs = [
//   {
//     title: "Software Developer",
//     employmentType: "Full-time",
//     salary: "50,000",
//     description:
//       "We are seeking a skilled Software Developer to join our team and contribute to the development of innovative software solutions. You will work on designing, coding, testing, and maintaining applications while collaborating with cross-functional teams to meet business and technical requirements. This role requires problem-solving skills, attention to detail, and a passion for technology.",
//     setup: "On-site",
//   },
//   {
//     title: "Project Manager",
//     employmentType: "Part-time",
//     description:
//       "Project manager needed to oversee software development projects. Must have experience with Agile methodologies and excellent communication skills.",
//     setup: "On-site",
//   },
//   {
//     title: "UX Designer",
//     employmentType: "Contract",
//     salary: "60,000",
//     description:
//       "Seeking a creative UX Designer to improve user experience for our web and mobile applications. Must have a strong portfolio and experience with Figma.",
//     setup: "On-site",
//   },
//   {
//     title: "Data Scientist",
//     employmentType: "Full-time",
//     salary: "70,000",
//     description:
//       "Data Scientist needed to analyze large datasets and provide insights to drive business decisions. Must have experience with Python and machine learning.",
//     setup: "On-site",
//   },
//   {
//     title: "DevOps Engineer",
//     employmentType: "Full-time",
//     description:
//       "DevOps Engineer needed to manage CI/CD pipelines and ensure smooth deployment of applications. Must have experience with AWS and Docker.",
//     setup: "On-site",
//   },
// ];

export default function JobCarousel() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await api.get("/api/all-jobs");

        setJobs(response.data.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchJobs();
  }, []);

  return (
    <>
      <Swiper
        effect={"coverflow"}
        grabCursor={false}
        draggable={false}
        allowTouchMove={false}
        centeredSlides={true}
        loop={jobs.length > 3}
        modules={[Navigation, Pagination, EffectCoverflow]}
        slidesPerView={2}
        // slidesPerGroup={1}
        autoplay={{ delay: 300 }}
        spaceBetween={0}
        // coverflowEffect={{ rotate: 0, stretch: 0, depth: 50, modifier: 0.25 }}
        pagination={{
          el: ".swiper-pagination",
          clickable: true,
          dynamicBullets: true,
        }}
        navigation
        className="flex flex-col justify-center max-w-4xl xl:max-w-5xl"
      >
        {jobs.map((job, index) => {
          return (
            <SwiperSlide key={index}>
              <JobPost {...job} />
            </SwiperSlide>
          );
        })}
        <div className="swiper-pagination"></div>
      </Swiper>
    </>
  );
}
