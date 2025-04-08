import React from "react";
import NewsArticle from "./NewsArticle";
import Issues from "./Issues";
import PageToggle from "./PageToggle";

function AdminNewsLetterToggle() {
  const tabs = [
    { label: "Issues", component: Issues },
    { label: "News Article", component: NewsArticle },
  ];

  return <PageToggle tabs={tabs} />;
}

export default AdminNewsLetterToggle;
