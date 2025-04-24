import { useEffect, useState } from "react";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { ModuleRegistry } from "@ag-grid-community/core";
import { AgGridReact } from "@ag-grid-community/react";
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-quartz.css";
import { useStore } from "../../store/authStore";
import {
  PlusCircleIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import api from "../../utils/axios";
import ContentButtons from "./ContentButtons";
import toast from "react-hot-toast";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import ActionButtons from "../buttons/ActionButtons";
import LoadingAnimation from "../loader/Loading";
import ConfirmationDialog from "./ConfirmationDialog";
import { useAddAuditLog } from "../../components/admin/UseAddAuditLog";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

const FooterContent = () => {
  const user = useStore((state) => state.user);
  const [rowFooterData, setRowFooterData] = useState([]);
  const [certModalAddEditIsShown, setCertModalAddEditIsShown] = useState(false);
  const [dataUpdated, setDataUpdated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const addLog = useAddAuditLog();

  const defaultCertificationDetails = {
    certId: null,
    certImageUrl: "",
    createdBy: user?.id || null,
    createdAt: new Date(),
  };

  const [certificationDetails, setCertificationDetails] = useState(
    defaultCertificationDetails
  );

  const handleCertificationSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      let response;
      if (certificationDetails.certId === null) {
        response = await api.post("/api/certification", {
          ...certificationDetails,
          userId: user.id,
        });

        //Log
        addLog({
          action: "CREATE",
          description: `A new certificate URL (${certificationDetails.certImageUrl}) has been added`,
        });
      } else {
        response = await api.put("/api/certification", {
          ...certificationDetails,
          userId: user.id,
        });

        //Log
        addLog({
          action: "UPDATE",
          description: `A certificate URL (${certificationDetails.certImageUrl}) has been updated`,
        });
      }

      if (response.data.success) {
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to save certificate");
      console.error(error);
    } finally {
      setIsLoading(false);
      setDataUpdated((prev) => !prev);
      setCertModalAddEditIsShown(false);
      setCertificationDetails(defaultCertificationDetails);
    }
  };

  const handleDeleteClick = (cert) => {
    setCertificationDetails(cert);
    setDeleteModalIsOpen(true);
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      const response = await api.delete("/api/certification", {
        data: { certId: certificationDetails.certId },
      });

      //Log
      addLog({
        action: "DELETE",
        description: `A certificate URL (${certificationDetails.certImageUrl}) has been deleted`,
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setRowFooterData((prev) =>
          prev.filter((item) => item.certId !== certificationDetails.certId)
        );
      } else {
        toast.error("Failed to delete certificate.");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Error deleting certification");
    } finally {
      setIsLoading(false);
      setDeleteModalIsOpen(false);
    }

    setDataUpdated(!dataUpdated);
    setCertificationDetails(defaultCertificationDetails);
  };

  const fetchCerts = async () => {
    try {
      const response = await api.get("/api/certification");
      setRowFooterData(response.data.certifications || []);
    } catch (error) {
      console.error("Error fetching certificates:", error);
    }
  };

  useEffect(() => {
    fetchCerts();
  }, [dataUpdated]);

  return (
    <>
      <div className="flex justify-end gap-2 mb-2">
        <ContentButtons
          icon={<PlusCircleIcon className="size-5" />}
          text="Add Certification"
          handleClick={() => {
            setCertificationDetails(defaultCertificationDetails);
            setCertModalAddEditIsShown(true);
          }}
        />
      </div>

      <div className="ag-theme-quartz mt-4" style={{ height: "auto" }}>
        <AgGridReact
          rowData={rowFooterData}
          columnDefs={[
            {
              headerName: "Image",
              field: "certImageUrl",
              flex: 1,
              cellRenderer: (params) =>
                params.value ? (
                  <img
                    src={params.value}
                    alt="CertImage"
                    className="w-[100px] h-[100px] object-cover mx-auto p-4"
                  />
                ) : (
                  <span>No Image</span>
                ),
              headerClass: "text-primary font-bold bg-gray-100",
            },
            {
              headerName: "Created By",
              field: "createdBy",
              flex: 2,
              headerClass: "text-primary font-bold bg-gray-100",
            },
            {
              headerName: "Date Created",
              field: "createdAt",
              flex: 2,
              headerClass: "text-primary font-bold bg-gray-100",
              valueGetter: (params) =>
                new Date(params.data.createdAt).toLocaleString(),
            },
            {
              headerName: "Action",
              field: "action",
              flex: 1,
              headerClass: "text-primary font-bold bg-gray-100",
              cellRenderer: (params) => (
                <div className="flex">
                  <ActionButtons
                    icon={<PencilIcon className="size-5" />}
                    handleClick={() => {
                      setCertificationDetails(params.data),
                        setCertModalAddEditIsShown(true);
                    }}
                  />
                  <ActionButtons
                    icon={<TrashIcon className="size-5" />}
                    handleClick={() => {
                      handleDeleteClick(params.data);
                    }}
                  />
                </div>
              ),
            },
          ]}
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
          rowHeight={80}
          pagination
          paginationPageSize={5}
          paginationPageSizeSelector={[5, 10, 20]}
        />
      </div>

      {isLoading ? (
        <LoadingAnimation />
      ) : (
        <Dialog
          open={certModalAddEditIsShown}
          onClose={() => setCertModalAddEditIsShown(false)}
          sx={{
            "& .MuiDialog-paper": {
              borderRadius: "16px",
              padding: "20px",
              width: "600px",
            },
          }}
        >
          <DialogTitle className="text-center">
            {certificationDetails.certId === null
              ? "Add Certificate"
              : "Edit Certificate"}
          </DialogTitle>
          <DialogContent>
            <div className="text-md font-bold pt-4 font-avenir-black">
              Image Url<span className="text-primary">*</span>
            </div>
            <input
              name="certImageUrl"
              type="text"
              value={certificationDetails.certImageUrl}
              onChange={(e) =>
                setCertificationDetails({
                  ...certificationDetails,
                  [e.target.name]: e.target.value,
                })
              }
              className="w-full p-3 border-none rounded-md bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary"
            />

            <div className="flex justify-end gap-2 mt-6">
              <button
                className="btn-light"
                onClick={() => {
                  setCertificationDetails(defaultCertificationDetails);
                  setCertModalAddEditIsShown(false);
                }}
              >
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={handleCertificationSubmit}
              >
                {certificationDetails.certId === null ? "Add" : "Update"}
              </button>
            </div>
          </DialogContent>
        </Dialog>
      )}
      {isLoading ? (
        <LoadingAnimation />
      ) : (
        <ConfirmationDialog
          open={deleteModalIsOpen}
          onClose={() => setDeleteModalIsOpen(false)}
          onConfirm={handleDelete}
          title="Delete Certification"
          description="Are you sure you want to delete this certification? This action cannot be undone."
          confirmLabel="Delete"
          cancelBtnClass="p-2 px-4 cursor-pointer rounded-lg hover:bg-gray-200 duration-500 text-gray-700"
          confirmBtnClass="p-2 px-4 cursor-pointer rounded-lg bg-red-500 hover:bg-red-600 duration-500 text-white"
        />
      )}
    </>
  );
};

export default FooterContent;
