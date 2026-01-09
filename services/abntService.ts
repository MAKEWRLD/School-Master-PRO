import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { AcademicWork } from "../types";

// Setup pdfmake fonts with defensive check for ESM export structure
const vfs = (pdfFonts as any)?.pdfMake?.vfs || (pdfFonts as any)?.vfs;
if (vfs) {
  (pdfMake as any).vfs = vfs;
}

export const exportToPDF = async (work: AcademicWork) => {
  const docDefinition: any = {
    pageSize: "A4",
    // Margins in pt (1mm ≈ 2.83pt)
    // ABNT: Top 30mm (85pt), Left 30mm (85pt), Bottom 20mm (57pt), Right 20mm (57pt)
    pageMargins: [85, 85, 57, 57], 
    defaultStyle: {
      font: "Roboto", // pdfmake uses Roboto by default in its vfs_fonts
      fontSize: 12,
      lineHeight: 1.5,
    },
    content: [
      // CAPA
      { text: work.institution.toUpperCase(), alignment: "center", bold: true, fontSize: 14, margin: [0, 0, 0, 40] },
      { text: work.author.toUpperCase(), alignment: "center", bold: true, fontSize: 12, margin: [0, 60, 0, 100] },
      { text: work.title.toUpperCase(), alignment: "center", bold: true, fontSize: 16, margin: [0, 40, 0, 150] },
      { text: work.city.toUpperCase(), alignment: "center", bold: true, margin: [0, 100, 0, 0] },
      { text: work.year, alignment: "center", bold: true, pageBreak: "after" },

      // FOLHA DE ROSTO
      { text: work.author.toUpperCase(), alignment: "center", bold: true, margin: [0, 0, 0, 40] },
      { text: work.title.toUpperCase(), alignment: "center", bold: true, fontSize: 14, margin: [0, 80, 0, 40] },
      {
        columns: [
          { width: "50%", text: "" },
          {
            width: "50%",
            text: `${work.type} apresentado ao curso de ${work.course} da ${work.institution} como requisito parcial para obtenção de grau académico.`,
            fontSize: 10,
            alignment: "justify",
            italics: true,
          }
        ],
        margin: [0, 40, 0, 100]
      },
      { text: work.city.toUpperCase(), alignment: "center", bold: true, margin: [0, 100, 0, 0] },
      { text: work.year, alignment: "center", bold: true, pageBreak: "after" },

      // INTRODUCAO
      { text: "1 INTRODUÇÃO", bold: true, fontSize: 12, margin: [0, 0, 0, 20] },
      { text: work.content.introducao, alignment: "justify" },

      // DESENVOLVIMENTO
      { text: "\n2 DESENVOLVIMENTO", bold: true, fontSize: 12, margin: [0, 20, 0, 20] },
      { text: work.content.desenvolvimento, alignment: "justify" },

      // CONCLUSAO
      { text: "\n3 CONCLUSÃO", bold: true, fontSize: 12, margin: [0, 20, 0, 20] },
      { text: work.content.conclusao, alignment: "justify", pageBreak: "after" },

      // REFERENCIAS
      { text: "REFERÊNCIAS", alignment: "center", bold: true, margin: [0, 0, 0, 30] },
      {
        stack: work.content.referencias.split("\n").map(ref => ({ text: ref, margin: [0, 0, 0, 10], fontSize: 11 }))
      }
    ],
    footer: (currentPage: number) => {
      // ABNT page numbering starts at the introduction, usually page 3
      if (currentPage >= 3) {
        return {
          text: currentPage.toString(),
          alignment: "right",
          margin: [0, 20, 40, 0],
          fontSize: 10
        };
      }
      return "";
    }
  };

  pdfMake.createPdf(docDefinition).download(`SchoolMaster_${work.title.replace(/\s+/g, "_")}.pdf`);
};