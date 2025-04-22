import TermsOfUse from "./TermsOfUse";
import PrivacyPolicy from "./PrivacyPolicy";
import FooterContent from "./FooterContent";
import PageToggle from "./PageToggle";

const FooterPageToggle = () => {
  const tabs = [
    { label: "Footer Content", component: FooterContent },
    { label: "Terms of Use", component: TermsOfUse },
    { label: "Privacy Policy", component: PrivacyPolicy },
  ];

  return <PageToggle tabs={tabs} />;
};

export default FooterPageToggle;
