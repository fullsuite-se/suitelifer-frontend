const InstagramEmbed = ({postId}) => {
  return (
    <div className="instagram-embed h-full">
      <iframe
        src={`https://www.instagram.com/p/${postId}/embed`}
        className="w-full h-100 md:h-full rounded-2xl p-2 bg-white shadow-md"
        frameBorder="0"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default InstagramEmbed;
