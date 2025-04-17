"use client";

import { Box, Flex, Group, Text } from "@mantine/core";
import { IconUpload, IconFileTypeCsv, IconX } from "@tabler/icons-react";
import { Dropzone, FileRejection } from "@mantine/dropzone";
import { useFileContext } from "@context/FilesContext";
import { useState } from "react";

const MAX_UPLOAD_SIZE = 5 * 1024 ** 2; // 5mb

const FileDropZone = () => {
  const { setFiles } = useFileContext();
  const [fileRejections, setFileRejections] = useState<FileRejection[]>([]);

  return (
    <>
      <Dropzone
        onDrop={(uploadFiles) => setFiles(uploadFiles)}
        onReject={(rejections) => setFileRejections(rejections)}
        maxSize={MAX_UPLOAD_SIZE}
        accept="text/csv"
      >
        <Group
          justify="center"
          gap="xl"
          mih={220}
          style={{ pointerEvents: "none" }}
        >
          <Dropzone.Accept>
            <IconUpload
              size={52}
              color="var(--mantine-color-blue-6)"
              stroke={1.5}
            />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <IconX size={52} color="var(--mantine-color-red-6)" stroke={1.5} />
          </Dropzone.Reject>
          <Dropzone.Idle>
            <IconFileTypeCsv
              size={52}
              color="var(--mantine-color-dimmed)"
              stroke={1.5}
            />
          </Dropzone.Idle>

          <div>
            <Text size="xl" inline>
              Drag CSV files here or click to select CSV files
            </Text>
            <Text size="sm" c="dimmed" inline mt={7}>
              Attach as many files as you like, each file should not exceed 5mb
            </Text>
          </div>
        </Group>
      </Dropzone>
      <RenderRejections fileRejections={fileRejections} />
    </>
  );
};

const RenderRejections = ({
  fileRejections,
}: {
  fileRejections: FileRejection[];
}) => {
  if (fileRejections.length === 0) {
    return <></>;
  }

  return (
    <Flex direction="column" gap="2rem">
      <Text>The following files were rejected:</Text>
      <>
        {fileRejections.map((rejection, index) => (
          <Box key={`rejected-file-${index}`}>
            <Text fontWeight="bold">{rejection.file.name}</Text>
            <>
              {rejection.errors.map((error, i) => (
                <Text key={`error-${i}`} c="red.500">
                  {error.message}
                </Text>
              ))}
            </>
          </Box>
        ))}
      </>
    </Flex>
  );
};

export default FileDropZone;
