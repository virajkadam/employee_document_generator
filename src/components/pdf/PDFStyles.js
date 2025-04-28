import { StyleSheet, Font } from '@react-pdf/renderer';

// Register fonts - using standard fonts for simplicity
// Serif font (Times Roman is built-in to PDF)
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
    padding: '20mm 30mm',
    backgroundColor: 'white',
    width: '210mm',
    height: '297mm',
    position: 'relative',
  },
  section: {
    marginBottom: 10,
  },
  companyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  companyName: {
    fontSize: 22,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 5,
    letterSpacing: 0.5,
  },
  companyAddress: {
    fontSize: 10,
    lineHeight: 1.3,
  },
  companyLogo: {
    width: 70,
    height: 'auto',
  },
  separatorLine: {
    borderBottom: '1pt solid #000',
    width: '100%',
    marginVertical: 8,
  },
  letterTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 15,
    textDecoration: 'underline',
  },
  letterDate: {
    marginBottom: 15,
    fontSize: 12,
  },
  letterParagraph: {
    textAlign: 'justify',
    marginBottom: 12,
    textIndent: 40,
    fontSize: 12,
    lineHeight: 1.5,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 30,
    right: 30,
    textAlign: 'left',
    paddingTop: 10,
  },
  footerSeparator: {
    borderTop: '1pt solid #000',
    width: '100%',
    marginBottom: 8,
  },
  signatureSection: {
    marginTop: 25,
    fontSize: 12,
  },
  signatureLine: {
    marginTop: 25,
    borderTop: '1pt solid black',
    width: 200,
  },
});

// Specific styles for offer letter
export const offerLetterStyles = StyleSheet.create({
  page: {
    ...commonStyles.page,
    fontFamily: 'Arial',
    fontSize: 12,
    lineHeight: 1.5,
  },
  letterContent: {
    marginBottom: 35,
  },
  letterSalutation: {
    marginBottom: 12,
    fontSize: 12,
  },
  salaryTable: {
    margin: '15px 10px',
    fontSize: 12,
  },
  compensationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderBottom: '1pt solid #ddd',
  },
  compensationLabel: {
    flex: 2,
  },
  compensationValue: {
    flex: 1,
    fontFamily: 'Courier',
    textAlign: 'right',
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