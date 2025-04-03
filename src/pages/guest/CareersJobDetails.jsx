import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import config from "../../config.js";
import MobileNav from "../../components/home/MobileNav.jsx";
import TabletNav from "../../components/home/TabletNav.jsx";
import DesktopNav from "../../components/home/DesktopNav.jsx";
import { toSlug } from "../../utils/slugUrl.js";
import BackToTop from "../../components/BackToTop.jsx";
import OnLoadLayoutAnimation from "../../components/layout/OnLoadLayoutAnimation";
import PageMeta from "../../components/layout/PageMeta.jsx";
import BackButton from "../../components/BackButton.jsx";
import atsAPI from "../../utils/atsAPI.js";

const CareersJobDetails = () => {
  const [jobDetails, setJobDetails] = useState(null);
  const location = useLocation();
  const { jobId } = location.state;
  const navigate = useNavigate();
  const previousPage = location.state?.from;

  const handleBack = () => {
    if (previousPage?.startsWith("/careers/application-form/")) {
      console.log("Navigating back to careers page");
      navigate("/careers");
    } else if (previousPage) {
      console.log("Navigating back to:", previousPage);
      navigate(-1);
    } else {
      console.log("No previous page, going to careers");
      navigate("/careers"); // Default fallback if no previous state
    }
  };

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        console.log("Fetching job details for jobId:", jobId);

        console.log(config.apiBaseUrl);

        const response = await atsAPI.get(`/jobs/details/${jobId}`);
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
      <div className="pt-[10%] xl:pt-[8%] px-7 max-w-3xl! mx-auto lg:flex lg:flex-col lg:h-lvh md:max-w-2xl! lg:max-w-4xl!">
        <BackButton backPath={handleBack} />
        {jobDetails ? (
          <div className="flex flex-col mt-5">
            <p className="font-avenir-black text-h6 flex items-center gap-2">
              {jobDetails.jobTitle}
              {jobDetails.isOpen === 0 && (
                <span className="font-avenir-roman bg-red-100 text-red-700 text-xss font-bold px-3 py-1 rounded-xl">
                  CLOSED
                </span>
              )}
            </p>

            <p className=" mb-2  text-gray-400 text-xss">
              <span className="text-secondary font-avenir-black">|</span>{" "}
              {jobDetails.industryName.toUpperCase()}
            </p>
            <p className="text-primary mb-2 text-small">
              {jobDetails.employmentType}, {jobDetails.setupName}
            </p>
            {jobDetails.salaryMin != null && jobDetails.salaryMin != 0 && (
              <div className="mb-5">
                {" "}
                <p className="text-xss text-gray-500">Expected Salary: </p>
                <span className="font-avenir-black text-body text-primary">
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
              </div>
            )}
            <p className="text-body">{jobDetails.description}</p>
            <br />
            {jobDetails.responsibility && (
              <>
                <p className="text-primary text-body  font-avenir-black">
                  Responsibilities:
                </p>
                <ul className="text-body">
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
                <p className="text-primary text-body font-avenir-black">
                  Requirements:
                </p>
                <ul className="text-body">
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
                <p className="text-primary text-body font-avenir-black">
                  Preferred Qualifications:
                </p>
                <ul className="text-body">
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
              className="cursor-pointer mx-auto font-avenir-black bg-primary mt-10 py-3 text-white rounded-xl min-w-70 md:min-w-100 mb-50 text-small"
              type="button"
              onClick={() => {
                navigate(
                  `/careers/application-form/${jobId}/${toSlug(
                    jobDetails.jobTitle
                  )}`
                );
              }}
            >
              APPLY NOW
            </button>
          </div>
        ) : (
          <section className="grid place-conte`nt-center h-dvh">
            <OnLoadLayoutAnimation />
          </section>
        )}
      </div>
      <BackToTop />
    </>
  );
};

export default CareersJobDetails;
