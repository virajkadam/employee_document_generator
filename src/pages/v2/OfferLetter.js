import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { 
  Document, 
  Page, 
  PDFDownloadLink, 
  PDFViewer,
  Text, 
  View, 
  Image 
} from '@react-pdf/renderer';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

// Import our custom PDF components and styles
import { offerLetterStyles } from '../../components/pdf/PDFStyles';
import { 
  CompanyHeader, 
  LetterTitle,
  FormattedDate,
  Addressee,
  Paragraph,
  Signature,
  Footer,
  SalaryTable
} from '../../components/pdf/PDFComponents';
import { 
  calculateSalaryComponents,
  prepareSalaryTableData
} from '../../components/pdf/SalaryUtils';

// Offer Letter PDF Document Component
const OfferLetterPDF = ({ formData }) => (
  <Document>
    <Page size="A4" style={offerLetterStyles.page}>
      {/* Company Header */}
      <CompanyHeader 
        companyName={formData.companyName || 'COMPANY NAME'} 
        companyAddress={formData.companyAddressLine1 || 'Company Address'} 
        companyLogo={formData.companyLogo}
        companyColor={formData.companyColor}
      />
      
      {/* Letter Date */}
      <FormattedDate date={new Date()} />
      
      {/* Letter Title */}
      <LetterTitle title="OFFER LETTER" />
      
      {/* Addressee */}
      <Addressee name={formData.employeeName || 'Candidate Name'} />
      
      {/* Letter Content */}
      <View style={offerLetterStyles.letterContent}>
        <Paragraph>
          We are pleased to offer you the position of {formData.designation || 'Position'} at {formData.companyName || 'Company Name'}. 
          Your employment will commence on {formData.joiningDate ? new Date(formData.joiningDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : '[Date]'}.
        </Paragraph>
        
        <Paragraph>
          Your compensation package will be {formData.lpa || '0'} LPA ({formData.ctcInWords || 'Zero'}). 
          The detailed break-up of your salary is provided below:
        </Paragraph>
        
        {/* Salary Table */}
        {formData.salaryComponents && (
          <View style={offerLetterStyles.salaryTable}>
            <SalaryTable 
              data={prepareSalaryTableData(formData.salaryComponents)} 
              showMonthly={true}
              showAnnual={true}
            />
          </View>
        )}
        
        <Paragraph>
          This offer is subject to the successful completion of your background check, 
          reference verification, and submission of all required documents. Your employment 
          will be governed by the company policies, rules, and regulations, which may change from time to time.
        </Paragraph>
        
        <Paragraph>
          Please sign and return a copy of this letter to indicate your acceptance of this offer.
        </Paragraph>
        
        <Paragraph>
          We look forward to welcoming you to our team.
        </Paragraph>
        
        {/* Signature */}
        <Signature 
          name="HR Manager"
          companyName={formData.companyName || 'Company Name'}
        />
      </View>
      
      {/* Footer */}
      <Footer 
        companyContact={`${formData.companyName || 'Company Name'} | ${formData.companyEmail || 'Email'} | ${formData.companyPhone || 'Phone'} | ${formData.companyWebsite || 'Website'}`}
      />
    </Page>
  </Document>
);

// Main Component
function OfferLetterV2() {
  const [companies, setCompanies] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    employeeName: "",
    joiningDate: "",
    designation: "",
    lpa: "",
    companyName: "",
    companyAddressLine1: "",
    companyColor: "",
    companyEmail: "",
    companyPhone: "",
    companyWebsite: "",
    companyLogo: ""
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
          companyLogo: selectedCompany.logo
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
          joiningDate: selectedCandidate.DateOfJoining,
          lpa: selectedCandidate.packageLPA,
          salaryComponents,
          ctcInWords: salaryComponents.ctcInWords
        }));
      }
    } else if (name === 'lpa') {
      const salaryComponents = calculateSalaryComponents(value);
      setFormData(prev => ({
        ...prev,
        lpa: value,
        salaryComponents,
        ctcInWords: salaryComponents.ctcInWords
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
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Enter Offer Letter Details</h2>
          
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
          </div>
        </div>

        {/* PDF Preview Section */}
        <div className="bg-white rounded-lg shadow-lg p-4 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">PDF Preview</h3>
            
            <PDFDownloadLink 
              document={<OfferLetterPDF formData={formData} />}
              fileName="offer-letter.pdf"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {({ loading }) => (loading ? 'Loading document...' : 'Download PDF')}
            </PDFDownloadLink>
          </div>
          
          <div className="border rounded-lg" style={{ height: '80vh' }}>
            <PDFViewer width="100%" height="100%" className="rounded-lg">
              <OfferLetterPDF formData={formData} />
            </PDFViewer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OfferLetterV2; 