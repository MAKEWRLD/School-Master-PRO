
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { TDocumentDefinitions } from "pdfmake/interfaces";
import { Document, Packer, Paragraph, AlignmentType, TextRun } from "docx";
import FileSaver from "file-saver";
import { AcademicWork } from "../types";

const vfs = (pdfFonts as any)?.pdfMake?.vfs || (pdfFonts as any)?.vfs;
if (vfs) {
  (pdfMake as any).vfs = vfs;
}

const saveAs = (FileSaver as any).saveAs || FileSaver;

export const exportToPDF = async (work: AcademicWork) => {
  const isAPA = work.norm === 'APA';
  
  const docDefinition: TDocumentDefinitions = {
    pageSize: "A4",
    pageMargins: [85, 85, 57, 57], // ABNT defaults
    defaultStyle: {
      font: "Roboto",
      fontSize: 12,
      lineHeight: 1.5,
    },
    content: [
      // Capa Profissional
      { text: work.institution.toUpperCase(), alignment: "center", bold: true, fontSize: 14, margin: [0, 0, 0, 40] },
      { text: work.author.toUpperCase(), alignment: "center", bold: true, fontSize: 12, margin: [0, 60, 0, 100] },
      { text: work.title.toUpperCase(), alignment: "center", bold: true, fontSize: 18, margin: [0, 40, 0, 150] },
      { text: `${work.city}\n${work.year}`, alignment: "center", bold: true, margin: [0, 100, 0, 0] },

      // Início do Conteúdo
      { text: `1 INTRODUÇÃO (${work.norm})`, bold: true, fontSize: 12, margin: [0, 40, 0, 20], pageBreak: "before" },
      { text: work.content.introducao, alignment: "justify" },

      { text: "\n2 DESENVOLVIMENTO", bold: true, fontSize: 12, margin: [0, 20, 0, 20] },
      { text: work.content.desenvolvimento, alignment: "justify" },

      { text: "\n3 CONCLUSÃO", bold: true, fontSize: 12, margin: [0, 20, 0, 20] },
      { text: work.content.conclusao, alignment: "justify" },

      { text: "REFERÊNCIAS", alignment: "center", bold: true, margin: [0, 40, 0, 30], pageBreak: "before" },
      {
        stack: work.content.referencias.split("\n").map(ref => ({ text: ref, margin: [0, 0, 0, 10], fontSize: 11 }))
      }
    ],
    footer: (currentPage: number) => {
      return {
        text: currentPage.toString(),
        alignment: isAPA ? "center" : "right",
        margin: [0, 20, 40, 0],
        fontSize: 10
      };
    }
  };

  pdfMake.createPdf(docDefinition).download(`SchoolMaster_${work.norm}_${work.title.replace(/\s+/g, "_")}.pdf`);
};

export const exportToDocx = async (work: AcademicWork) => {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({ 
            children: [new TextRun({ text: work.institution.toUpperCase(), bold: true, size: 28 })],
            alignment: AlignmentType.CENTER 
          }),
          new Paragraph({ text: "\n\n" }),
          new Paragraph({ 
            children: [new TextRun({ text: work.title.toUpperCase(), bold: true, size: 36 })],
            alignment: AlignmentType.CENTER 
          }),
          new Paragraph({ text: "", pageBreakBefore: true }),
          new Paragraph({ children: [new TextRun({ text: "1 INTRODUÇÃO", bold: true })] }),
          new Paragraph({ text: work.content.introducao, alignment: AlignmentType.JUSTIFIED }),
          new Paragraph({ text: "", pageBreakBefore: true }),
          new Paragraph({ children: [new TextRun({ text: "REFERÊNCIAS", bold: true })], alignment: AlignmentType.CENTER }),
          ...work.content.referencias.split("\n").map(line => new Paragraph({ text: line }))
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `SchoolMaster_${work.title.replace(/\s+/g, "_")}.docx`);
};
