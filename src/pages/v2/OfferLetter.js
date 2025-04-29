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
import { 
  offerLetterStyles,
  commonStyles 
} from '../../components/pdf/PDFStyles';
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
  calculateSalaryComponentsV2,
  formatIndianCurrency,
  numberToWords
} from '../../components/pdf/SalaryUtilsV2';

// Offer Letter PDF Document Component
const OfferLetterPDF = ({ formData }) => {
  // Format salary values to ensure they display correctly
  const formatSalaryValues = () => {
    if (!formData.salaryComponentsV2) return null;
    
    // Format with exact spacing and formatting as in current PDF
    // Use "Rs." prefix instead of rupee symbol to ensure proper rendering
    return [
      {
        label: 'Basic',
        value: formatIndianCurrency(formData.salaryComponentsV2.annual.basic),
      },
      {
        label: 'Dearness Allowance',
        value: formatIndianCurrency(formData.salaryComponentsV2.annual.dearnessAllowance),
      },
      {
        label: 'Conveyance Allowance',
        value: formatIndianCurrency(formData.salaryComponentsV2.annual.conveyanceAllowance),
      },
      {
        label: 'Other Allowance',
        value: formatIndianCurrency(formData.salaryComponentsV2.annual.otherAllowance),
      },
      {
        total: formatIndianCurrency(formData.lpa ? formData.lpa * 100000 : 0),
      },
    ];
  };

  return (
    <Document>
      {/* Page 1 - Joining Cum Appointment Letter */}
      <Page size="A4" style={offerLetterStyles.page}>
        {/* Company Header */}
        <CompanyHeader 
          companyName={formData.companyName || 'COMPANY NAME'} 
          companyAddress={formData.companyAddressLine1 || 'COMPANY ADDRESS'} 
          companyPhone={formData.companyPhone || 'PHONE NUMBER'}
          companyWebsite={formData.companyWebsite || 'WEBSITE'}
          companyLogo={formData.companyLogo}
          companyColor={formData.companyColor || '#FF0000'}
        />
        
        {/* Letter Title */}
        <LetterTitle title="Joining Cum Appointment Letter" />
        
        {/* Letter Date */}
        <FormattedDate date={formData.joiningDate || new Date()} />
        
        {/* Addressee */}
        <Addressee name={formData.employeeName || 'EMPLOYEE NAME'} />
        
        {/* Letter Content */}
        <View style={offerLetterStyles.letterContent}>
          <Paragraph>
            We Pleased In Appointing You As {formData.designation || 'DESIGNATION'} In {formData.companyName || 'COMPANY NAME'}, 
            at Our Office In Our Organization, Effective From {formData.joiningDate ? new Date(formData.joiningDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'DD MMM YYYY'} On The Following Terms And Conditions:
          </Paragraph>
          
          <Paragraph>
            You will be placed in the appropriate responsibility level of the Company, and will be entitled to compensation (salary and other applicable benefits) as discussed. Compensation will be governed by the rules of the Company on the subject, as applicable and/or amended hereafter.
          </Paragraph>
          
          <Paragraph>
            You will be eligible to the benefits of the Company's Leave Rules on your confirmation in the Company's Service as discussed. During the period of your employment you will devote full time to the work of the Company. Further, you will not take any other employment or assignment or any office honorary or for any consideration in cash or in kind or otherwise, without the prior written permission of the Company.
          </Paragraph>
          
          <Paragraph>
            You will be on a Probation period for the Three months based on your performance. During the probation period your services can be terminated with seven day's notice on either side and without any reasons whatsoever. If your services are found satisfactory during the probation period, you will be confirmed in the present position and thereafter your services can be terminated on one month's notice on either side. The period of probation can be extended at the discretion of the Management and you will continue to be on probation till an order of confirmation has been issued in writing.
          </Paragraph>
          
          <Paragraph>
            Your salary package will be Rs. {formData.lpa ? formatIndianCurrency(formData.lpa * 100000) : '0,00,000'}/- ({formData.lpa ? `${numberToWords(formData.lpa)} Lakh` : 'AMOUNT IN WORDS'} Rupees Only) and no other allowance is provided in that period.
          </Paragraph>
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

      {/* Page 2 - Split of Additional Terms and Salary Annexure to fit content properly */}
      <Page size="A4" style={offerLetterStyles.page}>
        {/* Company Header */}
        <CompanyHeader 
          companyName={formData.companyName || 'COMPANY NAME'} 
          companyAddress={formData.companyAddressLine1 || 'COMPANY ADDRESS'}
          companyPhone={formData.companyPhone || 'PHONE NUMBER'}
          companyWebsite={formData.companyWebsite || 'WEBSITE'}
          companyLogo={formData.companyLogo}
          companyColor={formData.companyColor || '#FF0000'}
        />
        
        {/* Letter Title */}
        <LetterTitle title="Additional Terms" />
        
        {/* Letter Content */}
        <View style={offerLetterStyles.letterContent}>
          <Paragraph>
            You will not disclose any of our technical or other important information which might come into your possession during the continuation of your service with us shall not be disclosed, divulged or made public by you even thereafter.
          </Paragraph>
          
          <Paragraph>
            If you conceive any new or advanced method of improving designs / processes / formulae / systems, etc. related to the interest / business of the Company, such developments will be fully communicated to the company and will be and will remain the sole right/property of the Company. Also includes Technology, Software packages license, Company's policy, Company's platform & Trade Mark and Company's human assets profile. Also the usage of personal USB Drives and CD-ROM's are strictly prohibited.
          </Paragraph>
          
          <Paragraph>
            If any declaration given or information furnished by you, to the Company proves to be false, or if you are found to have willfully suppressed any material information, in such cases you will be liable to removal from services without any notice.
          </Paragraph>
          
          <Paragraph>
            During the probationary period and any extension thereof, your service may be terminated on either side by giving one week's notice or salary in lieu thereof. Upon confirmation the services can be terminated from either side by giving one-month (30 Days) notice or salary in lieu thereof. Upon termination of employment you will immediately hand over to the Company all correspondence, specifications, formulae, books, documents, market data, cost data, drawings, affects or records belonging to the Company or relating to its business and shall not retain or make copies of these items.
          </Paragraph>
          
          <Paragraph>
            If at any time in our opinion which is final in this matter you are found non-performer or guilty of fraud, dishonest, disobedience, disorderly behavior, negligence, indiscipline, absence from duty without permission or any other conduct considered by us deterrent to our interest or of violation of one or more terms of this letter, your services may be terminated without notice.
          </Paragraph>
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

      {/* Page 3 - Continuation of Additional Terms and Salary Annexure */}
      <Page size="A4" style={offerLetterStyles.page}>
        {/* Company Header */}
        <CompanyHeader 
          companyName={formData.companyName || 'COMPANY NAME'} 
          companyAddress={formData.companyAddressLine1 || 'COMPANY ADDRESS'}
          companyPhone={formData.companyPhone || 'PHONE NUMBER'}
          companyWebsite={formData.companyWebsite || 'WEBSITE'}
          companyLogo={formData.companyLogo}
          companyColor={formData.companyColor || '#FF0000'}
        />
        
        {/* Additional Terms Continuation */}
        <View style={{marginBottom: 10}}>
          <Paragraph>
            You will be responsible for safekeeping and return in good condition and order of all Company property which may be in your use, custody or charge.
          </Paragraph>
          
          <Paragraph>
            All legal matters are subject to Pune Jurisdiction.
          </Paragraph>
          
          <Paragraph>
            Please confirm your acceptance of the appointment on the above terms and conditions by signing and returning this letter to us for our records.
          </Paragraph>
          
          <Paragraph>
            Enclosure:- Attaching herewith your salary annexure.
          </Paragraph>
        </View>
        
        {/* Salary Annexure Section */}
        <View style={{marginTop: 10}}>
          <LetterTitle title="Salary Annexure" />
          
          {/* Date - Hardcoded like in the sample */}
          <Text style={commonStyles.letterDate}>Date: 28/04/2025</Text>
          
          {/* Addressee */}
          <Addressee name={formData.employeeName || 'EMPLOYEE NAME'} />
          
          <Paragraph>
            As per mentioned in the offer letter, here with attaching your salary structure which includes your Basic salary and other benefits received by you from the company.
          </Paragraph>
          
          <Text style={{ fontWeight: 'bold', marginTop: 8, marginBottom: 4, fontSize: 11.5, fontFamily: 'Times New Roman' }}>
            Your salary structure as follows:
          </Text>
          
          {/* Salary Table */}
          {formData.salaryComponentsV2 && (
            <SalaryTable components={formatSalaryValues()} />
          )}
          
          <Paragraph>
            We expect you to keep up your performance in the years to come and grow with the organization and we will expect you will get happy and enthusiastic environment for work at the organization.
          </Paragraph>
          
          <Text style={{ marginTop: 8, fontSize: 11.5, fontFamily: 'Times New Roman' }}>Wish you all the best.</Text>
          
          {/* Signature */}
          <Signature designation="Head - HR Dept" style={{ marginTop: 15 }} />
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
        const salaryComponentsV2 = calculateSalaryComponentsV2(selectedCandidate.packageLPA);
        setFormData(prev => ({
          ...prev,
          employeeName: selectedCandidate.candidateName,
          designation: selectedCandidate.designation,
          joiningDate: selectedCandidate.DateOfJoining,
          lpa: selectedCandidate.packageLPA,
          salaryComponentsV2
        }));
      }
    } else if (name === 'lpa') {
      const salaryComponentsV2 = calculateSalaryComponentsV2(value);
      setFormData(prev => ({
        ...prev,
        lpa: value,
        salaryComponentsV2
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