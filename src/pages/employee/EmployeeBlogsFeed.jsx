import React from "react";
import FeedCard from "../../components/FeedCard";

const blogFeeds = [
  {
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
  return (
    <section className="p-2 xl:p-3">
      <div className="flex items-center justify-between">
        <h2 className="font-avenir-black">Feeds</h2>
        <span className="font-avenir-black text-primary text-sm">
          + Create new blog
        </span>
      </div>
      <main>
        {blogFeeds.map((feed, index) => (
          <FeedCard key={index} feed={feed} />
        ))}
      </main>
    </section>
  );
};

export default EmployeeBlogsFeed;
