const FacebookPostEmbed = ({ postId }) => {
    const defaultPage = "thefullsuitepod";
    const postUrl = `https://www.facebook.com/${defaultPage}/posts/${postId}`;
  
    return (
      <div className="facebook-post-embed h-full">
        <iframe
          src={`https://www.facebook.com/plugins/post.php?href=${encodeURIComponent(postUrl)}&show_text=true&width=500`}
          className="w-full h-100 md:h-full rounded-2xl p-2 shadow-md"
          style={{ border: "none", overflow: "hidden" }}
          scrolling="no"
          frameBorder="0"
          allowFullScreen={true}
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
        ></iframe>
      </div>
    );
  };
  
  export default FacebookPostEmbed;
  