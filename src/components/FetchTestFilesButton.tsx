"use client";

import { Button, Flex } from "@mantine/core";
import { useFileContext } from "@context/FilesContext";
import axios from "axios";
import { FileWithPath } from "@mantine/dropzone";

const TEST_FILES = [
  {
    path: "/files/companiesAccepted.csv",
    relativePath: "./companiesAccepted.csv",
  },
  { path: "/files/companiesDupes.csv", relativePath: "./companiesDupes.csv" },
  {
    path: "/files/companiesRejected.csv",
    relativePath: "./companiesRejected.csv",
  },
  { path: "/files/companies.csv", relativePath: "./companies.csv" },
  { path: "/files/companies1.csv", relativePath: "./companies1.csv" },
  { path: "/files/companies2.csv", relativePath: "./companies2.csv" },
];

const FetchTestFilesButton = () => {
  const { setFiles } = useFileContext();

  const loadTestFiles = (): Promise<FileWithPath[]> =>
    Promise.all(
      TEST_FILES.map(async (testFile) => {
        const { path, relativePath } = testFile;
        const res = await axios.get(path);
        const blob = res.data;

        return Object.assign(
          new File([blob], relativePath, { type: blob.type }),
          testFile,
        ) as FileWithPath;
      }),
    );

  return (
    <Flex justify="flex-end">
      <Button
        maw="150px"
        onClick={() => loadTestFiles().then((files) => setFiles(files))}
      >
        Fetch Test Files
      </Button>
    </Flex>
  );
};

export default FetchTestFilesButton;
