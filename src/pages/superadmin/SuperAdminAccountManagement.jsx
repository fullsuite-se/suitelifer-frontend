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
      { headerName: "Verification", field: "verification" },
      { headerName: "Role", field: "role" },
      { headerName: "Status", field: "status" },
      { headerName: "Created At", field: "createdAt" },
    ],
    []
  );

  const defaultColDef = useMemo(
    () => ({
      flex: 1,
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
        verification: "Verified",
        role: "SUPERADMIN",
        status: 1,
        createdAt: "2025-03-01",
      },
      {
        id: 2,
        fullName: "Bob Smith",
        email: "bob@example.com",
        verification: "Verified",
        role: "SUPERADMIN",
        status: 1,
        createdAt: "2025-03-05",
      },
      {
        id: 3,
        fullName: "Charlie Rose",
        email: "charlie@example.com",
        verification: "Verified",
        role: "ADMIN",
        status: 1,
        createdAt: "2025-03-10",
      },
      {
        id: 4,
        fullName: "Diana Prince",
        email: "diana@example.com",
        verification: "Unverified",
        role: "ADMIN",
        status: 1,
        createdAt: "2025-04-01",
      },
      {
        id: 5,
        fullName: "Diana Prince",
        email: "diana@example.com",
        verification: "Unverified",
        role: "EMPLOYEE",
        status: 0,
        createdAt: "2025-04-01",
      },
      {
        id: 4,
        fullName: "Diana Prince",
        email: "diana@example.com",
        verification: "Unverified",
        role: "EMPLOYEE",
        status: 1,
        createdAt: "2025-04-01",
      },
      {
        id: 4,
        fullName: "Diana Prince",
        email: "diana@example.com",
        verification: "Unverified",
        role: "EMPLOYEE",
        status: 0,
        createdAt: "2025-04-01",
      },
      {
        id: 4,
        fullName: "Diana Prince",
        email: "diana@example.com",
        verification: "Unverified",
        role: "EMPLOYEE",
        status: 1,
        createdAt: "2025-04-01",
      },
      {
        id: 4,
        fullName: "Diana Prince",
        email: "diana@example.com",
        verification: "Unverified",
        role: "EMPLOYEE",
        status: 1,
        createdAt: "2025-04-01",
      },
      {
        id: 4,
        fullName: "Diana Prince",
        email: "diana@example.com",
        verification: "Unverified",
        role: "EMPLOYEE",
        status: 1,
        createdAt: "2025-04-01",
      },
      {
        id: 4,
        fullName: "Diana Prince",
        email: "diana@example.com",
        verification: "Unverified",
        role: "EMPLOYEE",
        status: 1,
        createdAt: "2025-04-01",
      },
      {
        id: 4,
        fullName: "Diana Prince",
        email: "diana@example.com",
        verification: "Unverified",
        role: "EMPLOYEE",
        status: 1,
        createdAt: "2025-04-01",
      },
      {
        id: 4,
        fullName: "Diana Prince",
        email: "diana@example.com",
        verification: "Unverified",
        role: "EMPLOYEE",
        status: 1,
        createdAt: "2025-04-01",
      },
      {
        id: 4,
        fullName: "Diana Prince",
        email: "diana@example.com",
        verification: "Unverified",
        role: "EMPLOYEE",
        status: 1,
        createdAt: "2025-04-01",
      },
      {
        id: 4,
        fullName: "Diana Prince",
        email: "diana@example.com",
        verification: "Unverified",
        role: "EMPLOYEE",
        status: 1,
        createdAt: "2025-04-01",
      },
      {
        id: 4,
        fullName: "Diana Prince",
        email: "diana@example.com",
        verification: "Unverified",
        role: "EMPLOYEE",
        status: 1,
        createdAt: "2025-04-01",
      },

      {
        id: 4,
        fullName: "Diana Prince",
        email: "diana@example.com",
        verification: "Unverified",
        role: "EMPLOYEE",
        status: 1,
        createdAt: "2025-04-01",
      },
      {
        id: 4,
        fullName: "Diana Prince",
        email: "diana@example.com",
        verification: "Unverified",
        role: "EMPLOYEE",
        status: 1,
        createdAt: "2025-04-01",
      },
      {
        id: 4,
        fullName: "Diana Prince",
        email: "diana@example.com",
        verification: "Unverified",
        role: "EMPLOYEE",
        status: 1,
        createdAt: "2025-04-01",
      },
      {
        id: 4,
        fullName: "Diana Prince",
        email: "diana@example.com",
        verification: "Unverified",
        role: "EMPLOYEE",
        status: 1,
        createdAt: "2025-04-01",
      },
      {
        id: 4,
        fullName: "Diana Prince",
        email: "diana@example.com",
        verification: "Unverified",
        role: "EMPLOYEE",
        status: 1,
        createdAt: "2025-04-01",
      },
      {
        id: 4,
        fullName: "Diana Prince",
        email: "diana@example.com",
        verification: "Unverified",
        role: "EMPLOYEE",
        status: 1,
        createdAt: "2025-04-01",
      },
      {
        id: 4,
        fullName: "Diana Prince",
        email: "diana@example.com",
        verification: "Unverified",
        role: "EMPLOYEE",
        status: 1,
        createdAt: "2025-04-01",
      },
      {
        id: 4,
        fullName: "Diana Prince",
        email: "diana@example.com",
        verification: "Unverified",
        role: "EMPLOYEE",
        status: 1,
        createdAt: "2025-04-01",
      },
      {
        id: 4,
        fullName: "Diana Prince",
        email: "diana@example.com",
        verification: "Unverified",
        role: "EMPLOYEE",
        status: 1,
        createdAt: "2025-04-01",
      },
      {
        id: 4,
        fullName: "Diana Prince",
        email: "diana@example.com",
        verification: "Unverified",
        role: "EMPLOYEE",
        status: 1,
        createdAt: "2025-04-01",
      },
      {
        id: 4,
        fullName: "Diana Prince",
        email: "diana@example.com",
        verification: "Unverified",
        role: "EMPLOYEE",
        status: 1,
        createdAt: "2025-04-01",
      },
    ],
    []
  );

  return (
    <div className="flex flex-col">
      <section className="mt-3 mb-4 grid grid-cols-1 sm:grid-cols-7 grid-rows-[5rem] [&>*]:bg-white [&>*]:border [&>*]:border-gray-300 gap-4">
        <div className="rounded-md grid place-content-center cursor-pointer">
          <span className="text-small font-avenir-black text-primary text-center">
            Total
          </span>
          <div className="text-body  text-black text-center">27</div>
        </div>
        <div className="rounded-md grid place-content-center cursor-pointer">
          <span className="text-small font-avenir-black text-gray-500 text-center">
            Verified
          </span>
          <div className="text-body text-black text-center">25</div>
        </div>
        <div className="rounded-md grid place-content-center cursor-pointer">
          <span className="text-small font-avenir-black text-orange-400 text-center">
            Unverified
          </span>
          <div className="text-body text-black text-center">2</div>
        </div>
        <div className="rounded-md grid place-content-center cursor-pointer">
          <span className="text-small font-avenir-black text-gray-500 text-center">
            Active
          </span>
          <div className="text-body text-black text-center">24</div>
        </div>
        <div className="rounded-md grid place-content-center cursor-pointer">
          <span className="text-small font-avenir-black text-red-800 text-center">
            Disabled
          </span>
          <div className="text-body text-black text-center">3</div>
        </div>
        <div className="rounded-md grid place-content-center cursor-pointer">
          <span className="text-small font-avenir-black text-violet-800 text-center">
            Admin
          </span>
          <div className="text-body text-black text-center">2</div>
        </div>
        <div className="rounded-md grid place-content-center cursor-pointer">
          <span className="text-small font-avenir-black text-gray-500 text-center">
            Employees
          </span>
          <div className="text-body text-black text-center">25</div>
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
