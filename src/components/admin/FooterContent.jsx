import { useEffect, useState } from "react";
import { useStore } from "../../store/authStore";
import api from "../../utils/axios";
import {
  PencilIcon,
  TrashIcon,
  PlusCircleIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import LoadingAnimation from "../loader/Loading";
import ConfirmationDialog from "./ConfirmationDialog";
import { useAddAuditLog } from "../../components/admin/UseAddAuditLog";
import FooterImageUpload from "./FooterImageUpload";

const FooterContent = () => {
  const user = useStore((state) => state.user);
  const [certifications, setCertifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [selectedCert, setSelectedCert] = useState(null);
  const [dataUpdated, setDataUpdated] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [certificationDetails, setCertificationDetails] = useState({
    certId: null,
    certImageUrl: "",
    createdBy: user?.id || null,
    createdAt: new Date(),
  });

  const addLog = useAddAuditLog();

  const fetchCertifications = async () => {
    try {
      const response = await api.get("/api/certification");
      setCertifications(response.data.certifications || []);
    } catch (error) {}
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      const response = await api.delete("/api/certification", {
        data: { certId: selectedCert.certId },
      });

      addLog({
        action: "DELETE",
        description: `A certificate URL (${selectedCert.certImageUrl}) has been deleted`,
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setCertifications((prev) =>
          prev.filter((cert) => cert.certId !== selectedCert.certId)
        );
      } else {
        toast.error("Failed to delete certificate.");
      }
    } catch (error) {
      toast.error("Error deleting certification");
    } finally {
      setIsLoading(false);
      setDeleteModalIsOpen(false);
      setSelectedCert(null);
    }
  };

  const handleAddOrEdit = async () => {
    try {
      setIsLoading(true);
      let response;
      if (certificationDetails.certId === null) {
        response = await api.post("/api/certification", {
          ...certificationDetails,
          userId: user.id,
        });

        addLog({
          action: "CREATE",
          description: `A new certificate URL (${certificationDetails.certImageUrl}) has been added`,
        });
      } else {
        response = await api.put("/api/certification", {
          ...certificationDetails,
          userId: user.id,
        });

        addLog({
          action: "UPDATE",
          description: `A certificate URL (${certificationDetails.certImageUrl}) has been updated`,
        });
      }

      if (response.data.success) {
        toast.success(response.data.message);
        setDataUpdated((prev) => !prev);
      }
    } catch (error) {
      toast.error("Failed to save certificate");
    } finally {
      setIsLoading(false);
      setIsEditing(false);
      setCertificationDetails({
        certId: null,
        certImageUrl: "",
        createdBy: user?.id || null,
        createdAt: new Date(),
      });
    }
  };

  useEffect(() => {
    fetchCertifications();
  }, [dataUpdated]);

  return (
    <section className="mb-20">
      {isLoading && <LoadingAnimation />}
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
      <div className="flex justify-end mb-4">
        <button
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hovered"
          onClick={() => {
            setCertificationDetails({
              certId: null,
              certImageUrl: "",
              createdBy: user?.id || null,
              createdAt: new Date(),
            });
            setIsEditing(true);
          }}
        >
          <PlusCircleIcon className="w-5 h-5" />
          Add Certification
        </button>
      </div>
      <div className="mb-5">
        <span className="mb-1 flex text-sm text-gray-400">
          {" "}
          <InformationCircleIcon className="size-5  text-primary/70" />
          &nbsp;Accepted formats: .jpeg, .jpg, .png, .heic
        </span>
        <span className="flex text-sm text-gray-400">
          {" "}
          <ExclamationTriangleIcon className="size-5  text-orange-500/70" />
          &nbsp;Make sure all images are in 1:1 ratio
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {certifications.map((cert) => (
          <div key={cert.certId} className="relative group">
            <img
              src={cert.certImageUrl}
              alt="Certification"
              className="w-full h-64 object-contain rounded-lg"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex justify-center items-center gap-4 transition-opacity duration-300 rounded-lg cursor-pointer">
              <button
                className="p-2 bg-primary cursor-pointer rounded-full shadow-md hover:bg-primary-hovered"
                onClick={() => {
                  setCertificationDetails(cert);
                  setIsEditing(true);
                }}
              >
                <PencilIcon className="w-5 h-5 text-white" />
              </button>
              <button
                className="p-2 bg-primary cursor-pointer rounded-full shadow-md hover:bg-primary-hovered"
                onClick={() => {
                  setSelectedCert(cert);
                  setDeleteModalIsOpen(true);
                }}
              >
                <TrashIcon className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <FooterImageUpload
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        onSave={handleAddOrEdit}
        certificationDetails={certificationDetails}
        setCertificationDetails={setCertificationDetails}
        isEditing={isEditing}
        actionType={certificationDetails.certId === null ? "Add" : "Edit"}
      />
    </section>
  );
};

export default FooterContent;
