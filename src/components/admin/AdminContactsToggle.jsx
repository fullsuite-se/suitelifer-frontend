import React from "react";
import FAQs from "./FAQs";
import ContactDetails from "./ContactDetails";
import PageToggle from "../buttons/PageToggle";
function AdminContactsToggle() {
  const tabs = [
    { label: "Contact Details", component: ContactDetails },
    { label: "FAQs", component: FAQs },
  ];

  return <PageToggle tabs={tabs} />;
}

export default AdminContactsToggle;
