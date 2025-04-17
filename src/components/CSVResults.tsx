"use client";

import { Text, Paper, Grid } from "@mantine/core";
import { useFileContext } from "@context/FilesContext";
import EntitiesMapType from "@customTypes/EntitiesMapType";
import SubmissionResult from "@components/SubmissionResult";

type Props = {
  entityMap: EntitiesMapType;
};

const CSVTable = (props: Props) => {
  const { entityMap } = props;
  const { files } = useFileContext();

  if (!files || files.length === 0) {
    return (
      <Paper shadow="sm" p="md" radius="md" withBorder>
        <Text size="sm" c="dimmed">
          Upload a CSV file to see its content here.
        </Text>
      </Paper>
    );
  }

  return (
    <Grid columns={12} grow>
      <>
        {files.map((file, index) => (
          <Grid.Col
            span={4}
            key={`submission-result-${index}-${Math.random()}`}
          >
            <SubmissionResult file={file} entityMap={entityMap} />
          </Grid.Col>
        ))}
      </>
    </Grid>
  );
};

export default CSVTable;
