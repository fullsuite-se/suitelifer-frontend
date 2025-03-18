import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import api from "../../utils/axios.js";
import config from "../../config.js";
import MobileNav from "../../components/home/MobileNav.jsx";
import TabletNav from "../../components/home/TabletNav.jsx";
import DesktopNav from "../../components/home/DesktopNav.jsx";
import { toSlug } from "../../utils/slugUrl.js";
import BackToTop from "../../components/BackToTop.jsx";
import OnLoadLayoutAnimation from "../../components/layout/OnLoadLayoutAnimation";
import PageMeta from "../../components/layout/PageMeta.jsx";

const CareersJobDetails = () => {
  window.scroll(0, 0);

  const [jobDetails, setJobDetails] = useState(null);
  const location = useLocation();
  const { jobId } = location.state;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        console.log("Fetching job details for jobId:", jobId);

        console.log(config.apiBaseUrl);

        const response = await api.get(`/api/get-job-details/${jobId}`);
        setJobDetails(response.data.data);

        console.log(response.data.data);
      } catch (error) {
        console.error("Error fetching job details:", error);
      }
    };

    fetchJobDetails();
  }, []);

  useEffect(() => {
    if (jobDetails?.jobTitle) {
      const title = jobDetails?.jobTitle
        ? `${jobDetails.jobTitle} | Join Us at FullSuite`
        : "Job Opportunity | Suitelifer";
      document.title = title;
    }
  }, [jobDetails, location]);

  return (
    <>
      <PageMeta
        isDefer={true}
        title={
          jobDetails?.jobTitle
            ? `${jobDetails.jobTitle} | Join Us at FullSuite`
            : "Job Opportunity | Suitelifer"
        }
        description={jobDetails?.description}
      />
      {/* MOBILE NAV */}
      <div className="sm:hidden">
        <MobileNav />
      </div>
      {/* TABLET NAV */}
      <div className="tablet-nav">
        <TabletNav />
      </div>
      {/* DESKTOP NAV */}
      <div className="desktop-nav">
        <DesktopNav />
      </div>
      <div className="px-7 max-w-4xl mx-auto lg:flex lg:flex-col lg:pt-20 lg:h-lvh">
        <a href="/careers" className="text-primary no-underline text-xs">
          ← Back
        </a>
        {jobDetails ? (
          <div className="flex flex-col mt-5">
            <p className="font-avenir-black text-2xl">{jobDetails.jobTitle}</p>
            <p className="text-primary mb-2">
              | {jobDetails.industryName.toUpperCase()}
            </p>
            <p className="font-avenir-black text-primary mb-2">
              {jobDetails.employmentType}, {jobDetails.setupName}
            </p>
            {jobDetails.salaryMin != null && jobDetails.salaryMin != 0 && (
              <p className="text-xs mb-5">
                Expected Salary: <br />
                <span className="font-avenir-black text-xl text-primary">
                  {Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "PHP",
                    maximumFractionDigits: 0,
                  }).format(jobDetails.salaryMin)}
                  {jobDetails.salaryMax &&
                    " - " +
                      Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "PHP",
                        maximumFractionDigits: 0,
                      }).format(jobDetails.salaryMax)}
                </span>
              </p>
            )}
            <p>{jobDetails.description}</p>
            <br />
            {jobDetails.responsibility && (
              <>
                <p className="text-primary font-avenir-black">
                  Responsibilities:
                </p>
                <ul>
                  {jobDetails.responsibility
                    .split(/\.\s+|\n/)
                    .filter((responsibility) => responsibility.trim() !== "")
                    .map((responsibility, index, arr) => (
                      <li key={index}>
                        {responsibility.trim()}
                        {responsibility.trim().endsWith(".") ? "" : "."}{" "}
                      </li>
                    ))}
                </ul>
                <br />
              </>
            )}
            {jobDetails.requirement && (
              <>
                <p className="text-primary font-avenir-black">Requirements:</p>
                <ul>
                  {jobDetails.requirement
                    .split(/\.\s+|\n/)
                    .filter((requirement) => requirement.trim() !== "")
                    .map((requirement, index, arr) => (
                      <li key={index}>
                        {requirement.trim()}
                        {requirement.trim().endsWith(".") ? "" : "."}{" "}
                      </li>
                    ))}
                </ul>
                <br />
              </>
            )}
            {jobDetails.preferredQualification && (
              <>
                <p className="text-primary font-avenir-black">
                  Preferred Qualifications:
                </p>
                <ul>
                  {jobDetails.preferredQualification
                    .split(/\.\s+|\n/)
                    .filter(
                      (preferredQualification) =>
                        preferredQualification.trim() !== ""
                    )
                    .map((preferredQualification, index, arr) => (
                      <li key={index}>
                        {preferredQualification.trim()}
                        {preferredQualification.trim().endsWith(".")
                          ? ""
                          : "."}{" "}
                      </li>
                    ))}
                </ul>
                <br />
              </>
            )}
            <button
              className="cursor-pointer mx-auto font-avenir-black bg-primary py-2 text-white rounded-2xl min-w-52 mb-10"
              type="button"
              onClick={() => {
                navigate(
                  `/application-form/${jobId}/${toSlug(jobDetails.jobTitle)}`
                );
              }}
            >
              APPLY NOW
            </button>
          </div>
        ) : (
          <section className="grid place-content-center h-dvh">
            <OnLoadLayoutAnimation />
          </section>
        )}
      </div>
      <BackToTop />
    </>
  );
};

export default CareersJobDetails;
