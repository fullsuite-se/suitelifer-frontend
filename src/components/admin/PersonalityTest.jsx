import { useState, useRef, useEffect } from "react";
import {
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { ModuleRegistry } from "@ag-grid-community/core";
import { AgGridReact } from "@ag-grid-community/react";
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-quartz.css";
import api from "../../utils/axios";
import { useStore } from "../../store/authStore";
import toast from "react-hot-toast";
import { ModalDeleteConfirmation } from "../modals/ModalDeleteConfirmation";
import ContentButtons from "./ContentButtons";
import ComingSoon from "../../pages/admin/ComingSoon";
import { EyeIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import LoadingAnimation from "../loader/Loading";
import ConfirmationDialog from "./ConfirmationDialog";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

function PersonalityTest() {
  const [isComingSoon, setComingSoon] = useState(false);

  // USER DETAILS
  const user = useStore((state) => state.user);

  // PERSONALITY TEST VARIABLES
  const [personalityTests, setPersonalityTests] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const defaultPersonalityTestDetails = {
    testId: null,
    testTitle: "",
    testUrl: "",
    testDescription: "",
  };

  const [personalityTestDetails, setPTDetails] = useState(
    defaultPersonalityTestDetails
  );

  // PERSONALITY TEST TABLE VARIABLES
  const [rowData, setRowData] = useState([]);

  const gridRef = useRef();

  const [openDialog, setOpenDialog] = useState(false);

  // PERSONALITY TEST FUNCTIONS

  const handlePersonalityTestDetailsChange = (e) => {
    setPTDetails((pd) => ({
      ...pd,
      [e.target.name]: e.target.value,
    }));
  };

  const [dataUpdated, setDataUpdated] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      if (personalityTestDetails.testId === null) {
        // ADD PERSONALITY TEST
        const response = await api.post("/api/personality-test", {
          ...personalityTestDetails,
          userId: user.id,
        });

        toast.success(response.data.message);
        setPersonalityTests((pt) => [...pt, personalityTestDetails]);
      } else {
        // EDIT PERSONALITY TEST
        const response = await api.put("/api/personality-test", {
          ...personalityTestDetails,
          userId: user.id,
        });

        toast.success(response.data.message);
        const updatedPersonalityTests = personalityTests.map((pt) =>
          pt.testId === personalityTestDetails.testId
            ? { ...personalityTestDetails }
            : pt
        );
        setPersonalityTests(updatedPersonalityTests);
      }

      setDataUpdated(!dataUpdated);
    } catch (err) {
      toast.error("Encountered an error");
    } finally {
      setIsLoading(false);
    }

    setPTDetails(defaultPersonalityTestDetails);
    setOpenDialog(false);
  };

  const handleEditClick = (test) => {
    setPTDetails({
      testId: test.testId,
      testTitle: test.testTitle,
      testUrl: test.testUrl,
      testDescription: test.testDescription,
    });
    setOpenDialog(true);
  };

  const handleDeleteClick = (testId) => {
    setPTDetails((ptd) => ({ ...ptd, testId }));
    setDeleteModalIsOpen(true);
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      const response = await api.delete("/api/personality-test", {
        data: {
          testId: personalityTestDetails.testId,
        },
      });

      toast.success(response.data.message);
    } catch (err) {
      toast.error("Encountered an error deleting personality test");
    } finally {
      setIsLoading(false);
      setDeleteModalIsOpen(false);  
    }
    setDataUpdated(!dataUpdated);
    setPTDetails(defaultPersonalityTestDetails);
  };

  const handleModalClose = () => {
    setPTDetails(defaultPersonalityTestDetails);
    setOpenDialog(false);
  };

  const fetchPersonalityTests = async () => {
    try {
      const response = await api.get("/api/personality-test");

      setRowData(response.data.personalityTests);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchPersonalityTests();
  }, [dataUpdated]);

  // DELETE MODAL VARIABLES
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);

  if (isComingSoon) {
    return <ComingSoon />;
  }

  return (
    <>
      <div className="flex justify-end gap-2 mb-2">
        <ContentButtons
          icon={<PlusCircleIcon className="size-5" />}
          text="Add Test"
          handleClick={setOpenDialog}
        />
      </div>
      <div className="border-primary rounded-md w-full overflow-hidden">
        <div className="overflow-x-auto w-full">
          <div
            className="ag-theme-quartz min-w-[600px] lg:w-full"
            style={{ height: "400px" }}
          >
            <AgGridReact
              rowData={rowData}
              columnDefs={[
                {
                  headerName: "Title",
                  field: "testTitle",
                  flex: 2,
                  headerClass: "text-primary font-bold bg-gray-100",
                },

                {
                  headerName: "URL",
                  field: "testUrl",
                  flex: 2,
                  headerClass: "text-primary font-bold bg-gray-100",
                },
                {
                  headerName: "Description",
                  field: "testDescription",
                  flex: 2,
                  headerClass: "text-primary font-bold bg-gray-100",
                },
                {
                  headerName: "Date Created",
                  field: "createdAt",
                  flex: 1,
                  filter: "agTextColumnFilter",
                  headerClass: "text-primary font-bold bg-gray-100",
                  valueGetter: (params) =>
                    params.data?.createdAt
                      ? new Date(params.data.createdAt).toLocaleString()
                      : "N/A",
                },
                {
                  headerName: "Created By",
                  field: "createdBy",
                  flex: 1,
                  headerClass: "text-primary font-bold bg-gray-100",
                },
                {
                  headerName: "Action",
                  field: "action",
                  flex: 1,

                  headerClass: "text-primary font-bold bg-gray-100",
                  cellRenderer: (params) => (
                    <div className="flex gap-2">
                      <IconButton onClick={() => handleEditClick(params.data)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteClick(params.data.testId)}
                      >
                        <DeleteIcon />
                      </IconButton>
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
              rowHeight={50}
              pagination={true}
              paginationPageSize={5}
              paginationPageSizeSelector={[5, 10, 20, 50]}
              ref={gridRef}
            />
          </div>
        </div>

        {/* Dialog for Add/Edit */}
        {isLoading ? (
          <LoadingAnimation />
        ) : (
          <Dialog
            open={openDialog}
            onClose={handleModalClose}
            sx={{
              "& .MuiDialog-paper": {
                borderRadius: "16px",
                padding: "20px",
                width: "500px",
              },
            }}
          >
            <form onSubmit={(e) => handleSubmit(e)}>
              <DialogTitle className="flex w-full justify-center items-center">
                {personalityTestDetails.id ? "Edit Test" : "Add Test"}
              </DialogTitle>
              <DialogContent className="">
                <div className="w-full mb-3">
                  <label className="block text-gray-700 font-avenir-black">
                    Title<span className="text-primary">*</span>
                  </label>

                  <input
                    name="testTitle"
                    required
                    value={personalityTestDetails.testTitle}
                    onChange={(e) => handlePersonalityTestDetailsChange(e)}
                    rows={3}
                    className="w-full p-3 resize-none border rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary mb-4"
                  />
                </div>

                <div className="w-full mb-3">
                  <label className="block text-gray-700 font-avenir-black">
                    URL<span className="text-primary">*</span>
                  </label>

                  <input
                    name="testUrl"
                    required
                    value={personalityTestDetails.testUrl}
                    onChange={(e) => handlePersonalityTestDetailsChange(e)}
                    rows={3}
                    className="w-full p-3 resize-none border rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary mb-4"
                  />
                </div>

                <div className="w-full">
                  <label className="block text-gray-700 font-avenir-black">
                    Description<span className="text-primary">*</span>
                  </label>

                  <textarea
                    name="testDescription"
                    required
                    value={personalityTestDetails.testDescription}
                    onChange={(e) => handlePersonalityTestDetailsChange(e)}
                    rows={3}
                    className="w-full p-3 border rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary mb-4 mt-2 resize-y"
                  />
                </div>
              </DialogContent>
              <DialogActions>
                <button className="btn-light" onClick={handleModalClose}>
                  Cancel
                </button>
                <button
                  className="btn-primary"
                  type="submit"
                  variant="contained"
                >
                  Save
                </button>
              </DialogActions>
            </form>
          </Dialog>
        )}
      </div>
      {isLoading ? (
        <LoadingAnimation />
      ) : (
        <ConfirmationDialog
          open={deleteModalIsOpen}
          onClose={() => setDeleteModalIsOpen(false)}
          onConfirm={handleDelete}
          title="Delete Personality Test"
          description="Are you sure you want to delete this personality test? This action cannot be undone."
          confirmLabel="Delete"
          cancelBtnClass="p-2 px-4 cursor-pointer rounded-lg hover:bg-gray-200 duration-500 text-gray-700"
          confirmBtnClass="p-2 px-4 cursor-pointer rounded-lg bg-red-500 hover:bg-red-600 duration-500 text-white"
        />
      )}
    </>
  );
}

export default PersonalityTest;
