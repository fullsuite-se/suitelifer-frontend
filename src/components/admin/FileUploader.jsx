import { useState, createContext, useContext } from "react";
import ImageUploader from "./ImageUploader";

const FileUploadContext = createContext();

export const useFileUpload = () => useContext(FileUploadContext);

const FileUploaderProvider = ({ children }) => {

  return (
    <FileUploadContext.Provider>
      {children}

      <ImageUploader/>
 
    </FileUploadContext.Provider>
  );
};

export default FileUploaderProvider;
