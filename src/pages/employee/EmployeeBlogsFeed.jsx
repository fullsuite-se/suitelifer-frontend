import React from "react";
import BlogCard from "../../components/blog/BlogCard";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { TicketIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const blogFeeds = [
  {
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
  },
  {
    id: 2,
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
  },
];
const EmployeeBlogsFeed = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <section className="p-2 xl:p-3">
      {id ? (
        <Outlet />
      ) : (
        <>
          <div className="bg-primary rounded-md p-3 flex justify-between mb-5 lg:hidden">
            <div className="flex gap-2">
              <TicketIcon className="w-5 h-5 text-white" />
              <span className="text-white text-sm">3 events today</span>
            </div>
            <div className="flex gap-1 items-center">
              <span className="text-white text-xs">See all</span>
              <ChevronRightIcon className="w-3 h-3 text-white" />
            </div>
          </div>
          <main>
            {blogFeeds.map((blog, index) => (
              <div key={index} className="mb-5">
                <BlogCard blog={blog} />
              </div>
            ))}
          </main>
        </>
      )}
    </section>
  );
};

export default EmployeeBlogsFeed;
