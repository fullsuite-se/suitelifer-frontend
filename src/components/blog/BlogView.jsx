import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import BlogComment from "./BlogComment";
import {
  ArrowLeftIcon,
  ArrowUpIcon,
  PaperAirplaneIcon,
  HeartIcon,
  ChatBubbleLeftEllipsisIcon,
} from "@heroicons/react/20/solid";

import Carousel from "../Carousel";

const feed = {
  id: 1,
  userPic:
    "http://sa.kapamilya.com/absnews/abscbnnews/media/2020/tvpatrol/06/01/james-reid.jpg",
  firstName: "Hernani",
  lastName: "Domingo",
  title: "Lost in the beauty of Palawan!",
  description:
    "Lost in the beauty of Palawan! 🌊🏝️ From stunning lagoons to white sandy beaches, every moment feels like a dream. ✨🌅 #IslandParadise. Lost in the beauty of Palawan! 🌊🏝️ From stunning lagoons to white sandy beaches, every moment feels like a dream. ✨🌅 #IslandParadise. Lost in the beauty of Palawan! 🌊🏝️ From stunning lagoons to white sandy beaches, every moment feels like a dream. ✨🌅 #IslandParadise.",
  commentCount: 10,
  likeCount: 25,
  date: "2025-02-26 14:30:00",
  images: [
    "https://plus.unsplash.com/premium_photo-1697729414037-e2a59823d9d9?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1583685173048-342a162bb888?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1531761535209-180857e963b9?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ],
};

const comments = [
  {
    id: 1,
    userPic:
      "http://sa.kapamilya.com/absnews/abscbnnews/media/2020/tvpatrol/06/01/james-reid.jpg",
    firstName: "James",
    lastName: "Reid",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit magnam quas ratione, vero iusto expedita odio! Necessitatibus laudantium aliquid iusto?",
    createdAt: "2025-02-26 14:30:00",
  },
  {
    id: 2,
    userPic:
      "http://sa.kapamilya.com/absnews/abscbnnews/media/2020/tvpatrol/06/01/james-reid.jpg",
    firstName: "James",
    lastName: "Reid",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit magnam quas ratione, vero iusto expedita odio! Necessitatibus laudantium aliquid iusto?",
    createdAt: "2025-02-26 14:30:00",
  },
];

const BlogView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <section className="p-2 xl:p-3 flex flex-col gap-8 mt-4">
      <button
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => {
          navigate(location.state.previousPage);
        }}
      >
        <ArrowLeftIcon className="w-6 h-6 text-primary" />
        <span className="font-avenir-black text-primary text-base">Back</span>
      </button>
      <section className="flex gap-4">
        <div className="w-12 h-12">
          <img
            src={blog.userPic}
            alt={blog.firstName}
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        <div>
          <p className="font-avenir-black">
            {blog.firstName} {blog.lastName}
          </p>
          <span className="text-xs text-gray-500">{blog.date}</span>
        </div>
      </section>
      <section>
        <main className="max-w-5xl mx-auto">
          <Carousel images={feed.images} isButtonOutside={false} />
          <Carousel images={blog.images}/>
        </main>
      </section>
      <section>
        <h3 className="text-center font-avenir-black">{blog.title}</h3>
        <p>{blog.description}</p>
      </section>
      <section className="flex gap-3">
        <button className="flex gap-3 cursor-pointer">
          <HeartIcon className="w-5 h-5 text-gray-400" />
          <span className="text-gray-500">{blog.likeCount}</span>
        </button>
        <button className="flex gap-3 cursor-pointer">
          <ChatBubbleLeftEllipsisIcon className="w-5 h-5 text-gray-400" />
          <span className="text-gray-500">{blog.commentCount}</span>
        </button>
      </section>
      <section className="flex items-center gap-3">
        <div className="w-12 h-12">
          <img
            src={blog.userPic}
            alt={blog.firstName}
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        <textarea
          name="comment"
          id="comment"
          cols="30"
          rows="1"
          className="border flex-1 px-2 py-2 rounded bg-blue-50 border-none min-h-[50px] focus:outline-primary"
          placeholder="Write your comment here..."
        ></textarea>
        <PaperAirplaneIcon className="text-primary w-6 h-6" />
      </section>
      <section className="flex justify-between items-center">
        <h4 className="">Comments</h4>
        <div className="flex items-center gap-1">
          <span className="text-primary font-avenir-black text-sm">
            Newest first
          </span>
          <ArrowUpIcon className="w-4 h-4 text-primary" />
        </div>
      </section>
      <section className="flex flex-col gap-4">
        {comments.map((comment, index) => (
          <div key={comment.id}>
            <BlogComment
              id={comment.id}
              firstName={comment.firstName}
              lastName={comment.lastName}
              content={comment.content}
              createdAt={comment.createdAt}
              userPic={comment.userPic}
            />
            {index != comments.length - 1 && (
              <hr className="text-gray-200 mt-4" />
            )}
          </div>
        ))}
      </section>
    </section>
  );
};

export default BlogView;
