import TermsOfUse from "./TermsOfUse";
import PrivacyPolicy from "./PrivacyPolicy";
import FooterContent from "./FooterContent";
import PageToggle from "./PageToggle";

const FooterPageToggle = () => {
  const tabs = [
    { label: "Terms of Use", component: TermsOfUse },
    { label: "Privacy Policy", component: PrivacyPolicy },
    { label: "Footer Content", component: FooterContent }
  ];

  return <PageToggle tabs={tabs} />;
};

export default FooterPageToggle;
