"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { FileWithPath } from "@mantine/dropzone";

type FileContextType = {
  files: FileWithPath[] | undefined;
  setFiles: (files: FileWithPath[]) => void;
};

const FilesContext = createContext<FileContextType | undefined>(undefined);

export const FilesProvider = ({ children }: { children: ReactNode }) => {
  const [files, setFiles] = useState<FileWithPath[] | undefined>(undefined);

  return (
    <FilesContext.Provider value={{ files, setFiles }}>
      {children}
    </FilesContext.Provider>
  );
};

export const useFileContext = (): FileContextType => {
  const context = useContext(FilesContext);
  if (!context) {
    throw new Error("useFileContext must be used within a FilesProvider");
  }
  return context;
};
