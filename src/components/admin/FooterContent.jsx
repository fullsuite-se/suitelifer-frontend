import { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, TextField } from "@mui/material";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { ModuleRegistry } from "@ag-grid-community/core";
import { AgGridReact } from "@ag-grid-community/react";
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-quartz.css";
import {
  PlusCircleIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import api from "../../utils/axios";
import ContentButtons from "./ContentButtons";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

const FooterContent = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingFooter, setEditingFooter] = useState(null);
  const [rowFooterData, setRowFooterData] = useState([]);

  const [newCert, setNewCert] = useState({
    certId: "",
    imageUrl: "",
    createdBy: "",
    createdAt: "",
  });

  const addOrUpdateCert = async () => {
    try {
      const isEditing = !!editingFooter;
      const payload = {
        cert_id: isEditing ? editingFooter.certId : undefined,
        cert_img_url: isEditing ? editingFooter.imageUrl : newCert.imageUrl,
        created_by: isEditing
          ? editingFooter.createdBy
          : newCert.createdBy || "Admin",
      };

      const response = await api.post("/api/add-cert", payload);
      const result = response.data;

      if (response.status === 200) {
        const newEntry = {
          certId: result.cert_id || payload.cert_id || Date.now(),
          imageUrl: payload.cert_img_url,
          createdBy: payload.created_by,
          createdAt: result.created_at || new Date().toISOString(),
        };

        setRowFooterData((prev) =>
          isEditing
            ? prev.map((item) =>
                item.certId === editingFooter.certId ? newEntry : item
              )
            : [...prev, newEntry]
        );

        setShowModal(false);
        setEditingFooter(null);
        setNewCert({
          certId: "",
          imageUrl: "",
          createdBy: "",
          createdAy: "",
        });
      } else {
        alert("Failed to save certificate. Please try again.");
      }
    } catch (err) {
      console.error(
        "Error adding/updating cert:",
        err?.response?.data || err.message
      );
      alert("An unexpected error occurred while saving the certificate.");
    }
  };

  const deleteCert = async (certId) => {
    try {
      const response = await api.post("/api/delete-cert", { cert_id: certId });

      if (response.status === 200) {
        setRowFooterData((prev) =>
          prev.filter((item) => item.certId !== certId)
        );
      } else {
        alert("Failed to delete certificate.");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Something went wrong while deleting.");
    }
  };

  useEffect(() => {
    const fetchCerts = async () => {
      try {
        const response = await api.get("/api/all-cert");
        const result = response.data;

        if (response.status === 200) {
          const formatted = result.map((cert) => ({
            ...cert,
            certId: cert.cert_id,
            imageUrl:
              cert.cert_img_url ||
              "https://png.pngtree.com/png-vector/20210604/ourmid/pngtree-gray-network-placeholder-png-image_3416659.jpg",
            createdBy: cert.createdBy || "Unknown",
          }));
          setRowFooterData(formatted);
        } else {
          console.error("Failed to fetch certificates:", result.error);
        }
      } catch (error) {
        console.error("Error fetching certificates:", error);
      }
    };

    fetchCerts();
  }, []);

  return (
    <>
      <div className="flex justify-end gap-2 mb-2">
        <ContentButtons
          icon={<PlusCircleIcon className="size-5" />}
          text="Add Certification"
          handleClick={setShowModal}
        />
      </div>
      <div className="ag-theme-quartz mt-4" style={{ height: "auto" }}>
        <AgGridReact
          rowData={rowFooterData}
          columnDefs={[
            {
              headerName: "Image",
              field: "imageUrl",
              flex: 1,
              cellRenderer: (params) =>
                params.value ? (
                  <img
                    src={params.value}
                    alt="NewsImage"
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
                      setEditingFooter(params.data);
                      setShowModal(true);
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
          rowHeight={
            window.innerWidth < 640 ? 60 : window.innerWidth < 768 ? 70 : 80
          }
          pagination
          paginationPageSize={5}
          paginationPageSizeSelector={[5, 10, 20]}
        />
      </div>

      <Dialog open={showModal} onClose={() => setShowModal(false)}>
        <DialogTitle className="text-center">
          {editingFooter ? "Edit Footer Item" : "Add Footer Item"}
        </DialogTitle>
        <DialogContent>
          <div className="flex flex-col gap-4 mt-2">
            <TextField
              label="Image URL"
              fullWidth
              value={editingFooter?.imageUrl || newCert.imageUrl}
              onChange={(e) =>
                editingFooter
                  ? setEditingFooter({
                      ...editingFooter,
                      imageUrl: e.target.value,
                    })
                  : setNewCert({ ...newCert, imageUrl: e.target.value })
              }
            />
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button className="btn-light" onClick={() => setShowModal(false)}>
              Cancel
            </button>
            <button className="btn-primary" onClick={addOrUpdateCert}>
              {editingFooter ? "Update" : "Add"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FooterContent;
