import { useEffect, useState } from "react";
import parseCSV from "@utils/parseCSV";
import {
  Flex,
  Divider,
  Paper,
  Table,
  Text,
  Modal,
  Code,
  Button,
  Select,
} from "@mantine/core";
import { FileWithPath } from "@mantine/dropzone";
import EntitiesMapType from "@customTypes/EntitiesMapType";
import { DEFAULT_ENTITY, Entity } from "@customTypes/EntitiesType";
import { useDisclosure } from "@mantine/hooks";
import formatCSV from "@utils/formatCSV";
import downloadCSV from "@utils/downloadCSV";

type Props = {
  file: FileWithPath | undefined;
  entityMap: EntitiesMapType;
};

const SubmissionResult = (props: Props) => {
  const { file } = props;
  const [csvData, setCsvData] = useState<string[][]>([]);

  useEffect(() => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      const parsed = parseCSV(text);
      const formatted = formatCSV(parsed);
      setCsvData(formatted);
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
        <RenderInfo {...props} csvData={csvData} />
        <Divider />
        <RenderTable {...props} csvData={csvData} />
      </Flex>
    </Paper>
  );
};

type RenderProps = Props & {
  csvData: string[][];
};

const RenderInfo = ({ csvData, entityMap, file }: RenderProps) => {
  const headers = csvData[0] || [];
  const rows = csvData.slice(1) || [];

  const totalRows = rows.length;
  const matches = rows.reduce((acc, [companyName = ""]) => {
    const isMatched = entityMap.get(companyName);
    return acc + (isMatched ? 1 : 0);
  }, 0);
  const rejects = totalRows - matches;
  const duplicates = rows.reduce((acc, [, , count]) => {
    const num = Number(count);
    return acc + (num > 1 ? num - 1 : 0);
  }, 0);

  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    if (rejects === 0) {
      setStatus("Approved");
    } else if (matches === 0) {
      setStatus("Rejected");
    } else {
      setStatus("Pending Review");
    }
  }, [matches, rejects]);

  const handleStatusChange = (value: string) => {
    setStatus(value);
  };

  const handleDownload = () => {
    const { path = "" } = file;
    const fileName = path.split("/").pop();

    const matchedRows = rows.filter(([companyName = ""]) =>
      entityMap.get(companyName),
    );
    const csvWithHeaders = [headers, ...matchedRows];
    downloadCSV(csvWithHeaders, `matched-${fileName}`);
  };

  const maxButtonWidth = 200;
  return (
    <Flex direction="column" gap="1rem">
      <Select
        disabled={!matches || !rejects}
        maw={maxButtonWidth}
        label="Status"
        value={status}
        onChange={handleStatusChange}
        data={["Pending Review", "Under Review", "Approved", "Rejected"]}
      />
      <Flex direction="column">
        <Text>Total Rows: {totalRows}</Text>
        <Text>Matches: {matches}</Text>
        <Text>Rejects: {rejects}</Text>
        <Text>Duplicates: {duplicates}</Text>
      </Flex>
      <Button onClick={handleDownload} maw={maxButtonWidth} disabled={!matches}>
        Download Matched CSV
      </Button>
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
