import React, { useState } from "react";
import {
  ArrowUpRightIcon,
  HeartIcon,
  ChatBubbleLeftEllipsisIcon,
} from "@heroicons/react/20/solid";
import { Link } from "react-router-dom";
import { toSlug } from "../../utils/slugUrl";
import ViewFullImages from "../modals/ViewFullImages";

const FeedCard = ({ feed }) => {
  const [isFullImages, setIsFullImages] = useState(false);

  const handleViewImages = () => {
    setIsFullImages((prev) => !prev);
  };

  return (
    <section
      className="rounded-lg p-5 xl:p-8 flex flex-col gap-6 shadow-md border border-gray-100"
      style={{
        boxShadow: "rgba(0, 0, 0, 0.08) 0px 4px 12px",
      }}
    >
      <ViewFullImages
        viewFull={isFullImages}
        handleViewFull={handleViewImages}
        images={feed.images}
      />
      <section className="flex items-center justify-between">
        <div className="flex gap-4">
          <div className="w-12 h-12">
            <img
              src={feed.userPic}
              alt={feed.firstName}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div>
            <p className="font-avenir-black">
              {feed.firstName} {feed.lastName}
            </p>
            <span className="text-xs text-gray-500">{feed.date}</span>
          </div>
        </div>

        <Link
          to={`feed/${feed.id}/${toSlug(feed.title)}`}
          state={{ previousPage: location.pathname }}
        >
          <ArrowUpRightIcon className="w-7 h-7 text-primary cursor-pointer" />
        </Link>
      </section>
      <section>
        <h3 className="font-avenir-black">{feed.title}</h3>
        <p>{feed.description}</p>
      </section>
      <section className="grid grid-cols-4 grid-row grid-rows-2 gap-4">
        <div className="col-start-1 col-end-3 row-start-1 row-end-3">
          <img
            src={feed.images[0]}
            className="w-full h-full object-cover rounded-md"
            onClick={handleViewImages}
          />
        </div>
        <div className="col-start-3 col-end-4 row-start-1 row-end-2">
          <img
            src={feed.images[1]}
            className="w-full h-full object-cover rounded-md"
            onClick={handleViewImages}
          />
        </div>
        <div className="ol-start-3 col-end-4 row-start-2 row-end-3">
          <img
            src={feed.images[2]}
            className="w-full h-full object-cover rounded-md"
            onClick={handleViewImages}
          />
        </div>
        <div className="grid-start-4 grid-end-5 row-start-1 row-end-3">
          <img
            src={feed.images[3]}
            className="w-full h-full object-cover rounded-md"
            onClick={handleViewImages}
          />
        </div>
      </section>
      <section className="flex gap-3">
        <button className="flex gap-3 cursor-pointer">
          <HeartIcon className="w-5 h-5 text-gray-400" />
          <span className="text-gray-500">{feed.likeCount}</span>
        </button>
        <button className="flex gap-3 cursor-pointer">
          <ChatBubbleLeftEllipsisIcon className="w-5 h-5 text-gray-400" />
          <span className="text-gray-500">{feed.commentCount}</span>
        </button>
      </section>
    </section>
  );
};

export default FeedCard;
