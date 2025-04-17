import { useEffect, useState } from "react";
import parseCSV from "@utils/parseCSV";
import { Flex, Divider, Paper, Table, Text } from "@mantine/core";
import { FileWithPath } from "@mantine/dropzone";
import EntitiesMapType from "@customTypes/EntitiesMapType";

type Props = {
  file: FileWithPath | undefined;
  entityMap: EntitiesMapType;
};

const SubmissionResult = (props: Props) => {
  const { file, entityMap } = props;
  const [csvData, setCsvData] = useState<string[][]>([]);

  useEffect(() => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      const parsed = parseCSV(text);
      setCsvData(parsed);
    };

    reader.readAsText(file);
  }, [file]);

  if (!file) {
    return <></>;
  }

  const headers = csvData[0] || [];
  const rows = csvData.slice(1) || [];
  const { path = "" } = file;
  const fileName = path.split("/").pop();

  return (
    <Paper shadow="sm" p="md" radius="md" withBorder>
      <Flex direction="column" gap="1rem">
        <Text fw={700} fz={"2rem"}>
          {fileName}
        </Text>
        <Divider />
        <Table.ScrollContainer minWidth={500}>
          <Table stickyHeader>
            <Table.Thead>
              <Table.Tr>
                {headers.map((header, index) => (
                  <Table.Th key={`csv-header-row-${index}-${Math.random()}`}>
                    {header}
                  </Table.Th>
                ))}
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {rows.map((col, rowIndex) => {
                const [companyName = ""] = col || [];
                const isMatched = entityMap.get(companyName);

                return (
                  <Table.Tr
                    key={`csv-result-row-${rowIndex}-${Math.random()}`}
                    bg={isMatched ? "green" : "red"}
                  >
                    {col.map((cell, cellIndex) => (
                      <Table.Td
                        key={`csv-result-cell-${rowIndex}-${cellIndex}-${Math.random()}`}
                      >
                        {cell}
                      </Table.Td>
                    ))}
                  </Table.Tr>
                );
              })}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </Flex>
    </Paper>
  );
};

export default SubmissionResult;
