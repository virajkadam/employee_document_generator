import React, { useState, useEffect } from 'react';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';
import { ArrowLeft, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { commonStyles } from '../../components/pdf/PDFStyles';

// Helper: AU Small Finance Bank PDF Template
const AUBankStatementPDF = ({ statementData, logo }) => {
  const {
    name,
    customerId,
    customerType,
    address,
    accountNumber,
    accountType,
    branch,
    ifsc,
    nominee,
    statementDate,
    statementPeriod,
    openingBalance,
    closingBalance,
    transactions = [],
  } = statementData;

  // Use logo from bank db, fallback to AU static logo
  const auLogo = logo || 'https://www.aubank.in/themes/custom/au/images/logo.svg';

  // Colors
  const purple = '#4B2563';
  const lightGray = '#f3f0ff';
  const borderGray = '#d1d5db';

  return (
    <Document>
      <Page size="A4" style={commonStyles.page}>
        {/* Purple Header Bar */}
        <View style={{ backgroundColor: purple, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px', margin: '-10mm -20mm 0 -20mm', height: 48 }}>
          <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', letterSpacing: 1, fontFamily: 'Calibri' }}>
            ACCOUNT STATEMENT
          </Text>
          <View style={{ backgroundColor: 'white', borderRadius: 8, padding: 4, height: 40, width: 100, justifyContent: 'center', alignItems: 'center' }}>
            <Image src={auLogo} style={{ width: 80, height: 32, objectFit: 'contain' }} />
          </View>
        </View>
        {/* Info Section: Two columns, compact */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16, marginBottom: 8 }}>
          <View style={{ flex: 1, marginRight: 12 }}>
            <Text style={{ fontSize: 11, marginBottom: 2 }}>Name : {name}</Text>
            <Text style={{ fontSize: 11, marginBottom: 2 }}>Customer ID : {customerId}</Text>
            <Text style={{ fontSize: 11, marginBottom: 2 }}>Customer Type : {customerType}</Text>
            <Text style={{ fontSize: 11, marginBottom: 2 }}>Address : {address}</Text>
            <Text style={{ fontSize: 11, marginBottom: 2 }}>Statement Date : {statementDate}</Text>
            <Text style={{ fontSize: 11, marginBottom: 2 }}>Statement Period : {statementPeriod}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 11, marginBottom: 2 }}>Account Number : {accountNumber}</Text>
            <Text style={{ fontSize: 11, marginBottom: 2 }}>Account Type : {accountType}</Text>
            <Text style={{ fontSize: 11, marginBottom: 2 }}>Branch : {branch}</Text>
            <Text style={{ fontSize: 11, marginBottom: 2 }}>IFSC : {ifsc}</Text>
            <Text style={{ fontSize: 11, marginBottom: 2 }}>Nominee : {nominee}</Text>
            <Text style={{ fontSize: 11, marginBottom: 2 }}>Opening Balance(₹) : {openingBalance}</Text>
            <Text style={{ fontSize: 11, marginBottom: 2 }}>Closing Balance(₹) : {closingBalance}</Text>
          </View>
        </View>
        {/* Table Section */}
        <View style={{ marginTop: 8 }}>
          <View style={{ flexDirection: 'row', backgroundColor: lightGray, border: `1pt solid ${borderGray}`, borderBottom: 'none', fontWeight: 'bold', fontSize: 10, fontFamily: 'Calibri' }}>
            <Text style={{ flex: 1, padding: 4, borderRight: `1pt solid ${borderGray}` }}>Transaction Date</Text>
            <Text style={{ flex: 1, padding: 4, borderRight: `1pt solid ${borderGray}` }}>Value Date</Text>
            <Text style={{ flex: 2.2, padding: 4, borderRight: `1pt solid ${borderGray}` }}>Description/Narration</Text>
            <Text style={{ flex: 1.2, padding: 4, borderRight: `1pt solid ${borderGray}` }}>Cheque/Ref No.</Text>
            <Text style={{ flex: 0.9, padding: 4, borderRight: `1pt solid ${borderGray}` }}>Debit (₹)</Text>
            <Text style={{ flex: 0.9, padding: 4, borderRight: `1pt solid ${borderGray}` }}>Credit (₹)</Text>
            <Text style={{ flex: 1, padding: 4 }}>Balance (₹)</Text>
          </View>
          {transactions.map((txn, idx) => (
            <View key={idx} style={{ flexDirection: 'row', borderLeft: `1pt solid ${borderGray}`, borderRight: `1pt solid ${borderGray}`, borderBottom: `1pt solid ${borderGray}`, fontSize: 10, fontFamily: 'Calibri', minHeight: 24 }} wrap={false}>
              <Text style={{ flex: 1, padding: 4, borderRight: `1pt solid ${borderGray}` }}>{txn.transactionDate}</Text>
              <Text style={{ flex: 1, padding: 4, borderRight: `1pt solid ${borderGray}` }}>{txn.valueDate}</Text>
              <Text style={{ flex: 2.2, padding: 4, borderRight: `1pt solid ${borderGray}` }}>{txn.description}</Text>
              <Text style={{ flex: 1.2, padding: 4, borderRight: `1pt solid ${borderGray}` }}>{txn.chequeRefNo}</Text>
              <Text style={{ flex: 0.9, padding: 4, borderRight: `1pt solid ${borderGray}` }}>{txn.debit}</Text>
              <Text style={{ flex: 0.9, padding: 4, borderRight: `1pt solid ${borderGray}` }}>{txn.credit}</Text>
              <Text style={{ flex: 1, padding: 4 }}>{txn.balance}</Text>
            </View>
          ))}
        </View>
        {/* Footer: Purple separator, disclaimer, and contact info */}
        <View style={{ position: 'absolute', bottom: 24, left: 0, right: 0, paddingHorizontal: 10 }}>
          <View style={{ borderTop: `2pt solid ${purple}`, width: '100%', marginBottom: 6 }} />
          <Text style={{ fontSize: 9, color: '#888', textAlign: 'center', marginBottom: 4 }}>
            This is an auto generated statement and requires no signature
          </Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', fontSize: 8.5, color: '#444', marginTop: 4 }}>
            <View style={{ flex: 1 }}>
              <Text>Call us at</Text>
              <Text>1800 1200 1200</Text>
              <Text>Website</Text>
              <Text>www.aubank.in</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text>Email</Text>
              <Text>customercare@aubank.in</Text>
              <Text>Write to us at</Text>
              <Text>Reg. office address</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text>Follow us on</Text>
              <Text>Facebook/Twitter</Text>
            </View>
          </View>
          <Text style={{ fontSize: 8.5, color: '#444', textAlign: 'center', marginTop: 6 }}>
            19A, DHULESHWAR GARDEN, AJMER ROAD, JAIPUR - 302001, RAJASTHAN (INDIA) Ph.: +91 141 4110060/61, TOLL-FREE: 1800 1200 1200
          </Text>
        </View>
      </Page>
    </Document>
  );
};

// Table styles for AU statement
const styles = StyleSheet.create({
  tableHeader: {
    flexDirection: 'row',
    borderBottom: '1pt solid #7c3aed',
    backgroundColor: '#f3f0ff',
    fontWeight: 'bold',
    fontSize: 10,
    fontFamily: 'Calibri',
  },
  th: {
    flex: 1,
    padding: 2,
    fontFamily: 'Calibri',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '0.5pt solid #eee',
    fontSize: 9.5,
    fontFamily: 'Calibri',
  },
  td: {
    flex: 1,
    padding: 2,
    fontFamily: 'Calibri',
    wordBreak: 'break-all',
  },
});

// Main BankStatement component
const BankStatement = () => {
  const [candidates, setCandidates] = useState([]);
  const [banks, setBanks] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [selectedBank, setSelectedBank] = useState(null);
  const [statementData, setStatementData] = useState(null);
  const [startDate, setStartDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
  });
  const [endDate, setEndDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().slice(0, 10);
  });

  useEffect(() => {
    fetchCandidates();
    fetchBanks();
  }, []);

  const fetchCandidates = async () => {
    const querySnapshot = await getDocs(collection(db, 'candidates'));
    const candidateList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setCandidates(candidateList);
  };

  const fetchBanks = async () => {
    const querySnapshot = await getDocs(collection(db, 'banks'));
    const bankList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setBanks(bankList);
  };

  // Example: You would fetch/generate statement data based on candidate and bank
  useEffect(() => {
    if (selectedCandidate && selectedBank) {
      // Format statement period
      const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      };
      const period = `${formatDate(startDate)} to ${formatDate(endDate)}`;
      setStatementData({
        bankName: selectedBank.bankName,
        name: selectedCandidate.candidateName,
        customerId: selectedCandidate.employeeCode || '12345678',
        customerType: 'Individual - Full KYC',
        address: selectedCandidate.address || 'N/A',
        accountNumber: selectedCandidate.accountNumber || 'XXXXXXXXXXXX',
        accountType: selectedBank.accountType || 'Savings',
        branch: selectedBank.branch,
        ifsc: selectedBank.ifsc,
        nominee: 'Not Registered',
        statementDate: new Date(endDate).toLocaleDateString('en-GB'),
        statementPeriod: period,
        openingBalance: '17,205.00',
        closingBalance: '13,766.52',
        transactions: [
          {
            transactionDate: '01 Apr 2025',
            valueDate: '01 Apr 2025',
            description: 'UPI/DR/509157008024/K HOSMAHAMMAD/YESB/00226100000025/UPI AU JAGATPURA',
            chequeRefNo: 'AUS20250401TS0TED6451FABCAA4289873',
            debit: '10.00',
            credit: '-',
            balance: '17,195.00',
          },
          // ... more transactions or fetch from your backend
        ],
      });
    } else {
      setStatementData(null);
    }
  }, [selectedCandidate, selectedBank, startDate, endDate]);

  // PDF document for preview/download
  const pdfDocument = statementData && statementData.bankName === 'AU Small Finance Bank'
    ? <AUBankStatementPDF statementData={statementData} logo={selectedBank?.logo} />
    : (
      <Document>
        <Page size="A4" style={commonStyles.page}>
          <Text>Bank statement template for this bank is not yet implemented.</Text>
        </Page>
      </Document>
    );

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
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Generate Bank Statement</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Candidate Dropdown */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Candidate</label>
              <select
                value={selectedCandidate ? selectedCandidate.id : ''}
                onChange={e => {
                  const cand = candidates.find(c => c.id === e.target.value);
                  setSelectedCandidate(cand || null);
                }}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Candidate</option>
                {candidates.map(candidate => (
                  <option key={candidate.id} value={candidate.id}>{candidate.candidateName}</option>
                ))}
              </select>
            </div>
            {/* Bank Dropdown */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Bank</label>
              <select
                value={selectedBank ? selectedBank.id : ''}
                onChange={e => {
                  const bank = banks.find(b => b.id === e.target.value);
                  setSelectedBank(bank || null);
                }}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Bank</option>
                {banks.map(bank => (
                  <option key={bank.id} value={bank.id}>{bank.bankName}</option>
                ))}
              </select>
            </div>
          </div>
          {/* Date Pickers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Statement Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Statement End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
        {/* PDF Preview and Download */}
        {statementData && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Preview</h3>
            <div className="mb-4" style={{ height: '80vh', minHeight: 500 }}>
              <PDFViewer width="100%" height="100%">{pdfDocument}</PDFViewer>
            </div>
            <PDFDownloadLink document={pdfDocument} fileName="bank-statement.pdf">
              {({ loading }) => (
                <button className="bg-blue-600 text-white px-6 py-3 rounded-md flex items-center gap-2 hover:bg-blue-700 transition-colors">
                  <Download className="w-5 h-5" />
                  {loading ? 'Preparing document...' : 'Download PDF'}
                </button>
              )}
            </PDFDownloadLink>
          </div>
        )}
      </div>
    </div>
  );
};

export default BankStatement;
