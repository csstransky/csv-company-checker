export const COUNT_HEADER = "Count";

/**
 * Adds an extra COUNT_HEADER column, as well as removing all duplicates
 *
 * @param csv
 */
const formatCSV = (csv: string[][]): string[][] => {
  const headers = csv[0];
  const rows = csv.splice(1);

  const companyNameCountMap = rows.reduce(
    (acc: Map<string, number>, [companyName = ""]) => {
      acc.set(companyName, (acc.get(companyName) ?? 0) + 1);
      return acc;
    },
    new Map(),
  );

  const seenRowsSet = new Set<string>();
  const dedupedRows = rows.filter(([companyName = ""]) => {
    if (seenRowsSet.has(companyName)) return false;
    seenRowsSet.add(companyName);
    return true;
  });

  return [
    [...headers, COUNT_HEADER],
    ...dedupedRows.map((row) => {
      const [companyName = ""] = row;
      const count = companyNameCountMap.get(companyName) ?? 1;
      return [...row, String(count)];
    }),
  ];
};

export default formatCSV;
