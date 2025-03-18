import { AgGridReact } from "ag-grid-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

const NewsTable = ({ rowNewsData, formatNumber, handleEdit, handleDelete }) => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [isTablet, setIsTablet] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
      setIsTablet(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const columnDefs = [
    {
      headerName: "Image",
      field: "image",
      flex: 1,
      filter: "agTextColumnFilter",
      headerClass: "text-primary font-bold bg-tertiary",
      cellRenderer: (params) => {
        return params.value ? (
          <img
            src={params.value}
            alt="News"
            className="w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24 rounded-md object-cover"
          />
        ) : (
          <span>No Image</span>
        );
      },
    },
    {
      headerName: "Title",
      field: "title",
      flex: 2,
      filter: "agTextColumnFilter",
      headerClass: "text-primary font-bold bg-tertiary",
      valueGetter: (params) => params.data.title.replace(/<[^>]*>/g, ""),
    },
    {
      headerName: "Author",
      field: "author",
      flex: 1,
      filter: "agTextColumnFilter",
      headerClass: "text-primary font-bold bg-tertiary",
      hide: isMobile,
    },
    {
      headerName: "Date Published",
      field: "datePublished",
      flex: 1,
      headerClass: "text-primary font-bold bg-tertiary",
      valueGetter: (params) =>
        new Date(params.data.datePublished.seconds * 1000).toLocaleString(),
      hide: isTablet,
    },
    {
      headerName: "Views",
      field: "views",
      flex: 1,
      filter: "agTextColumnFilter",
      headerClass: "text-primary font-bold bg-tertiary",
      valueGetter: (params) => formatNumber(params.data.views),
    },
    {
      headerName: "Likes",
      field: "likes",
      flex: 1,
      filter: "agTextColumnFilter",
      headerClass: "text-primary font-bold bg-tertiary",
      valueGetter: (params) => formatNumber(params.data.likes),
    },
    {
      headerName: "Comments",
      field: "comments",
      flex: 1,
      filter: "agTextColumnFilter",
      headerClass: "text-primary font-bold bg-tertiary",
      valueGetter: (params) => formatNumber(params.data.comments),
      hide: isTablet,
    },
    {
      headerName: "Action",
      field: "action",
      flex: 1,
      headerClass: "text-primary font-bold bg-tertiary",
      cellRenderer: (params) => (
        <div className="flex gap-2">
          <button className="btn-update" onClick={() => handleEdit(params.data)}>
            <EditIcon />
          </button>
          <button className="btn-delete" onClick={() => handleDelete(params.data.id)}>
            <DeleteIcon />
          </button>
          <button className="btn-preview" onClick={() => navigate(`details/${params.data.id}`)}>
            <PreviewIcon />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full overflow-x-auto">
      <div className="ag-theme-quartz p-3 sm:p-5 w-full" style={{ height: "auto" }}>
        <AgGridReact
          rowData={rowNewsData}
          columnDefs={columnDefs}
          defaultColDef={{
            filter: "agTextColumnFilter",
            floatingFilter: true,
            sortable: true,
            cellStyle: {
              display: "flex",
              alignItems: "center",
              justifyContent: "left",
            },
          }}
          domLayout="autoHeight"
          rowHeight={isMobile ? 60 : isTablet ? 70 : 80}
          pagination
          paginationPageSize={6}
        />
      </div>
    </div>
  );
};

export default NewsTable;
