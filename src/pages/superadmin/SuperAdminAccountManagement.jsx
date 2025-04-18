import React from "react";

const SuperAdminAccountManagement = () => {
  return (
    <div>
      <section className="mt-3 mb-4 grid grid-cols-2 grid-rows-[5rem] [&>*]:bg-gray-100 [&>*]:border [&>*]:border-gray-200 gap-4">
        <div className="rounded-md grid place-content-center cursor-pointer">
          <span className="text-base text-center">Total Users</span>
          <div className="text-sm text-gray-500 text-center">123</div>
        </div>
        <div className="rounded-md grid place-content-center cursor-pointer">
          <span className="text-base text-center">Verified Users</span>
          <div className="text-sm text-gray-500 text-center">32</div>
        </div>
      </section>
    </div>
  );
};

export default SuperAdminAccountManagement;
