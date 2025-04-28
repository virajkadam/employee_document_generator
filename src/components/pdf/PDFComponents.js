import React from 'react';
import { Text, View, Image, StyleSheet } from '@react-pdf/renderer';
import { commonStyles } from './PDFStyles';

// Company Header Component
export const CompanyHeader = ({ companyName, companyAddress, companyLogo, companyColor }) => (
  <>
    <View style={commonStyles.companyHeader}>
      <View>
        <Text 
          style={[
            commonStyles.companyName, 
            { color: companyColor || '#FF0000' } // Default to red
          ]}
        >
          {companyName}
        </Text>
        <Text style={commonStyles.companyAddress}>{companyAddress}</Text>
      </View>
      {companyLogo && (
        <Image 
          src={companyLogo} 
          style={commonStyles.companyLogo} 
        />
      )}
    </View>
    <View style={commonStyles.separatorLine} />
  </>
);

// Letter Title Component
export const LetterTitle = ({ title }) => (
  <Text style={commonStyles.letterTitle}>{title}</Text>
);

// Date Component with formatting
export const FormattedDate = ({ date, style }) => {
  const formatDate = (dateString) => {
    if (!dateString || isNaN(new Date(dateString).getTime())) {
      return "";
    }
    
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    return `${day} ${month} ${year}`;
  };
  
  return (
    <Text style={[commonStyles.letterDate, style]}>Date: {formatDate(date)}</Text>
  );
};

// Addressee Component
export const Addressee = ({ name, designation }) => (
  <View style={{ marginBottom: 15 }}>
    <Text style={{ fontSize: 12 }}>{name}</Text>
    {designation && <Text style={{ fontSize: 12 }}>{designation}</Text>}
  </View>
);

// Paragraph Component
export const Paragraph = ({ children, style }) => (
  <Text style={[commonStyles.letterParagraph, style]}>{children}</Text>
);

// Signature Component
export const Signature = ({ name, designation, companyName }) => (
  <View style={commonStyles.signatureSection}>
    <Text>Yours sincerely,</Text>
    <View style={commonStyles.signatureLine} />
    <Text style={{ marginTop: 5, fontWeight: 'bold' }}>{name}</Text>
    {designation && <Text>{designation}</Text>}
    {companyName && <Text>{companyName}</Text>}
  </View>
);

// Footer Component
export const Footer = ({ companyContact }) => (
  <View style={commonStyles.footer}>
    <View style={commonStyles.footerSeparator} />
    {companyContact && (
      <Text style={{ fontSize: 9 }}>
        {companyContact}
      </Text>
    )}
  </View>
);

// Table Component for Salary/Compensation
const tableStyles = StyleSheet.create({
  table: {
    width: '100%',
    marginVertical: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1pt solid #ddd',
    paddingVertical: 6,
  },
  headerRow: {
    flexDirection: 'row',
    borderBottom: '2pt solid #000',
    paddingVertical: 6,
    fontWeight: 'bold',
    fontSize: 12,
  },
  tableCell: {
    flex: 1,
    fontSize: 12,
  },
  tableCellRight: {
    flex: 1,
    textAlign: 'right',
    fontSize: 12,
    fontFamily: 'Courier', // Use monospace font for numbers
  },
  totalRow: {
    flexDirection: 'row',
    borderTop: '2pt solid #000',
    borderBottom: '2pt solid #000',
    paddingVertical: 6,
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export const SalaryTable = ({ data, showMonthly = true, showAnnual = true }) => (
  <View style={tableStyles.table}>
    <View style={tableStyles.headerRow}>
      <Text style={tableStyles.tableCell}>EARNINGS</Text>
      {showMonthly && <Text style={tableStyles.tableCellRight}>MONTHLY</Text>}
      {showAnnual && <Text style={tableStyles.tableCellRight}>YEARLY</Text>}
    </View>
    
    {data.components.map((item, index) => (
      <View key={index} style={tableStyles.tableRow}>
        <Text style={tableStyles.tableCell}>{item.name}</Text>
        {showMonthly && <Text style={tableStyles.tableCellRight}>{item.monthly.toFixed(2)}</Text>}
        {showAnnual && <Text style={tableStyles.tableCellRight}>{item.annual.toFixed(2)}</Text>}
      </View>
    ))}
    
    <View style={tableStyles.totalRow}>
      <Text style={tableStyles.tableCell}>TOTAL</Text>
      {showMonthly && <Text style={tableStyles.tableCellRight}>{data.totalMonthly.toFixed(2)}</Text>}
      {showAnnual && <Text style={tableStyles.tableCellRight}>{data.totalAnnual.toFixed(2)}</Text>}
    </View>
  </View>
); 