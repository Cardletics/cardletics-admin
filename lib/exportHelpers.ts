import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

type ExportSection = {
  title: string;
  rows: Record<string, unknown>[];
};

export function exportUserDetailsToExcel(
  fileName: string,
  sections: ExportSection[]
) {
  const workbook = XLSX.utils.book_new();

  sections.forEach((section) => {
    const rows =
      section.rows.length > 0
        ? section.rows
        : [{ info: "Keine Daten vorhanden" }];

    const worksheet = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      safeSheetName(section.title)
    );
  });

  XLSX.writeFile(workbook, `${fileName}.xlsx`, { compression: true });
}

export function exportUserDetailsToPdf(
  fileName: string,
  title: string,
  sections: ExportSection[]
) {
  const doc = new jsPDF();
  let currentY = 20;

  doc.setFontSize(18);
  doc.text(title, 14, currentY);
  currentY += 10;

  sections.forEach((section, index) => {
    const rows =
      section.rows.length > 0
        ? section.rows
        : [{ info: "Keine Daten vorhanden" }];

    const columns = Object.keys(rows[0]);
    const body = rows.map((row) =>
      columns.map((column) => formatPdfValue(row[column]))
    );

    doc.setFontSize(13);
    doc.text(section.title, 14, currentY);

    autoTable(doc, {
      startY: currentY + 4,
      head: [columns],
      body,
      styles: {
        fontSize: 9,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [17, 24, 39],
      },
      margin: { left: 14, right: 14 },
    });

    currentY = (doc as jsPDF & { lastAutoTable?: { finalY?: number } }).lastAutoTable?.finalY
      ? ((doc as jsPDF & { lastAutoTable?: { finalY?: number } }).lastAutoTable!.finalY || 20) + 12
      : currentY + 20;

    if (index < sections.length - 1 && currentY > 240) {
      doc.addPage();
      currentY = 20;
    }
  });

  doc.save(`${fileName}.pdf`);
}

function safeSheetName(name: string) {
  return name.replace(/[\\/*?:[\]]/g, "").slice(0, 31) || "Sheet";
}

function formatPdfValue(value: unknown) {
  if (value === null || value === undefined) return "—";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}