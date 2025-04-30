import NewsArticle from "./NewsArticle";
import Issues from "./Issues";
import PageToggle from "../buttons/PageToggle";
import SuiteLetterLayout from "../../assets/images/suiteletter-section-layout.webp";
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import { AgGridReact } from "@ag-grid-community/react";
import { ModuleRegistry } from "@ag-grid-community/core";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-quartz.css";
import ContentButtons from "./ContentButtons";
import {
  CheckCircleIcon,
  BookmarkSquareIcon,
  InformationCircleIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  MinusCircleIcon,
  RectangleStackIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import emptyIllustration from "../../assets/images/empty-illustration.svg";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Popper,
  Paper,
  ClickAwayListener,
} from "@mui/material";
import YearFilterDropDown from "./NewsletterFilter";
import React, { useState, useEffect, useRef, useMemo, use } from "react";
import api from "../../utils/axios";
import { set } from "react-hook-form";
import formatTimestamp from "../../utils/formatTimestamp";
import { ArrowLeft } from "lucide-react";
import ActionButtons from "../buttons/ActionButtons";
import { useStore } from "../../store/authStore";
import toast from "react-hot-toast";
import ContentEditor from "../cms/ContentEditor";
import { useNavigate } from "react-router-dom";
import NewsletterHeader from "../newsletter/NewsletterHeader";
import { useAddAuditLog } from "./UseAddAuditLog";

ModuleRegistry.registerModules([ClientSideRowModelModule]);
function AdminNewsLetterToggle() {
  const [sectionsNewsletterByMonth, setSectionsNewsletterByMonth] = useState(
    []
  );
  const user = useStore((state) => state.user);
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const [selectedMonthlyIssue, setSelectedMonthlyIssue] = useState(null);
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [updateTrigger, setUpdateTrigger] = useState(Date.now());

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const [currentPublishedIssue, setCurrentPublishedIssue] = useState({});
  const [oldestIssue, setOldestIssue] = useState({});

  const [issues, setIssues] = useState([]);
  const [isNewestFirst, setIsNewestFirst] = useState(true);

  const [newslettersByMonth, setNewslettersByMonth] = useState([]);
  const [openIssueDialog, setOpenIssueDialog] = useState(false);
  const [isOpenArticleForm, setIsOpenArticleForm] = useState(false);
  const [prevClickedIssue, setPrevClickedIssue] = useState({});

  const [openSuiteletterLayoutInfoDialog, setOpenSuiteletterLayoutInfoDialog] =
    useState(false);

  const defaultArticleDetails = {
    newsletterId: "",
    title: "",
    article: "",
    pseudonym: "",
    section: 0,
  };

  const [articleDetails, setArticleDetails] = useState(defaultArticleDetails);

  const today = new Date();
  let initMonth = today.getMonth() + 2;
  let initYear = today.getFullYear();

  if (initMonth > 12) {
    initMonth = 1;
    initYear += 1;
  }

  const [currentIssue, setCurrentIssue] = useState({
    issueId: "",
    month: initMonth,
    year: initYear,
  });

  const monthOptions = useMemo(() => {
    return currentMonth === 12
      ? [0]
      : Array.from({ length: 12 - currentMonth }, (_, i) => currentMonth + i);
  }, [currentMonth]);

  const yearOptions = useMemo(() => {
    return currentMonth === 12 ? [currentYear, currentYear + 1] : [currentYear];
  }, [currentMonth, currentYear]);

  const handleSaveIssue = async () => {
    console.log("Saving issue:", currentIssue);
    if (!currentIssue.month || !currentIssue.year) {
      toast.error("Please select both month and year.");
      return;
    }
    if (currentIssue.month < currentMonth) {
      toast.error("You cannot select a month in the past.");
      return;
    }
    if (currentIssue.year < currentYear) {
      toast.error("You cannot select a year in the past.");
      return;
    }
    if (
      currentIssue.month === currentMonth &&
      currentIssue.year === currentYear
    ) {
      toast.error("You cannot select the current month.");
      return;
    }
    if (currentIssue.month > 12) {
      toast.error("Invalid month selected.");
      return;
    }
    if (currentIssue.year < 2000) {
      toast.error("Invalid year selected.");
      return;
    }
    if (currentIssue.month < 1) {
      toast.error("Invalid month selected.");
      return;
    }
    const newIssue = {
      ...currentIssue,
      userId: user.id,
    };
    let response;
    try {
      console.log("Sending to backend:", newIssue);

      response = await api.post("/api/issues", newIssue);
      console.log(response.data);

      if (response.data?.success) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message || "Failed to save issue.");
      }
    } catch (err) {
      if (err.response?.data?.month && err.response?.data?.year) {
        toast.error(
          `Issue for ${getMonthName(err.response.data.month)} ${
            err.response.data.year
          } already exists.`
        );
        return;
      } else {
        toast.error("An error occurred while saving. Please try again.");
      }
    }

    setSelectedYear(currentIssue.year);
    setUpdateTrigger(Date.now());
    setIsNewestFirst(true);
    setOpenIssueDialog(false);
  };

  const fetchNewsLettersByMonth = async (issueId) => {
    try {
      const response = await api.get("/api/newsletter?issueId=" + issueId);
      const fetchedNewslettersByMonth = response.data.newsletters;

      const sortedNewsletters = [...fetchedNewslettersByMonth].sort((a, b) => {
        const aNum = Number(a.section);
        const bNum = Number(b.section);

        const inRange = (n) => n >= 1 && n <= 7;

        if (inRange(aNum) && inRange(bNum)) {
          return aNum - bNum;
        } else if (inRange(aNum)) {
          return -1;
        } else if (inRange(bNum)) {
          return 1;
        } else {
          return aNum - bNum;
        }
      });

      setNewslettersByMonth(sortedNewsletters);
      const sectionsOfThisNewsletter = [
        ...new Set(
          fetchedNewslettersByMonth
            .map((newsletter) => newsletter.section)
            .filter((section) => section !== 0)
        )
      ];
      
      setSectionsNewsletterByMonth(sectionsOfThisNewsletter);      
      console.log("Sections of this newsletter:", sectionsOfThisNewsletter);
      console.log(sortedNewsletters);
    } catch (err) {
      console.log(err);
    }
  };

  const gridRef = useRef();

  const fetchIssuesByYear = async (year, isNewestFirst = true) => {
    try {
      const response = await api.get("/api/issues?year=" + year);
      let issues = response.data.issues;

      if (!isNewestFirst) {
        issues = issues.slice().reverse();
      }

      setIssues(issues);
    } catch (err) {
      console.log(err);
    }
  };

  const handleMonthClick = (monthlyIssue) => {
    setSelectedMonthlyIssue(monthlyIssue);
    fetchNewsLettersByMonth(monthlyIssue.issueId);
  };

  const handleAddEditArticle = (e) => {
    setIsOpenArticleForm(true);
  };

  const handleSortToggle = () => {
    setIsNewestFirst((prev) => !prev);
    fetchIssuesByYear(selectedYear, !isNewestFirst);
  };

  const fetchCurrentIssue = async () => {
    try {
      const response = await api.get("/api/issues/current");
      setCurrentPublishedIssue(response.data.currentIssue);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchOldestIssue = async () => {
    try {
      const response = await api.get("/api/issues/oldest");
      setOldestIssue(response.data.oldestIssue);
    } catch (err) {
      console.log(err);
    }
  };

  function getMonthName(monthNumber) {
    return months[monthNumber - 1];
  }

  useEffect(() => {
    fetchIssuesByYear(selectedYear);
    fetchCurrentIssue();
    fetchOldestIssue();
  }, [selectedYear, updateTrigger]);

  // dito article form functions
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [blogTitle, setBlogTitle] = useState("");
  const [blogDescription, setBlogDescription] = useState("");

  const refTitle = useRef();
  const refDesc = useRef();

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleTitleChange = (content) => {
    setBlogTitle(content);
  };

  const handleDescriptionChange = (content) => {
    setBlogDescription(content);
  };

  useEffect(() => {
    if (refTitle.current) {
      refTitle.current.innerHTML = blogTitle;
      refDesc.current.innerHTML = blogDescription;
    }
  }, [blogTitle, blogDescription]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!blogTitle.trim() || !blogDescription.trim()) {
      toast.error("Please fill in all fields.");

      return;
    }

    const eBlogData = {
      title: blogTitle,
      description: blogDescription,
    };

    return;

    const uploadBlog = async () => {
      try {
        const responseBlog = await api.post(
          "/api/add-employee-blog",
          eBlogData
        );
        const eblogId = responseBlog.data.eblog_id;
        const responseImg = await api.post(
          `/api/upload-image/blogs/${eblogId}`,
          imagesData
        );

        console.log("Blog uploaded successfully:", responseBlog.data);
        console.log("File uploaded successfully:", responseImg.data);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    };
    uploadBlog();
  };

  const handlePublishIssue = async () => {
    try {
    } catch (error) {}
  };

  const [editingData, setEditingData] = useState(null);

  const handleEditClick = (article) => {
    setEditingData(article);
  };

  const handleBackAfterSubmitForm = () => {
    setEditingData(null);
    setUpdateTrigger(Date.now());
    handleMonthClick(prevClickedIssue);
    setIsOpenArticleForm(false);
  };

  return (
    <div>
      {!selectedMonthlyIssue && !isOpenArticleForm ? (
        <>
          <h3>Currently Published Issue</h3>
          <div
            onClick={() => {
              handleMonthClick(currentPublishedIssue);
              setPrevClickedIssue(currentPublishedIssue);
            }}
            className="flex flex-row items-center justify-between bg-primary text-white p-4 rounded-lg mb-4 cursor-pointer hover:scale-101 hover:shadow-lg transition duration-300 ease-in-out"
          >
            <h3 className="font-avenir-black">
              {getMonthName(currentPublishedIssue.month) +
                " " +
                currentPublishedIssue.year}
            </h3>
            <div className="flex flex-row items-center justify-center gap-1">
              <RectangleStackIcon className="h-5 w-5 text-white" />
              <p className="-mb-1 font-avenir-black">
                {currentPublishedIssue.articleCount} articles
              </p>
            </div>
            <div className="flex flex-row items-center justify-center gap-1">
              <CheckCircleIcon className="h-5 w-5 text-white" />
              <p className="font-avenir-black">
                {currentPublishedIssue.assigned}/7 assigned
              </p>
            </div>
            <div className="flex flex-row items-center justify-center gap-1">
              <MinusCircleIcon className="h-5 w-5 text-white" />
              <p className="font-avenir-black">
                {currentPublishedIssue.unassigned} unassigned
              </p>
            </div>
            <ArrowRightIcon className="h-5 w-5 text-white" />
          </div>
          <div className="py-3"></div>
          <div className="flex flex-row items-center justify-between">
            <h3>All Issues</h3>
            {/* <InformationCircleIcon className="w-5 h-5 text-primary cursor-pointer" /> */}

            <InformationCircleIcon
              className="w-5 h-5 text-primary cursor-pointer"
              ref={anchorRef}
              onClick={() => setOpen((prev) => !prev)}
            />
          </div>
          <div className="flex flex-row items-center justify-between">
            <div className="flex justify-start items-center">
              <div className="bg-primary/20 rounded-md text-white pr-4 flex items-center cursor-pointer">
                <YearFilterDropDown
                  startYear={oldestIssue.year}
                  endYear={currentYear}
                  selectedYear={selectedYear}
                  onYearChange={setSelectedYear}
                />
              </div>
              <div
                className="flex flex-row items-center justify-center gap-1 ml-4 text-gray-500 cursor-pointer text-xs"
                onClick={handleSortToggle}
              >
                <div>
                  {isNewestFirst ? (
                    <ArrowDownIcon className="h-4 w-4" />
                  ) : (
                    <ArrowUpIcon className="h-4 w-4" />
                  )}
                </div>
                <div>{isNewestFirst ? "Newest first" : "Oldest first"}</div>
              </div>
            </div>
            <div
              className="cursor-pointer"
              onClick={() => {
                setOpenIssueDialog(true);
                setCurrentIssue({ issueId: "", month: "", year: "" });
              }}
            >
              <p className="font-avenir-black text-primary  ">
                + Add new issue
              </p>
            </div>
          </div>
          <div className="py-5"></div>
          {issues.length > 0 ? (
            <div className="flex flex-wrap justify-center lg:justify-start gap-10 p-1">
              {issues.map((issue) => (
                <div
                  key={issue.issueId}
                  onClick={() => {
                    handleMonthClick(issue);
                    setPrevClickedIssue(issue);
                    console.log("ETOOOO: ");
                    console.log(issue);
                  }}
                >
                  <div
                    className={`group border ${
                      issue.is_published
                        ? "border-primary border-2 "
                        : "border-gray-500/50"
                    } p-5 rounded-xl flex flex-col cursor-pointer hover:shadow-lg transition duration-300 ease-in-out hover:scale-101`}
                  >
                    <div className="flex flex-row justify-start items-center gap-2">
                      <div
                        className={`w-2 h-2 ${
                          issue.assigned < 7 && !issue.is_published
                            ? "bg-orange-400"
                            : issue.assigned >= 7 && !issue.is_published
                            ? "bg-primary"
                            : "bg-green-700"
                        } rounded-full`}
                      ></div>
                      <p className="font-avenir-black text-body">
                        {getMonthName(issue.month)}
                      </p>
                    </div>
                    <div className="py-2"></div>
                    <div className="flex flex-col gap-2 pr-20">
                      <div className="flex flex-row justify-start items-center gap-2 text-gray-400">
                        <RectangleStackIcon className="h-4 w-4 " />
                        <p className=" text-xs">
                          {issue.articleCount} articles
                        </p>
                      </div>
                      <div className="flex flex-row justify-start items-center gap-2 text-gray-400">
                        <CheckCircleIcon className="h-4 w-4 " />
                        <p className=" text-xs">
                          {issue.assigned}
                          /7 assigned
                        </p>
                      </div>
                      <div className="flex flex-row justify-start items-center gap-2 text-gray-400">
                        <MinusCircleIcon className="h-4 w-4 " />
                        <p className=" text-xs">
                          {issue.unassigned} unassigned
                        </p>
                      </div>
                    </div>
                    <div className="py-3"></div>
                    <div className="w-full justify-end flex ">
                      <p className="text-xs scale-90 text-gray-400 font-avenir-roman-oblique ">
                        created on{" "}
                        {formatTimestamp(issue.issueCreatedAt).fullDate}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid place-content-center px-5 text-center text-small text-gray-400 min-h-70 my-7">
              <img
                src={emptyIllustration}
                alt="No issues illustration"
                className="w-auto h-30 mx-auto mb-6"
              />
              <p>No issues have been published for this selected year.</p>
            </div>
          )}
          {/* <div className="py-15"></div> */}
          {/* <PageToggle tabs={tabs} /> */}
          <Popper
            open={open}
            anchorEl={anchorRef.current}
            placement="bottom-start"
          >
            <ClickAwayListener onClickAway={() => setOpen(false)}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 2,
                  border: "1px solid #E7E7E7",
                  mt: 1,
                  width: 220,
                  bgcolor: "white",
                  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.08)",
                }}
              >
                <p className="font-avenir-black mb-3  text-small">LEGEND</p>

                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <Box
                    width={12}
                    height={12}
                    borderRadius="50%"
                    bgcolor="green"
                  />
                  <p className=" font-avenir-roman text-xs text-gray-500">
                    Currently Published
                  </p>
                </Box>

                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <Box
                    width={12}
                    height={12}
                    borderRadius="50%"
                    bgcolor="#0097A7"
                  />
                  <p className=" font-avenir-roman text-xs text-gray-500">
                    Complete/Ready to Publish
                  </p>
                </Box>

                <Box display="flex" alignItems="center" gap={1}>
                  <Box
                    width={12}
                    height={12}
                    borderRadius="50%"
                    bgcolor="#F57C00"
                  />
                  <p className=" font-avenir-roman text-xs text-gray-500">
                    In Progress/Incomplete
                  </p>
                </Box>
              </Paper>
            </ClickAwayListener>
          </Popper>
          <Dialog
            open={openIssueDialog}
            onClose={(event, reason) => {
              if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
                setOpenIssueDialog(false);
              }
            }}
            fullWidth
            disableEscapeKeyDown={true}
            sx={{
              "& .MuiDialog-paper": {
                width: "600px",
                height: "auto",
                maxHeight: "90vh",
              },
            }}
          >
            <DialogTitle>
              {currentIssue.issueId ? "Edit Issue" : "Add New Issue"}
            </DialogTitle>
            <DialogContent>
              <div className="mb-4">
                <label className="block text-gray-700 font-avenir-black">
                  Year<span className="text-primary">*</span>
                </label>
                <select
                  value={currentIssue.year}
                  onChange={(e) =>
                    setCurrentIssue({
                      ...currentIssue,
                      year: parseInt(e.target.value),
                    })
                  }
                  className="w-full p-3 mt-2 border rounded bg-primary/10 focus:ring-2 focus:ring-primary"
                >
                  <option value="" hidden>
                    Select year
                  </option>
                  {yearOptions.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-avenir-black">
                  Month<span className="text-primary">*</span>
                </label>
                <select
                  value={currentIssue.month}
                  onChange={(e) =>
                    setCurrentIssue({
                      ...currentIssue,
                      month: parseInt(e.target.value),
                    })
                  }
                  className="w-full p-3 mt-2 border rounded bg-primary/10 focus:ring-2 focus:ring-primary"
                >
                  <option value="" hidden>
                    Select month
                  </option>
                  {monthOptions.map((monthIndex) => (
                    <option key={monthIndex} value={monthIndex + 1}>
                      {months[monthIndex]}
                    </option>
                  ))}
                </select>
              </div>
            </DialogContent>

            <DialogActions>
              <button
                className="btn-light"
                onClick={() => setOpenIssueDialog(false)}
              >
                Cancel
              </button>
              <button className="btn-primary" onClick={handleSaveIssue}>
                Save
              </button>
            </DialogActions>
          </Dialog>
        </>
      ) : selectedMonthlyIssue && !isOpenArticleForm ? (
        <>
          <div className="py-5"></div>
          <div className="flex flex-row items-center justify-between">
            <button
              onClick={() => handleMonthClick(null)}
              className="group cursor-pointer flex items-center gap-2 text-primary text-xss transition active:font-avenir-black"
            >
              <ArrowLeft size={15} />
              <span className="mt-1 group-hover:font-avenir-black">Back</span>
            </button>
            {prevClickedIssue.is_published === 0 ? (
              <button
                onClick={handlePublishIssue}
                disabled={selectedMonthlyIssue.assigned < 7}
                className={`flex gap-2   font-avenir-black p-2 px-3  items-center rounded-md transition ${
                  selectedMonthlyIssue.assigned === 7
                    ? "cursor-pointer bg-primary text-white hover:bg-primary/90"
                    : "cursor-not-allowed bg-gray-300 text-gray-200"
                }`}
              >
                <BookmarkSquareIcon className="size-5" />
                <span className="hidden sm:flex flex-col">
                  Publish this issue
                </span>
              </button>
            ) : (
              <></>
            )}
          </div>
          <div className="py-2"></div>
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row justify-start items-center gap-2">
              <div
                className={`w-2 h-2  ${
                  selectedMonthlyIssue.assigned < 7 &&
                  !selectedMonthlyIssue.is_published
                    ? "bg-orange-400"
                    : selectedMonthlyIssue.assigned >= 7 &&
                      !selectedMonthlyIssue.is_published
                    ? "bg-primary"
                    : "bg-green-700"
                } rounded-full`}
              ></div>
              <h3 className="font-avenir-black">
                {getMonthName(selectedMonthlyIssue.month) +
                  " " +
                  selectedMonthlyIssue.year}{" "}
                {/* <span className="text-sm text-gray-500 font-avenir-roman">
                  ({selectedMonthlyIssue.articleCount})
                </span> */}
                <span className="text-sm text-green-700 font-avenir-roman">
                  {!selectedMonthlyIssue.is_published
                    ? ""
                    : "(Currently Published)"}
                </span>
              </h3>
              <InformationCircleIcon
                className="w-4 h-4 text-gray-500 cursor-pointer"
                onClick={() =>
                  setOpenSuiteletterLayoutInfoDialog((prev) => !prev)
                }
              />
            </div>
            <div onClick={(e) => handleAddEditArticle(e)}>
              {" "}
              <p className="font-avenir-black text-primary cursor-pointer ">
                + Add new article
              </p>
            </div>
          </div>
          <div className="py-1"></div>
          <section className=" mb-4 grid grid-cols-1 sm:grid-cols-3 grid-rows-[5rem] [&>*]:bg-white [&>*]:border [&>*]:border-gray-300 gap-4">
            <div className="rounded-md grid place-content-center ">
              <span className="text-small font-avenir-black text-primary text-center">
                Total
              </span>
              <div className="text-body  text-black text-center">
                {selectedMonthlyIssue.articleCount}
              </div>
            </div>
            <div className="rounded-md grid place-content-center">
              <span className="text-small font-avenir-black text-gray-500 text-center">
                Assigned
              </span>
              <div className="text-body text-black text-center">
                {selectedMonthlyIssue.assigned}/7
              </div>
            </div>
            <div className="rounded-md grid place-content-center">
              <span className="text-small font-avenir-black text-gray-500 text-center">
                Unassigned
              </span>
              <div className="text-body text-black text-center">
                {selectedMonthlyIssue.unassigned}
              </div>
            </div>
          </section>
          <div className="py-1"></div>
          <div
            className="ag-theme-quartz min-w-[600px] lg:w-full "
            style={{ height: "500px", width: "100%" }}
          >
            <AgGridReact
              enableBrowserTooltips={true}
              ref={gridRef}
              rowData={newslettersByMonth}
              columnDefs={[
                {
                  headerName: "Title",
                  field: "title",
                  flex: 3,
                  tooltipField: "title",
                  headerClass: "text-primary font-bold bg-gray-100",
                },
                {
                  headerName: "Article",
                  field: "article",
                  flex: 3,
                  headerClass: "text-primary font-bold bg-gray-100",
                  tooltipField: "article",
                  valueFormatter: (params) =>
                    params.value?.replace(/<[^>]+>/g, ""),
                  cellStyle: {
                    display: "block",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    whiteSpace: "normal",
                  },
                },
                {
                  headerName: "Author",
                  field: "pseudonym",
                  flex: 1,
                  tooltipField: "author",
                  headerClass: "text-primary font-bold bg-gray-100",
                },
                {
                  headerName: "Section",
                  field: "section",
                  flex: 1,
                  headerClass: "text-primary font-bold bg-gray-100",
                  valueFormatter: (params) =>
                    params.value === 0 ? "Unassigned" : params.value,
                },
                {
                  headerName: "Date Created",
                  field: "createdAt",
                  flex: 2,
                  headerClass: "text-primary font-bold bg-gray-100",
                  valueGetter: (params) =>
                    params.data?.createdAt
                      ? new Date(params.data.createdAt).toLocaleString()
                      : "N/A",
                },

                {
                  headerName: "Action",
                  field: "action",
                  flex: 1,
                  headerClass: "text-primary font-bold bg-gray-100",
                  cellRenderer: (params) => (
                    <div className="flex">
                      <ActionButtons
                        icon={<PencilIcon className="size-5 cursor-pointer" />}
                        // handleClick={() => handleEdit(params.data)}
                      />
                      <ActionButtons
                        icon={<TrashIcon className="size-5 cursor-pointer" />}
                        // handleClick={() => handleDelete(params.data.faq_id)}
                      />
                    </div>
                  ),
                },
              ]}
              defaultColDef={{
                filter: "agTextColumnFilter",
                floatingFilter: true,
                sortable: true,
                cellStyle: {
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "left",
                },
              }}
              pagination
              paginationPageSize={10}
              paginationPageSizeSelector={[5, 10, 20, 50]}
            />
          </div>{" "}
          <div className="py-20"></div>
        </>
      ) : (
        <>
          {/* DITO ANG FORM ADDING/EDITING ARTICLE */}
          {/* <section className="h-[100vh] overflow-auto"> */}
          <section>
            <div className="py-5"></div>
            <button
              onClick={() => {
                handleMonthClick(prevClickedIssue);
                setIsOpenArticleForm(false);
              }}
              className="group cursor-pointer flex items-center gap-2 text-primary text-xss transition active:font-avenir-black"
            >
              <ArrowLeft size={15} />
              <span className="mt-1 group-hover:font-avenir-black">Back</span>
            </button>
            <div className="py-2"></div>
            <div className="flex items-center justify-between ">
              <div className="flex items-center gap-2">
                <h2 className="font-avenir-black">Add New Article</h2>
                <InformationCircleIcon
                  className="w-4 h-4 text-gray-500 cursor-pointer"
                  onClick={() =>
                    setOpenSuiteletterLayoutInfoDialog((prev) => !prev)
                  }
                />
              </div>
              <span
                onClick={() => {
                  handleMonthClick(prevClickedIssue);
                  setIsOpenArticleForm(false);
                }}
                className="font-avenir-black text-red-700 text-sm cursor-pointer"
              >
                Cancel
              </span>
            </div>

            <section>
              <ContentEditor
              sectionsNewsletterByMonth={sectionsNewsletterByMonth}
                handleBackAfterSubmitForm={handleBackAfterSubmitForm}
                editingData={editingData}
                handleFileChange={handleFileChange}
                handleTitleChange={handleTitleChange}
                handleDescriptionChange={handleDescriptionChange}
                handleSubmit={handleSubmit}
                type={"newsletter"}
                issueId={selectedMonthlyIssue.issueId}
                user={user}
              />
            </section>

            <div className="pb-40"></div>
          </section>
          {/* DITO ANG END NG ADDING/EDITING FORM NG NEWS ARTICLE */}
        </>
      )}{" "}
      <Dialog
        open={openSuiteletterLayoutInfoDialog}
        onClose={() => setOpenSuiteletterLayoutInfoDialog(false)}
        fullWidth
        disableEscapeKeyDown={false}
        sx={{
          "& .MuiDialog-paper": {
            width: "600px",
            height: "auto",
            maxHeight: "90vh",
            borderRadius: "0.75rem",
          },
        }}
      >
        <DialogTitle>
          {" "}
          <span className="flex flex-row items-center">
            <InformationCircleIcon className="w-6 h-6 text-gray-500 " />
            &nbsp; Suiteletter Section Layout
          </span>
        </DialogTitle>
        <DialogContent>
          <div className="p-2">
            {" "}
            <p className="text-sm text-gray-500">
              Preview the newsletter layout. Articles will appear in the section
              you assign (1–7).
            </p>
            <div className="py-1"></div>
            <div>
              <img
                src={SuiteLetterLayout}
                alt="suiteletter layout"
                className="border border-gray-300 rounded-md h-auto "
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AdminNewsLetterToggle;
