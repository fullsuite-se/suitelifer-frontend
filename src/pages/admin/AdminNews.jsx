import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
// Theme
import { ModuleRegistry } from "@ag-grid-community/core";
import { AgGridReact } from "@ag-grid-community/react";
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-quartz.css";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

const AdminNews = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const gridRef = useRef();

  // Mock data for news
  const mockData = [
    {
      id: "1",
      title: "Breaking News: Market Hits All-Time High",
      author: "John Doe",
      datePublished: { seconds: 1616161616 },
    },
    {
      id: "2",
      title: "Tech Innovations in 2025",
      author: "Jane Smith",
      datePublished: { seconds: 1616161626 },
    },
    {
      id: "3",
      title: "Climate Change and Its Impact",
      author: "Alice Johnson",
      datePublished: { seconds: 1616161636 },
    },
  ];

  const [rowNewsData, setRowNewsData] = useState(mockData);

  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: "Title",
      field: "title",
      flex: 2,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "Author",
      field: "author",
      flex: 1,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "Date Published",
      field: "datePublished",
      filter: "agDateColumnFilter",
      flex: 1,
      sort: "desc",
      sortIndex: 0,
      valueGetter: (params) => {
        const datePublished = params.data.datePublished;
        if (datePublished && datePublished.seconds) {
          return new Date(datePublished.seconds * 1000);
        }
        return null;
      },
      valueFormatter: (params) => {
        const date = params.value;

        if (date instanceof Date) {
          return date.toLocaleDateString() + " " + date.toLocaleTimeString();
        }
        return "";
      },
    },
    {
      headerName: "Action",
      field: "action",
      filter: false,
      flex: 1,
      cellRenderer: (params) => {
        const newsId = params.data.id;

        return (
          <section className="flex items-center justify-center gap-2 px-2 mt-1">
            <button
              className="px-2 py-1 text-sm font-normal border border-gray-300 rounded-sm bg-arfagray text-arfablack btn-update"
              onClick={() => {
                navigate(`details/${newsId}`);
              }}
            >
              <span className="text-sm">View </span>
            </button>
          </section>
        );
      },
    },
  ]);

  const defaultColDef = useMemo(() => {
    return {
      filter: "agTextColumnFilter",
      floatingFilter: true,
      sortable: true,
    };
  }, []);

  const handleViewNews = (value) => {
    navigate(`details/${value}`);
  };

  const isOutletPage = location.pathname.includes("/news/details/");

  return (
    
    <>
      {!isOutletPage ? (
        <>

        
          <div
            className={"ag-theme-quartz p-5"}
            style={{ height: "max(600px, 90%)", width: "100%" }}
          >
            <AgGridReact
              rowData={rowNewsData}
              ref={gridRef}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              pagination={true}
              paginationPageSize={15}
              paginationPageSizeSelector={[15, 25, 50]}
              domLayout="normal"
            />
          </div>
        </>
      ) : (
        <Outlet />
      )}
    </>
  );
};

export default AdminNews;
