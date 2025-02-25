import React from "react";
import Sidebar from "../../components/Sidebar";

export default function JobListing() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 container mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold text-primary">fullsuite.</div>
          <div className="space-x-2">
            <button className="bg-primary hover:bg-teal-700 text-white px-4 py-2 rounded">
              <span className="mr-2">+</span> JOB LISTING
            </button>
            <button className="bg-primary hover:bg-teal-700 text-white px-4 py-2 rounded">
              <span className="mr-2">+</span> INDUSTRY
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-4">
          <div className="bg-primary text-white px-4 py-2 rounded-md">
            <div className="text-sm">Total Applications</div>
            <div className="text-2xl font-bold">917</div>
          </div>
          <div className="border px-4 py-2 rounded-md">
            <div className="text-sm">Industries</div>
            <div className="text-2xl font-bold">2</div>
          </div>
          <div className="border px-4 py-2 rounded-md">
            <div className="text-sm">Job Listings</div>
            <div className="text-2xl font-bold">4</div>
          </div>
          <div className="flex gap-2">
            <div className="border px-4 py-2 rounded-md">
              <div className="text-sm">Open</div>
              <div className="text-2xl font-bold">3</div>
            </div>
            <div className="border px-4 py-2 rounded-md">
              <div className="text-sm">Closed</div>
              <div className="text-2xl font-bold">1</div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search Job"
              className="bg-gray-50 px-4 py-2 rounded w-full"
            />
          </div>
          <div className="relative w-[200px]">
            <select className="bg-gray-50 px-4 py-2 rounded w-full">
              <option value="business-operations">Business Operations</option>
              <option value="technology">Technology</option>
              <option value="marketing">Marketing</option>
            </select>
          </div>
          <button className="bg-transparent p-2 rounded">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              ></path>
            </svg>
          </button>
        </div>

        {/* Table */}
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2">Job Title</th>
              <th className="py-2">Description</th>
              <th className="py-2">Employment Type</th>
              <th className="py-2">Status</th>
              <th className="py-2">Visibility</th>
              <th className="py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-gray-50">
              <td className="py-2 font-medium">
                Financial Management Associate
              </td>
              <td className="py-2">Lorem ipsum dolor sit</td>
              <td className="py-2">Full-time</td>
              <td className="py-2">Open</td>
              <td className="py-2">Shown</td>
              <td className="py-2">
                <button className="bg-transparent p-2 rounded">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4v16m8-8H4"
                    ></path>
                  </svg>
                </button>
              </td>
            </tr>
            <tr>
              <td className="py-2 font-medium">Business Operation Manager</td>
              <td className="py-2">Manage overall oper...</td>
              <td className="py-2">Full-time</td>
              <td className="py-2">Open</td>
              <td className="py-2">Shown</td>
              <td className="py-2">
                <button className="bg-transparent p-2 rounded">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4v16m8-8H4"
                    ></path>
                  </svg>
                </button>
              </td>
            </tr>
            <tr className="bg-gray-50">
              <td className="py-2 font-medium">
                Associate Manager Business Operations
              </td>
              <td className="py-2">Manage overall oper...</td>
              <td className="py-2">Full-time</td>
              <td className="py-2">Closed</td>
              <td className="py-2">Hidden</td>
              <td className="py-2">
                <button className="bg-transparent p-2 rounded">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4v16m8-8H4"
                    ></path>
                  </svg>
                </button>
              </td>
            </tr>
            <tr>
              <td className="py-2 font-medium">Business Operation Associate</td>
              <td className="py-2">We are looking for a...</td>
              <td className="py-2">Full-time</td>
              <td className="py-2">Open</td>
              <td className="py-2">Shown</td>
              <td className="py-2">
                <button className="bg-transparent p-2 rounded">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4v16m8-8H4"
                    ></path>
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
