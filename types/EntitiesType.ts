export type Entity = {
  name: string;
  hits?: number;
  type: string;
  meta_type: string;
  created: string;
  curated?: number;
  domain?: string;
  created_at?: string;
  modified?: string;
  common_names?: string[];
  external_id?: string;
  display_name?: string;
  alias?: string[];
  owner?: string;
  deleted?: string;
  longname?: string;
  peers?: string[];
  pos?: {
    latitude: number;
    longitude: number;
  };
  external_links?: {
    [key: string]: {
      id: string[];
    };
  };
  lists?: string[];
  industries?: string[];
  domicile?: string;
  category?: string[];
  features?: string[];
  containers?: string[];
  population?: number;
  disambiguation_vectors?: {
    vectors: {
      words: {
        weight: number;
        value: string;
      }[];
      target_entity: string;
      comment: string;
      substrings: {
        weight: number;
        value: string;
      }[];
    }[];
    default_entity: string;
    threshold: number;
  };
  level?: number;
  topic?: string;
  media_type?: string;
  location?: string;
};

type EntitiesType = {
  [id: string]: Entity;
};

export default EntitiesType;
