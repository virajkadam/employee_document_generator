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

  return (
    <Document>
      <Page size="A4" style={commonStyles.page}>
        {/* Top Header: ACCOUNT STATEMENT + AU Logo */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#4B2563', letterSpacing: 1, fontFamily: 'Calibri' }}>
            ACCOUNT STATEMENT
          </Text>
          <View style={{ height: 48, width: 120, justifyContent: 'center', alignItems: 'flex-end' }}>
            <Image src={auLogo} style={{ width: 90, height: 40, objectFit: 'contain' }} />
          </View>
        </View>
        {/* Info Section: Two columns */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
          <View style={{ flex: 1, marginRight: 12 }}>
            <Text>Name : {name}</Text>
            <Text>Customer ID : {customerId}</Text>
            <Text>Customer Type : {customerType}</Text>
            <Text>Address : {address}</Text>
            <Text>Statement Date : {statementDate}</Text>
            <Text>Statement Period : {statementPeriod}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text>Account Number : {accountNumber}</Text>
            <Text>Account Type : {accountType}</Text>
            <Text>Branch : {branch}</Text>
            <Text>IFSC : {ifsc}</Text>
            <Text>Nominee : {nominee}</Text>
            <Text>Opening Balance(₹) : {openingBalance}</Text>
            <Text>Closing Balance(₹) : {closingBalance}</Text>
          </View>
        </View>
        {/* Transactions Table */}
        <View style={{ marginTop: 10 }}>
          <View style={styles.tableHeader}>
            <Text style={styles.th}>Transaction Date</Text>
            <Text style={styles.th}>Value Date</Text>
            <Text style={styles.th}>Description/Narration</Text>
            <Text style={styles.th}>Cheque/Ref No.</Text>
            <Text style={styles.th}>Debit (₹)</Text>
            <Text style={styles.th}>Credit (₹)</Text>
            <Text style={styles.th}>Balance (₹)</Text>
          </View>
          {transactions.map((txn, idx) => (
            <View style={styles.tableRow} key={idx} wrap={false}>
              <Text style={styles.td}>{txn.transactionDate}</Text>
              <Text style={styles.td}>{txn.valueDate}</Text>
              <Text style={styles.td}>{txn.description}</Text>
              <Text style={styles.td}>{txn.chequeRefNo}</Text>
              <Text style={styles.td}>{txn.debit}</Text>
              <Text style={styles.td}>{txn.credit}</Text>
              <Text style={styles.td}>{txn.balance}</Text>
            </View>
          ))}
        </View>
        {/* Footer: Disclaimer and Bank Details */}
        <View style={{ position: 'absolute', bottom: 32, left: 0, right: 0, paddingHorizontal: 10 }}>
          <Text style={{ fontSize: 10, color: '#888', textAlign: 'center', marginBottom: 4 }}>
            This is an auto generated statement and requires no signature
          </Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', fontSize: 9, color: '#444', marginTop: 8 }}>
            <View style={{ flex: 1 }}>
              <Text>Call us at{`\n`}1800 1200 1200</Text>
              <Text>Website{`\n`}www.aubank.in</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text>Email{`\n`}customercare@aubank.in</Text>
              <Text>Write to us at{`\n`}Reg. office address</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text>Follow us on{`\n`}Facebook/Twitter</Text>
            </View>
          </View>
          <Text style={{ fontSize: 9, color: '#444', textAlign: 'center', marginTop: 8 }}>
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
      // This is a placeholder. You should fetch/generate real statement data here.
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
        statementDate: new Date().toLocaleDateString('en-GB'),
        statementPeriod: '01 Apr 2025 to 30 Apr 2025',
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
  }, [selectedCandidate, selectedBank]);

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
