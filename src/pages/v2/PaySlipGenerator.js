import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PDFViewer, PDFDownloadLink, Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';
import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';
import { ArrowLeft, Download } from "lucide-react";
import { CompanyHeader, FormattedDate, Paragraph, Signature, Footer } from '../../components/pdf/PDFComponents';
import { commonStyles } from '../../components/pdf/PDFStyles';
import { formatIndianCurrency } from '../../components/pdf/SalaryUtilsV2';

// Create watermark styles
const watermarkStyles = StyleSheet.create({
  watermarkContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  watermarkImage: {
    width: '70%',
    height: 'auto',
    opacity: 0.17, // 17% opacity (same as OfferLetter.js)
  }
});

// Watermark Component
const Watermark = ({ logoSrc }) => {
  // Only render if logo exists
  if (!logoSrc) return null;
  
  return (
    <View style={watermarkStyles.watermarkContainer}>
      <Image src={logoSrc} style={watermarkStyles.watermarkImage} />
    </View>
  );
};

// Define styles for the PaySlip
const payslipStyles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'Calibri',
  },
  subtitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    fontFamily: 'Calibri',
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
    fontFamily: 'Calibri',
  },
  headerCell: {
    flex: 1,
    padding: 5,
    fontSize: 11,
    fontWeight: 'bold',
    fontFamily: 'Calibri',
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
    fontFamily: 'Calibri',
  },
  infoValue: {
    flex: 2,
    fontSize: 10,
    fontFamily: 'Calibri',
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
    fontFamily: 'Calibri',
  },
  amountColumnHeader: {
    flex: 1,
    fontSize: 11,
    fontWeight: 'bold',
    fontFamily: 'Calibri',
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
    fontFamily: 'Calibri',
  },
  itemAmount: {
    flex: 1,
    fontSize: 10,
    fontFamily: 'Calibri',
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
    fontFamily: 'Calibri',
  },
  totalAmount: {
    flex: 1,
    fontSize: 11,
    fontWeight: 'bold',
    fontFamily: 'Calibri',
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
    fontFamily: 'Calibri',
  },
  netPayAmount: {
    flex: 1,
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Calibri',
    textAlign: 'right',
  },
  netPayWords: {
    padding: 8,
    fontSize: 11,
    fontFamily: 'Calibri',
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
    fontFamily: 'Calibri',
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
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(payDate).toUpperCase();
  };

  return (
    <Document>
      <Page size="A4" style={commonStyles.page}>
        {/* Watermark */}
        <Watermark logoSrc={safeFormData.companyLogo} />
        
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
        <Text style={payslipStyles.title}>PAY SLIP FOR THE MONTH OF {getPayslipMonth()}</Text>
        
        {/* Employee Information */}
        <View style={payslipStyles.employeeInfoContainer}>
          <View style={{...payslipStyles.employeeInfoSection, flexDirection: 'column'}}>
            <View style={payslipStyles.infoRow}>
              <Text style={payslipStyles.infoLabel}>EMP Code</Text>
              <Text style={payslipStyles.infoValue}>{safeFormData.employeeId || 'EMP001'}</Text>
            </View>
            <View style={payslipStyles.infoRow}>
              <Text style={payslipStyles.infoLabel}>Name</Text>
              <Text style={payslipStyles.infoValue}>{safeFormData.employeeName || 'Employee Name'}</Text>
            </View>
            <View style={payslipStyles.infoRow}>
              <Text style={payslipStyles.infoLabel}>Designation</Text>
              <Text style={payslipStyles.infoValue}>{safeFormData.designation || 'Designation'}</Text>
            </View>
            <View style={payslipStyles.infoRow}>
              <Text style={payslipStyles.infoLabel}>PAN</Text>
              <Text style={payslipStyles.infoValue}>{safeFormData.pan || 'XXXXXXXXXX'}</Text>
            </View>
            <View style={payslipStyles.infoRow}>
              <Text style={payslipStyles.infoLabel}>Location</Text>
              <Text style={payslipStyles.infoValue}>{safeFormData.location || 'Location'}</Text>
            </View>
            <View style={payslipStyles.infoRow}>
              <Text style={payslipStyles.infoLabel}>DOJ</Text>
              <Text style={payslipStyles.infoValue}>{formatDate(safeFormData.payDate) || 'DD/MM/YYYY'}</Text>
            </View>
            <View style={payslipStyles.infoRow}>
              <Text style={payslipStyles.infoLabel}>Department</Text>
              <Text style={payslipStyles.infoValue}>{safeFormData.department || 'Department'}</Text>
            </View>
            <View style={payslipStyles.infoRow}>
              <Text style={payslipStyles.infoLabel}>Payable Days</Text>
              <Text style={payslipStyles.infoValue}>{safeFormData.payableDays || '30'}</Text>
            </View>
          </View>
          
          <View style={payslipStyles.employeeInfoSection}>
            <View style={payslipStyles.infoRow}>
              <Text style={payslipStyles.infoLabel}>Bank Name:</Text>
              <Text style={payslipStyles.infoValue}>{safeFormData.bankName || 'Bank Name'}</Text>
            </View>
            <View style={payslipStyles.infoRow}>
              <Text style={payslipStyles.infoLabel}>Bank A/C No:</Text>
              <Text style={payslipStyles.infoValue}>{safeFormData.accountNumber || 'XXXXXXXXXXXX'}</Text>
            </View>
          </View>
        </View>
        
        {/* Salary Information - Earnings and Deductions */}
        <View style={payslipStyles.earningsDeductionsContainer}>
          {/* Earnings Section */}
          <View style={payslipStyles.earningsSection}>
            <View style={payslipStyles.columnHeader}>
              <Text style={payslipStyles.columnHeaderText}>Earnings</Text>
              <Text style={payslipStyles.amountColumnHeader}>Amount (₹)</Text>
            </View>
            
            {/* Earnings Items */}
            <View style={payslipStyles.item}>
              <Text style={payslipStyles.itemName}>Basic</Text>
              <Text style={payslipStyles.itemAmount}>Rs. {formatIndianCurrency(safeFormData.basicSalary || 0)}</Text>
            </View>
            <View style={payslipStyles.item}>
              <Text style={payslipStyles.itemName}>DA</Text>
              <Text style={payslipStyles.itemAmount}>Rs. {formatIndianCurrency(safeFormData.da || 0)}</Text>
            </View>
            <View style={payslipStyles.item}>
              <Text style={payslipStyles.itemName}>Conveyance Allowance</Text>
              <Text style={payslipStyles.itemAmount}>Rs. {formatIndianCurrency(safeFormData.conveyanceAllowance || 0)}</Text>
            </View>
            <View style={payslipStyles.item}>
              <Text style={payslipStyles.itemName}>Other Allowance</Text>
              <Text style={payslipStyles.itemAmount}>Rs. {formatIndianCurrency(safeFormData.otherAllowance || 0)}</Text>
            </View>
            <View style={payslipStyles.item}>
              <Text style={payslipStyles.itemName}>Medical Allowance</Text>
              <Text style={payslipStyles.itemAmount}>Rs. {formatIndianCurrency(safeFormData.medicalAllowance || 0)}</Text>
            </View>
            <View style={payslipStyles.item}>
              <Text style={payslipStyles.itemName}>CCA</Text>
              <Text style={payslipStyles.itemAmount}>Rs. {formatIndianCurrency(safeFormData.cca || 0)}</Text>
            </View>
            
            {/* Total Earnings */}
            <View style={payslipStyles.totalRow}>
              <Text style={payslipStyles.totalLabel}>Gross Salary</Text>
              <Text style={payslipStyles.totalAmount}>
                Rs. {formatIndianCurrency(
                  (safeFormData.basicSalary || 0) +
                  (safeFormData.da || 0) +
                  (safeFormData.conveyanceAllowance || 0) +
                  (safeFormData.otherAllowance || 0) +
                  (safeFormData.medicalAllowance || 0) +
                  (safeFormData.cca || 0)
                )}
              </Text>
            </View>
          </View>
          
          {/* Deductions Section */}
          <View style={payslipStyles.deductionsSection}>
            <View style={payslipStyles.columnHeader}>
              <Text style={payslipStyles.columnHeaderText}>Deductions</Text>
              <Text style={payslipStyles.amountColumnHeader}>Amount (₹)</Text>
            </View>
            
            {/* Deduction Items */}
            <View style={payslipStyles.item}>
              <Text style={payslipStyles.itemName}>Professional Tax</Text>
              <Text style={payslipStyles.itemAmount}>Rs. {formatIndianCurrency(safeFormData.professionalTax || 0)}</Text>
            </View>
            <View style={payslipStyles.item}>
              <Text style={payslipStyles.itemName}>Other Deductions</Text>
              <Text style={payslipStyles.itemAmount}>Rs. {formatIndianCurrency(safeFormData.otherDeductions || 0)}</Text>
            </View>
            <View style={payslipStyles.item}>
              <Text style={payslipStyles.itemName}></Text>
              <Text style={payslipStyles.itemAmount}></Text>
            </View>
            <View style={payslipStyles.item}>
              <Text style={payslipStyles.itemName}></Text>
              <Text style={payslipStyles.itemAmount}></Text>
            </View>
            <View style={payslipStyles.item}>
              <Text style={payslipStyles.itemName}></Text>
              <Text style={payslipStyles.itemAmount}></Text>
            </View>
            
            {/* Total Deductions */}
            <View style={payslipStyles.totalRow}>
              <Text style={payslipStyles.totalLabel}>Total Deductions</Text>
              <Text style={payslipStyles.totalAmount}>
                Rs. {formatIndianCurrency(
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
                (safeFormData.da || 0) +
                (safeFormData.conveyanceAllowance || 0) +
                (safeFormData.otherAllowance || 0) +
                (safeFormData.medicalAllowance || 0) +
                (safeFormData.cca || 0) -
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
        <Text style={{ fontSize: 9, marginTop: 30, textAlign: 'center', fontFamily: 'Calibri' }}>
          This is a computer-generated Pay slip. No Signature is required.
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
  const [showPDF, setShowPDF] = useState(false);
  const [formData, setFormData] = useState({
    employeeName: "",
    employeeId: "",
    designation: "",
    department: "",
    payDate: new Date().toISOString().split('T')[0],
    location: "",
    payableDays: "30",
    leaves: "0",
    month: new Date().getMonth().toString(),
    pan: "",
    basicSalary: 0,
    da: 0,
    conveyanceAllowance: 0,
    otherAllowance: 0,
    medicalAllowance: 0,
    cca: 0,
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

  // Add this function to calculate days in month
  const getDaysInMonth = (month) => {
    const year = new Date().getFullYear();
    return new Date(year, month + 1, 0).getDate();
  };

  // Calculate salary components
  const calculateSalary = (lpa, leaves = 0, selectedMonth) => {
    // Convert inputs to numbers and provide defaults
    const lpaNum = Number(lpa) || 0;
    const leavesNum = Number(leaves) || 0;
    const monthNum = Number(selectedMonth) || new Date().getMonth();
    
    // Get total days in selected month
    const daysInMonth = getDaysInMonth(monthNum);
    
    // Calculate base annual salary
    const annualSalary = lpaNum * 100000;
    
    // Calculate per day salary
    const perDaySalary = (annualSalary / 12) / daysInMonth;
    
    // Calculate effective monthly salary after leave deductions
    const effectiveSalary = Math.max(0, (annualSalary / 12) - (perDaySalary * leavesNum));
    
    // Calculate components with null checks and Math.max to prevent negative values
    const monthlyBasic = Math.max(0, Math.round(effectiveSalary * 0.5));
    const da = Math.max(0, Math.round(monthlyBasic * 0.2));
    const conveyanceAllowance = Math.max(0, Math.round(1600 * ((daysInMonth - leavesNum) / daysInMonth)));
    const medicalAllowance = Math.max(0, Math.round(1250 * ((daysInMonth - leavesNum) / daysInMonth)));
    const cca = Math.max(0, Math.round(monthlyBasic * 0.1));
    
    // Calculate allowances total
    const totalFixedAllowances = monthlyBasic + da + conveyanceAllowance + medicalAllowance + cca;
    const monthlyCTC = Math.max(0, Math.round(effectiveSalary));
    const otherAllowance = Math.max(0, Math.round(monthlyCTC - totalFixedAllowances));
    
    // Calculate deductions
    const professionalTax = Math.max(0, Math.round(200 * ((daysInMonth - leavesNum) / daysInMonth)));
    
    // Calculate final amounts
    const grossSalary = monthlyBasic + da + conveyanceAllowance + 
                       medicalAllowance + cca + otherAllowance;
    const totalDeductions = professionalTax;
    const netPay = Math.max(0, grossSalary - totalDeductions);
  
    return {
      basicSalary: monthlyBasic,
      da: da,
      conveyanceAllowance: conveyanceAllowance,
      medicalAllowance: medicalAllowance,
      cca: cca,
      otherAllowance: otherAllowance,
      gross: grossSalary,
      professionalTax: professionalTax,
      totalDeductions: totalDeductions,
      netPay: netPay,
      daysInMonth: daysInMonth,
      payableDays: (daysInMonth - leavesNum).toString()
    };
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
        // Calculate salary based on LPA, leaves and selected month
        const salaryComponents = calculateSalary(
          selectedCandidate.packageLPA,
          formData.leaves,
          formData.month
        );
        
        setFormData(prev => ({
          ...prev,
          employeeName: selectedCandidate.candidateName,
          employeeId: selectedCandidate.employeeCode || '',
          designation: selectedCandidate.designation || '',
          department: selectedCandidate.department || '',
          location: selectedCandidate.location || '',
          pan: selectedCandidate.panNo || '',
          ...salaryComponents
        }));
      }
    } else if (name === "leaves" || name === "month") {
      // Recalculate salary when leaves or month changes
      const selectedCandidate = candidates.find(candidate => candidate.candidateName === formData.employeeName);
      if (selectedCandidate) {
        const newLeaves = name === "leaves" ? value : formData.leaves;
        const newMonth = name === "month" ? value : formData.month;
        
        const salaryComponents = calculateSalary(
          selectedCandidate.packageLPA,
          newLeaves,
          newMonth
        );
        
        setFormData(prev => ({
          ...prev,
          [name]: value,
          ...salaryComponents
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const handleGeneratePayslip = () => {
    setShowPDF(true);
  };

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

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
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Enter Payslip Detail</h2>
          
          <div className="space-y-4">
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
            
            {/* Month */}
            <div className="form-group">
              <label className="block mb-2 text-sm font-medium text-gray-700">Month</label>
              <select
                name="month"
                value={formData.month}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {months.map((month, index) => (
                  <option key={index} value={index}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Leaves */}
            <div className="form-group">
              <label className="block mb-2 text-sm font-medium text-gray-700">Leaves (Max: 30 days)</label>
              <input
                type="number"
                name="leaves"
                value={formData.leaves}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="0"
                max="30"
              />
            </div>
            
            {/* Payable Days */}
            <div className="form-group">
              <label className="block mb-2 text-sm font-medium text-gray-700">Payable Days:</label>
              <input
                type="text"
                name="payableDays"
                value={formData.payableDays}
                readOnly
                className="w-full p-3 border border-gray-300 rounded-md bg-gray-100"
                placeholder="Enter payable days"
              />
            </div>
            
            {/* Generate Button */}
            <div className="flex justify-end mt-6">
              <button
                onClick={handleGeneratePayslip}
                className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 shadow-lg hover:shadow-md transition-all duration-200"
              >
                <Download size={18} className="mr-2" />
                <span>Generate PaySlip</span>
              </button>
            </div>
          </div>
        </div>

        {/* PDF Preview Section - only show when Generate button is clicked */}
        {showPDF && (
          <div className="bg-white rounded-lg shadow-lg p-4 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">PDF Preview</h3>
              
              <PDFDownloadLink 
                document={memoizedPdfDocument}
                fileName={`PaySlip_${formData.employeeName || 'Employee'}_${formData.payDate}.pdf`}
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
        )}
      </div>
    </div>
  );
}

export default PaySlipGeneratorV2;
