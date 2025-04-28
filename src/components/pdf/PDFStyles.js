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
    padding: '40mm 60mm',
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
    marginBottom: 40,
  },
  companyName: {
    fontSize: 24,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  companyAddress: {
    fontSize: 11,
    lineHeight: 1.4,
  },
  companyLogo: {
    width: 80,
    height: 'auto',
  },
  letterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 30,
    textDecoration: 'underline',
  },
  letterDate: {
    marginBottom: 20,
  },
  letterParagraph: {
    textAlign: 'justify',
    marginBottom: 15,
    textIndent: 40,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 60,
    right: 60,
    textAlign: 'left',
    paddingTop: 20,
  },
  signatureSection: {
    marginTop: 40,
  },
  signatureLine: {
    marginTop: 30,
    borderTop: '1pt solid black',
    width: 200,
  },
});

// Specific styles for offer letter
export const offerLetterStyles = StyleSheet.create({
  page: {
    ...commonStyles.page,
    fontFamily: 'Times New Roman',
    fontSize: 14,
    lineHeight: 1.6,
  },
  letterContent: {
    marginBottom: 60,
  },
  letterSalutation: {
    marginBottom: 15,
  },
  salaryTable: {
    margin: '20px 40px',
    fontSize: 14,
  },
  compensationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
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