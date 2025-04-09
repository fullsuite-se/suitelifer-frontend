import QuoteIcon from "../../assets/icons/QuoteIcon";

const NewsletterQuote = ({ text }) => {
  return (
    <div className="flex md:flex-col gap-4 py-5 md:pt-0">
      <div className="flex-1 xl:flex-none">
        <QuoteIcon size="7vw" color="#0097b2" />
      </div>
      <p className="quote-text text-h6">{text}</p>
    </div>
  );
};

export default NewsletterQuote;
