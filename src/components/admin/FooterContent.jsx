import { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, TextField } from "@mui/material";
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

ModuleRegistry.registerModules([ClientSideRowModelModule]);

const FooterContent = () => {
  const [rowFooterData, setRowFooterData] = useState([]);
  const user = useStore((state) => state.user);

  // CERTIFICATIONS
  const [certModalAddEditIsShown, setCertModalAddEditIsShown] = useState(false);

  const defaultCertificationDetails = {
    certId: null,
    certImageUrl: "",
  };

  const [certificationDetails, setCertificationDetails] = useState(
    defaultCertificationDetails
  );

  const [dataUpdated, setDataUpdated] = useState(false);

  const handleCertificationSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (certificationDetails.certId === null) {
        // ADD CERTIFICATION
        response = await api.post("/api/certification", {
          ...certificationDetails,
          userId: user.id,
        });
      } else {
        // EDIT CERTIFICATION
        response = await api.put("/api/certification", {
          ...certificationDetails,
          userId: user.id,
        });
      }

      if (response.data.success) {
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to save certificate");
      console.error(error);
    } finally {
      setDataUpdated(!dataUpdated);
      setCertModalAddEditIsShown(false);
      setCertificationDetails(defaultCertificationDetails);
    }
  };

  const deleteCert = async (certId) => {
    try {
      const response = await api.delete("/api/certification", {
        data: { certId },
      });

      if (response.data.success) {
        toast.success(response.data.message);
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Error Deleting Certification");
    } finally {
      setDataUpdated(!dataUpdated);
    }
  };

  const fetchCerts = async () => {
    try {
      const response = await api.get("/api/certification");

      setRowFooterData(response.data.certifications);
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
          handleClick={() => setCertModalAddEditIsShown(true)}
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
                    className="w-[100px] h-[100px] sm:w-[100px] sm:h-[100px] object-cover mx-auto p-4"
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
              headerName: "Created At",
              field: "createdAt",
              flex: 2,
              headerClass: "text-primary font-bold bg-gray-100",
              valueGetter: (params) =>
                new Date(params.data.createdAt).toLocaleString(),
            },
            {
              headerName: "Action",
              field: "action",
              flex: 2,
              headerClass: "text-primary font-bold bg-gray-100",
              cellRenderer: (params) => (
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setCertificationDetails(params.data);
                      setCertModalAddEditIsShown(true);
                    }}
                  >
                    <PencilIcon className="size-5 text-black" />
                  </button>
                  <button onClick={() => deleteCert(params.data.certId)}>
                    <TrashIcon className="size-5 text-black" />
                  </button>
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

      <Dialog
        open={certModalAddEditIsShown}
        onClose={() => setCertModalAddEditIsShown(false)}
      >
        <DialogTitle className="text-center">
          {certificationDetails.certId === null
            ? "Add Certificate"
            : "Edit Certificate"}
        </DialogTitle>
        <DialogContent>
          <div className="flex flex-col gap-4 mt-2">
            <TextField
              label="Image URL"
              fullWidth
              name="certImageUrl"
              value={certificationDetails.certImageUrl}
              onChange={(e) =>
                setCertificationDetails({
                  ...certificationDetails,
                  [e.target.name]: e.target.value,
                })
              }
            />
          </div>

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
            <button className="btn-primary" onClick={handleCertificationSubmit}>
              {certificationDetails.certId === null ? "Add" : "Update"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FooterContent;
