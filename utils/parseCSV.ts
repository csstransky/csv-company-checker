const parseCSV = (csv: string): string[][] =>
  csv
    .trim()
    .split("\n")
    .map((line) => {
      const regex = /"([^"]*(?:""[^"]*)*)"|([^,]+)/g;
      const matches = [...line.matchAll(regex)];
      return matches.map((m) => (m[1] ?? m[2]).replace(/""/g, '"').trim());
    });

export default parseCSV;
