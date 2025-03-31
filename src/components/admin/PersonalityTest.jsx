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
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import api from "../../utils/axios";
import { useStore } from "../../store/authStore";
import toast from "react-hot-toast";
import { showConfirmationToast } from "../toasts/confirm";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

function PersonalityTest() {
  // USER DETAILS
  const user = useStore((state) => state.user);

  // PERSONALITY TEST VARIABLES
  const [personalityTests, setPersonalityTests] = useState([]);

  const defaultPersonalityTestDetails = {
    testId: null,
    testTitle: "",
    url: "",
  };

  const [personalityTestDetails, setPTDetails] = useState(
    defaultPersonalityTestDetails
  );

  // PERSONALITY TEST TABLE VARIABLES
  const [rowData, setRowData] = useState([]);

  const gridOptions = {
    getRowStyle: (params) => {
      if (params.node.rowIndex % 2 === 0) {
        return { background: "#ECF1E3", color: "black" };
      } else {
        return { background: "white", color: "black" };
      }
    },
  };

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
      if (personalityTestDetails.testId === null) {
        const response = await api.post("/api/add-personality-test", {
          ...personalityTestDetails,
          userId: user.id,
        });

        toast.success(response.data.message);
        setPersonalityTests((pt) => [...pt, personalityTestDetails]);
      } else {
        const response = await api.post("/api/edit-personality-test", {
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
    }

    setPTDetails(defaultPersonalityTestDetails);
    setOpenDialog(false);
  };

  const handleEditClick = (test) => {
    setPTDetails({
      testId: test.testId,
      testTitle: test.testTitle,
      url: test.url,
    });
    setOpenDialog(true);
  };

  const handleDeleteClick = (testId) => {
    showConfirmationToast({
      message: "Delete personality test?",
      onConfirm: () => handleDelete(testId),
      onCancel: null,
    });
  };

  const handleDelete = async (testId) => {
    try {
      const response = await api.post("/api/delete-personality-test", {
        test_id: testId,
      });

      toast.success(response.data.message);
    } catch (err) {
      toast.error("Encountered an error deleting personality test");
    }
    setDataUpdated(!dataUpdated);
  };

  const handleModalClose = () => {
    setPTDetails(defaultPersonalityTestDetails);
    setOpenDialog(false);
  };

  const fetchPersonalityTests = async () => {
    try {
      const response = await api.get("/api/get-all-personality-tests");

      setRowData(response.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchPersonalityTests();
  }, [dataUpdated]);

  return (
    <>
      <div className="w-full flex justify-end items-end">
        <button
          variant="contained"
          onClick={() => setOpenDialog(true)}
          sx={{ mb: 2 }}
          className="btn-primary mb-2 "
        >
          <div className="flex items-center justify-center w-full gap-1">
            <ControlPointIcon fontSize="small" />
            <span className="text-sm flex items-center justify-center">
              Test
            </span>
          </div>
        </button>
      </div>
      <div className="border-primary border-2 rounded-3xl w-full overflow-hidden">
        <div className="overflow-x-auto w-full">
          <div
            className="ag-theme-quartz p-3 sm:p-5 min-w-[600px] lg:w-full"
            style={{ height: "400px" }}
          >
            <AgGridReact
              rowData={rowData}
              columnDefs={[
                {
                  headerName: "Title",
                  field: "testTitle",
                  flex: 2,
                  headerClass: "text-primary font-bold bg-tertiary",
                },
                {
                  headerName: "URL",
                  field: "url",
                  flex: 2,
                  headerClass: "text-primary font-bold bg-tertiary",
                },
                {
                  headerName: "Date Created",
                  field: "createdAt",
                  flex: 1,
                  filter: "agTextColumnFilter",
                  headerClass: "text-primary font-bold bg-tertiary",
                  valueGetter: (params) =>
                    params.data?.createdAt
                      ? new Date(params.data.createdAt).toLocaleString()
                      : "N/A",
                },
                {
                  headerName: "Created By",
                  field: "createdBy",
                  flex: 1,
                  headerClass: "text-primary font-bold bg-tertiary",
                },
                {
                  headerName: "Action",
                  field: "action",
                  flex: 1,

                  headerClass: "text-primary font-bold bg-tertiary",
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
              defaultColDef={{ sortable: true, filter: true }}
              rowHeight={50}
              pagination={true}
              paginationPageSize={5}
              paginationPageSizeSelector={[5, 10, 20, 50]}
              gridOptions={gridOptions}
              ref={gridRef}
            />
          </div>
        </div>

        {/* Dialog for Add/Edit */}
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
                  className="w-full p-3 resize-none border-none rounded-md bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary mt-2"
                />
              </div>

              <div className="w-full">
                <label className="block text-gray-700 font-avenir-black">
                  URL<span className="text-primary">*</span>
                </label>

                <input
                  name="url"
                  required
                  value={personalityTestDetails.url}
                  onChange={(e) => handlePersonalityTestDetailsChange(e)}
                  rows={3}
                  className="w-full p-3 resize-none border-none rounded-md bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary mt-2"
                />
              </div>
            </DialogContent>
            <DialogActions>
              <button className="btn-light" onClick={handleModalClose}>
                Cancel
              </button>
              <button className="btn-primary" type="submit" variant="contained">
                Save
              </button>
            </DialogActions>
          </form>
        </Dialog>
      </div>
    </>
  );
}

export default PersonalityTest;
