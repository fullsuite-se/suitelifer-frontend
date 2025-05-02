import React, { useEffect, useState } from "react";
import api from "../../utils/axios";
import {
  ArchiveBoxXMarkIcon,
  PencilSquareIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import dayjs from "dayjs";
import Skeleton from "react-loading-skeleton";
import Empty from "../../assets/images/empty.svg";
const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const limit = 10;

  const [isLoading, setIsLoading] = useState(false);
  const fetchLogs = async (page, query = "") => {
    try {
      setIsLoading(true);
      const response = await api.get(
        `/api/audit-logs?limit=${limit}&page=${page}&search=${query}`
      );
      const processedLogs = response.data.logs.map((log) => {
        let description = log.description;

        const urlWithParenthesesPattern = /\(https?:\/\/[^\s)]+\)/;
        const urlPattern = /https?:\/\/[^\s)]+/;

        const matchWithParentheses = description.match(
          urlWithParenthesesPattern
        );
        const matchWithoutParentheses = description.match(urlPattern);

        if (matchWithParentheses) {
          const cleanUrl = matchWithParentheses[0].slice(1, -1);

          const descriptionWithoutUrl = description
            .replace(matchWithParentheses[0], "")
            .trim();

          const clickableText = `<a href="${cleanUrl}" target="_blank" class="text-primary no-underline hover:!underline">this is the link</a>`;

          return {
            ...log,
            description: `${descriptionWithoutUrl} (${clickableText})`,
          };
        } else if (matchWithoutParentheses) {
          const cleanUrl = matchWithoutParentheses[0];

          const descriptionWithoutUrl = description
            .replace(cleanUrl, "")
            .trim();

          const clickableText = `<a href="${cleanUrl}" target="_blank" class="text-primary no-underline hover:!underline">this is the link</a>`;

          return {
            ...log,
            description: `${descriptionWithoutUrl} (${clickableText})`,
          };
        }

        return {
          ...log,
          description: description,
        };
      });

      setIsLoading(false);

      setLogs(processedLogs);
      setTotal(response.data.total);
    } catch (e) {
      console.error("Failed to fetch logs", e);
    }
  };

  useEffect(() => {
    fetchLogs(page, query);
  }, [page, query]);

  const totalPages = Math.ceil(total / limit);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setQuery(search);
  };

  return logs.length === 0 && !isLoading ? (
    <div className="grid place-content-center h-full">
           <div className="flex gap-4 flex-col items-center">
             <div className="w-[20vw] -mt-50">
               <img
                 className=""
                 src={Empty}
                 alt="Fullsuite Events Page Coming Soon"
               />
             </div>
             <p className="text-lg md:text-xl lg:text-3xl font-avenir-black text-primary mb-5 lg:mb-0 mt-10">
             No audit activity yet — <span className="text-black font-semibold">everything’s quiet for now.</span>
</p>
<p className="text-center text-gray-600 text-[12px] md:text-[14px] lg:text-base">
  Once actions are taken by admins or users, you’ll see the audit logs appear here.
</p>
           </div>
         </div>
  ) : (
    <section className="px-[15%] pb-40 pt-5 space-y-6">
      <form onSubmit={handleSearch} className="flex gap-4 items-center">
        <input
          type="text"
          placeholder="Search logs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`border border-none rounded px-4 py-2 w-full focus:outline-primary 
            ${isLoading ? "bg-gray-100" : "bg-primary/10"}`}
        />
        <button
          type="submit"
          disabled={isLoading}
          className={`cursor-pointer px-4 py-2 rounded text-white focus:outline-primary-hovered 
            ${
              isLoading ? "bg-gray-200" : "bg-primary hover:bg-primary-hovered"
            }`}
        >
          Search
        </button>
        {query && (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setQuery("");
              setPage(1);
            }}
            className="cursor-pointer px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            Clear
          </button>
        )}
      </form>

      {isLoading && (
        <div className="space-y-4">
          {Array(10)
            .fill(null)
            .map((_, index) => (
              <div
                key={index}
                className="p-5 flex items-center gap-4  bg-gray-100 rounded-lg"
              >
                <Skeleton height={30} className="w-full" />
              </div>
            ))}
        </div>
      )}

      {logs.map((log) => (
        <div
          key={log.logId}
          className="p-5 flex items-center gap-4 border border-gray-200 rounded-lg"
        >
          <div>
            {log.action === "CREATE" && (
              <PlusCircleIcon className="size-5 text-green-600" />
            )}
            {log.action === "UPDATE" && (
              <PencilSquareIcon className="size-5 text-blue-600" />
            )}
            {log.action === "DELETE" && (
              <ArchiveBoxXMarkIcon className="size-5 text-red-600" />
            )}
          </div>
          <div className="flex flex-col">
            <p
              className="font-avenir-black"
              dangerouslySetInnerHTML={{ __html: log.description }}
            ></p>
            <p className="text-gray-500 text-xss">
              {dayjs(log.date).format("MMMM D, YYYY h:mm A")}
            </p>
          </div>
        </div>
      ))}

      <div className="flex items-center justify-center gap-4 mt-6">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="cursor-pointer px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:hover:bg-gray-200 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-md font-semibold">{`Page ${page} of ${totalPages}`}</span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="cursor-pointer px-4 py-2 bg-primary text-white rounded hover:bg-primary-hovered disabled:hover:bg-primary disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </section>
  );
};

export default AuditLogs;
