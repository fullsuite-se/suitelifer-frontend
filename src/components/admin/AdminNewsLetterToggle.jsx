import React from "react";
import NewsArticle from "./NewsArticle";
import Issues from "./Issues";
import PageToggle from "./PageToggle";
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import {
  DocumentIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  ArrowsUpDownIcon,
} from "@heroicons/react/24/outline";
import Filter from "./NewsletterFilter";
import { useState } from "react";

<ArrowRightIcon className="h-5 w-5 text-gray-500" />;

function AdminNewsLetterToggle() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const tabs = [
    { label: "Issues", component: Issues },
    { label: "News Article", component: NewsArticle },
  ];

  const sampleNewsLetterList = [
    {
      id: 1,
      month: "January",
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
  ];

  return (
    <>
      <h3>Current Published Issue</h3>
      <div className="flex flex-row items-center justify-between bg-primary text-white p-4 rounded-lg mb-4 cursor-pointer">
        <h3 className="font-avenir-black">
          {sampleNewsLetterList[0].month + " " + sampleNewsLetterList[0].year}
        </h3>
        <div className="flex flex-row items-center justify-center gap-1">
          <DocumentIcon className="h-5 w-5 text-white" />
          <p className="-mb-1 font-avenir-black">
            {sampleNewsLetterList[0].newsletterList.length} articles
          </p>
        </div>
        <div className="flex flex-row items-center justify-center gap-1">
          <CheckCircleIcon className="h-5 w-5 text-white" />
          <p className="font-avenir-black">
            {
              sampleNewsLetterList[0].newsletterList.filter(
                (newsletter) =>
                  newsletter.newsletter_section >= 1 &&
                  newsletter.newsletter_section <= 7
              ).length
            }
            /7 assigned
          </p>
        </div>
        <div className="flex flex-row items-center justify-center gap-1">
          <ExclamationTriangleIcon className="h-5 w-5 text-white" />
          <p className="font-avenir-black">
            {
              sampleNewsLetterList[0].newsletterList.filter(
                (newsletter) =>
                  !(
                    newsletter.newsletter_section >= 1 &&
                    newsletter.newsletter_section <= 7
                  )
              ).length
            }{" "}
            unassigned
          </p>
        </div>

        <ArrowRightIcon className="h-5 w-5 text-white" />
      </div>
      <div className="py-3"></div>
      <div className="flex flex-row items-center justify-between">
        <h3>All Issues</h3>

        <InformationCircleIcon className="w-5 h-5 text-primary cursor-pointer" />
      </div>
      <div className="flex flex-row items-center justify-between">
        <div className="flex justify-start items-center">
          <div className="bg-primary rounded-md text-white pr-4 flex items-center cursor-pointer">
            <Filter
              showMonth={false}
              showYear={true}
              onYearChange={setSelectedYear}
            />
          </div>
          <div className="flex flex-row items-center justify-center gap-1 ml-4 text-gray-500 cursor-pointer">
            <div>
              <ArrowsUpDownIcon className="h-5 w-5 " />
            </div>
            <div> Newest first</div>
          </div>
        </div>
        <div>
          <p className="font-avenir-black text-primary cursor-pointer ">
            + Add new issue
          </p>
        </div>
      </div>
      {/* <PageToggle tabs={tabs} /> */}
    </>
  );
}

export default AdminNewsLetterToggle;
