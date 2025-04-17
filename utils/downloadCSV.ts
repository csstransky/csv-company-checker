const tableArrayToCSV = (data: string[][]): string => {
  return data
    .map((row) =>
      row
        .slice(0, -1) // Remove the last column (usually "Count")
        .map((cell) => `"${cell.replace(/"/g, '""')}"`) // Escape quotes
        .join(","),
    )
    .join("\n");
};

const downloadCSV = (data: string[][], filename = "file.csv") => {
  const csvString = tableArrayToCSV(data);
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default downloadCSV;
