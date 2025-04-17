import axios from "axios";
import EntitiesType from "@customTypes/EntitiesType";
import { headers } from "next/headers";
import FileDropZone from "@components/FileDropZone";
import CSVResults from "@components/CSVResults";
import { Flex } from "@mantine/core";
import EntitiesMapType from "@customTypes/EntitiesMapType";

const createEntityMap = (entities: EntitiesType): EntitiesMapType =>
  Object.values(entities).reduce((accMap, entity) => {
    const { name = "" } = entity || {};
    accMap.set(name, entity);
    return accMap;
  }, new Map());

const Home = async () => {
  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") || "http";
  const url = `${protocol}://${host}`;

  const entities = await axios
    .get(`${url}/data/entities.json`)
    .then(({ data = {} }) => data as EntitiesType)
    .catch((error) => {
      const { response: { data = {} } = {} } = error || {};
      return data as EntitiesType;
    });

  const entityMap = createEntityMap(entities);

  return (
    <Flex p="4rem" gap="2rem" direction="column">
      <FileDropZone />
      <CSVResults entityMap={entityMap} />
      {JSON.stringify(entityMap.get("Cohesity"))}
    </Flex>
  );
};

export default Home;
