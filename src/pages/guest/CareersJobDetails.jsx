import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import MobileNav from "../../components/home/MobileNav.jsx";
import TabletNav from "../../components/home/TabletNav.jsx";
import DesktopNav from "../../components/home/DesktopNav.jsx";
import { toSlug } from "../../utils/slugUrl.js";
import BackToTop from "../../components/buttons/BackToTop.jsx";
import OnLoadLayoutAnimation from "../../components/layout/OnLoadLayoutAnimation";
import PageMeta from "../../components/layout/PageMeta.jsx";
import BackButton from "../../components/buttons/BackButton.jsx";
import atsAPI from "../../utils/atsAPI.js";

const CareersJobDetails = () => {
  const [jobDetails, setJobDetails] = useState(null);
  let location = useLocation();

  const [searchParams] = useSearchParams();
  const jobId = searchParams.get("id");
  const navigate = useNavigate();
  const previousPage = location.state?.from;

  // const handleBack = () => {
  //   if (previousPage?.startsWith("/careers/application-form/")) {
  //     navigate("/careers");
  //   } else if (previousPage) {
  //     navigate(-1);
  //   } else {
  //     navigate("/careers");
  //   }
  // };

  const handleBack = () => {
    if (location.key !== "default") {
      navigate(-1);
    } else {
      navigate("/careers");
    }
  };

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await atsAPI.get(`/jobs/details/${jobId}`);
        setJobDetails(response.data.data);
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
        imageUrl={"https://www.suitelifer.com/images/job-link-preview.webp"}
        url={`${location.pathname}${location.search}`}
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
            {/* {jobDetails.salaryMin != null && jobDetails.salaryMin != 0 && (
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
            )} */}
            <p className="text-body">{jobDetails.description}</p>
            <br />
            {jobDetails.responsibility && (
              <>
                <p className="text-primary text-body  font-avenir-black">
                  {jobDetails.responsibilityHeader ?? 'Responsibilities'}
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
                   {jobDetails.requirementHeader ?? 'Requirements'}
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
                    {jobDetails.qualificationHeader ?? 'Preferred Qualifications'}
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
              className={`mx-auto font-avenir-black ${
                jobDetails.isOpen === 1
                  ? "bg-primary cursor-pointer"
                  : "bg-gray-300 cursor-not-allowed"
              } mt-10 py-3 text-white rounded-xl min-w-70 md:min-w-100 mb-50 text-small`}
              type="button"
              disabled={jobDetails.isOpen === 0}
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
