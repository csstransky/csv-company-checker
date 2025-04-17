import EntitiesType from "@customTypes/EntitiesType";
import getServerUrl from "./getServerUrl";
import axios from "axios";

const fetchEntities = async (): Promise<EntitiesType> => {
  const url = getServerUrl();

  return axios
    .get<EntitiesType>(`${url}/data/entities.json`)
    .then(({ data = {} }) => data)
    .catch(({ response: { data = {} } = {} }) => data);
};

export default fetchEntities;
