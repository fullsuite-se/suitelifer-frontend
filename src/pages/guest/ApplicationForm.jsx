import React, { useCallback, useEffect, useState } from "react";
import MobileNav from "../../components/home/MobileNav";
import TabletNav from "../../components/home/TabletNav";
import DesktopNav from "../../components/home/DesktopNav";
import BackButton from "../../components/buttons/BackButton";
import { useNavigate, useParams } from "react-router-dom";
import BackToTop from "../../components/buttons/BackToTop";
import { unSlug } from "../../utils/slugUrl";
import atsAPI from "../../utils/atsAPI";
import api from "../../utils/axios";
import toast from "react-hot-toast";
import { useDropzone } from "react-dropzone";
import { DocumentPlusIcon } from "@heroicons/react/24/solid";
import { ArrowUpOnSquareIcon } from "@heroicons/react/24/solid";
import { DocumentTextIcon } from "@heroicons/react/24/solid";
import {
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  GoogleReCaptchaProvider,
  useGoogleReCaptcha,
} from "react-google-recaptcha-v3";
import ModalConfirmApplication from "../../components/modals/ModalConfirmApplication";
import LoadingAnimation from "../../components/loader/Loading";

const Form = () => {
  const navigate = useNavigate();
  const { id, jobPosition } = useParams();
  const [referralInputName, setReferralInputName] = useState("");
  const [referrerName, setReferrerName] = useState("");
  const [agree, setAgree] = useState(false);

  const defaultApplicationDetails = {
    first_name: "",
    middle_name: "",
    last_name: "",
    email_1: "",
    gender: null,
    birth_date: null,
    mobile_number_1: "",
    discovered_at: "",
    applied_source: "COMPANY_WEBSITE",
    referrer_name: referrerName,
    position_id: id,
    test_result: null,
    created_by: null,
    updated_by: null,
    cv_link: "",
  };

  const [applicationDetails, setApplicationDetails] = useState(
    defaultApplicationDetails
  );

  const { executeRecaptcha } = useGoogleReCaptcha();

  // const handleApplicationDetailsChange = (e) => {
  //   setApplicationDetails((ad) => ({ ...ad, [e.target.name]: e.target.value }));
  // };

  const handleApplicationDetailsChange = (e) => {
    const { name, value } = e.target;

    if (name === "referrer_name") {
      setShowReferralInput(value === "REFERRAL");

      setApplicationDetails((ad) => ({
        ...ad,
        referrer_name:
          value === "REFERRAL" ? `REFERRAL (${referralInputName})` : value,
      }));
    } else if (name === "referral_input") {
      setReferralInputName(value);

      setApplicationDetails((ad) => ({
        ...ad,
        referrer_name: `REFERRAL (${value})`,
      }));
    } else {
      setApplicationDetails((ad) => ({
        ...ad,
        [name]: value,
      }));
    }
  };

  // =========== START: drag and drop using dropzone ===========

  const [CV, setCV] = useState(null);
  const [isFileTooLarge, setIsFileTooLarge] = useState(false);
  const [isFileRemovedOnce, setIsFileRemovedOnce] = useState(false);
  const MAX_FILE_SIZE = 10 * 1024 * 1024;

  const onDrop = useCallback((acceptedFiles) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      if (selectedFile.size > MAX_FILE_SIZE) {
        setIsFileTooLarge(true);
        return;
      }
      setIsFileTooLarge(false);
      setIsFileRemovedOnce(false);
      setCV(selectedFile);
    }
  }, []);

  const { getRootProps, acceptedFiles, getInputProps, isDragActive } =
    useDropzone({
      onDrop,
      maxFiles: MAX_FILE_SIZE,
    });

  const formatFileSize = (size) => {
    if (size < 1024) return `${size} B`; // Bytes
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`; // Kilobytes
    return `${(size / (1024 * 1024)).toFixed(1)} MB`; // Megabytes
  };
  // ============================= END =============================

  const [showReferralInput, setShowReferralInput] = useState(false);

  const uploadFile = async () => {
    const formData = new FormData();
    formData.append("file", CV);

    const upload_response = await atsAPI.post("/upload/gdrive/cv", formData);

    applicationDetails.cv_link = upload_response.data.fileUrl;
  };

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmitApplication = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    if (!executeRecaptcha) {
      toast.error("reCAPTCHA is not ready.");
      return;
    }

    // Recaptcha Verifcation
    const recaptchaToken = await executeRecaptcha("application");
    const recaptcha = await api.post("/api/verify-recaptcha", {
      recaptchaToken: recaptchaToken,
    });

    if (recaptcha.status !== 200) {
      toast.error(recaptcha.data.message);
      return;
    }

    // VALIDATE CV
    if (CV === null) {
      setIsFileRemovedOnce(true);
      toast.error("Please attach your CV");
      setIsLoading(false);
      setAgree(false);
      return;
    }

    try {
      const duplicateResponse = await atsAPI.post(
        "/applicants/check/check-existing",
        {
          applicant: JSON.stringify(applicationDetails),
        }
      );

      if (duplicateResponse.data.isExisting) {
        // SET RE-OPEN MODAL TRUE
        return setConfirmModalIsOpen(true);
      } else {
        await uploadFile();

        const response = await atsAPI.post("/applicants/add", {
          applicant: JSON.stringify({
            ...applicationDetails,
            mobile_number_1: "09" + applicationDetails.mobile_number_1,
          }),
        });

        console.log(response.data.message);

        if (response.data.message === "Successfully inserted") {
          const res = await atsAPI.post("/jobs/assessment-url", {
            job_id: id,
          });

          const assessmentUrl = res.data.data.assessmentUrl;

          toast.success("Job Application Successful.");

          navigate("/congrats-application-form", { state: { assessmentUrl } });
        }
      }
    } catch (err) {
      console.log("Unable to Submit Application Job", err);
      toast.error("Job Application Unsuccessful.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatSource = (source) => {
    return source
      .toLowerCase()
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const [confirmModalIsOpen, setConfirmModalIsOpen] = useState(false);

  const handleConfirm = async () => {
    try {
      await uploadFile();

      const response = await atsAPI.post("/applicants/pending", {
        applicant: JSON.stringify(applicationDetails),
      });

      if (response.status === 201) {
        toast.success("Thank you! We’ll be in touch with you soon.");

        navigate("/careers");
      } else {
        toast.error("Something went wrong. Try again later.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmitApplication}
        className="space-y-4 text-sm p-6 md:p-12 lg:p-15 shadow-sm border-primary border-1  rounded-lg bg-white"
      >
        {isLoading ? <LoadingAnimation /> : <> </>}
        <p className="!text-lg lg:!text-2xl font-avenir-black mb-10">
          Job Application Form
          <span className="font-avenir-roman"> - {unSlug(jobPosition)}</span>
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-700 font-avenir-black">
              First Name<span className="text-primary">*</span>
            </label>
            <input
              type="text"
              name="first_name"
              value={applicationDetails.first_name}
              onChange={handleApplicationDetailsChange}
              required
              className="w-full p-3 border-none rounded-md bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-avenir-black">
              Middle Name
            </label>
            <input
              type="text"
              name="middle_name"
              value={applicationDetails.middle_name}
              onChange={handleApplicationDetailsChange}
              className="w-full p-3 border-none rounded-md bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-avenir-black">
              Last Name<span className="text-primary">*</span>
            </label>
            <input
              type="text"
              name="last_name"
              value={applicationDetails.last_name}
              onChange={handleApplicationDetailsChange}
              required
              className="w-full p-3 border-none rounded-md bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:mt-5">
          <div>
            <label className="block text-gray-700 font-avenir-black">
              Email Address<span className="text-primary">*</span>
            </label>
            <input
              type="email"
              name="email_1"
              value={applicationDetails.email_1}
              onChange={handleApplicationDetailsChange}
              required
              className="w-full p-3 border-none rounded-md bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="relative">
            {" "}
            <label className="block text-gray-700 font-avenir-black">
              Phone Number<span className="text-primary">*</span>
            </label>
            <input
              type="tel"
              name="mobile_number_1"
              value={applicationDetails.mobile_number_1}
              onChange={handleApplicationDetailsChange}
              required
              maxLength="9"
              pattern="[0-9]{9}"
              placeholder="Enter 9-digit number"
              className="w-full p-3 pl-15 border-none rounded-md  text-gray-700   bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="absolute left-3 top-[65%]   -translate-y-1/2  text-gray-700  flex items-center  space-x-1 font-avenir-black">
              <span>🇵🇭&nbsp;</span>
              <span>09</span>
            </div>
          </div>
        </div>
        <div className="md:col-span-2 mt-10">
          <label className="block text-gray-700 font-avenir-black">
            How did you discover Fullsuite?
            <span className="text-primary">*</span>
          </label>
          <div className="flex flex-col gap-3 mt-3">
            {[
              "INDEED",
              "LINKEDIN",
              "SOCIAL_MEDIA",
              "COMPANY_WEBSITE",
              "REFERRAL",
              "CAREER_FAIR",
              "JOBSTREET",
              "PODCAST",
            ].map((option) => (
              <label key={option} className="flex items-center">
                <input
                  type="radio"
                  name="referrer_name"
                  value={option}
                  required
                  className="text-primary focus:ring-primary"
                  onChange={(e) => {
                    setShowReferralInput(option === "REFERRAL");
                    handleApplicationDetailsChange(e);
                  }}
                />
                <span className="ml-2 text-gray-700">
                  {formatSource(option)}
                </span>
              </label>
            ))}
          </div>

          {showReferralInput && (
            <div className="mt-3">
              <label className="block text-gray-700 font-avenir-black">
                Who referred you?<span className="text-primary">*</span>
              </label>
              <input
                type="text"
                name="referral_input"
                required={showReferralInput}
                value={referralInputName}
                onChange={handleApplicationDetailsChange}
                className="w-full p-3 border-none rounded-md bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          )}
        </div>
        {/* DAN: DRAG AND DROP */}
        <label className="block mt-10 text-gray-700 font-avenir-black mb-3">
          Upload your Curriculum Vitae here:{" "}
          <span className="text-primary">*</span>
        </label>
        {!CV && (
          <>
            <div
              className={`drop-zone ${
                isDragActive ? "bg-primary/10" : ""
              } hover:bg-primary/10 cursor-pointer p-10 border ${
                isFileRemovedOnce && !isDragActive
                  ? "border-[#d63e50] hover:bg-[#d63e50]/10"
                  : "border-primary"
              }  text-primary border-dashed rounded-lg`}
              {...getRootProps()}
            >
              <></>
              <input
                type="file"
                {...getInputProps()}
                accept=".pdf,.doc,.docx"
              />
              {isDragActive ? (
                <div className="flex flex-col items-center justify-center">
                  <ArrowUpOnSquareIcon className="size-15" />
                  <span className="text-center mt-5">Drop your file here</span>
                </div>
              ) : (
                <>
                  {isFileRemovedOnce ? (
                    <div className="flex flex-col items-center justify-center text-[#d63e50]">
                      <DocumentPlusIcon className="size-15" />
                      <span className="text-center mt-5">
                        Please click here to upload your CV or drag and drop it
                        here
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center">
                      <DocumentPlusIcon className="size-15" />
                      <span className="text-center mt-5">
                        Click here to upload your CV or drag and drop it here
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
            {/* FILE CONSTRAINTS MESSAGE */}
            <div className="flex justify-between text-gray-400 ">
              <span className="flex ">
                {" "}
                <ExclamationCircleIcon className="size-5  text-primary/70" />
                &nbsp;Supported files: .pdf
              </span>
              <span>Maximum size: 10MB</span>
            </div>
            {/* ERROR MESSAGE */}
            <div
              id="file-error"
              className={`${isFileTooLarge ? "block" : "hidden"}`}
            >
              <p className="flex gap-2 text-yellow-600/80 text-sm">
                <ExclamationTriangleIcon className="size-5" /> Oops! Your file
                is too large. Please upload a smaller file.
              </p>
            </div>
          </>
        )}
        {/* PREVIEW */}
        {CV != null ? (
          <div className="flex flex-col bg-gray-100/50 p-4 gap-2 rounded-md">
            <div className="flex justify-between">
              <div className="flex gap-4">
                <div className="flex justify-center items-center bg-white aspect-square px-2 rounded-md">
                  <DocumentTextIcon className="size-5 text-primary" />
                </div>
                <div className="flex flex-col">
                  <p className="font-avenir-black">{CV.name}</p>
                  <p className="text-gray-500">{formatFileSize(CV.size)}</p>
                </div>
              </div>
              <button
                type="button"
                className="hover:bg-white duration-500 rounded-full h-fit p-1"
                onClick={() => {
                  setCV(null);
                  setIsFileTooLarge(false);
                  setIsFileRemovedOnce(true);
                }}
              >
                <XMarkIcon className="size-5 cursor-pointer" />
              </button>
            </div>
          </div>
        ) : (
          ""
        )}
        {/* Drag and Drop Files */}
        <div className="py-2"></div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="accent-primary w-4 h-4 cursor-pointer"
          />
          <span>
            I have read and accept the{" "}
            <a
              href="/terms-of-use"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary no-underline"
            >
              Terms of Use
            </a>{" "}
            and{" "}
            <a
              href="/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary no-underline"
            >
              Privacy Policy
            </a>
            .
          </span>
        </div>
        <div className="py-2"></div>
        <button
          type="submit"
          disabled={!agree || isLoading}
          className={`w-full font-avenir-black py-3 rounded-md transition ${
            agree
              ? "cursor-pointer bg-primary text-white hover:bg-primary/90"
              : "cursor-not-allowed bg-gray-300 text-gray-200"
          }`}
        >
          SUBMIT APPLICATION
        </button>
        <button
          type="button"
          className="w-full cursor-pointer text-primary py-3 rounded-md hover:bg-primary/10 transition"
          onClick={() => navigate(-1)}
        >
          CANCEL
        </button>{" "}
      </form>
      <ModalConfirmApplication
        isOpen={confirmModalIsOpen}
        handleClose={() => {
          setConfirmModalIsOpen(false);
        }}
        onConfirm={handleConfirm}
        message="You already have an application in progress. Would you prefer to start a new one?"
      />
    </>
  );
};

const ApplicationForm = () => {
  const { id, jobPosition } = useParams();

  return (
    <GoogleReCaptchaProvider reCaptchaKey={import.meta.env.VITE_RECAPTCHA_SITE}>
      <section
        className="gap-4 h-dvh"
        style={{ maxWidth: "1800px", margin: "0 auto" }}
      >
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
        {/* BLOGS HERO */}
        <section className="pt-[10%] xl:pt-[8%]">
          <main className="px-[5%]">
            <div className="md:px-5 lg:px-20 xl:px-50">
              {" "}
              <BackButton
                type={unSlug(jobPosition) + " Details"}
                backPath={-1}
                jobId={id}
              />
              <div className="py-5"></div>
              <Form />
            </div>
          </main>
        </section>
        <div className="h-30"></div>
        <BackToTop />
      </section>
    </GoogleReCaptchaProvider>
  );
};

export default ApplicationForm;
