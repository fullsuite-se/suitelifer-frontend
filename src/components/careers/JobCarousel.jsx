import React from "react";
import JobPost from "./JobPost";

const job = {
  title: "Software Developer",
  employmentType: "Full-time",
  salary: "50,000",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam minus repudiandae sunt quisquam ipsa hic, facilis cumque distinctio maiores dignissimos, sequi tempore natus, necessitatibus dolores ducimus quod corrupti.",
};

export default function JobCarousel() {
  return <JobPost {...job} />;
}
