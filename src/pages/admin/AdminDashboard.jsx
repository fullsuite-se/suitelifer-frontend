import React from "react";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Building2, Calendar, LayoutDashboard, LogOut, NewspaperIcon, Users } from "lucide-react";

const data = [
  { name: "0", value: 2000 },
  { name: "1", value: 2200 },
  { name: "2", value: 2100 },
  { name: "3", value: 2300 },
  { name: "4", value: 2400 },
  { name: "5", value: 2200 },
  { name: "6", value: 2100 },
  { name: "7", value: 2300 },
  { name: "8", value: 2500 },
  { name: "9", value: 2400 },
  { name: "10", value: 2600 },
  { name: "11", value: 2400 }
];

const Dashboard = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-blue-600 text-white p-4 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold">LANCE SALCEDO</h3>
          <p className="text-sm text-white/80">Software Engineer Administrator</p>
          <nav className="mt-4 space-y-2">
            <button className="flex items-center gap-2 w-full p-2 hover:bg-blue-500">
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </button>
            <button className="flex items-center gap-2 w-full p-2 hover:bg-blue-500">
              <Building2 className="w-4 h-4" /> Job Listings
            </button>
            <button className="flex items-center gap-2 w-full p-2 hover:bg-blue-500">
              <NewspaperIcon className="w-4 h-4" /> Blogs
            </button>
            <button className="flex items-center gap-2 w-full p-2 hover:bg-blue-500">
              <Calendar className="w-4 h-4" /> Events
            </button>
            <button className="flex items-center gap-2 w-full p-2 hover:bg-blue-500">
              <Users className="w-4 h-4" /> Content
            </button>
          </nav>
        </div>
        <button className="flex items-center gap-2 p-2 hover:bg-blue-500">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </aside>
      <main className="flex-1 p-8">
        <header className="flex justify-between mb-8">
          <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-23%20185946-gbHMINwnvdTmAPRVFejpPCDoktogZj.png" alt="Logo" className="h-8" />
          <div className="flex gap-2">
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500">+ Job Listing</button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500">+ Employee Account</button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500">+ Event</button>
          </div>
        </header>
        <section className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded shadow-md">
            <div className="text-4xl font-bold mb-2">32k</div>
            <div className="text-sm text-gray-500">Total Site Visits</div>
          </div>
          <div className="bg-white p-4 rounded shadow-md">
            <div className="text-4xl font-bold mb-2">52</div>
            <div className="text-sm text-gray-500">Total Employee Accounts</div>
          </div>
          <div className="bg-white p-4 rounded shadow-md">
            <div className="text-4xl font-bold mb-2">917</div>
            <div className="text-sm text-gray-500">Total Applications</div>
          </div>
        </section>
        <section className="bg-white p-6 rounded shadow-md">
          <h2 className="font-semibold mb-4">Site Visit Insights</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <XAxis dataKey="name" />
                <YAxis />
                <Area type="monotone" dataKey="value" stroke="#2563EB" fill="#60A5FA" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;