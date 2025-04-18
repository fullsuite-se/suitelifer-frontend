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
  const [showModal, setShowModal] = useState(false);
  const [editingFooter, setEditingFooter] = useState(null);
  const [rowFooterData, setRowFooterData] = useState([]);
  const user = useStore((state) => state.user);

  const [newCert, setNewCert] = useState({
    certId: "",
    certImageUrl: "",
    createdBy: user.id,
    createdAt: new Date(),
  });

  console.log(user)

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...newCert}; 
      console.log("payload", payload);
      if (newCert.certId) {
        const response = await api.put("/api/update-cert", {...payload, userId: user.id});
        toast.success(response.data.message);

        const updatedCerts = rowFooterData.map((c) =>
          c.certId === newCert.certd ? { ...newCert } : c
        );
        setRowFooterData(updatedCerts);
      } else {
        const response = await api.post("/api/add-cert", payload);

        toast.success(response.data.message);

        setRowFooterData((prev) => [
          ...prev,
          { ...newCert, certId: Date.now() },
        ]);
      }
      setShowModal(false);
    } catch (error) {
      toast.error("Failed to save certificate");
      console.error(error);
    }
  };

  const deleteCert = async (certId) => {
    try {
      const response = await api.post("/api/delete-cert", { cert_id: certId });
  
      if (response.status === 200) {
        setRowFooterData((prev) => prev.filter((item) => item.cert_id !== certId));
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
        console.log("respons", response.data);
        const result = response.data;

        if (response.status === 200) {
          const formatted = result.map((cert) => ({
            ...cert,
            certId: cert.cert_id,
            certImageUrl:
              cert.cert_img_url ||
              "https://png.pngtree.com/png-vector/20210604/ourmid/pngtree-gray-network-placeholder-png-image_3416659.jpg",
            created_by: cert.createdBy || "Unknown",
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
          handleClick={() => {
            setEditingFooter(null);
            setNewCert({ ...newCert, certId: null });
            setShowModal(true);
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
                      setNewCert({ ...params.data });
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
          rowHeight={80}
          pagination
          paginationPageSize={5}
          paginationPageSizeSelector={[5, 10, 20]}
        />
      </div>

      <Dialog open={showModal} onClose={() => setShowModal(false)}>
        <DialogTitle className="text-center">
          {editingFooter ? "Edit Certificate" : "Add Certificate"}
        </DialogTitle>
        <DialogContent>
          <div className="flex flex-col gap-4 mt-2">
            <TextField
              label="Image URL"
              fullWidth
              value={newCert.certImageUrl}
              onChange={(e) =>
                setNewCert({ ...newCert, certImageUrl: e.target.value })
              }
            />
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button className="btn-light" onClick={() => setShowModal(false)}>
              Cancel
            </button>
            <button className="btn-primary" onClick={handleSubmit}>
              {editingFooter ? "Update" : "Add"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FooterContent;
