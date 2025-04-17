import { useEffect, useState } from "react";
import parseCSV from "@utils/parseCSV";
import { Flex, Divider, Paper, Table, Text, Modal, Code } from "@mantine/core";
import { FileWithPath } from "@mantine/dropzone";
import EntitiesMapType from "@customTypes/EntitiesMapType";
import { DEFAULT_ENTITY, Entity } from "@customTypes/EntitiesType";
import { useDisclosure } from "@mantine/hooks";

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

  const { path = "" } = file;
  const fileName = path.split("/").pop();

  return (
    <Paper shadow="sm" p="md" radius="md" withBorder>
      <Flex direction="column" gap="1rem">
        <Text fw={700} fz={"2rem"}>
          {fileName}
        </Text>
        <Divider />
        <RenderInfo csvData={csvData} entityMap={entityMap} />
        <Divider />
        <RenderTable csvData={csvData} entityMap={entityMap} />
      </Flex>
    </Paper>
  );
};

type RenderProps = {
  csvData: string[][];
  entityMap: EntitiesMapType;
};

const RenderInfo = ({ csvData, entityMap }: RenderProps) => {
  const rows = csvData.slice(1) || [];
  const totalRows = rows.length;
  const matches = rows.reduce((acc, [companyName = ""]) => {
    const isMatched = entityMap.get(companyName);
    return acc + (isMatched ? 1 : 0);
  }, 0);
  const rejects = totalRows - matches;

  const companyNameCountMap = rows.reduce(
    (acc: Record<string, number>, [companyName = ""]) => {
      acc[companyName] = (acc[companyName] ?? 0) + 1;
      return acc;
    },
    {},
  );
  const duplicates = Object.entries(companyNameCountMap)
    .filter(([, count]) => count > 1)
    .reduce((acc, [, count]) => {
      return acc + count - 1;
    }, 0);

  return (
    <Flex direction="column">
      <Text>Total Rows: {totalRows}</Text>
      <Text>Matches: {matches}</Text>
      <Text>Rejects: {rejects}</Text>
      <Text>Duplicates: {duplicates}</Text>
    </Flex>
  );
};

const RenderTable = ({ csvData, entityMap }: RenderProps) => {
  const [currentRow, setCurrentRow] = useState(0);
  const [opened, { open, close }] = useDisclosure(false);

  if (csvData.length === 0) {
    return <></>;
  }

  const headers = csvData[0] || [];
  const rows = csvData.slice(1) || [];
  const currentEntity = entityMap.get(rows[currentRow][0]) || DEFAULT_ENTITY;

  return (
    <>
      <EntityModal entity={currentEntity} opened={opened} close={close} />
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
                  onClick={() => {
                    if (isMatched) {
                      setCurrentRow(rowIndex);
                      open();
                    }
                  }}
                  style={{ cursor: isMatched ? "pointer" : undefined }}
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
    </>
  );
};

type EntityModalType = {
  entity: Entity;
  opened: boolean;
  close: () => void;
};

const EntityModal = ({ entity, opened, close }: EntityModalType) => {
  const { name } = entity;

  return (
    <Modal opened={opened} onClose={close} title={name}>
      <Code block>{JSON.stringify(entity, null, 2)}</Code>
    </Modal>
  );
};

export default SubmissionResult;
