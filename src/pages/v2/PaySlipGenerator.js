import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PDFViewer, PDFDownloadLink, Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';
import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';
import { ArrowLeft } from "lucide-react";
import { CompanyHeader, FormattedDate, Paragraph, Signature, Footer } from '../../components/pdf/PDFComponents';
import { commonStyles } from '../../components/pdf/PDFStyles';
import { formatIndianCurrency } from '../../components/pdf/SalaryUtilsV2';

// Define styles for the PaySlip
const payslipStyles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'Times New Roman',
  },
  subtitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    fontFamily: 'Times New Roman',
  },
  section: {
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderBottomStyle: 'solid',
    paddingVertical: 5,
  },
  cell: {
    flex: 1,
    padding: 5,
    fontSize: 10,
    fontFamily: 'Times New Roman',
  },
  headerCell: {
    flex: 1,
    padding: 5,
    fontSize: 11,
    fontWeight: 'bold',
    fontFamily: 'Times New Roman',
    backgroundColor: '#f0f0f0',
  },
  bold: {
    fontWeight: 'bold',
  },
  employeeInfoContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#000',
    marginVertical: 10,
  },
  employeeInfoSection: {
    flex: 1,
    padding: 8,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  infoLabel: {
    flex: 1,
    fontSize: 10,
    fontWeight: 'bold',
    fontFamily: 'Times New Roman',
  },
  infoValue: {
    flex: 2,
    fontSize: 10,
    fontFamily: 'Times New Roman',
  },
  earningsDeductionsContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#000',
    marginTop: 15,
  },
  earningsSection: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: '#000',
  },
  deductionsSection: {
    flex: 1,
  },
  columnHeader: {
    backgroundColor: '#f0f0f0',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    padding: 5,
  },
  columnHeaderText: {
    flex: 1,
    fontSize: 11,
    fontWeight: 'bold',
    fontFamily: 'Times New Roman',
  },
  amountColumnHeader: {
    flex: 1,
    fontSize: 11,
    fontWeight: 'bold',
    fontFamily: 'Times New Roman',
    textAlign: 'right',
  },
  item: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    padding: 5,
  },
  itemName: {
    flex: 1,
    fontSize: 10,
    fontFamily: 'Times New Roman',
  },
  itemAmount: {
    flex: 1,
    fontSize: 10,
    fontFamily: 'Times New Roman',
    textAlign: 'right',
  },
  totalRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#000',
    padding: 5,
    backgroundColor: '#f0f0f0',
  },
  totalLabel: {
    flex: 1,
    fontSize: 11,
    fontWeight: 'bold',
    fontFamily: 'Times New Roman',
  },
  totalAmount: {
    flex: 1,
    fontSize: 11,
    fontWeight: 'bold',
    fontFamily: 'Times New Roman',
    textAlign: 'right',
  },
  netPayContainer: {
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#000',
  },
  netPayRow: {
    flexDirection: 'row',
    padding: 8,
    backgroundColor: '#e6e6e6',
  },
  netPayLabel: {
    flex: 1,
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Times New Roman',
  },
  netPayAmount: {
    flex: 1,
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Times New Roman',
    textAlign: 'right',
  },
  netPayWords: {
    padding: 8,
    fontSize: 11,
    fontFamily: 'Times New Roman',
    fontStyle: 'italic',
  },
  signature: {
    marginTop: 50,
    flexDirection: 'row',
  },
  signatureSection: {
    flex: 1,
    alignItems: 'center',
  },
  signatureText: {
    fontSize: 11,
    fontFamily: 'Times New Roman',
    marginTop: 20,
  },
});

// PaySlip PDF Document Component
const PaySlipPDF = ({ formData }) => {
  const safeFormData = formData || {};
  
  // Format date
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

  // Get month and year for payslip
  const getPayslipMonth = () => {
    const payDate = safeFormData.payDate ? new Date(safeFormData.payDate) : new Date();
    return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(payDate);
  };

  return (
    <Document>
      <Page size="A4" style={commonStyles.page}>
        {/* Company Header */}
        <CompanyHeader
          companyName={safeFormData.companyName || 'COMPANY NAME'}
          companyAddress={safeFormData.companyAddressLine1 || 'COMPANY ADDRESS'}
          companyLogo={safeFormData.companyLogo}
          companyPhone={safeFormData.companyPhone || 'PHONE NUMBER'}
          companyWebsite={safeFormData.companyWebsite || 'WEBSITE'}
          companyColor={safeFormData.companyColor || '#FF0000'}
        />
        
        {/* Payslip Title */}
        <Text style={payslipStyles.title}>SALARY SLIP - {getPayslipMonth()}</Text>
        
        {/* Employee Information */}
        <View style={payslipStyles.employeeInfoContainer}>
          <View style={payslipStyles.employeeInfoSection}>
            <View style={payslipStyles.infoRow}>
              <Text style={payslipStyles.infoLabel}>Employee Name:</Text>
              <Text style={payslipStyles.infoValue}>{safeFormData.employeeName || 'Employee Name'}</Text>
            </View>
            <View style={payslipStyles.infoRow}>
              <Text style={payslipStyles.infoLabel}>Employee ID:</Text>
              <Text style={payslipStyles.infoValue}>{safeFormData.employeeId || 'EMP001'}</Text>
            </View>
            <View style={payslipStyles.infoRow}>
              <Text style={payslipStyles.infoLabel}>Designation:</Text>
              <Text style={payslipStyles.infoValue}>{safeFormData.designation || 'Designation'}</Text>
            </View>
            <View style={payslipStyles.infoRow}>
              <Text style={payslipStyles.infoLabel}>Department:</Text>
              <Text style={payslipStyles.infoValue}>{safeFormData.department || 'Department'}</Text>
            </View>
          </View>
          
          <View style={payslipStyles.employeeInfoSection}>
            <View style={payslipStyles.infoRow}>
              <Text style={payslipStyles.infoLabel}>Pay Date:</Text>
              <Text style={payslipStyles.infoValue}>{formatDate(safeFormData.payDate) || 'DD/MM/YYYY'}</Text>
            </View>
            <View style={payslipStyles.infoRow}>
              <Text style={payslipStyles.infoLabel}>Bank Name:</Text>
              <Text style={payslipStyles.infoValue}>{safeFormData.bankName || 'Bank Name'}</Text>
            </View>
            <View style={payslipStyles.infoRow}>
              <Text style={payslipStyles.infoLabel}>Bank A/C No:</Text>
              <Text style={payslipStyles.infoValue}>{safeFormData.accountNumber || 'XXXXXXXXXXXX'}</Text>
            </View>
            <View style={payslipStyles.infoRow}>
              <Text style={payslipStyles.infoLabel}>PAN:</Text>
              <Text style={payslipStyles.infoValue}>{safeFormData.pan || 'XXXXXXXXXX'}</Text>
            </View>
          </View>
        </View>
        
        {/* Salary Information - Earnings and Deductions */}
        <View style={payslipStyles.earningsDeductionsContainer}>
          {/* Earnings Section */}
          <View style={payslipStyles.earningsSection}>
            <View style={payslipStyles.columnHeader}>
              <Text style={payslipStyles.columnHeaderText}>Earnings</Text>
              <Text style={payslipStyles.amountColumnHeader}>Amount (Rs.)</Text>
            </View>
            
            {/* Earnings Items */}
            <View style={payslipStyles.item}>
              <Text style={payslipStyles.itemName}>Basic Salary</Text>
              <Text style={payslipStyles.itemAmount}>{formatIndianCurrency(safeFormData.basicSalary || 0)}</Text>
            </View>
            <View style={payslipStyles.item}>
              <Text style={payslipStyles.itemName}>HRA</Text>
              <Text style={payslipStyles.itemAmount}>{formatIndianCurrency(safeFormData.hra || 0)}</Text>
            </View>
            <View style={payslipStyles.item}>
              <Text style={payslipStyles.itemName}>Conveyance Allowance</Text>
              <Text style={payslipStyles.itemAmount}>{formatIndianCurrency(safeFormData.conveyanceAllowance || 0)}</Text>
            </View>
            <View style={payslipStyles.item}>
              <Text style={payslipStyles.itemName}>Medical Allowance</Text>
              <Text style={payslipStyles.itemAmount}>{formatIndianCurrency(safeFormData.medicalAllowance || 0)}</Text>
            </View>
            <View style={payslipStyles.item}>
              <Text style={payslipStyles.itemName}>Special Allowance</Text>
              <Text style={payslipStyles.itemAmount}>{formatIndianCurrency(safeFormData.specialAllowance || 0)}</Text>
            </View>
            
            {/* Total Earnings */}
            <View style={payslipStyles.totalRow}>
              <Text style={payslipStyles.totalLabel}>Total Earnings</Text>
              <Text style={payslipStyles.totalAmount}>
                {formatIndianCurrency(
                  (safeFormData.basicSalary || 0) +
                  (safeFormData.hra || 0) +
                  (safeFormData.conveyanceAllowance || 0) +
                  (safeFormData.medicalAllowance || 0) +
                  (safeFormData.specialAllowance || 0)
                )}
              </Text>
            </View>
          </View>
          
          {/* Deductions Section */}
          <View style={payslipStyles.deductionsSection}>
            <View style={payslipStyles.columnHeader}>
              <Text style={payslipStyles.columnHeaderText}>Deductions</Text>
              <Text style={payslipStyles.amountColumnHeader}>Amount (Rs.)</Text>
            </View>
            
            {/* Deduction Items */}
            <View style={payslipStyles.item}>
              <Text style={payslipStyles.itemName}>Provident Fund</Text>
              <Text style={payslipStyles.itemAmount}>{formatIndianCurrency(safeFormData.providentFund || 0)}</Text>
            </View>
            <View style={payslipStyles.item}>
              <Text style={payslipStyles.itemName}>Income Tax</Text>
              <Text style={payslipStyles.itemAmount}>{formatIndianCurrency(safeFormData.incomeTax || 0)}</Text>
            </View>
            <View style={payslipStyles.item}>
              <Text style={payslipStyles.itemName}>Professional Tax</Text>
              <Text style={payslipStyles.itemAmount}>{formatIndianCurrency(safeFormData.professionalTax || 0)}</Text>
            </View>
            <View style={payslipStyles.item}>
              <Text style={payslipStyles.itemName}>Other Deductions</Text>
              <Text style={payslipStyles.itemAmount}>{formatIndianCurrency(safeFormData.otherDeductions || 0)}</Text>
            </View>
            <View style={payslipStyles.item}>
              <Text style={payslipStyles.itemName}></Text>
              <Text style={payslipStyles.itemAmount}></Text>
            </View>
            
            {/* Total Deductions */}
            <View style={payslipStyles.totalRow}>
              <Text style={payslipStyles.totalLabel}>Total Deductions</Text>
              <Text style={payslipStyles.totalAmount}>
                {formatIndianCurrency(
                  (safeFormData.providentFund || 0) +
                  (safeFormData.incomeTax || 0) +
                  (safeFormData.professionalTax || 0) +
                  (safeFormData.otherDeductions || 0)
                )}
              </Text>
            </View>
          </View>
        </View>
        
        {/* Net Pay */}
        <View style={payslipStyles.netPayContainer}>
          <View style={payslipStyles.netPayRow}>
            <Text style={payslipStyles.netPayLabel}>Net Pay</Text>
            <Text style={payslipStyles.netPayAmount}>
              Rs. {formatIndianCurrency(
                (safeFormData.basicSalary || 0) +
                (safeFormData.hra || 0) +
                (safeFormData.conveyanceAllowance || 0) +
                (safeFormData.medicalAllowance || 0) +
                (safeFormData.specialAllowance || 0) -
                (safeFormData.providentFund || 0) -
                (safeFormData.incomeTax || 0) -
                (safeFormData.professionalTax || 0) -
                (safeFormData.otherDeductions || 0)
              )}
            </Text>
          </View>
          <Text style={payslipStyles.netPayWords}>
            Amount in words: {safeFormData.amountInWords || 'Rupees only'}
          </Text>
        </View>
        
        {/* Signature */}
        <View style={payslipStyles.signature}>
          <View style={payslipStyles.signatureSection}>
            <Text style={payslipStyles.signatureText}>Employee Signature</Text>
          </View>
          <View style={payslipStyles.signatureSection}>
            <Text style={payslipStyles.signatureText}>Authorised Signatory</Text>
          </View>
        </View>
        
        {/* This is a computer generated payslip */}
        <Text style={{ fontSize: 9, marginTop: 30, textAlign: 'center', fontFamily: 'Times New Roman' }}>
          This is a computer generated payslip and does not require signature
        </Text>
        
        {/* Footer */}
        <Footer
          companyName={safeFormData.companyName || 'COMPANY NAME'}
          companyAddress={safeFormData.companyAddressLine1 || 'COMPANY ADDRESS'}
          companyPhone={safeFormData.companyPhone || 'PHONE NUMBER'}
          companyWebsite={safeFormData.companyWebsite || 'WEBSITE'}
          companyColor={safeFormData.companyColor || '#FF0000'}
        />
      </Page>
    </Document>
  );
};

// Main Component
function PaySlipGeneratorV2() {
  const [companies, setCompanies] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    employeeName: "",
    employeeId: "",
    designation: "",
    department: "",
    payDate: new Date().toISOString().split('T')[0],
    bankName: "",
    accountNumber: "",
    pan: "",
    basicSalary: 0,
    hra: 0,
    conveyanceAllowance: 0,
    medicalAllowance: 0,
    specialAllowance: 0,
    providentFund: 0,
    incomeTax: 0,
    professionalTax: 0,
    otherDeductions: 0,
    companyName: "",
    companyAddressLine1: "",
    companyColor: "",
    companyEmail: "",
    companyPhone: "",
    companyWebsite: "",
    companyLogo: "",
    companyHR: ""
  });

  // Use React.useMemo to memoize the PDF document to prevent unnecessary re-renders
  const memoizedPdfDocument = React.useMemo(() => (
    <PaySlipPDF formData={formData} />
  ), [formData]);

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

  // Calculate total earnings
  const totalEarnings = parseFloat(formData.basicSalary || 0) +
    parseFloat(formData.hra || 0) +
    parseFloat(formData.conveyanceAllowance || 0) +
    parseFloat(formData.medicalAllowance || 0) +
    parseFloat(formData.specialAllowance || 0);

  // Calculate total deductions
  const totalDeductions = parseFloat(formData.providentFund || 0) +
    parseFloat(formData.incomeTax || 0) +
    parseFloat(formData.professionalTax || 0) +
    parseFloat(formData.otherDeductions || 0);

  // Calculate net pay
  const netPay = totalEarnings - totalDeductions;

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
        // You may want to calculate salary components based on the LPA
        const basicSalary = selectedCandidate.packageLPA * 100000 * 0.5 / 12; // 50% of CTC as basic
        const hra = basicSalary * 0.4; // 40% of basic as HRA
        const conveyanceAllowance = 1600; // Fixed
        const medicalAllowance = 1250; // Fixed
        const specialAllowance = (selectedCandidate.packageLPA * 100000 / 12) - basicSalary - hra - conveyanceAllowance - medicalAllowance;
        const providentFund = Math.min(basicSalary * 0.12, 1800); // 12% of basic capped at 1800
        
        setFormData(prev => ({
          ...prev,
          employeeName: selectedCandidate.candidateName,
          employeeId: `EMP${Math.floor(1000 + Math.random() * 9000)}`, // Generate random ID
          designation: selectedCandidate.designation,
          department: selectedCandidate.department,
          basicSalary: Math.round(basicSalary),
          hra: Math.round(hra),
          conveyanceAllowance,
          medicalAllowance,
          specialAllowance: Math.round(specialAllowance),
          providentFund: Math.round(providentFund)
        }));
      }
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
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Enter Payslip Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Company Selection */}
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

            {/* Employee Selection */}
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
            
            {/* Pay Date */}
            <div className="form-group">
              <label className="block mb-2 text-sm font-medium text-gray-700">Pay Date</label>
              <input
                type="date"
                name="payDate"
                value={formData.payDate}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            {/* Bank Details */}
            <div className="form-group">
              <label className="block mb-2 text-sm font-medium text-gray-700">Bank Name</label>
              <input
                type="text"
                name="bankName"
                value={formData.bankName}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter bank name"
              />
            </div>
            
            <div className="form-group">
              <label className="block mb-2 text-sm font-medium text-gray-700">Account Number</label>
              <input
                type="text"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter account number"
              />
            </div>
            
            <div className="form-group">
              <label className="block mb-2 text-sm font-medium text-gray-700">PAN</label>
              <input
                type="text"
                name="pan"
                value={formData.pan}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter PAN"
              />
            </div>
          </div>
          
          {/* Earnings and Deductions */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Earnings */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Earnings</h3>
              
              <div className="space-y-4">
                <div className="form-group">
                  <label className="block mb-2 text-sm font-medium text-gray-700">Basic Salary</label>
                  <input
                    type="number"
                    name="basicSalary"
                    value={formData.basicSalary}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="form-group">
                  <label className="block mb-2 text-sm font-medium text-gray-700">HRA</label>
                  <input
                    type="number"
                    name="hra"
                    value={formData.hra}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="form-group">
                  <label className="block mb-2 text-sm font-medium text-gray-700">Conveyance Allowance</label>
                  <input
                    type="number"
                    name="conveyanceAllowance"
                    value={formData.conveyanceAllowance}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="form-group">
                  <label className="block mb-2 text-sm font-medium text-gray-700">Medical Allowance</label>
                  <input
                    type="number"
                    name="medicalAllowance"
                    value={formData.medicalAllowance}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="form-group">
                  <label className="block mb-2 text-sm font-medium text-gray-700">Special Allowance</label>
                  <input
                    type="number"
                    name="specialAllowance"
                    value={formData.specialAllowance}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="p-3 bg-gray-100 rounded-md">
                  <div className="flex justify-between font-semibold">
                    <span>Total Earnings:</span>
                    <span>₹ {totalEarnings.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Deductions */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Deductions</h3>
              
              <div className="space-y-4">
                <div className="form-group">
                  <label className="block mb-2 text-sm font-medium text-gray-700">Provident Fund</label>
                  <input
                    type="number"
                    name="providentFund"
                    value={formData.providentFund}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="form-group">
                  <label className="block mb-2 text-sm font-medium text-gray-700">Income Tax</label>
                  <input
                    type="number"
                    name="incomeTax"
                    value={formData.incomeTax}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="form-group">
                  <label className="block mb-2 text-sm font-medium text-gray-700">Professional Tax</label>
                  <input
                    type="number"
                    name="professionalTax"
                    value={formData.professionalTax}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="form-group">
                  <label className="block mb-2 text-sm font-medium text-gray-700">Other Deductions</label>
                  <input
                    type="number"
                    name="otherDeductions"
                    value={formData.otherDeductions}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="p-3 bg-gray-100 rounded-md">
                  <div className="flex justify-between font-semibold">
                    <span>Total Deductions:</span>
                    <span>₹ {totalDeductions.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Net Pay */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-blue-800">Net Pay:</h3>
              <span className="text-xl font-bold text-blue-800">₹ {netPay.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* PDF Preview Section */}
        <div className="bg-white rounded-lg shadow-lg p-4 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">PDF Preview</h3>
            
            <PDFDownloadLink 
              document={memoizedPdfDocument}
              fileName="payslip.pdf"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {({ loading }) => (loading ? 'Loading document...' : 'Download PDF')}
            </PDFDownloadLink>
          </div>
          
          <div className="border rounded-lg" style={{ height: '80vh' }}>
            <PDFViewer width="100%" height="100%" className="rounded-lg">
              {memoizedPdfDocument}
            </PDFViewer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaySlipGeneratorV2;
