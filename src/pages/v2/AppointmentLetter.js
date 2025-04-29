import React, { useState, useEffect } from 'react';
import { PDFViewer, PDFDownloadLink, Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';
import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { CompanyHeader, FormattedDate, Paragraph, Signature, Footer } from '../../components/pdf/PDFComponents';
import { commonStyles } from '../../components/pdf/PDFStyles';
import { formatIndianCurrency, numberToWords } from '../../components/pdf/SalaryUtilsV2';

// Create a styled component for the appointment table
const appointmentStyles = StyleSheet.create({
  table: {
    width: '100%',
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#000',
    borderStyle: 'solid',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderBottomStyle: 'solid',
  },
  tableCellHeader: {
    width: '40%',
    padding: 8,
    fontFamily: 'Times New Roman',
    fontWeight: 'bold',
    fontSize: 12,
    borderRightWidth: 1,
    borderRightColor: '#000',
    borderRightStyle: 'solid',
  },
  tableCell: {
    width: '60%',
    padding: 8,
    fontFamily: 'Times New Roman',
    fontSize: 12,
  },
  sectionHeading: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 8,
    fontFamily: 'Times New Roman',
  },
  listItem: {
    fontSize: 12,
    marginBottom: 8,
    fontFamily: 'Times New Roman',
    textAlign: 'justify',
    lineHeight: 1.5,
  },
  to: {
    fontSize: 12,
    marginBottom: 4,
    fontFamily: 'Times New Roman',
  },
  addresseeName: {
    fontSize: 12,
    marginBottom: 15,
    fontFamily: 'Times New Roman',
  },
  subject: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 15,
    fontFamily: 'Times New Roman',
  },
  appointmentHeading: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 0,
    marginBottom: 5,
    fontFamily: 'Times New Roman',
  },
  paragraph: {
    fontSize: 12,
    marginBottom: 15,
    fontFamily: 'Times New Roman',
  },
  signatureContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signatureBox: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  signatureTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
    fontFamily: 'Times New Roman',
  },
  signatureSpace: {
    height: 20,
  },
  signatureName: {
    fontSize: 12,
    fontFamily: 'Times New Roman',
  },
  signatureDate: {
    fontSize: 12,
    fontFamily: 'Times New Roman',
  },
});

// Styled component for the salary table
const tableStyles = StyleSheet.create({
  table: {
    width: '100%',
    marginVertical: 10,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderBottomStyle: 'solid',
    padding: 5,
  },
  tableHeader: {
    fontWeight: 'bold',
    fontSize: 11,
    fontFamily: 'Times New Roman',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    borderBottomStyle: 'solid',
    padding: 4,
  },
  tableCell: {
    flex: 3,
    fontSize: 11,
    fontFamily: 'Times New Roman',
    padding: 2,
  },
  tableCellValue: {
    flex: 2,
    fontSize: 11,
    fontFamily: 'Times New Roman',
    textAlign: 'right',
    padding: 2,
  },
  totalRow: {
    flexDirection: 'row',
    borderTopWidth: 2,
    borderTopColor: '#000',
    borderTopStyle: 'solid',
    borderBottomWidth: 2,
    borderBottomColor: '#000',
    borderBottomStyle: 'solid',
    padding: 4,
    marginTop: 4,
    fontWeight: 'bold',
  },
});

// Function to calculate salary components
const calculateSalaryComponents = (lpa) => {
  const monthlyMultiplier = 1/12;
  const annual = lpa * 100000; // Convert LPA to annual amount
  
  // Basic - 50% of CTC
  const basic = annual * 0.5;
  
  // HRA - 40% of Basic
  const hra = basic * 0.4;
  
  // Education Allowance - Fixed
  const educationAllowance = 2400;
  
  // Monthly Reimbursement - Fixed
  const monthlyReimbursement = 36000;
  
  // LTA - 8% of Basic
  const lta = basic * 0.08;
  
  // Statutory Bonus - 8.33% of Basic, capped at 20991
  const statutoryBonus = Math.min(basic * 0.0833, 20991);
  
  // Calculate remaining amount for Special Allowance
  const subTotal = basic + hra + educationAllowance + monthlyReimbursement + lta + statutoryBonus;
  
  // Employer Contributions
  const gratuity = basic * 0.0417; // 4.17% of basic
  const monthlyWellness = 1200;
  const healthInsurance = annual * 0.00429; // 0.429% of CTC
  const employerPF = Math.min(basic * 0.12, 21600); // 12% of basic, capped at 21600
  
  // Special Allowance is the balancing amount
  const specialAllowance = annual - subTotal - gratuity - monthlyWellness - healthInsurance - employerPF;
  
  return {
    basic,
    hra,
    educationAllowance,
    monthlyReimbursement,
    lta,
    statutoryBonus,
    specialAllowance,
    subTotal,
    gratuity,
    monthlyWellness,
    healthInsurance,
    employerPF,
    total: annual
  };
};

// Function to format salary values for display
const formatSalaryValues = (salaryComponents, includePF) => {
  if (!salaryComponents) return [];

  // Format values for display
  const items = [
    { label: 'Basic', value: formatIndianCurrency(salaryComponents.basic) },
    { label: 'Education Allowance', value: formatIndianCurrency(salaryComponents.educationAllowance) },
    { label: 'HRA', value: formatIndianCurrency(salaryComponents.hra) },
    { label: 'Monthly Reimbursement', value: formatIndianCurrency(salaryComponents.monthlyReimbursement) },
    { label: 'Travel Reimbursement (LTA)', value: formatIndianCurrency(salaryComponents.lta) },
    { label: 'Statutory Bonus', value: formatIndianCurrency(salaryComponents.statutoryBonus) },
    { label: 'Special Allowance', value: formatIndianCurrency(salaryComponents.specialAllowance) },
  ];

  // Add PF and Gratuity if required
  if (includePF) {
    items.push(
      { label: 'PF - Employer', value: formatIndianCurrency(salaryComponents.employerPF) },
      { label: 'Employee Gratuity contribution', value: formatIndianCurrency(salaryComponents.gratuity) }
    );
  }

  // Add remaining items
  items.push(
    { label: 'Monthly Wellness', value: formatIndianCurrency(salaryComponents.monthlyWellness) },
    { label: 'Health Insurance', value: formatIndianCurrency(salaryComponents.healthInsurance) },
    { total: formatIndianCurrency(salaryComponents.total) }
  );

  return items;
};

// Appointment Table Component
const AppointmentTable = ({ joiningDate, designation, department, reportingAuthority, ctc, ctcInWords }) => (
  <View style={appointmentStyles.table}>
    <View style={appointmentStyles.tableRow}>
      <Text style={appointmentStyles.tableCellHeader}>Date of joining as recorded</Text>
      <Text style={appointmentStyles.tableCell}>{joiningDate || '[Date]'}</Text>
    </View>
    <View style={appointmentStyles.tableRow}>
      <Text style={appointmentStyles.tableCellHeader}>Designation</Text>
      <Text style={appointmentStyles.tableCell}>{designation || '[Designation]'}</Text>
    </View>
    <View style={appointmentStyles.tableRow}>
      <Text style={appointmentStyles.tableCellHeader}>Department</Text>
      <Text style={appointmentStyles.tableCell}>{department || '[Department]'}</Text>
    </View>
    <View style={appointmentStyles.tableRow}>
      <Text style={appointmentStyles.tableCellHeader}>Reporting Authority</Text>
      <Text style={appointmentStyles.tableCell}>{reportingAuthority || '[Authority]'}</Text>
    </View>
    <View style={appointmentStyles.tableRow}>
      <Text style={appointmentStyles.tableCellHeader}>CTC (break up as per Annexure)</Text>
      <Text style={appointmentStyles.tableCell}>
        Total Annual CTC Rs. {ctc} Lakhs{'\n'}
        {ctcInWords ? `(${ctcInWords})` : '(Rupees [Amount] Only)'}
      </Text>
    </View>
  </View>
);

// Define the PDF Document Component
const AppointmentLetterPDF = ({ formData }) => {
  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "";
    
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(date);
    } catch (e) {
      return "";
    }
  };

  const salaryComponents = formData.salaryComponents ? formatSalaryValues(formData.salaryComponents, formData.showPF) : [];

  return (
    <Document>
      {/* Page 1 */}
      <Page size="A4" style={commonStyles.page}>
        {/* Company Header */}
        <CompanyHeader
          companyName={formData.companyName || 'COMPANY NAME'}
          companyAddress={formData.companyAddressLine1 || 'COMPANY ADDRESS'}
          companyLogo={formData.companyLogo}
          companyPhone={formData.companyPhone || 'PHONE NUMBER'}
          companyWebsite={formData.companyWebsite || 'WEBSITE'}
          companyColor={formData.companyColor || '#FF0000'}
        />
        
        <View style={{marginTop: 10}}>
          {/* Addressee */}
          <Text style={appointmentStyles.to}>To,</Text>
          <Text style={appointmentStyles.addresseeName}>{formData.employeeName || '[Employee Name]'}</Text>
          
          {/* Subject */}
          <Text style={appointmentStyles.subject}>Subject: Appointment Letter</Text>
          
          {/* Introduction */}
          <Text style={appointmentStyles.listItem}>
            Dear {formData.employeeName || '[Employee Name]'},
          </Text>
          
          <Text style={appointmentStyles.listItem}>
            We welcome you to {formData.companyName || 'our company'}. Your appointment is subject to the Terms & Conditions contained in this letter & Company policy.
          </Text>
          
          {/* Appointment Details */}
          <Text style={appointmentStyles.appointmentHeading}>Appointment</Text>
          
          <AppointmentTable 
            joiningDate={formatDate(formData.joiningDate)}
            designation={formData.designation || '[Designation]'}
            department={formData.department || '[Department]'}
            reportingAuthority={formData.reportingAuthority || '[Authority]'}
            ctc={formData.ctc || ''}
            ctcInWords={formData.ctcInWords || ''}
          />
          
          {/* Salary & Benefits */}
          <Text style={appointmentStyles.sectionHeading}>Salary & Benefits</Text>
          
          <Text style={appointmentStyles.listItem}>
            1. Compensation structure may be altered/ modified at any time providing appropriate communication to employees. Salary, allowances and all other payments/ benefits shall be governed by the Company's rules as well as statutory provisions in force and subject to deduction of appropriate taxes at source.
          </Text>
          
          <Text style={appointmentStyles.listItem}>
            2. Your salary, benefits, level / grade fitment, level of earnings within your group is absolutely personal to you, which is purely based on your academic background, experience, potential and competence as assessed by the Company. As such comparison between individual employees is invidious. Such information is strictly confidential to you.
          </Text>
        </View>
        
        {/* Footer */}
        <Footer
          companyName={formData.companyName || 'COMPANY NAME'}
          companyAddress={formData.companyAddressLine1 || 'COMPANY ADDRESS'}
          companyPhone={formData.companyPhone || 'PHONE NUMBER'}
          companyWebsite={formData.companyWebsite || 'WEBSITE'}
          companyColor={formData.companyColor || '#FF0000'}
        />
      </Page>

      {/* Page 2 - Benefits continued */}
      <Page size="A4" style={commonStyles.page}>
        {/* Company Header */}
        <CompanyHeader
          companyName={formData.companyName || 'COMPANY NAME'}
          companyAddress={formData.companyAddressLine1 || 'COMPANY ADDRESS'}
          companyLogo={formData.companyLogo}
          companyPhone={formData.companyPhone || 'PHONE NUMBER'}
          companyWebsite={formData.companyWebsite || 'WEBSITE'}
          companyColor={formData.companyColor || '#FF0000'}
        />
        
        <View style={{marginTop: 10}}>
          <Text style={appointmentStyles.listItem}>
            3. Your performance may be reviewed by the Company at least once annually. Any increase or decrease in your Remuneration is at the absolute discretion of Company and will depend on factors such as your performance and the performance of Company's business as a whole. The Company is under no obligation to increase the Remuneration as a result of any review.
          </Text>
          
          <Text style={appointmentStyles.listItem}>
            4. Your Remuneration will be paid monthly directly into a bank account nominated by you and acceptable to Company.
          </Text>
          
          <Text style={appointmentStyles.listItem}>
            5. You will pay levies such as PF/ESI (if applicable) and other contributions as required under appropriate legislation. These levies and expenses may be made by way of salary sacrifice (before tax) or after tax. Company will make mandatory payment as required under appropriate legislation. Company contribution to PF and Gratuity is a part of your CTC.
          </Text>
          
          <Text style={appointmentStyles.listItem}>
            6. Company will reimburse you for all reasonable traveling, accommodation and general expenses incurred by you in connection with carrying out Company's business. Payment will only be made against valid receipts.
          </Text>

          {/* Posting Section */}
          <Text style={appointmentStyles.sectionHeading}>Posting</Text>
          
          <Text style={appointmentStyles.listItem}>
            7. At present, you would be posted at {formData.location || 'Pune'}, however, you may be required to travel to or work at other locations, including interstate or overseas. Your services are liable to be transferred to any other division, activity, geographical location, branch, Group Company, sister concern or subsidiary of this Company or any of its associates, clients, customers, presently in existence & operational or will be operational in future. In such an eventuality, you will be governed by the terms and conditions and the remunerations as applicable to such new place to which your services may be temporarily or permanently transferred and that you will, therefore, not be entitled to any additional compensation.
          </Text>

          {/* Responsibility Section */}
          <Text style={appointmentStyles.sectionHeading}>Responsibility</Text>
          
          <Text style={appointmentStyles.listItem}>
            8. During your employment with the Company, you will be governed by Service Conditions mentioned in this letter & other rules, code of conduct and General terms and conditions framed by the Management from time to time, which shall be applicable to you, and also by such legal provisions as may be applicable.
          </Text>
          
          <Text style={appointmentStyles.listItem}>
            9. You are expected to give to the Company your best efforts, attention and commitment. You are explicitly advised to refrain from any such activity, whether for monetary or any other considerations, as may become, in our opinion, a hindrance to your performance.
          </Text>
          
          <Text style={appointmentStyles.listItem}>
            10. You are, by virtue of employment with this Company, required to do all the work allied, ancillary related or incidental to the main job. Similarly, you may be asked to do any job within your competence depending upon the exigencies of the situation.
          </Text>
        </View>
        
        {/* Footer */}
        <Footer
          companyName={formData.companyName || 'COMPANY NAME'}
          companyAddress={formData.companyAddressLine1 || 'COMPANY ADDRESS'}
          companyPhone={formData.companyPhone || 'PHONE NUMBER'}
          companyWebsite={formData.companyWebsite || 'WEBSITE'}
          companyColor={formData.companyColor || '#FF0000'}
        />
      </Page>

      {/* Page 3 - Additional conditions */}
      <Page size="A4" style={commonStyles.page}>
        {/* Company Header */}
        <CompanyHeader
          companyName={formData.companyName || 'COMPANY NAME'}
          companyAddress={formData.companyAddressLine1 || 'COMPANY ADDRESS'}
          companyLogo={formData.companyLogo}
          companyPhone={formData.companyPhone || 'PHONE NUMBER'}
          companyWebsite={formData.companyWebsite || 'WEBSITE'}
          companyColor={formData.companyColor || '#FF0000'}
        />
        
        <View style={{marginTop: 10}}>
          <Text style={appointmentStyles.listItem}>
            11. Your appointment is a full time assignment and you will not at any time engage, directly or indirectly, in any paid occupation or business outside the Company without obtaining prior written consent of the Company.
          </Text>

          {/* Training Section */}
          <Text style={appointmentStyles.sectionHeading}>Training</Text>
          
          <Text style={appointmentStyles.listItem}>
            12. In furtherance of your employment in this Company and for increasing & honing your skills, you may be required to be trained technically or otherwise. This may require the Company to provide training either in-house or send you for training outside the Company in India or abroad.
          </Text>
          
          <Text style={appointmentStyles.listItem}>
            13. You shall always endeavor to upgrade your skills, knowledge, and expertise from time to time and shall not refuse to undergo any training undertaken by Company or as directed by the Company for improvement or up gradation of skills, services performance or such other things necessary for the growth of the Company.
          </Text>

          {/* Termination Section */}
          <Text style={appointmentStyles.sectionHeading}>Termination / Separation</Text>
          
          <Text style={appointmentStyles.listItem}>
            14. The contract of employment can be terminated by either party by giving a notice of three months in writing of its intention to do so or by tendering a sum equivalent to three month's salary in lieu thereof, and further the Company may at its sole discretion, waive the whole or part of the notice period without any compensation. However, Company also reserves the right not to relieve you till the completion of job/assignment in hand. However company shall be within its right to terminate this contract in case of any acts of commission or omission that are detrimental to the business or reputation of the company such as but not limited to bribery, forgery, fraud, pilferage, theft, abandoning project, misuse of drugs and alcohol on company premises, any act which constitutes an offence involving moral turpitude etc.. The company also reserves the right to terminate his or her services with immediate effect in case of unsatisfactory or below standard performance on your part, without giving you any notice or pay in lieu thereof. In this case you will be paid up to the date of termination only.
          </Text>
          
          <Text style={appointmentStyles.listItem}>
            15. In the event of breach of any of the terms & conditions of your appointment order and / or General Terms and conditions & rules, the Company reserves the right to claim liquidated Damages from you, apart from other damages. Company also reserves the right to terminate your services without giving notice.
          </Text>
          
          <Text style={appointmentStyles.listItem}>
            16. Your appointment and employment will be subject to your being and remaining medically fit. If deemed necessary you may get medically examined by the Medical Officer appointed by the Company.
          </Text>
        </View>
        
        {/* Footer */}
        <Footer
          companyName={formData.companyName || 'COMPANY NAME'}
          companyAddress={formData.companyAddressLine1 || 'COMPANY ADDRESS'}
          companyPhone={formData.companyPhone || 'PHONE NUMBER'}
          companyWebsite={formData.companyWebsite || 'WEBSITE'}
          companyColor={formData.companyColor || '#FF0000'}
        />
      </Page>

      {/* Page 4 - Final additional conditions and signing */}
      <Page size="A4" style={commonStyles.page}>
        {/* Company Header */}
        <CompanyHeader
          companyName={formData.companyName || 'COMPANY NAME'}
          companyAddress={formData.companyAddressLine1 || 'COMPANY ADDRESS'}
          companyLogo={formData.companyLogo}
          companyPhone={formData.companyPhone || 'PHONE NUMBER'}
          companyWebsite={formData.companyWebsite || 'WEBSITE'}
          companyColor={formData.companyColor || '#FF0000'}
        />
        
        <View style={{marginTop: 10}}>
          <Text style={appointmentStyles.listItem}>
            17. Your appointment is a full time assignment and you will not at any time engage, directly or indirectly, in any paid occupation or business outside the Company without obtaining prior written consent of the Company.
          </Text>
          
          <Text style={appointmentStyles.listItem}>
            18. You will be required to submit with us, a copy of attested documents mentioned below within 3 working days of joining, which will be retained by the company as your personal history record:{'\n'}
            • Educational certificate.{'\n'}
            • Professional certificate.{'\n'}
            • Appointment cum Joining/JD/Relieving/Service Certificate/Experience Certificate from your present & earlier company, if any.{'\n'}
            • 3 passport size photographs{'\n'}
            • Identity Proof (Any one from the PAN Card/Voter ID/Driving License/Aadhar/Passport){'\n'}
            • Address Proof (Any one from Electricity Bill/Telephone Bill/Aadhar/Bank Passbook/Passport)
          </Text>
          
          <Text style={appointmentStyles.listItem}>
            19. This appointment shall be valid only if accepted on or before {formData.acceptanceDate || 'ACCEPTANCE DATE'}.
          </Text>

          <Text style={appointmentStyles.listItem}>
            20. You are required to return this letter of appointment duly signed as a token of your acceptance of the terms and conditions.
          </Text>
          
          <Text style={appointmentStyles.paragraph}>
            We place on record your joining in the Company on {formData.joiningDate || 'JOINING DATE'} and look forward to your long & purposeful association with the Company.
          </Text>
          
          <View style={appointmentStyles.signatureContainer}>
            <View style={appointmentStyles.signatureBox}>
              <Text style={appointmentStyles.signatureTitle}>FOR {formData.companyName?.toUpperCase() || 'COMPANY NAME'}</Text>
              <View style={appointmentStyles.signatureSpace}></View>
              <Text style={appointmentStyles.signatureName}>NAME</Text>
              <Text style={appointmentStyles.signatureRole}>DESIGNATION</Text>
            </View>
            
            <View style={appointmentStyles.signatureBox}>
              <Text style={appointmentStyles.signatureTitle}>ACCEPTED & AGREED</Text>
              <View style={appointmentStyles.signatureSpace}></View>
              <Text style={appointmentStyles.signatureName}>{formData.employeeName?.toUpperCase() || 'EMPLOYEE NAME'}</Text>
              <Text style={appointmentStyles.signatureDate}>DATE: {formData.joiningDate || 'JOINING DATE'}</Text>
            </View>
          </View>
        </View>
        
        {/* Footer */}
        <Footer
          companyName={formData.companyName || 'COMPANY NAME'}
          companyAddress={formData.companyAddressLine1 || 'COMPANY ADDRESS'}
          companyPhone={formData.companyPhone || 'PHONE NUMBER'}
          companyWebsite={formData.companyWebsite || 'WEBSITE'}
          companyColor={formData.companyColor || '#FF0000'}
        />
      </Page>

      {/* Page 5 - Confidentiality */}
      <Page size="A4" style={commonStyles.page}>
        {/* Company Header */}
        <CompanyHeader
          companyName={formData.companyName || 'COMPANY NAME'}
          companyAddress={formData.companyAddressLine1 || 'COMPANY ADDRESS'}
          companyLogo={formData.companyLogo}
          companyPhone={formData.companyPhone || 'PHONE NUMBER'}
          companyWebsite={formData.companyWebsite || 'WEBSITE'}
          companyColor={formData.companyColor || '#FF0000'}
        />
        
        <View style={commonStyles.contentContainer}>
          {/* Confidentiality Section */}
          <Text style={appointmentStyles.sectionHeading}>Confidentiality</Text>
          
          <Text style={appointmentStyles.listItem}>
            21. Without the prior consent of the Company in writing during the continuance of your employment, you shall not publish or cause to be published any publication or contribute any article or review to any newspaper, magazine or other publication whether for remuneration or otherwise on a subject in any way related to or concerning the Company's business, services, products, strategies or policies.
          </Text>
          
          <Text style={appointmentStyles.listItem}>
            22. If, during the period of employment with us, you achieve any inventions, process improvement, operational improvement or other processes/methods, likely to result in more efficient operation of any of the activities of the Company, the Company shall be entitled to use, utilize and exploit such improvement, and such rights shall stand to be automatically assigned to the Company.
          </Text>
          
          <Text style={appointmentStyles.listItem}>
            23. You have to treat the affairs of the Company and its customers of which you may be cognizant, particularly the products, quotations, specifications, trade secrets, systems, procedures or other policy information as strictly confidential.
          </Text>
          
          <Text style={appointmentStyles.listItem}>
            24. During the period of your employment with the Company, you shall at all times observe secrecy in respect of any information of whatever nature be it technical, trade, business data, information of systems, designs, drawings existing programs or programs developed, Software, inventions made by you or any other employee of the Company, which you may acquire or which may come to your knowledge while during the currency of your employment. You shall not disclose the same to anyone except a Company's Officer authorized in that behalf. Even after you cease to be in our employment you shall not disclose the same to anyone.
          </Text>
          
          <Text style={appointmentStyles.listItem}>
            25. You shall assign the right and interest in any invention, improvement design or software development drawing made by you solely or in a group while in employment, and you shall perform all such acts, execute documents without any consideration for securing the Patent design copyright or trade mark or such or any other right or create title in the name of the Company, in relation to any product, service arising out of invention, improvement or software development as stated above.
          </Text>
        </View>
        
        {/* Footer */}
        <Footer
          companyName={formData.companyName || 'COMPANY NAME'}
          companyAddress={formData.companyAddressLine1 || 'COMPANY ADDRESS'}
          companyPhone={formData.companyPhone || 'PHONE NUMBER'}
          companyWebsite={formData.companyWebsite || 'WEBSITE'}
          companyColor={formData.companyColor || '#FF0000'}
        />
      </Page>

      {/* Page 6 - General & Closing */}
      <Page size="A4" style={commonStyles.page}>
        {/* Company Header */}
        <CompanyHeader
          companyName={formData.companyName || 'COMPANY NAME'}
          companyAddress={formData.companyAddressLine1 || 'COMPANY ADDRESS'}
          companyLogo={formData.companyLogo}
          companyPhone={formData.companyPhone || 'PHONE NUMBER'}
          companyWebsite={formData.companyWebsite || 'WEBSITE'}
          companyColor={formData.companyColor || '#FF0000'}
        />
        
        <View style={commonStyles.contentContainer}>
          {/* General Section */}
          <Text style={appointmentStyles.sectionHeading}>General</Text>
          
          <Text style={appointmentStyles.listItem}>
            26. The Company is engaged in the business of providing various professional and other High End Services to its customers and clients. It is just and necessary to keep the operations in tandem with the needs of the customers and clients.
          </Text>
          
          <Text style={appointmentStyles.listItem}>
            27. Office working days are Monday to Friday. Office hours are generally 9:30 am to 6:30 pm however, your working hours may be flexible. You may be required to work in shifts as per the exigencies of work. The management shall have the sole right to change your working hours as per the exigencies of work, similarly your weekly off's shall also be flexible and shall be subject to change as per the exigencies of work.
          </Text>
          
          <Text style={appointmentStyles.listItem}>
            28. There shall be exceptions and flexibility with respect to working hours, leaves & holidays for accommodating needs of internal/external customers and clients& project needs and for those who are interfacing with the customers and clients.
          </Text>
          
          <Text style={appointmentStyles.listItem}>
            29. Leave – You will be entitled to leave in accordance with the Leave Policy framed by the Company from time to time.
          </Text>
          
          <Text style={appointmentStyles.listItem}>
            30. All the correspondence, communications by the company herein after shall be made either personally at work place or at the residential address given by you, at any one of the places at the discretion and convenience of the company. Should you change your residence, you shall forthwith inform the address in writing to the company.
          </Text>
          
          <Text style={appointmentStyles.listItem}>
            31. Any dispute between yourself and the Company concerning or relating to or arising out of your appointment/employment shall be subject to the jurisdiction of {formData.location || 'Pune'}.
          </Text>

          <Text style={[appointmentStyles.listItem, { marginTop: 15 }]}>
            We take pleasure in welcoming you to our Organisation and looking forward to a long association with the Company.
          </Text>
          
          <Text style={appointmentStyles.listItem}>
            You are requested to affix your signature on the duplicate of this letter confirming your acceptance of the terms and conditions of employment and return it to Human Resources.
          </Text>
          
          <Text style={appointmentStyles.listItem}>
            Please meet Human Resources Head regarding your joining documentation and other formalities to be carried out on the date of joining.
          </Text>
          
          <Text style={[appointmentStyles.listItem, { marginTop: 10 }]}>
            Thanking You,
          </Text>
          
          <Text style={[appointmentStyles.listItem, { fontWeight: 'bold', marginTop: 20 }]}>
            {formData.companyName || 'COMPANY NAME'}
          </Text>
          
          {/* Signature Section */}
          <View style={{ marginTop: 40 }}>
            <Text style={appointmentStyles.listItem}>
              {formData.companyHR || 'HR Manager'}
            </Text>
            <Text style={appointmentStyles.listItem}>
              Head - HR Dept
            </Text>
          </View>
        </View>
        
        {/* Footer */}
        <Footer
          companyName={formData.companyName || 'COMPANY NAME'}
          companyAddress={formData.companyAddressLine1 || 'COMPANY ADDRESS'}
          companyPhone={formData.companyPhone || 'PHONE NUMBER'}
          companyWebsite={formData.companyWebsite || 'WEBSITE'}
          companyColor={formData.companyColor || '#FF0000'}
        />
      </Page>

      {/* Page 7 - Salary Annexure */}
      <Page size="A4" style={commonStyles.page}>
        {/* Company Header */}
        <CompanyHeader
          companyName={formData.companyName || 'COMPANY NAME'}
          companyAddress={formData.companyAddressLine1 || 'COMPANY ADDRESS'}
          companyLogo={formData.companyLogo}
          companyPhone={formData.companyPhone || 'PHONE NUMBER'}
          companyWebsite={formData.companyWebsite || 'WEBSITE'}
          companyColor={formData.companyColor || '#FF0000'}
        />
        
        <View style={commonStyles.contentContainer}>
          {/* Salary Table */}
          {formData.salaryComponents && (
            <View>
              <View style={tableStyles.table}>
                <View style={tableStyles.headerRow}>
                  <Text style={[tableStyles.tableHeader, { flex: 3 }]}>EARNINGS</Text>
                  <Text style={[tableStyles.tableHeader, { flex: 2, textAlign: 'right' }]}>MONTHLY</Text>
                  <Text style={[tableStyles.tableHeader, { flex: 2, textAlign: 'right' }]}>YEARLY</Text>
                </View>
                
                {salaryComponents.slice(0, -1).map((item, index) => {
                  // Calculate monthly from annual
                  const annualValue = parseFloat(item.value.replace(/,/g, ''));
                  const monthlyValue = (annualValue / 12).toFixed(2);
                  
                  // Format with commas
                  const formatWithCommas = (num) => {
                    const parts = num.toString().split('.');
                    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                    return parts.join('.');
                  };
                  
                  return (
                    <View key={index} style={tableStyles.tableRow}>
                      <Text style={tableStyles.tableCell}>{item.label}</Text>
                      <Text style={tableStyles.tableCellValue}>{formatWithCommas(monthlyValue)}</Text>
                      <Text style={tableStyles.tableCellValue}>{item.value}</Text>
                    </View>
                  );
                })}
                
                {salaryComponents.length > 0 && (
                  <View style={tableStyles.totalRow}>
                    <Text style={tableStyles.tableCell}>TOTAL</Text>
                    <Text style={tableStyles.tableCellValue}>
                      {(parseFloat(salaryComponents[salaryComponents.length - 1].total.replace(/,/g, '')) / 12).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    </Text>
                    <Text style={tableStyles.tableCellValue}>{salaryComponents[salaryComponents.length - 1].total}</Text>
                  </View>
                )}
              </View>
              
              {/* Notes */}
              <View style={{ marginTop: 20 }}>
                <Text style={[appointmentStyles.sectionHeading, { marginBottom: 10 }]}>Notes:</Text>
                <Text style={appointmentStyles.listItem}>• All payments are subject to appropriate taxation.</Text>
                <Text style={appointmentStyles.listItem}>• All payments would be as per company's rules and regulations and administrative procedure.</Text>
                <Text style={appointmentStyles.listItem}>• The salary structure is liable for modification from time to time.</Text>
                <Text style={appointmentStyles.listItem}>• Company will consider payments done towards LTA as taxable income till the time you submit relevant bills to claim income tax benefit. In case employee wants to claim LTA tax benefit under LTA, the relevant must be submitted latest by 31st December.</Text>
              </View>
              
              {/* HR Signature */}
              <View style={{ marginTop: 30 }}>
                <Text style={appointmentStyles.listItem}>HR Department</Text>
                <Text style={[appointmentStyles.listItem, { marginTop: 20 }]}>Head - HR Dept</Text>
              </View>
            </View>
          )}
        </View>
        
        {/* Footer */}
        <Footer
          companyName={formData.companyName || 'COMPANY NAME'}
          companyAddress={formData.companyAddressLine1 || 'COMPANY ADDRESS'}
          companyPhone={formData.companyPhone || 'PHONE NUMBER'}
          companyWebsite={formData.companyWebsite || 'WEBSITE'}
          companyColor={formData.companyColor || '#FF0000'}
        />
      </Page>
    </Document>
  );
};

// Main Component
function AppointmentLetterV2() {
  const [companies, setCompanies] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [showPF, setShowPF] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    employeeName: "",
    address: "",
    joiningDate: "",
    designation: "",
    department: "",
    reportingAuthority: "HR",
    ctc: "",
    ctcInWords: "",
    location: "",
    companyName: "",
    companyAddressLine1: "",
    companyColor: "",
    companyEmail: "",
    companyPhone: "",
    companyWebsite: "",
    companyLogo: "",
    companyHR: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await fetchCompanies();
        await fetchCandidates();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const fetchCompanies = async () => {
    const querySnapshot = await getDocs(collection(db, "companies"));
    const companyList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setCompanies(companyList);
  };

  const fetchCandidates = async () => {
    const querySnapshot = await getDocs(collection(db, "candidates"));
    const candidateList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setCandidates(candidateList);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "company") {
      const selectedCompany = companies.find(company => company.name === value);
      if (selectedCompany) {
        setFormData(prev => ({
          ...prev,
          companyName: selectedCompany.name,
          companyAddressLine1: selectedCompany.address,
          companyColor: selectedCompany.serverColor,
          companyEmail: selectedCompany.email,
          companyPhone: selectedCompany.mobile,
          companyWebsite: selectedCompany.website,
          companyLogo: selectedCompany.logo,
          companyHR: selectedCompany.hrName
        }));
      }
    } else if (name === "employeeName") {
      const selectedCandidate = candidates.find(candidate => candidate.candidateName === value);
      if (selectedCandidate) {
        const salaryComponents = calculateSalaryComponents(selectedCandidate.packageLPA);
        setFormData(prev => ({
          ...prev,
          employeeName: selectedCandidate.candidateName,
          designation: selectedCandidate.designation,
          department: selectedCandidate.department,
          location: selectedCandidate.location,
          joiningDate: selectedCandidate.DateOfJoining,
          ctc: selectedCandidate.packageLPA,
          ctcInWords: `Rupees ${numberToWords(selectedCandidate.packageLPA * 100000)} Only`,
          salaryComponents: salaryComponents
        }));
      }
    } else if (name === 'ctc') {
      const ctcValue = parseFloat(value);
      const ctcInWords = !isNaN(ctcValue) ? 
        `Rupees ${numberToWords(ctcValue * 100000)} Only` : '';
      
      const salaryComponents = calculateSalaryComponents(ctcValue);
      
      setFormData(prev => ({
        ...prev,
        [name]: value,
        ctcInWords: ctcInWords,
        salaryComponents
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-[210mm] mx-auto">
        <div className="flex justify-between items-center mb-6 md:mb-12 mt-4 md:mt-6">
          <div className="ml-2 md:ml-4">
            <Link to="/" className="back-link flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-4 w-4 md:h-5 md:w-5 mr-2" />
              <span className="text-sm md:text-base">Back to Home</span>
            </Link>
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Enter Appointment Letter Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-group">
              <label className="block mb-2 text-sm font-medium text-gray-700">Employee Name</label>
              <select
                name="employeeName"
                value={formData.employeeName}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Employee</option>
                {candidates.map((candidate) => (
                  <option key={candidate.id} value={candidate.candidateName}>
                    {candidate.candidateName}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="block mb-2 text-sm font-medium text-gray-700">Company</label>
              <select
                name="company"
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Company</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.name}>
                    {company.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label className="block mb-2 text-sm font-medium text-gray-700">Reporting Authority</label>
              <input
                type="text"
                name="reportingAuthority"
                value={formData.reportingAuthority}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter reporting authority"
              />
            </div>
          </div>
          
          <div className="form-group mt-4 flex items-center space-x-3 border p-4 rounded-lg bg-gray-50">
            <input
              type="checkbox"
              id="include-pf"
              checked={showPF}
              onChange={(e) => setShowPF(e.target.checked)}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
            />
            <label 
              htmlFor="include-pf" 
              className="text-gray-700 font-medium cursor-pointer select-none flex items-center"
            >
              <span>Include PF in Salary Structure</span>
              {showPF && (
                <span className="ml-2 text-sm text-green-600">
                  (PF and Gratuity components will be shown in salary breakup)
                </span>
              )}
            </label>
          </div>
        </div>

        {/* PDF Preview Section */}
        <div className="bg-white rounded-lg shadow-lg p-4 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">PDF Preview</h3>
            
            <PDFDownloadLink 
              document={<AppointmentLetterPDF formData={{...formData, showPF}} />}
              fileName="appointment-letter.pdf"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {({ loading }) => (loading ? 'Loading document...' : 'Download PDF')}
            </PDFDownloadLink>
          </div>
          
          <div className="border rounded-lg" style={{ height: '80vh' }}>
            <PDFViewer width="100%" height="100%" className="rounded-lg">
              <AppointmentLetterPDF formData={{...formData, showPF}} />
            </PDFViewer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppointmentLetterV2; 