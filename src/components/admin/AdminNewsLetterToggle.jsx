import React from "react";
import NewsArticle from "./NewsArticle";
import Issues from "./Issues";
import PageToggle from "./PageToggle";
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import { AgGridReact } from "@ag-grid-community/react";
import { ModuleRegistry } from "@ag-grid-community/core";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-quartz.css";

import {
  DocumentIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  MinusCircleIcon,
  RectangleStackIcon,
  PlusCircleIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import emptyIllustration from "../../assets/images/empty-illustration.svg";
import {
  Modal,
  TextField,
  Typography,
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
import { useState, useEffect, useRef } from "react";
import api from "../../utils/axios";
import { set } from "react-hook-form";
import formatTimestamp from "../TimestampFormatter";
import { ArrowLeft } from "lucide-react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ActionButtons from "./ActionButtons";
import { useStore } from "../../store/authStore";
import toast from "react-hot-toast";
ModuleRegistry.registerModules([ClientSideRowModelModule]);
function AdminNewsLetterToggle() {
  const user = useStore((state) => state.user);
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const [selectedMonthlyIssue, setSelectedMonthlyIssue] = useState(null);
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const [selectedYear, setSelectedYear] = useState(currentYear);
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
  const [currentIssue, setCurrentIssue] = useState({
    issueId: "",
    month: "",
    year: "",
  });

  const yearOptions = [currentYear];
  if (currentMonth === 12) {
    yearOptions.push(currentYear + 1);
  }

  const monthOptions =
    currentMonth === 12
      ? [0]
      : Array.from({ length: 12 - currentMonth }, (_, i) => currentMonth + i);

  const handleSaveIssue = async () => {
    if (currentIssue.issueId) {
      // try {
      //   console.log("Sending to backend:", currentIssue);
      //   const response = await api.post("/api/edit-faq", {
      //     ...currentIssue,
      //     user_id: user.id,
      //   });
      //   console.log(response.data);
      //   if (response.data?.success) {
      //     toast.success(response.data.message);
      //   } else {
      //     toast.error(response.data.message || "Failed to update faq.");
      //   }
      //   setDataUpdated(!dataUpdated);
      // } catch (err) {
      //   console.error(err.message);
      // }
    } else {
      const newIssue = {
        ...currentIssue,
        userId: user.id,
      };
      try {
        console.log("Sending to backend:", newIssue);

        const response = await api.post("/api/issues", newIssue);
        console.log(response.data);

        if (response.data?.success) {
          toast.success(response.data.message);
        } else {
          toast.error(response.data.message || "Failed to save issue.");
        }
      } catch (err) {
        console.error(err.message);
      }
      setSelectedYear(2025);
    }

    setCurrentIssue({ issueId: "", month: "", year: "" });
    setOpenIssueDialog(false);
  };

  const fetchNewsLettersByMonth = async (issueId) => {
    try {
      const response = await api.get("/api/newsletter?issueId=" + issueId);
      const fetchedNewslettersByMonth = response.data.newsletters;
      setNewslettersByMonth(fetchedNewslettersByMonth);
      console.log(fetchedNewslettersByMonth);
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

  useEffect(() => {
    fetchIssuesByYear(selectedYear);
    fetchCurrentIssue();
    fetchOldestIssue();
  }, [selectedYear]);

  const tabs = [
    { label: "Issues", component: Issues },
    { label: "News Article", component: NewsArticle },
  ];

  const sampleNewsLetterList = [
    {
      id: 1,
      month: "January",
      year: "2025",
      is_published: 1,
      created_at: "2025-01-01",
      created_by: "admin",
      newsletterList: [
        {
          newsletter_id: 1,
          newsletter_title: "Sample Title 1",
          newsletter_article: "Sample Content 1",
          newsletter_image: "sample-image-1.jpg",
          newsletter_created_at: "2025-01-01",
          newsletter_pseudonym: "admin",
          newsletter_section: 1,
        },
        {
          newsletter_id: 2,
          newsletter_title: "Sample Title 2",
          newsletter_article: "Sample Content 2",
          newsletter_image: "sample-image-2.jpg",
          newsletter_created_at: "2025-01-01",
          newsletter_pseudonym: "admin",
          newsletter_section: 2,
        },
        {
          newsletter_id: 3,
          newsletter_title: "Sample Title 3",
          newsletter_article: "Sample Content 3",
          newsletter_image: "sample-image-3.jpg",
          newsletter_created_at: "2025-01-01",
          newsletter_pseudonym: "admin",
          newsletter_section: 3,
        },
        {
          newsletter_id: 4,
          newsletter_title: "Sample Title 4",
          newsletter_article: "Sample Content 4",
          newsletter_image: "sample-image-4.jpg",
          newsletter_created_at: "2025-01-01",
          newsletter_pseudonym: "admin",
          newsletter_section: 4,
        },
        {
          newsletter_id: 5,
          newsletter_title: "Sample Title 5",
          newsletter_article: "Sample Content 5",
          newsletter_image: "sample-image-5.jpg",
          newsletter_created_at: "2025-01-01",
          newsletter_pseudonym: "admin",
          newsletter_section: 5,
        },
        {
          newsletter_id: 6,
          newsletter_title: "Sample Title 6",
          newsletter_article: "Sample Content 6",
          newsletter_image: "sample-image-6.jpg",
          newsletter_created_at: "2025-01-01",
          newsletter_pseudonym: "admin",
          newsletter_section: 6,
        },
        {
          newsletter_id: 7,
          newsletter_title: "Sample Title 7",
          newsletter_article: "Sample Content 7",
          newsletter_image: "sample-image-7.jpg",
          newsletter_created_at: "2025-01-01",
          newsletter_pseudonym: "admin",
          newsletter_section: 7,
        },
        {
          newsletter_id: 8,
          newsletter_title: "Sample Title 8",
          newsletter_article: "Sample Content 8",
          newsletter_image: "sample-image-8.jpg",
          newsletter_created_at: "2025-01-01",
          newsletter_pseudonym: "admin",
          newsletter_section: null,
        },
        {
          newsletter_id: 9,
          newsletter_title: "Sample Title 9",
          newsletter_article: "Sample Content 9",
          newsletter_image: "sample-image-9.jpg",
          newsletter_created_at: "2025-01-01",
          newsletter_pseudonym: "admin",
          newsletter_section: null,
        },
        {
          newsletter_id: 10,
          newsletter_title: "Sample Title 10",
          newsletter_article: "Sample Content 10",
          newsletter_image: "sample-image-10.jpg",
          newsletter_created_at: "2025-01-01",
          newsletter_pseudonym: "admin",
          newsletter_section: null,
        },
      ],
    },
    {
      id: 2,
      month: "February",
      year: "2025",
      is_published: 0,
      created_at: "2025-01-01",
      created_by: "admin",
      newsletterList: [
        {
          newsletter_id: 1,
          newsletter_title: "Sample Title 1",
          newsletter_article: "Sample Content 1",
          newsletter_image: "sample-image-1.jpg",
          newsletter_created_at: "2025-01-01",
          newsletter_pseudonym: "admin",
          newsletter_section: 1,
        },
        {
          newsletter_id: 2,
          newsletter_title: "Sample Title 2",
          newsletter_article: "Sample Content 2",
          newsletter_image: "sample-image-2.jpg",
          newsletter_created_at: "2025-01-01",
          newsletter_pseudonym: "admin",
          newsletter_section: 2,
        },
        {
          newsletter_id: 3,
          newsletter_title: "Sample Title 3",
          newsletter_article: "Sample Content 3",
          newsletter_image: "sample-image-3.jpg",
          newsletter_created_at: "2025-01-01",
          newsletter_pseudonym: "admin",
          newsletter_section: null,
        },
        {
          newsletter_id: 4,
          newsletter_title: "Sample Title 4",
          newsletter_article: "Sample Content 4",
          newsletter_image: "sample-image-4.jpg",
          newsletter_created_at: "2025-01-01",
          newsletter_pseudonym: "admin",
          newsletter_section: 4,
        },
        {
          newsletter_id: 5,
          newsletter_title: "Sample Title 5",
          newsletter_article: "Sample Content 5",
          newsletter_image: "sample-image-5.jpg",
          newsletter_created_at: "2025-01-01",
          newsletter_pseudonym: "admin",
          newsletter_section: 5,
        },
        {
          newsletter_id: 6,
          newsletter_title: "Sample Title 6",
          newsletter_article: "Sample Content 6",
          newsletter_image: "sample-image-6.jpg",
          newsletter_created_at: "2025-01-01",
          newsletter_pseudonym: "admin",
          newsletter_section: 6,
        },
        {
          newsletter_id: 7,
          newsletter_title: "Sample Title 7",
          newsletter_article: "Sample Content 7",
          newsletter_image: "sample-image-7.jpg",
          newsletter_created_at: "2025-01-01",
          newsletter_pseudonym: "admin",
          newsletter_section: 7,
        },
        {
          newsletter_id: 8,
          newsletter_title: "Sample Title 8",
          newsletter_article: "Sample Content 8",
          newsletter_image: "sample-image-8.jpg",
          newsletter_created_at: "2025-01-01",
          newsletter_pseudonym: "admin",
          newsletter_section: 8,
        },
        {
          newsletter_id: 9,
          newsletter_title: "Sample Title 9",
          newsletter_article: "Sample Content 9",
          newsletter_image: "sample-image-9.jpg",
          newsletter_created_at: "2025-01-01",
          newsletter_pseudonym: "admin",
          newsletter_section: 9,
        },
      ],
    },
    {
      id: 3,
      month: "March",
      year: "2025",
      is_published: 0,
      created_at: "2025-01-01",
      created_by: "admin",
      newsletterList: [
        {
          newsletter_id: 1,
          newsletter_title: "Sample Title 1",
          newsletter_article: "Sample Content 1",
          newsletter_image: "sample-image-1.jpg",
          newsletter_created_at: "2025-01-01",
          newsletter_pseudonym: "admin",
          newsletter_section: 1,
        },
        {
          newsletter_id: 2,
          newsletter_title: "Sample Title 2",
          newsletter_article: "Sample Content 2",
          newsletter_image: "sample-image-2.jpg",
          newsletter_created_at: "2025-01-01",
          newsletter_pseudonym: "admin",
          newsletter_section: 2,
        },
        {
          newsletter_id: 3,
          newsletter_title: "Sample Title 3",
          newsletter_article: "Sample Content 3",
          newsletter_image: "sample-image-3.jpg",
          newsletter_created_at: "2025-01-01",
          newsletter_pseudonym: "admin",
          newsletter_section: 3,
        },
        {
          newsletter_id: 4,
          newsletter_title: "Sample Title 4",
          newsletter_article: "Sample Content 4",
          newsletter_image: "sample-image-4.jpg",
          newsletter_created_at: "2025-01-01",
          newsletter_pseudonym: "admin",
          newsletter_section: 4,
        },
        {
          newsletter_id: 5,
          newsletter_title: "Sample Title 5",
          newsletter_article: "Sample Content 5",
          newsletter_image: "sample-image-5.jpg",
          newsletter_created_at: "2025-01-01",
          newsletter_pseudonym: "admin",
          newsletter_section: 5,
        },
        {
          newsletter_id: 6,
          newsletter_title: "Sample Title 6",
          newsletter_article: "Sample Content 6",
          newsletter_image: "sample-image-6.jpg",
          newsletter_created_at: "2025-01-01",
          newsletter_pseudonym: "admin",
          newsletter_section: 6,
        },
        {
          newsletter_id: 7,
          newsletter_title: "Sample Title 7",
          newsletter_article: "Sample Content 7",
          newsletter_image: "sample-image-7.jpg",
          newsletter_created_at: "2025-01-01",
          newsletter_pseudonym: "admin",
          newsletter_section: 7,
        },
        {
          newsletter_id: 8,
          newsletter_title: "Sample Title 8",
          newsletter_article: "Sample Content 8",
          newsletter_image: "sample-image-8.jpg",
          newsletter_created_at: "2025-01-01",
          newsletter_pseudonym: "admin",
          newsletter_section: 8,
        },
      ],
    },
    {
      id: 4,
      month: "April",
      year: "2025",
      is_published: 0,
      created_at: "2025-01-01",
      created_by: "admin",
      newsletterList: [
        {
          newsletter_id: 1,
          newsletter_title: "Sample Title 1",
          newsletter_article: "Sample Content 1",
          newsletter_image: "sample-image-1.jpg",
          newsletter_created_at: "2025-01-01",
          newsletter_pseudonym: "admin",
          newsletter_section: 1,
        },
        {
          newsletter_id: 2,
          newsletter_title: "Sample Title 2",
          newsletter_article: "Sample Content 2",
          newsletter_image: "sample-image-2.jpg",
          newsletter_created_at: "2025-01-01",
          newsletter_pseudonym: "admin",
          newsletter_section: 2,
        },
        {
          newsletter_id: 3,
          newsletter_title: "Sample Title 3",
          newsletter_article: "Sample Content 3",
          newsletter_image: "sample-image-3.jpg",
          newsletter_created_at: "2025-01-01",
          newsletter_pseudonym: "admin",
          newsletter_section: 3,
        },
        {
          newsletter_id: 4,
          newsletter_title: "Sample Title 4",
          newsletter_article: "Sample Content 4",
          newsletter_image: "sample-image-4.jpg",
          newsletter_created_at: "2025-01-01",
          newsletter_pseudonym: "admin",
          newsletter_section: 4,
        },
        {
          newsletter_id: 5,
          newsletter_title: "Sample Title 5",
          newsletter_article: "Sample Content 5",
          newsletter_image: "sample-image-5.jpg",
          newsletter_created_at: "2025-01-01",
          newsletter_pseudonym: "admin",
          newsletter_section: 5,
        },
        {
          newsletter_id: 6,
          newsletter_title: "Sample Title 6",
          newsletter_article: "Sample Content 6",
          newsletter_image: "sample-image-6.jpg",
          newsletter_created_at: "2025-01-01",
          newsletter_pseudonym: "admin",
          newsletter_section: 6,
        },
        {
          newsletter_id: 7,
          newsletter_title: "Sample Title 7",
          newsletter_article: "Sample Content 7",
          newsletter_image: "sample-image-7.jpg",
          newsletter_created_at: "2025-01-01",
          newsletter_pseudonym: "admin",
          newsletter_section: 7,
        },
      ],
    },
    {
      id: 5,
      month: "May",
      year: "2025",
      is_published: 0,
      created_at: "2025-01-01",
      created_by: "admin",
      newsletterList: [
        {
          newsletter_id: 1,
          newsletter_title: "Sample Title 1",
          newsletter_article: "Sample Content 1",
          newsletter_image: "sample-image-1.jpg",
          newsletter_created_at: "2025-01-01",
          newsletter_pseudonym: "admin",
          newsletter_section: 1,
        },
        {
          newsletter_id: 2,
          newsletter_title: "Sample Title 2",
          newsletter_article: "Sample Content 2",
          newsletter_image: "sample-image-2.jpg",
          newsletter_created_at: "2025-01-01",
          newsletter_pseudonym: "admin",
          newsletter_section: 2,
        },
        {
          newsletter_id: 3,
          newsletter_title: "Sample Title 3",
          newsletter_article: "Sample Content 3",
          newsletter_image: "sample-image-3.jpg",
          newsletter_created_at: "2025-01-01",
          newsletter_pseudonym: "admin",
          newsletter_section: 3,
        },
        {
          newsletter_id: 4,
          newsletter_title: "Sample Title 4",
          newsletter_article: "Sample Content 4",
          newsletter_image: "sample-image-4.jpg",
          newsletter_created_at: "2025-01-01",
          newsletter_pseudonym: "admin",
          newsletter_section: 4,
        },
        {
          newsletter_id: 5,
          newsletter_title: "Sample Title 5",
          newsletter_article: "Sample Content 5",
          newsletter_image: "sample-image-5.jpg",
          newsletter_created_at: "2025-01-01",
          newsletter_pseudonym: "admin",
          newsletter_section: 5,
        },
        {
          newsletter_id: 6,
          newsletter_title: "Sample Title 6",
          newsletter_article: "Sample Content 6",
          newsletter_image: "sample-image-6.jpg",
          newsletter_created_at: "2025-01-01",
          newsletter_pseudonym: "admin",
          newsletter_section: 6,
        },
      ],
    },
    {
      id: 6,
      month: "June",
      year: "2025",
      is_published: 0,
      created_at: "2025-01-01",
      created_by: "admin",
      newsletterList: [
        {
          newsletter_id: 1,
          newsletter_title: "Sample Title 1",
          newsletter_article: "Sample Content 1",
          newsletter_image: "sample-image-1.jpg",
          newsletter_created_at: "2025-01-01",
          newsletter_pseudonym: "admin",
          newsletter_section: 1,
        },
        {
          newsletter_id: 2,
          newsletter_title: "Sample Title 2",
          newsletter_article: "Sample Content 2",
          newsletter_image: "sample-image-2.jpg",
          newsletter_created_at: "2025-01-01",
          newsletter_pseudonym: "admin",
          newsletter_section: 2,
        },
        {
          newsletter_id: 3,
          newsletter_title: "Sample Title 3",
          newsletter_article: "Sample Content 3",
          newsletter_image: "sample-image-3.jpg",
          newsletter_created_at: "2025-01-01",
          newsletter_pseudonym: "admin",
          newsletter_section: 3,
        },
        {
          newsletter_id: 4,
          newsletter_title: "Sample Title 4",
          newsletter_article: "Sample Content 4",
          newsletter_image: "sample-image-4.jpg",
          newsletter_created_at: "2025-01-01",
          newsletter_pseudonym: "admin",
          newsletter_section: 4,
        },
        {
          newsletter_id: 5,
          newsletter_title: "Sample Title 5",
          newsletter_article: "Sample Content 5",
          newsletter_image: "sample-image-5.jpg",
          newsletter_created_at: "2025-01-01",
          newsletter_pseudonym: "admin",
          newsletter_section: 5,
        },
        {
          newsletter_id: 6,
          newsletter_title: "Sample Title 6",
          newsletter_article: "Sample Content 6",
          newsletter_image: "sample-image-6.jpg",
          newsletter_created_at: "2025-01-01",
          newsletter_pseudonym: "admin",
          newsletter_section: 6,
        },
        {
          newsletter_id: 7,
          newsletter_title: "Sample Title 7",
          newsletter_article: "Sample Content 7",
          newsletter_image: "sample-image-7.jpg",
          newsletter_created_at: "2025-01-01",
          newsletter_pseudonym: "admin",
          newsletter_section: 7,
        },
        {
          newsletter_id: 8,
          newsletter_title: "Sample Title 8",
          newsletter_article: "Sample Content 8",
          newsletter_image: "sample-image-8.jpg",
          newsletter_created_at: "2025-01-01",
          newsletter_pseudonym: "admin",
          newsletter_section: 8,
        },
        {
          newsletter_id: 9,
          newsletter_title: "Sample Title 9",
          newsletter_article: "Sample Content 9",
          newsletter_image: "sample-image-9.jpg",
          newsletter_created_at: "2025-01-01",
          newsletter_pseudonym: "admin",
          newsletter_section: 9,
        },
        {
          newsletter_id: 10,
          newsletter_title: "Sample Title 10",
          newsletter_article: "Sample Content 10",
          newsletter_image: "sample-image-10.jpg",
          newsletter_created_at: "2025-01-01",
          newsletter_pseudonym: "admin",
          newsletter_section: 10,
        },
      ],
    },
    {
      id: 7,
      month: "July",
      year: "2025",
      is_published: 0,
      created_at: "2025-01-01",
      created_by: "admin",
      newsletterList: [
        {
          newsletter_id: 1,
          newsletter_title: "Sample Title 1",
          newsletter_article: "Sample Content 1",
          newsletter_image: "sample-image-1.jpg",
          newsletter_created_at: "2025-01-01",
          newsletter_pseudonym: "admin",
          newsletter_section: 1,
        },
        {
          newsletter_id: 2,
          newsletter_title: "Sample Title 2",
          newsletter_article: "Sample Content 2",
          newsletter_image: "sample-image-2.jpg",
          newsletter_created_at: "2025-01-01",
          newsletter_pseudonym: "admin",
          newsletter_section: 2,
        },
        {
          newsletter_id: 3,
          newsletter_title: "Sample Title 3",
          newsletter_article: "Sample Content 3",
          newsletter_image: "sample-image-3.jpg",
          newsletter_created_at: "2025-01-01",
          newsletter_pseudonym: "admin",
          newsletter_section: 3,
        },
        {
          newsletter_id: 4,
          newsletter_title: "Sample Title 4",
          newsletter_article: "Sample Content 4",
          newsletter_image: "sample-image-4.jpg",
          newsletter_created_at: "2025-01-01",
          newsletter_pseudonym: "admin",
          newsletter_section: 4,
        },
        {
          newsletter_id: 5,
          newsletter_title: "Sample Title 5",
          newsletter_article: "Sample Content 5",
          newsletter_image: "sample-image-5.jpg",
          newsletter_created_at: "2025-01-01",
          newsletter_pseudonym: "admin",
          newsletter_section: 5,
        },
        {
          newsletter_id: 6,
          newsletter_title: "Sample Title 6",
          newsletter_article: "Sample Content 6",
          newsletter_image: "sample-image-6.jpg",
          newsletter_created_at: "2025-01-01",
          newsletter_pseudonym: "admin",
          newsletter_section: 6,
        },
        {
          newsletter_id: 7,
          newsletter_title: "Sample Title 7",
          newsletter_article: "Sample Content 7",
          newsletter_image: "sample-image-7.jpg",
          newsletter_created_at: "2025-01-01",
          newsletter_pseudonym: "admin",
          newsletter_section: 7,
        },
        {
          newsletter_id: 8,
          newsletter_title: "Sample Title 8",
          newsletter_article: "Sample Content 8",
          newsletter_image: "sample-image-8.jpg",
          newsletter_created_at: "2025-01-01",
          newsletter_pseudonym: "admin",
          newsletter_section: 8,
        },
        {
          newsletter_id: 9,
          newsletter_title: "Sample Title 9",
          newsletter_article: "Sample Content 9",
          newsletter_image: "sample-image-9.jpg",
          newsletter_created_at: "2025-01-01",
          newsletter_pseudonym: "admin",
          newsletter_section: 9,
        },
        {
          newsletter_id: 10,
          newsletter_title: "Sample Title 10",
          newsletter_article: "Sample Content 10",
          newsletter_image: "sample-image-10.jpg",
          newsletter_created_at: "2025-01-01",
          newsletter_pseudonym: "admin",
          newsletter_section: 10,
        },
      ],
    },
    {
      id: 8,
      month: "August",
      year: "2025",
      is_published: 0,
      created_at: "2025-01-01",
      created_by: "admin",
      newsletterList: [
        {
          newsletter_id: 1,
          newsletter_title: "Sample Title 1",
          newsletter_article: "Sample Content 1",
          newsletter_image: "sample-image-1.jpg",
          newsletter_created_at: "2025-01-01",
          newsletter_pseudonym: "admin",
          newsletter_section: 1,
        },
        {
          newsletter_id: 2,
          newsletter_title: "Sample Title 2",
          newsletter_article: "Sample Content 2",
          newsletter_image: "sample-image-2.jpg",
          newsletter_created_at: "2025-01-01",
          newsletter_pseudonym: "admin",
          newsletter_section: 2,
        },
        {
          newsletter_id: 3,
          newsletter_title: "Sample Title 3",
          newsletter_article: "Sample Content 3",
          newsletter_image: "sample-image-3.jpg",
          newsletter_created_at: "2025-01-01",
          newsletter_pseudonym: "admin",
          newsletter_section: 3,
        },
        {
          newsletter_id: 4,
          newsletter_title: "Sample Title 4",
          newsletter_article: "Sample Content 4",
          newsletter_image: "sample-image-4.jpg",
          newsletter_created_at: "2025-01-01",
          newsletter_pseudonym: "admin",
          newsletter_section: 4,
        },
        {
          newsletter_id: 5,
          newsletter_title: "Sample Title 5",
          newsletter_article: "Sample Content 5",
          newsletter_image: "sample-image-5.jpg",
          newsletter_created_at: "2025-01-01",
          newsletter_pseudonym: "admin",
          newsletter_section: 5,
        },
        {
          newsletter_id: 6,
          newsletter_title: "Sample Title 6",
          newsletter_article: "Sample Content 6",
          newsletter_image: "sample-image-6.jpg",
          newsletter_created_at: "2025-01-01",
          newsletter_pseudonym: "admin",
          newsletter_section: 6,
        },
        {
          newsletter_id: 7,
          newsletter_title: "Sample Title 7",
          newsletter_article: "Sample Content 7",
          newsletter_image: "sample-image-7.jpg",
          newsletter_created_at: "2025-01-01",
          newsletter_pseudonym: "admin",
          newsletter_section: 7,
        },
      ],
    },
  ];

  function getMonthName(monthNumber) {
    monthNumber = parseInt(monthNumber, 10);
    if (
      typeof monthNumber !== "number" ||
      monthNumber < 1 ||
      monthNumber > 12
    ) {
      throw new Error("Invalid month number. Must be between 1 and 12.");
    }

    return new Date(0, monthNumber - 1).toLocaleString("default", {
      month: "long",
    });
  }

  return (
    <div>
      {!selectedMonthlyIssue ? (
        <>
          <h3>Currently Published Issue</h3>
          <div
            onClick={() => handleMonthClick(currentPublishedIssue)}
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
                  onClick={() => handleMonthClick(issue)}
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
                            : "bg-green-600"
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
                  <option value="">Select year</option>
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
                    setCurrentIssue({ ...currentIssue, month: e.target.value })
                  }
                  className="w-full p-3 mt-2 border rounded bg-primary/10 focus:ring-2 focus:ring-primary"
                >
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
      ) : (
        <>
          <div className="py-5"></div>
          <button
            onClick={() => handleMonthClick(null)}
            className="group cursor-pointer flex items-center gap-2 text-primary text-xss transition active:font-avenir-black"
          >
            <ArrowLeft size={15} />
            <span className="mt-1 group-hover:font-avenir-black">Back</span>
          </button>
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
                    : "bg-green-600"
                } rounded-full`}
              ></div>
              <h3 className="font-avenir-black">
                {getMonthName(selectedMonthlyIssue.month) +
                  " " +
                  selectedMonthlyIssue.year}{" "}
                {/* <span className="text-sm text-gray-500 font-avenir-roman">
                  ({selectedMonthlyIssue.articleCount})
                </span> */}
                <span className="text-sm text-gray-500 font-avenir-roman">
                  {!selectedMonthlyIssue.is_published
                    ? ""
                    : "(Currently Published)"}
                </span>
              </h3>
            </div>
            <div>
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
          </div>
        </>
      )}
    </div>
  );
}

export default AdminNewsLetterToggle;
