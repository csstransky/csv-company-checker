import { headers } from "next/headers";

const getServerUrl = async (): Promise<string> => {
  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") || "http";
  return `${protocol}://${host}`;
};

export default getServerUrl;
