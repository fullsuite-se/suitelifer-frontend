import React, { useRef, useMemo, useState, useEffect } from "react";
import { AgGridReact } from "@ag-grid-community/react";
import { ModuleRegistry } from "@ag-grid-community/core";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import api from "../../utils/axios";
import ModalUserManagement from "../../components/modals/ModalUserManagement";
import toast from "react-hot-toast";
import formatTimestamp from "../../utils/formatTimestamp";
import ActionButtons from "../../components/buttons/ActionButtons";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useStore } from "../../store/authStore";
import { useAddAuditLog } from "../../components/admin/UseAddAuditLog";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

const SuperAdminAccountManagement = () => {
  const addLog = useAddAuditLog();

  // User Accounts Table Essentials
  const gridRef = useRef(null);

  const columnDefs = useMemo(
    () => [
      // { headerName: "User ID", field: "userId", checkboxSelection: true },
      { headerName: "Full Name", flex: 2, field: "fullName" },
      { headerName: "Email", flex: 2, field: "userEmail" },
      {
        headerName: "Verification",
        field: "isVerified",
        valueGetter: (params) =>
          params.data.isVerified === 1 ? "Verified" : "Unverified",
      },
      {
        headerName: "Role",
        field: "userType",
        cellRenderer: (params) => (
          <select
            id={params.data.userId}
            value={params.data.userType}
            onChange={(e) => confirmTypeChange(params.data, e.target.value)}
            className="w-full"
          >
            <option
              value="SUPER ADMIN"
              disabled={user.email !== "infosec@fullsuite.ph"}
            >
              Super Admin
            </option>
            <option
              value="ADMIN"
              disabled={
                user.email === "infosec@fullsuite.ph"
                  ? false
                  : params.data.userType === "SUPER ADMIN"
              }
            >
              Admin
            </option>
            <option
              value="EMPLOYEE"
              disabled={
                user.email === "infosec@fullsuite.ph"
                  ? false
                  : params.data.userType === "SUPER ADMIN"
              }
            >
              Employee
            </option>
          </select>
        ),
      },
      {
        headerName: "Status",
        field: "isActive",
        cellRenderer: (params) => (
          <select
            value={params.data.isActive}
            onChange={(e) => confirmStatusChange(params.data, e.target.value)}
            className="w-full"
          >
            <option value={1}>Active</option>
            <option value={0}>Disabled</option>
          </select>
        ),
      },
      {
        headerName: "Date Registered",
        // flex: 1.5, // if action is present
        flex: 1,
        field: "createdAt",
        valueGetter: (params) =>
          formatTimestamp(params.data.createdAt).fullDate,
      },
      // {
      //   headerName: "Action",
      //   cellRenderer: (params) => (
      //     <ActionButtons
      //       icon={<TrashIcon className="size-5 " />}
      //       handleClick={null}
      //     />
      //   ),
      // },
    ],
    []
  );

  const defaultColDef = useMemo(
    () => ({
      flex: 1,
      sortable: true,
      filter: true,
      resizable: false,
    }),
    []
  );

  const [userAccounts, setUserAccounts] = useState([]);

  const fetchUserAccounts = async () => {
    try {
      const response = await api.get("api/users");

      setUserAccounts(response.data.users);
    } catch (err) {
      console.log(err);
    }
  };

  const confirmTypeChange = (data, value) => {
    if (data.userType === value) {
      return;
    }

    let title;
    let message;

    if (data.userType === "EMPLOYEE" && value === "ADMIN") {
      title = `Make ${data.fullName} as an ${value}?`;
      message =
        "This grants the user access to content management features. Their role can be changed later if needed.";
    } else {
      title = `Change ${data.fullName}'s role to ${value}?`;
      message =
        "This removes the user’s access to content management features. Their admin privileges can be reassigned at any time.";
    }

    modal.onConfirm = () => {
      addLog({
        action: "UPDATE",
        description: `${data.fullName}'s role has been updated from ${data.userType} to ${value}`,
      });
      handleTypeChange(value, data.userId);
    };

    setModal((m) => ({
      ...m,
      isOpen: true,
      title,
      message,
    }));
  };

  const handleTypeChange = async (userType, accountId) => {
    try {
      const response = await api.patch("/api/users/type", {
        userType,
        accountId,
      });

      if (response.status === 200) {
        toast.success("Role Updated Successfully");
      }
    } catch (err) {
      console.log(err);
    } finally {
      window.location.reload();
      setModal((m) => defaultModalDetails);
    }
  };

  const confirmStatusChange = (data, value) => {
    if (data.isActive === Number(value)) {
      return;
    }

    let title;
    let message;

    if (data.isActive === 1 && Number(value) === 0) {
      title = `Disable ${data.fullName}'s account?`;
      message =
        "This prevents the user from accessing the system. The account can be reactivated later if needed.";
    } else {
      title = `Reactivate ${data.fullName}'s account?`;
      message =
        "This restores the user’s access to the system. The account can be disabled again at any time.";
    }

    modal.onConfirm = () => {
      addLog({
        action: "UPDATE",
        description: `${data.fullName}'s account has been ${
          data.isActive === 1 && Number(value) === 0
            ? "disabled"
            : "reactivated"
        }`,
      });
      handleStatusChange(Number(value), data.userId);
    };

    setModal((m) => ({
      ...m,
      isOpen: true,
      title,
      message,
    }));
  };

  const handleStatusChange = async (isActive, accountId) => {
    try {
      const response = await api.patch("/api/users/status", {
        isActive,
        accountId,
      });

      if (response.status === 200) {
        toast.success("Status Updated Successfully");
      }
    } catch (err) {
      console.log(err);
    } finally {
      window.location.reload();
      setModal((m) => defaultModalDetails);
    }
  };

  const handleClose = () => {
    setModal(defaultModalDetails);
  };

  const defaultModalDetails = {
    isOpen: false,
    isDelete: false,
    title: "",
    message: "",
  };

  const [modal, setModal] = useState(defaultModalDetails);

  const user = useStore((state) => state.user);

  useEffect(() => {
    fetchUserAccounts();
  }, []);

  return (
    <div className="flex flex-col">
      <section className="mt-3 mb-4 grid grid-cols-1 sm:grid-cols-7 grid-rows-[5rem] [&>*]:bg-white [&>*]:border [&>*]:border-gray-300 gap-4">
        <div className="rounded-md grid place-content-center cursor-pointer">
          <span className="text-small font-avenir-black text-primary text-center">
            Total Accounts
          </span>
          <div className="text-body  text-black text-center">
            {userAccounts.length}
          </div>
        </div>
        <div className="rounded-md grid place-content-center cursor-pointer">
          <span className="text-small font-avenir-black text-gray-500 text-center">
            Verified
          </span>
          <div className="text-body text-black text-center">
            {userAccounts.filter((account) => account.isVerified).length}
          </div>
        </div>
        <div className="rounded-md grid place-content-center cursor-pointer">
          <span className="text-small font-avenir-black text-orange-400 text-center">
            Unverified
          </span>
          <div className="text-body text-black text-center">
            {userAccounts.filter((account) => !account.isVerified).length}
          </div>
        </div>
        <div className="rounded-md grid place-content-center cursor-pointer">
          <span className="text-small font-avenir-black text-gray-500 text-center">
            Active
          </span>
          <div className="text-body text-black text-center">
            {userAccounts.filter((account) => account.isActive).length}
          </div>
        </div>
        <div className="rounded-md grid place-content-center cursor-pointer">
          <span className="text-small font-avenir-black text-red-800 text-center">
            Disabled
          </span>
          <div className="text-body text-black text-center">
            {userAccounts.filter((account) => !account.isActive).length}
          </div>
        </div>
        <div className="rounded-md grid place-content-center cursor-pointer">
          <span className="text-small font-avenir-black text-violet-800 text-center">
            Admin
          </span>
          <div className="text-body text-black text-center">
            {
              userAccounts.filter((account) => account.userType === "ADMIN")
                .length
            }
          </div>
        </div>
        <div className="rounded-md grid place-content-center cursor-pointer">
          <span className="text-small font-avenir-black text-gray-500 text-center">
            Employees
          </span>
          <div className="text-body text-black text-center">
            {
              userAccounts.filter((account) => account.userType === "EMPLOYEE")
                .length
            }
          </div>
        </div>
      </section>

      <section className="ag-theme-quartz flex-1 pb-32">
        <AgGridReact
          ref={gridRef}
          rowData={userAccounts}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pagination={true}
          paginationPageSize={15}
          domLayout="autoHeight"
          paginationPageSizeSelector={[15, 25, 50]}
          className=" bg-red-300 h-[calc(100% - 100px)]"
        />
      </section>
      <ModalUserManagement
        isOpen={modal.isOpen}
        isDelete={modal.isDelete}
        onConfirm={modal.onConfirm}
        onClose={handleClose}
        title={modal.title}
        message={modal.message}
      />
    </div>
  );
};

export default SuperAdminAccountManagement;
