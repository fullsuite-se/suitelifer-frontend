import React from "react";

const FeedComment = ({
  id,
  userPic,
  firstName,
  lastName,
  content,
  createdAt,
}) => {
  return (
    <section>
      <section className="flex flex-row gap-4">
        <div className="w-12 h-12">
          <img
            src={userPic}
            alt={firstName}
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        <div className="flex-1">
          <div className="flex gap-2 items-center">
            <span className="text-primary font-avenir-black">
              {firstName} {lastName}
            </span>
            <span className="text-xs text-gray-500">{createdAt}</span>
          </div>
          <p>{content}</p>
        </div>
      </section>
    </section>
  );
};

export default FeedComment;
