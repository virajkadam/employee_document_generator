import { StyleSheet, Font } from '@react-pdf/renderer';

// Register fonts - using standard fonts for simplicity
// Default font (Times New Roman for PDF)
Font.register({
  family: 'Times New Roman',
  fonts: [
    {
      src: 'https://cdn.jsdelivr.net/npm/@canvas-fonts/times-new-roman@1.0.4/Times New Roman.ttf',
    },
    {
      src: 'https://cdn.jsdelivr.net/npm/@canvas-fonts/times-new-roman-bold@1.0.4/Times New Roman Bold.ttf',
      fontWeight: 'bold',
    },
    {
      src: 'https://cdn.jsdelivr.net/npm/@canvas-fonts/times-new-roman-italic@1.0.4/Times New Roman Italic.ttf',
      fontStyle: 'italic',
    },
  ],
});

// Sans-serif font (Helvetica is built-in to PDF, similar to Arial)
Font.register({
  family: 'Arial',
  fonts: [
    {
      src: 'https://cdn.jsdelivr.net/npm/@canvas-fonts/arial@1.0.4/Arial.ttf',
    },
    {
      src: 'https://cdn.jsdelivr.net/npm/@canvas-fonts/arial-bold@1.0.4/Arial Bold.ttf',
      fontWeight: 'bold',
    },
    {
      src: 'https://cdn.jsdelivr.net/npm/@canvas-fonts/arial-italic@1.0.4/Arial Italic.ttf',
      fontStyle: 'italic',
    },
  ],
});

// Monospace font for fixed-width formatting
Font.register({
  family: 'Courier',
  fonts: [
    { src: 'https://cdn.jsdelivr.net/npm/@canvas-fonts/courier-new@1.0.4/Courier New.ttf' },
    { 
      src: 'https://cdn.jsdelivr.net/npm/@canvas-fonts/courier-new-bold@1.0.4/Courier New Bold.ttf',
      fontWeight: 'bold'
    }
  ]
});

// Common styles for all PDF documents
export const commonStyles = StyleSheet.create({
  page: {
    padding: '10mm 20mm',
    backgroundColor: 'white',
    width: '210mm',
    height: '297mm',
    position: 'relative',
    fontFamily: 'Times New Roman',
  },
  section: {
    marginBottom: 6,
  },
  companyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 3,
  },
  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 2,
    color: '#FF0000',
    fontFamily: 'Times New Roman',
  },
  companyAddress: {
    fontSize: 10,
    lineHeight: 1.2,
    fontFamily: 'Times New Roman',
  },
  companyLogo: {
    width: 60,
    height: 60,
    objectFit: 'contain',
  },
  separatorLine: {
    borderBottom: '1pt solid #FF0000',
    width: '100%',
    marginTop: 2,
    marginBottom: 10,
  },
  letterTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 8,
    fontFamily: 'Times New Roman',
  },
  letterDate: {
    marginBottom: 6,
    fontSize: 12,
    fontFamily: 'Times New Roman',
  },
  letterParagraph: {
    textAlign: 'justify',
    marginBottom: 6,
    fontSize: 11.5,
    lineHeight: 1.5,
    fontFamily: 'Times New Roman',
  },
  footer: {
    position: 'absolute',
    bottom: 10,
    left: 20,
    right: 20,
    textAlign: 'center',
    paddingTop: 4,
  },
  footerText: {
    fontSize: 10,
    marginBottom: 2,
    fontFamily: 'Times New Roman',
    textAlign: 'center',
  },
  footerSeparator: {
    borderTop: '1pt solid #FF0000',
    width: '100%',
    marginBottom: 3,
  },
  signatureSection: {
    marginTop: 12,
    fontSize: 12,
    fontFamily: 'Times New Roman',
  },
  signatureLine: {
    marginTop: 15,
    borderTop: '1pt solid black',
    width: 200,
  },
  contentContainer: {
    flexGrow: 1,
    marginTop: 8,
  },
});

// Specific styles for offer letter
export const offerLetterStyles = StyleSheet.create({
  page: {
    ...commonStyles.page,
    fontFamily: 'Times New Roman',
    fontSize: 11.5,
    lineHeight: 1.5,
  },
  letterContent: {
    marginBottom: 15,
  },
  letterSalutation: {
    marginBottom: 8,
    fontSize: 12,
    fontFamily: 'Times New Roman',
  },
  salaryTable: {
    margin: '8px 0',
    fontSize: 12,
    fontFamily: 'Times New Roman',
  },
  compensationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottom: '1pt solid #ddd',
  },
  compensationLabel: {
    flex: 3,
    fontFamily: 'Times New Roman',
  },
  compensationValue: {
    flex: 2,
    fontFamily: 'Times New Roman',
    textAlign: 'right',
  },
  footerText: {
    fontSize: 10,
    lineHeight: 1.2,
    fontFamily: 'Times New Roman',
  },
});

// Specific styles for appointment letter
export const appointmentLetterStyles = StyleSheet.create({
  page: {
    ...commonStyles.page,
    fontFamily: 'Arial',
    fontSize: 12,
    lineHeight: 1.6,
  },
  subjectLine: {
    margin: '20px 0',
    fontWeight: 'bold',
  },
  sectionHeading: {
    fontWeight: 'bold',
    margin: '20px 0 10px',
  },
  tableContainer: {
    marginVertical: 20,
    width: '100%',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1pt solid black',
    borderLeft: '1pt solid black',
    borderRight: '1pt solid black',
  },
  tableRowFirst: {
    flexDirection: 'row',
    borderTop: '1pt solid black',
    borderBottom: '1pt solid black',
    borderLeft: '1pt solid black',
    borderRight: '1pt solid black',
  },
  tableHeader: {
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold',
    padding: 8,
    flex: 1,
    borderRight: '1pt solid black',
  },
  tableCell: {
    padding: 8,
    flex: 1,
    borderRight: '1pt solid black',
  },
  tableCellLast: {
    padding: 8,
    flex: 1,
  },
});

// Add other document-specific styles as needed
export const appraisalLetterStyles = StyleSheet.create({
  // ...
});

export const relievingLetterStyles = StyleSheet.create({
  // ...
});

export const incrementLetterStyles = StyleSheet.create({
  // ...
}); 