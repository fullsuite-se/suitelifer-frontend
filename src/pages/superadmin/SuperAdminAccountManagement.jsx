import React, { useRef, useMemo } from "react";
import { AgGridReact } from "@ag-grid-community/react";
import { ModuleRegistry } from "@ag-grid-community/core";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

const SuperAdminAccountManagement = () => {
  const gridRef = useRef(null);

  const columnDefs = useMemo(
    () => [
      { headerName: "User ID", field: "id", checkboxSelection: true },
      { headerName: "Full Name", field: "fullName" },
      { headerName: "Email", field: "email" },
      { headerName: "Status", field: "status" },
      { headerName: "Created At", field: "createdAt" },
    ],
    []
  );

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      filter: true,
      resizable: true,
    }),
    []
  );

  const orders = useMemo(
    () => [
      {
        id: 1,
        fullName: "Alice Johnson",
        email: "alice@example.com",
        status: "Verified",
        createdAt: "2025-03-01",
      },
      {
        id: 2,
        fullName: "Bob Smith",
        email: "bob@example.com",
        status: "Unverified",
        createdAt: "2025-03-05",
      },
      {
        id: 3,
        fullName: "Charlie Rose",
        email: "charlie@example.com",
        status: "Verified",
        createdAt: "2025-03-10",
      },
      {
        id: 4,
        fullName: "Diana Prince",
        email: "diana@example.com",
        status: "Unverified",
        createdAt: "2025-04-01",
      },
      {
        id: 4,
        fullName: "Diana Prince",
        email: "diana@example.com",
        status: "Unverified",
        createdAt: "2025-04-01",
      },
      {
        id: 4,
        fullName: "Diana Prince",
        email: "diana@example.com",
        status: "Unverified",
        createdAt: "2025-04-01",
      },
      {
        id: 4,
        fullName: "Diana Prince",
        email: "diana@example.com",
        status: "Unverified",
        createdAt: "2025-04-01",
      },
      {
        id: 4,
        fullName: "Diana Prince",
        email: "diana@example.com",
        status: "Unverified",
        createdAt: "2025-04-01",
      },
      {
        id: 4,
        fullName: "Diana Prince",
        email: "diana@example.com",
        status: "Unverified",
        createdAt: "2025-04-01",
      },
      {
        id: 4,
        fullName: "Diana Prince",
        email: "diana@example.com",
        status: "Unverified",
        createdAt: "2025-04-01",
      },
      {
        id: 4,
        fullName: "Diana Prince",
        email: "diana@example.com",
        status: "Unverified",
        createdAt: "2025-04-01",
      },
      {
        id: 4,
        fullName: "Diana Prince",
        email: "diana@example.com",
        status: "Unverified",
        createdAt: "2025-04-01",
      },
      {
        id: 4,
        fullName: "Diana Prince",
        email: "diana@example.com",
        status: "Unverified",
        createdAt: "2025-04-01",
      },
      {
        id: 4,
        fullName: "Diana Prince",
        email: "diana@example.com",
        status: "Unverified",
        createdAt: "2025-04-01",
      },
      {
        id: 4,
        fullName: "Diana Prince",
        email: "diana@example.com",
        status: "Unverified",
        createdAt: "2025-04-01",
      },
      {
        id: 4,
        fullName: "Diana Prince",
        email: "diana@example.com",
        status: "Unverified",
        createdAt: "2025-04-01",
      },

      {
        id: 4,
        fullName: "Diana Prince",
        email: "diana@example.com",
        status: "Unverified",
        createdAt: "2025-04-01",
      },
      {
        id: 4,
        fullName: "Diana Prince",
        email: "diana@example.com",
        status: "Unverified",
        createdAt: "2025-04-01",
      },
      {
        id: 4,
        fullName: "Diana Prince",
        email: "diana@example.com",
        status: "Unverified",
        createdAt: "2025-04-01",
      },
      {
        id: 4,
        fullName: "Diana Prince",
        email: "diana@example.com",
        status: "Unverified",
        createdAt: "2025-04-01",
      },
      {
        id: 4,
        fullName: "Diana Prince",
        email: "diana@example.com",
        status: "Unverified",
        createdAt: "2025-04-01",
      },
      {
        id: 4,
        fullName: "Diana Prince",
        email: "diana@example.com",
        status: "Unverified",
        createdAt: "2025-04-01",
      },
      {
        id: 4,
        fullName: "Diana Prince",
        email: "diana@example.com",
        status: "Unverified",
        createdAt: "2025-04-01",
      },
      {
        id: 4,
        fullName: "Diana Prince",
        email: "diana@example.com",
        status: "Unverified",
        createdAt: "2025-04-01",
      },
      {
        id: 4,
        fullName: "Diana Prince",
        email: "diana@example.com",
        status: "Unverified",
        createdAt: "2025-04-01",
      },
      {
        id: 4,
        fullName: "Diana Prince",
        email: "diana@example.com",
        status: "Unverified",
        createdAt: "2025-04-01",
      },
      {
        id: 4,
        fullName: "Diana Prince",
        email: "diana@example.com",
        status: "Unverified",
        createdAt: "2025-04-01",
      },
    ],
    []
  );

  return (
    <div className="flex flex-col">
      <section className="mt-3 mb-4 grid grid-cols-1 sm:grid-cols-2 grid-rows-[5rem] [&>*]:bg-gray-100 [&>*]:border [&>*]:border-gray-200 gap-4">
        <div className="rounded-md grid place-content-center cursor-pointer">
          <span className="text-base text-center">Total Users</span>
          <div className="text-sm text-gray-500 text-center">123</div>
        </div>
        <div className="rounded-md grid place-content-center cursor-pointer">
          <span className="text-base text-center">Verified Users</span>
          <div className="text-sm text-gray-500 text-center">32</div>
        </div>
      </section>

      <section className="ag-theme-quartz flex-1 pb-32">
        <AgGridReact
          ref={gridRef}
          rowData={orders}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowSelection="multiple"
          pagination={true}
          paginationPageSize={15}
          domLayout="autoHeight"
          paginationPageSizeSelector={[15, 25, 50]}
          className=" bg-red-300 h-[calc(100% - 100px)]"
        />
      </section>
    </div>
  );
};

export default SuperAdminAccountManagement;
