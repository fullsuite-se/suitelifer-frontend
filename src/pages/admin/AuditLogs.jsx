import React, { useEffect, useState } from "react";
import api from "../../utils/axios";
import {
  ArchiveBoxXMarkIcon,
  PencilSquareIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import dayjs from "dayjs";

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  const fetchLogs = async (page) => {
    try {
      const response = await api.get(
        `/api/audit-logs?limit=${limit}&page=${page}`
      );
      setLogs(response.data.logs);
      setTotal(response.data.total);
    } catch (e) {
      console.error("Failed to fetch logs", e);
    }
  };

  useEffect(() => {
    fetchLogs(page);
  }, [page]);

  const totalPages = Math.ceil(total / limit);

  return (
    <section className="px-[15%] pb-40 pt-5 space-y-4">
      {logs.map((log) => (
        <div
          key={log.logId}
          className={`p-5 flex items-center gap-4 border border-gray-200
        rounded-lg`}
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
            <p className="font-avenir-black">{log.description}</p>
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
          className="px-4 py-2 cursor-pointer disabled:cursor-default disabled:hover:bg-gray-200 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-md font-semibold">{`Page ${page} of ${totalPages}`}</span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-hovered cursor-pointer disabled:opacity-50 disabled:cursor-default disabled:hover:bg-primary"
        >
          Next
        </button>
      </div>
    </section>
  );
};

export default AuditLogs;
