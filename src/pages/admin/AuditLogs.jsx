import React from "react";
import { useEffect, useState } from "react";
import { useAddAuditLog } from "../../components/admin/UseAddAuditLog";
import api from "../../utils/axios";

const AuditLogs = () => {
  const [auditLogs, setAuditLogs] = useState({});
  const addLog = useAddAuditLog();

  const handleAddLog = () => {
    addLog({
      action: "CREATE",
      description: "NEW LOG INCOMING",
    });
  };

  const fetchLogs = async () => {
    try{
        const response = await api.get('api/audit-logs');
        console.log(response.data.logs);
        setAuditLogs(response.data.logs);
    } catch (e) {
        console.log(e);
    }
  }

  useEffect(()=>{
    fetchLogs();
  }, [])

  return <div><button onClick={handleAddLog}>add</button></div>;
};

export default AuditLogs;
