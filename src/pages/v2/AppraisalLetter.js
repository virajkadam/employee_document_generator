import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PDFViewer, PDFDownloadLink, Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { ArrowLeft, Download } from "lucide-react";
import { commonStyles } from '../../components/pdf/PDFStyles';

// Define styles for the AppraisalLetter
const appraisalLetterStyles = StyleSheet.create({
  page: {
    padding: '25px 50px',
    fontSize: 10,
    fontFamily: 'Calibri',
    lineHeight: 1.3,
    color: '#000000',
  },
  title: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 10,
    fontWeight: 'bold',
    fontFamily: 'Calibri',
  },
  date: {
    marginBottom: 8,
    fontFamily: 'Calibri',
  },
  employeeName: {
    marginBottom: 8,
    fontFamily: 'Calibri',
    textTransform: 'capitalize',
  },
  subject: {
    marginBottom: 10,
    fontFamily: 'Calibri',
  },
  para: {
    marginBottom: 8,
    textAlign: 'justify',
    fontFamily: 'Calibri',
    lineHeight: 1.3,
  },
  tableContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    paddingBottom: 3,
    marginBottom: 3,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#dddddd',
    paddingVertical: 4,
  },
  tableRowTotal: {
    flexDirection: 'row',
    borderTopWidth: 2,
    borderTopColor: '#000000',
    borderBottomWidth: 2,
    borderBottomColor: '#000000',
    paddingVertical: 4,
    fontWeight: 'bold',
  },
  tableCol1: {
    width: '60%',
  },
  tableCol2: {
    width: '40%',
    textAlign: 'right',
  },
  signatureSection: {
    marginTop: 25,
    fontFamily: 'Calibri',
  },
  footer: {
    position: 'absolute',
    bottom: 25,
    left: 50,
    right: 50,
    borderTopWidth: 1,
    borderTopColor: '#FF0000',
    paddingTop: 5,
    textAlign: 'center',
  },
  footerText: {
    fontSize: 8,
    marginBottom: 1,
    fontFamily: 'Calibri',
    textAlign: 'center',
  }
});

// Appraisal Letter PDF Document Component
const AppraisalLetterPDF = ({ formData }) => {
  // Helper to safely access formData
  const safeFormData = formData || {};
  
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

  return (
    <Document>
      <Page size="A4" wrap={false} style={{...commonStyles.page, ...appraisalLetterStyles.page}}>
        {/* Company Header - More compact */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          borderBottomWidth: 1,
          borderBottomColor: safeFormData.companyColor || '#FF0000',
          paddingBottom: 4,
          marginBottom: 10,
        }}>
          <View>
            <Text style={{
              color: safeFormData.companyColor || '#FF0000',
              fontSize: 12,
              fontWeight: 'bold',
              fontFamily: 'Calibri',
              textTransform: 'uppercase',
            }}>
              {safeFormData.companyName || 'COMPANY NAME'}
            </Text>
            <Text style={{fontFamily: 'Calibri', fontSize: 8}}>
              {safeFormData.companyAddressLine1 || 'COMPANY ADDRESS'}
            </Text>
            <Text style={{fontFamily: 'Calibri', fontSize: 8}}>
              Phone: {safeFormData.companyPhone || 'PHONE NUMBER'}
            </Text>
            <Text style={{fontFamily: 'Calibri', fontSize: 8}}>
              {safeFormData.companyWebsite || 'WEBSITE'}
            </Text>
          </View>
          {safeFormData.companyLogo && (
            <Image src={safeFormData.companyLogo} style={{width: 40, height: 40}} />
          )}
        </View>
        
        {/* Letter Title */}
        <Text style={appraisalLetterStyles.title}>
          Employee Appraisal Letter
        </Text>
        
        {/* Letter Content - Everything in one continuous flow with no fixed height container */}
        <View style={{ position: 'relative' }}>
          {/* Date */}
          <Text style={appraisalLetterStyles.date}>
            Date - {formatDate(safeFormData.date)}
          </Text>
          
          {/* Employee Name */}
          <Text style={appraisalLetterStyles.employeeName}>
            {safeFormData.employeeName || 'Employee Name'},
          </Text>
          
          {/* Subject */}
          <Text style={appraisalLetterStyles.subject}>
            Sub: Appraisal Letter
          </Text>
          
          {/* Appreciation Text */}
          <Text style={appraisalLetterStyles.para}>
            We would like to express our appreciation and commendation for all the passion
            and commitment you have been exhibiting in your existing role. In recognition
            of your contribution, it is our pleasure to award you a gross increase in your
            salary with effect from {formatDate(safeFormData.date)}.
          </Text>
          
          <Text style={{...appraisalLetterStyles.para, marginBottom: 5}}>
            Your revised salary structure as follows:
          </Text>
          
          {/* Compensation Table - More compact */}
          <View style={appraisalLetterStyles.tableContainer}>
            {/* Table Header */}
            <View style={appraisalLetterStyles.tableHeader}>
              <Text style={appraisalLetterStyles.tableCol1}>Compensation Heads</Text>
              <Text style={appraisalLetterStyles.tableCol2}>Compensation (In INR)</Text>
            </View>
            
            {/* Basic Row */}
            <View style={appraisalLetterStyles.tableRow}>
              <Text style={appraisalLetterStyles.tableCol1}>Basic</Text>
              <Text style={appraisalLetterStyles.tableCol2}>Rs {safeFormData.basic || '0.00'}</Text>
            </View>
            
            {/* DA Row */}
            <View style={appraisalLetterStyles.tableRow}>
              <Text style={appraisalLetterStyles.tableCol1}>Dearness Allowance</Text>
              <Text style={appraisalLetterStyles.tableCol2}>Rs {safeFormData.da || '0.00'}</Text>
            </View>
            
            {/* Conveyance Row */}
            <View style={appraisalLetterStyles.tableRow}>
              <Text style={appraisalLetterStyles.tableCol1}>Conveyance Allowance</Text>
              <Text style={appraisalLetterStyles.tableCol2}>Rs {safeFormData.conveyance || '0.00'}</Text>
            </View>
            
            {/* Other Row */}
            <View style={appraisalLetterStyles.tableRow}>
              <Text style={appraisalLetterStyles.tableCol1}>Other allowance</Text>
              <Text style={appraisalLetterStyles.tableCol2}>Rs {safeFormData.other || '0.00'}</Text>
            </View>
            
            {/* Total Row */}
            <View style={appraisalLetterStyles.tableRowTotal}>
              <Text style={appraisalLetterStyles.tableCol1}>Monthly Total</Text>
              <Text style={appraisalLetterStyles.tableCol2}>Rs {safeFormData.total || '0.00'}</Text>
            </View>
          </View>
          
          {/* Expectation Text */}
          <Text style={appraisalLetterStyles.para}>
            We expect you to keep up your performance in the years to come and grow with
            the organization. Please sign and return the duplicate copy in token of your
            acceptance, for your records.
          </Text>
          
          <Text style={{...appraisalLetterStyles.para, marginBottom: 15}}>
            Wish you all the best.
          </Text>
          
          {/* Signature Section - Increased bottom margin to prevent footer overlap */}
          <View style={{...appraisalLetterStyles.signatureSection, marginBottom: 60}}>
            <Text>Signature</Text>
            <Text style={{ marginTop: 20 }}>Hr Manager</Text>
          </View>
          
          {/* Spacer to prevent overlap */}
          <View style={{ height: 20 }}></View>
        </View>
        
        {/* Footer - Adjusted position */}
        <View fixed style={{
          position: 'absolute',
          bottom: 20,
          left: 50,
          right: 50,
          borderTopWidth: 1,
          borderTopColor: safeFormData.companyColor || '#FF0000',
          paddingTop: 4,
          textAlign: 'center',
        }}>
          <Text style={appraisalLetterStyles.footerText}>{safeFormData.companyName || 'COMPANY NAME'}</Text>
          <Text style={appraisalLetterStyles.footerText}>{safeFormData.companyAddressLine1 || 'COMPANY ADDRESS'}</Text>
          <Text style={appraisalLetterStyles.footerText}>+91 {safeFormData.companyPhone || 'PHONE NUMBER'}</Text>
          <Text style={appraisalLetterStyles.footerText}>{safeFormData.companyWebsite || 'WEBSITE'}</Text>
        </View>
      </Page>
    </Document>
  );
};

// Main Component
function AppraisalLetterV2() {
  const [companies, setCompanies] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPDF, setShowPDF] = useState(false);
  const [formData, setFormData] = useState({
    employeeName: "",
    date: "",
    lpa: "",
    basic: "",
    da: "",
    conveyance: "",
    other: "",
    total: "",
    salaryInWords: "",
    companyName: "",
    companyAddressLine1: "",
    companyColor: "",
    companyEmail: "",
    companyPhone: "",
    companyWebsite: "",
    companyLogo: "",
  });

  // Use React.useMemo to memoize the PDF document to prevent unnecessary re-renders
  const memoizedPdfDocument = React.useMemo(() => (
    <AppraisalLetterPDF formData={formData} />
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

  // Convert number to words
  const numberToWords = (num) => {
    const single = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
    const double = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
    const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
    const formatTens = (num) => {
      if (num < 10) return single[num];
      if (num < 20) return double[num - 10];
      return tens[Math.floor(num / 10)] + (num % 10 ? " " + single[num % 10] : "");
    };

    if (num === 0) return "Zero";
    const convert = (num) => {
      if (num < 100) return formatTens(num);
      if (num < 1000) return single[Math.floor(num / 100)] + " Hundred" + (num % 100 ? " and " + formatTens(num % 100) : "");
      if (num < 100000) return convert(Math.floor(num / 1000)) + " Thousand" + (num % 1000 ? " " + convert(num % 1000) : "");
      if (num < 10000000) return convert(Math.floor(num / 100000)) + " Lakh" + (num % 100000 ? " " + convert(num % 100000) : "");
      return convert(Math.floor(num / 10000000)) + " Crore" + (num % 10000000 ? " " + convert(num % 10000000) : "");
    };
    return convert(Math.round(num));
  };

  // Calculate salary components based on LPA
  const calculateSalaryComponents = (lpa) => {
    const annualSalary = parseFloat(lpa) * 100000;

    // Standard Indian salary structure
    const basic = Math.round(annualSalary * 0.40); // 40% of CTC
    const hra = Math.round(basic * 0.50); // 50% of Basic
    const da = Math.round(annualSalary * 0.10); // 10% of CTC
    const conveyance = 19200; // Standard yearly conveyance
    const medical = 15000; // Standard medical allowance
    const special = annualSalary - (basic + hra + da + conveyance + medical);

    // Monthly calculations
    const monthlyBasic = Math.round(basic / 12);
    const monthlyHRA = Math.round(hra / 12);
    const monthlyDA = Math.round(da / 12);
    const monthlyConveyance = Math.round(conveyance / 12);
    const monthlyMedical = Math.round(medical / 12);
    const monthlySpecial = Math.round(special / 12);
    const monthlyTotal = monthlyBasic + monthlyHRA + monthlyDA + monthlyConveyance + monthlyMedical + monthlySpecial;

    return {
      basic: monthlyBasic.toFixed(2),
      da: monthlyDA.toFixed(2),
      conveyance: monthlyConveyance.toFixed(2),
      other: monthlySpecial.toFixed(2),
      total: monthlyTotal.toFixed(2),
      salaryInWords: `Rupees ${numberToWords(annualSalary)} Only Per Annum`
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
          companyLogo: selectedCompany.logo
        }));
      }
    } else if (name === "employeeName") {
      // Find selected candidate and calculate salary components
      const selectedCandidate = candidates.find(candidate => candidate.candidateName === value);
      if (selectedCandidate) {
        const lpa = parseFloat(selectedCandidate.packageLPA);
        const components = calculateSalaryComponents(formData.newLPA || lpa); // Use new LPA if available
        
        setFormData(prev => ({
          ...prev,
          employeeName: value,
          currentLPA: lpa, // Store current LPA
          lpa: formData.newLPA || lpa, // Use new LPA if available
          basic: components.basic,
          da: components.da,
          packageLPA: formData.newLPA || selectedCandidate.packageLPA,
          conveyance: components.conveyance,
          other: components.other,
          total: components.total,
          salaryInWords: components.salaryInWords
        }));
      }
    } else if (name === "newLPA") {
      const newLPA = parseFloat(value) || 0;
      const components = calculateSalaryComponents(newLPA);
      
      setFormData(prev => ({
        ...prev,
        newLPA: value,
        lpa: newLPA,
        basic: components.basic,
        da: components.da,
        packageLPA: value,
        conveyance: components.conveyance,
        other: components.other,
        total: components.total,
        salaryInWords: components.salaryInWords
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const handleGenerateDocument = () => {
    setShowPDF(true);
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
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Enter Appraisal Letter Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            {/* Appraisal Date */}
            <div className="form-group">
              <label className="block mb-2 text-sm font-medium text-gray-700">Appraisal Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
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
            
            {/* New Package (LPA) */}
            <div className="form-group">
              <label className="block mb-2 text-sm font-medium text-gray-700">New Package (LPA)</label>
              <input
                type="number"
                name="newLPA"
                value={formData.newLPA || ''}
                onChange={handleInputChange}
                placeholder="Enter new LPA"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                step="0.1"
                min="0"
              />
            </div>
            
            {/* Generate Button */}
            <div className="md:col-span-2 flex justify-end mt-6">
              <button
                onClick={handleGenerateDocument}
                className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 shadow-lg hover:shadow-md transition-all duration-200"
              >
                <Download size={18} className="mr-2" />
                <span>Generate Appraisal Letter</span>
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
                fileName={`AppraisalLetter_${formData.employeeName || 'Employee'}.pdf`}
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

export default AppraisalLetterV2;
