import React from 'react';
import { Text, View, Image, StyleSheet } from '@react-pdf/renderer';
import { commonStyles } from './PDFStyles';

// Company Header Component
export const CompanyHeader = ({ companyName, companyAddress, companyLogo, companyPhone, companyWebsite, companyColor }) => (
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
        <Text style={commonStyles.companyAddress}>Phone: {companyPhone}</Text>
        <Text style={commonStyles.companyAddress}>{companyWebsite}</Text>
      </View>
      {companyLogo && (
        <Image 
          src={companyLogo} 
          style={commonStyles.companyLogo} 
        />
      )}
    </View>
    <View style={[commonStyles.separatorLine, { borderBottomColor: companyColor || '#FF0000' }]} />
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
export const Addressee = ({ name, style }) => (
  <View style={{ marginBottom: 15, ...style }}>
    <Text style={{ fontSize: 12 }}>Dear {name},</Text>
  </View>
);

// Paragraph Component
export const Paragraph = ({ children, style }) => (
  <Text style={[commonStyles.letterParagraph, style]}>{children}</Text>
);

// Signature Component
export const Signature = ({ name, designation, style }) => (
  <View style={[commonStyles.signatureSection, style]}>
    <Text style={{ marginBottom: 5 }}>Signature</Text>
    <Text style={{ marginTop: 15 }}>{designation || 'Head - HR Dept'}</Text>
  </View>
);

// Footer Component
export const Footer = ({ companyName, companyAddress, companyPhone, companyWebsite, companyColor }) => (
  <View style={commonStyles.footer}>
    <View style={[commonStyles.footerSeparator, { borderTopColor: companyColor || '#FF0000' }]} />
    <Text style={{ fontSize: 10, marginBottom: 2 }}>{companyName}</Text>
    <Text style={{ fontSize: 10, marginBottom: 2 }}>{companyAddress}</Text>
    <Text style={{ fontSize: 10, marginBottom: 2 }}>{companyPhone}</Text>
    <Text style={{ fontSize: 10 }}>{companyWebsite}</Text>
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
    justifyContent: 'space-between',
    borderBottom: '1pt solid #ddd',
    paddingVertical: 5,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontWeight: 'bold',
    fontSize: 12,
    marginBottom: 2,
  },
  tableCell: {
    flex: 3,
    fontSize: 12,
  },
  tableCellValue: {
    flex: 2,
    textAlign: 'right',
    fontSize: 12,
    fontFamily: 'Courier',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    borderTop: '2pt solid #000',
    borderBottom: '2pt solid #000',
    paddingVertical: 5,
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export const SalaryTable = ({ components }) => (
  <View style={tableStyles.table}>
    <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Compensation Heads</Text>
    
    {components.map((item, index) => (
      <View key={index} style={tableStyles.tableRow}>
        <Text style={tableStyles.tableCell}>{item.label}</Text>
        <Text style={tableStyles.tableCellValue}>: ₹{item.value}</Text>
      </View>
    ))}
    
    <View style={tableStyles.totalRow}>
      <Text style={tableStyles.tableCell}>Annual Total</Text>
      <Text style={tableStyles.tableCellValue}>: ₹{components[components.length - 1].total}</Text>
    </View>
  </View>
); 