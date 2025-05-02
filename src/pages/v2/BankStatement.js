import React, { useState, useEffect } from "react";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
import { ArrowLeft, Download } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import { commonStyles } from "../../components/pdf/PDFStyles";

// Register Quicksand font for AU statement
Font.register({
  family: "Quicksand",
  fonts: [
    {
      src: "https://github.com/google/fonts/raw/main/ofl/quicksand/Quicksand-Regular.ttf",
    },
    {
      src: "https://github.com/google/fonts/raw/main/ofl/quicksand/Quicksand-Bold.ttf",
      fontWeight: 700,
    },
  ],
});

// Use built-in fonts that are guaranteed to work with React-PDF
// Helvetica, Helvetica-Bold, etc. are built-in and don't need registration

// AU Statement Header Component
const AUStatementHeader = ({ auLogo, purple }) => (
  <View
    style={{
      backgroundColor: purple,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      height: 68,
      width: "100%",
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
    }}
  >
    <Text
      style={{
        color: "white",
        fontSize: 27,
        fontWeight: 700,
        letterSpacing: 0.5,
        fontFamily: "Calibri",
        marginLeft: 36,
      }}
    >
      ACCOUNT STATEMENT
    </Text>
    <Image
      src={auLogo}
      style={{ width: 110, height: 90, objectFit: "contain", marginRight: 36 }}
    />
  </View>
);

// AU Statement Footer Component
const AUStatementFooter = ({ purple }) => (
  <View
    style={{
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      paddingLeft: 36,
      paddingRight: 36,
      paddingBottom: 10,
      paddingTop: 0,
    }}
  >
    <View
      style={{
        borderTopWidth: 1,
        borderTopColor: purple,
        borderTopStyle: "solid",
        width: "100%",
        marginBottom: 4,
      }}
    />
    <Text
      style={{
        fontSize: 8.5,
        color: "#888",
        textAlign: "center",
        marginBottom: 4,
        fontFamily: "Calibri",
        fontWeight: 400,
        letterSpacing: 0.1,
      }}
    >
      This is an auto generated statement and requires no signature
    </Text>
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        fontSize: 8.5,
        color: "#444",
        fontFamily: "Calibri",
        marginBottom: 0,
      }}
    >
      <View style={{ flex: 1, alignItems: "flex-start" }}>
        <Text>Call us at</Text>
        <Text>1800 1200 1200</Text>
        <Text style={{ marginTop: 2 }}>Website</Text>
        <Text>www.aubank.in</Text>
      </View>
      <View style={{ flex: 1, alignItems: "center" }}>
        <Text>Email</Text>
        <Text>customercare@aubank.in</Text>
        <Text style={{ marginTop: 2 }}>Write to us at</Text>
        <Text>Reg. office address</Text>
      </View>
      <View style={{ flex: 1, alignItems: "flex-end" }}>
        <Text>Follow us on</Text>
        <Text>Facebook/Twitter</Text>
      </View>
    </View>
    <Text
      style={{
        fontSize: 8.5,
        color: "#444",
        textAlign: "center",
        marginTop: 2,
        fontFamily: "Calibri",
        fontWeight: 400,
        letterSpacing: 0.1,
      }}
    >
      19A, DHULESHWAR GARDEN, AJMER ROAD, JAIPUR - 302001, RAJASTHAN (INDIA)
      Ph.: +91 141 4110060/61, TOLL-FREE: 1800 1200 1200
    </Text>
  </View>
);

// Helper: AU Small Finance Bank PDF Template
const AUBankStatementPDF = ({ statementData, logo }) => {
  // Format transaction data to handle wrapping properly
  const formatTransactions = (transactions = []) => {
    return transactions.map(transaction => {
      // Split the description at logical break points for better wrapping
      const description = transaction.description ? 
        transaction.description.split(/(?<=\/)/).join('\n') : '';
      
      // Split the reference number into chunks of appropriate length
      const chequeRefNo = transaction.chequeRefNo ? 
        (transaction.chequeRefNo.match(/.{1,12}/g)?.join('\n') || transaction.chequeRefNo) : '';
      
      return {
        ...transaction,
        description,
        chequeRefNo
      };
    });
  };

  const {
    name,
    customerId,
    customerType,
    address,
    accountNumber,
    accountType,
    branch,
    nominee,
    statementDate,
    statementPeriod,
    openingBalance,
    closingBalance,
    transactions = [],
  } = statementData;

  // Process transactions for display
  const formattedTransactions = formatTransactions(transactions);

  // Use logo from bank db, fallback to AU static logo
  const auLogo =
    logo || "https://www.aubank.in/themes/custom/au/images/logo.svg";
  const purple = "#6d3076";
  const lightGray = "#f7f6fa";
  const borderGray = "#d1d5db";

  return (
    <Document>
      <Page
        size="A4"
        style={{
          padding: '10mm 8mm 0mm 8mm',
          backgroundColor: 'white',
          width: '210mm',
          height: '297mm',
          position: 'relative',
          fontFamily: 'Calibri',
        }}
      >
        <AUStatementHeader auLogo={auLogo} purple={purple} />
        {/* Info Section: Two columns, grid-like flexbox for pixel-perfect alignment */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-start",
            width: "100%",
            paddingLeft: 0,
            paddingRight: 0,
            paddingTop: 0,
            paddingBottom: 12,
            marginTop: 56,
            borderBottomWidth: 1,
            borderBottomColor: borderGray,
            borderBottomStyle: "solid",
            alignItems: "flex-start",
          }}
        >
          {/* Left Column - explicit rows for each field */}
          <View style={{ flex: 1 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                marginBottom: 0,
                minHeight: 24,
              }}
            >
              <Text
                style={{
                  fontSize: 9,
                  fontFamily: "Calibri",
                  color: "#2d3a5a",
                  width: 70,
                  textAlign: "left",
                }}
              >
                Name
              </Text>
              <Text
                style={{
                  fontSize: 9,
                  fontFamily: "Calibri",
                  color: "#2d3a5a",
                  width: 18,
                  textAlign: "center",
                }}
              >
                {" "}
                :{" "}
              </Text>
              <Text
                style={{
                  fontSize: 10,
                  fontFamily: "Helvetica-Bold",
                  color: "#000000",
                  width: 180,
                  textAlign: "left",
                }}
              >
                {name}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                marginBottom: 0,
                minHeight: 24,
              }}
            >
              <Text
                style={{
                  fontSize: 9,
                  fontFamily: "Calibri",
                  color: "#2d3a5a",
                  width: 70,
                  textAlign: "left",
                }}
              >
                Customer ID
              </Text>
              <Text
                style={{
                  fontSize: 9,
                  fontFamily: "Calibri",
                  color: "#2d3a5a",
                  width: 18,
                  textAlign: "center",
                }}
              >
                {" "}
                :{" "}
              </Text>
              <Text
                style={{
                  fontSize: 10,
                  fontFamily: "Helvetica-Bold",
                  color: "#000000",
                  width: 180,
                  textAlign: "left",
                }}
              >
                {customerId}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                marginBottom: 0,
                minHeight: 24,
              }}
            >
              <Text
                style={{
                  fontSize: 9,
                  fontFamily: "Calibri",
                  color: "#2d3a5a",
                  width: 70,
                  textAlign: "left",
                }}
              >
                Customer Type
              </Text>
              <Text
                style={{
                  fontSize: 9,
                  fontFamily: "Calibri",
                  color: "#2d3a5a",
                  width: 18,
                  textAlign: "center",
                }}
              >
                {" "}
                :{" "}
              </Text>
              <Text
                style={{
                  fontSize: 10,
                  fontFamily: "Helvetica-Bold",
                  color: "#000000",
                  width: 180,
                  textAlign: "left",
                }}
              >
                {customerType}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                marginBottom: 0,
                minHeight: 24,
              }}
            >
              <Text
                style={{
                  fontSize: 9,
                  fontFamily: "Calibri",
                  color: "#2d3a5a",
                  width: 70,
                  textAlign: "left",
                }}
              >
                Statement Date
              </Text>
              <Text
                style={{
                  fontSize: 9,
                  fontFamily: "Calibri",
                  color: "#2d3a5a",
                  width: 18,
                  textAlign: "center",
                }}
              >
                {" "}
                :{" "}
              </Text>
              <Text
                style={{
                  fontSize: 10,
                  fontFamily: "Helvetica-Bold",
                  color: "#000000",
                  width: 180,
                  textAlign: "left",
                }}
              >
                {statementDate}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                marginBottom: 0,
                minHeight: 24,
              }}
            >
              <Text
                style={{
                  fontSize: 9,
                  fontFamily: "Calibri",
                  color: "#2d3a5a",
                  width: 70,
                  textAlign: "left",
                }}
              >
                Statement Period
              </Text>
              <Text
                style={{
                  fontSize: 9,
                  fontFamily: "Calibri",
                  color: "#2d3a5a",
                  width: 18,
                  textAlign: "center",
                }}
              >
                {" "}
                :{" "}
              </Text>
              <Text
                style={{
                  fontSize: 10,
                  fontFamily: "Helvetica-Bold",
                  color: "#000000",
                  width: 180,
                  textAlign: "left",
                }}
              >
                {statementPeriod}
              </Text>
            </View>
          </View>
          {/* Right Column - explicit rows for each field */}
          <View style={{ flex: 1, alignItems: "flex-start" }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                marginBottom: 0,
                minHeight: 24,
              }}
            >
              <Text
                style={{
                  fontSize: 9,
                  fontFamily: "Calibri",
                  color: "#2d3a5a",
                  width: 70,
                  textAlign: "left",
                }}
              >
                Account Number
              </Text>
              <Text
                style={{
                  fontSize: 9,
                  fontFamily: "Calibri",
                  color: "#2d3a5a",
                  width: 18,
                  textAlign: "center",
                }}
              >
                {" "}
                :{" "}
              </Text>
              <Text
                style={{
                  fontSize: 10,
                  fontFamily: "Helvetica-Bold",
                  color: "#000000",
                  width: 180,
                  textAlign: "left",
                }}
              >
                {accountNumber}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                marginBottom: 0,
                minHeight: 24,
              }}
            >
              <Text
                style={{
                  fontSize: 9,
                  fontFamily: "Calibri",
                  color: "#2d3a5a",
                  width: 70,
                  textAlign: "left",
                }}
              >
                Account Type
              </Text>
              <Text
                style={{
                  fontSize: 9,
                  fontFamily: "Calibri",
                  color: "#2d3a5a",
                  width: 18,
                  textAlign: "center",
                }}
              >
                {" "}
                :{" "}
              </Text>
              <Text
                style={{
                  fontSize: 10,
                  fontFamily: "Helvetica-Bold",
                  color: "#000000",
                  width: 180,
                  textAlign: "left",
                }}
              >
                {accountType}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                marginBottom: 0,
                minHeight: 24,
              }}
            >
              <Text
                style={{
                  fontSize: 9,
                  fontFamily: "Calibri",
                  color: "#2d3a5a",
                  width: 70,
                  textAlign: "left",
                }}
              >
                Branch
              </Text>
              <Text
                style={{
                  fontSize: 9,
                  fontFamily: "Calibri",
                  color: "#2d3a5a",
                  width: 18,
                  textAlign: "center",
                }}
              >
                {" "}
                :{" "}
              </Text>
              <Text
                style={{
                  fontSize: 10,
                  fontFamily: "Helvetica-Bold",
                  color: "#000000",
                  width: 180,
                  textAlign: "left",
                }}
              >
                {branch}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                marginBottom: 0,
                minHeight: 24,
              }}
            >
              <Text
                style={{
                  fontSize: 9,
                  fontFamily: "Calibri",
                  color: "#2d3a5a",
                  width: 70,
                  textAlign: "left",
                }}
              >
                Nominee
              </Text>
              <Text
                style={{
                  fontSize: 9,
                  fontFamily: "Calibri",
                  color: "#2d3a5a",
                  width: 18,
                  textAlign: "center",
                }}
              >
                {" "}
                :{" "}
              </Text>
              <Text
                style={{
                  fontSize: 10,
                  fontFamily: "Helvetica-Bold",
                  color: "#000000",
                  width: 180,
                  textAlign: "left",
                }}
              >
                {nominee}
              </Text>
            </View>
          </View>
        </View>
        {/* Table Section: pixel-perfect header/row alignment and styling */}
        <View style={{ marginTop: 12 }}>
          <View style={styles.tableHeader}>
            <View style={[styles.tableCell, { flex: 1 }]}>
              <Text style={styles.tableHeaderText}>Transaction Date</Text>
            </View>
            <View style={[styles.tableCell, { flex: 1 }]}>
              <Text style={styles.tableHeaderText}>Value Date</Text>
            </View>
            <View style={[styles.tableCell, { flex: 2.2 }]}>
              <Text style={styles.tableHeaderText}>Description/Narration</Text>
            </View>
            <View style={[styles.tableCell, { flex: 1.2 }]}>
              <Text style={styles.tableHeaderText}>Cheque/Reference No.</Text>
            </View>
            <View style={[styles.tableCell, { flex: 0.9 }]}>
              <Text style={styles.tableHeaderText}>Debit (Rs)</Text>
            </View>
            <View style={[styles.tableCell, { flex: 0.9 }]}>
              <Text style={styles.tableHeaderText}>Credit (Rs)</Text>
            </View>
            <View style={[styles.tableCell, { flex: 1, borderRightWidth: 0 }]}>
              <Text style={styles.tableHeaderText}>Balance (Rs)</Text>
            </View>
          </View>
          {/* Sample transaction row for testing */}
          <View style={styles.tableRow}>
            <View style={[styles.tableCell, { flex: 1 }]}>
              <Text>01 Apr 2025</Text>
            </View>
            <View style={[styles.tableCell, { flex: 1 }]}>
              <Text>01 Apr 2025</Text>
            </View>
            <View style={[styles.tableCell, { flex: 2.2, alignItems: "flex-start" }]}>
              <Text style={styles.wrapText}>
                {'UPI/DR/509157008024/K HOSMAHAMMAD/YESB/00226100000025/UPI AU JAGATPURA'.split(/(?<=\/)/).join('\n')}
              </Text>
            </View>
            <View style={[styles.tableCell, { flex: 1.2 }]}>
              <Text style={styles.wrapText}>
                {'AUS20250401TS0TED6451FABCAE4289873'.match(/.{1,12}/g)?.join('\n') || ''}
              </Text>
            </View>
            <View style={[styles.tableCell, { flex: 0.9, alignItems: "flex-end" }]}>
              <Text>10.00</Text>
            </View>
            <View style={[styles.tableCell, { flex: 0.9, alignItems: "flex-end" }]}>
              <Text>-</Text>
            </View>
            <View style={[styles.tableCell, { flex: 1, alignItems: "flex-end", borderRightWidth: 0 }]}>
              <Text>17,195.00</Text>
            </View>
          </View>
        </View>
        {/* Footer: pixel-perfect, purple bar, contact info, and page number */}
        <View style={{ position: "absolute", left: 0, right: 0, bottom: 0 }}>
          <View
            style={{
              borderTopWidth: 2,
              borderTopColor: purple,
              borderTopStyle: "solid",
              width: "100%",
            }}
          />
          <Text
            style={{
              fontSize: 9,
              color: "#888",
              textAlign: "center",
              marginTop: 6,
              fontFamily: "Calibri",
              fontWeight: 400,
              letterSpacing: 0.1,
            }}
          >
            This is an auto generated statement and requires no signature
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              fontSize: 9,
              color: "#444",
              fontFamily: "Calibri",
              marginTop: 4,
              paddingLeft: 36,
              paddingRight: 36,
            }}
          >
            <View style={{ flex: 1, alignItems: "flex-start" }}>
              <Text>Call us at</Text>
              <Text>1800 1200 1200</Text>
              <Text style={{ marginTop: 2 }}>Website</Text>
              <Text>www.aubank.in</Text>
            </View>
            <View style={{ flex: 1, alignItems: "center" }}>
              <Text>Email</Text>
              <Text>customercare@aubank.in</Text>
              <Text style={{ marginTop: 2 }}>Write to us at</Text>
              <Text>Reg. office address</Text>
            </View>
            <View style={{ flex: 1, alignItems: "flex-end" }}>
              <Text>Follow us on</Text>
              <Text>Facebook/Twitter</Text>
            </View>
          </View>
          <Text
            style={{
              fontSize: 9,
              color: "#444",
              textAlign: "center",
              marginTop: 2,
              fontFamily: "Calibri",
              fontWeight: 400,
              letterSpacing: 0.1,
            }}
          >
            19A, DHULESHWAR GARDEN, AJMER ROAD, JAIPUR - 302001, RAJASTHAN
            (INDIA) Ph.: +91 141 4110060/61, TOLL-FREE: 1800 1200 1200
          </Text>
          <Text
            style={{
              fontSize: 9,
              color: "#444",
              textAlign: "right",
              marginTop: 2,
              marginRight: 36,
              fontFamily: "Calibri",
              fontWeight: 400,
              letterSpacing: 0.1,
            }}
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} of ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );
};

// Table styles for AU statement
const styles = StyleSheet.create({
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderStyle: "solid",
    borderBottomWidth: 0,
    minHeight: 30,
    fontFamily: "Calibri",
  },
  tableRow: {
    flexDirection: "row",
    borderLeftWidth: 1,
    borderLeftColor: "#d1d5db",
    borderLeftStyle: "solid",
    borderRightWidth: 1,
    borderRightColor: "#d1d5db",
    borderRightStyle: "solid",
    borderBottomWidth: 1,
    borderBottomColor: "#d1d5db",
    borderBottomStyle: "solid",
    minHeight: 60,
    fontSize: 9,
    fontFamily: "Calibri",
  },
  tableCell: {
    padding: 6,
    borderRightWidth: 1,
    borderRightColor: "#d1d5db",
    borderRightStyle: "solid",
    fontFamily: "Calibri",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  tableCellNarration: {
    flex: 2.2,
    padding: 8,
    borderRightWidth: 1,
    borderRightColor: "#d1d5db",
    borderRightStyle: "solid",
    fontFamily: "Calibri",
    textAlign: "left",
  },
  tableCellRef: {
    flex: 1.2,
    padding: 8,
    borderRightWidth: 1,
    borderRightColor: "#d1d5db",
    borderRightStyle: "solid",
    fontFamily: "Calibri",
    textAlign: "center",
  },
  tableCellAmount: {
    flex: 0.9,
    padding: 8,
    borderRightWidth: 1,
    borderRightColor: "#d1d5db",
    borderRightStyle: "solid",
    fontFamily: "Calibri",
    textAlign: "right",
  },
  tableCellDateValue: {
    flex: 1,
    padding: 8,
    borderRightWidth: 1,
    borderRightColor: "#d1d5db",
    borderRightStyle: "solid",
    fontFamily: "Calibri",
    textAlign: "center",
  },
  tableCellBalance: {
    flex: 1,
    padding: 8,
    fontFamily: "Calibri",
    textAlign: "right",
  },
  tableHeaderText: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    color: "#000000",
    textAlign: "center",
  },
  wrapText: {
    width: "100%",
    maxWidth: "100%",
    fontSize: 8.5,
    wordBreak: "break-word",
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
    return new Date(now.getFullYear(), now.getMonth(), 1)
      .toISOString()
      .slice(0, 10);
  });
  const [endDate, setEndDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0)
      .toISOString()
      .slice(0, 10);
  });

  useEffect(() => {
    fetchCandidates();
    fetchBanks();
  }, []);

  const fetchCandidates = async () => {
    const querySnapshot = await getDocs(collection(db, "candidates"));
    const candidateList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setCandidates(candidateList);
  };

  const fetchBanks = async () => {
    const querySnapshot = await getDocs(collection(db, "banks"));
    const bankList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setBanks(bankList);
  };

  // Example: You would fetch/generate statement data based on candidate and bank
  useEffect(() => {
    if (selectedCandidate && selectedBank) {
      // Format statement period
      const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
      };
      const period = `${formatDate(startDate)} to ${formatDate(endDate)}`;
      setStatementData({
        bankName: selectedBank.bankName,
        name: selectedCandidate.candidateName,
        customerId: selectedCandidate.employeeCode || "12345678",
        customerType: "Individual - Full KYC",
        address: selectedCandidate.address || "N/A",
        accountNumber: selectedCandidate.accountNumber || "XXXXXXXXXXXX",
        accountType: "AU Salary Account-Value",
        branch: "Pune East Street Camp",
        nominee: "Not Registered",
        statementDate: new Date(endDate).toLocaleDateString("en-GB"),
        statementPeriod: period,
        openingBalance: "17,205.00",
        closingBalance: "13,766.52",
        transactions: [
          {
            transactionDate: "01 Apr 2025",
            valueDate: "01 Apr 2025",
            description:
              "UPI/DR/509157008024/K HOSMAHAMMAD/YESB/00226100000025/UPI AU JAGATPURA",
            chequeRefNo: "AUS20250401TS0TED6451FABCAA4289873",
            debit: "10.00",
            credit: "-",
            balance: "17,195.00",
          },
          {
            transactionDate: "01 Apr 2025",
            valueDate: "01 Apr 2025",
            description:
              "UPI/DR/509132244631/VIK AS JALINDAR KALE/KBKB/0641091000053/2328609AU JAGATPURA",
            chequeRefNo: "AUS20250401TS0TE4E9767AB03304F2D883",
            debit: "50.00",
            credit: "-",
            balance: "17,145.00",
          },
          {
            transactionDate: "04 Apr 2025",
            valueDate: "04 Apr 2025",
            description:
              "UPI/DR/509431982610/SHINDE GANESH BHANUDAS/YESB/002261100000025/UPI AU JAGATPURA",
            chequeRefNo: "AUS20250404TS0TE4EDB07CE82AF4224AFF",
            debit: "120.00",
            credit: "-",
            balance: "17,025.00",
          },
          {
            transactionDate: "04 Apr 2025",
            valueDate: "04 Apr 2025",
            description:
              "UPI/DR/509487121216/SUGAT BHIMRAJ SARWADE/SBIN/00000032889570404/UPI AU JAGATPURA",
            chequeRefNo: "AUS20250404TS0TE66079CDF8D9D4D668DD",
            debit: "500.00",
            credit: "-",
            balance: "16,525.00",
          },
          {
            transactionDate: "04 Apr 2025",
            valueDate: "04 Apr 2025",
            description: "SMS_ALERT_CHARGE_JA N25_Mar25",
            chequeRefNo: "",
            debit: "2.48",
            credit: "-",
            balance: "16,522.52",
          },
          {
            transactionDate: "08 Apr 2025",
            valueDate: "08 Apr 2025",
            description:
              "UPI/DR/509853502986/SHINDE GANESH BHANUDAS/YESB/00142500000051/UPI AU JAGATPURA",
            chequeRefNo: "AUS20250408TS0TE23443CA252724302AE6",
            debit: "120.00",
            credit: "-",
            balance: "16,402.52",
          },
          {
            transactionDate: "10 Apr 2025",
            valueDate: "10 Apr 2025",
            description:
              "UPI/DR/510045139727/SUGAT BHIMRAJ SARWADE/SBIN/00000032889570404/UPI AU JAGATPURA",
            chequeRefNo: "AUS20250410TS0TE20612F8EC0324B7BCC",
            debit: "500.00",
            credit: "-",
            balance: "15,902.52",
          },
        ],
      });
    } else {
      setStatementData(null);
    }
  }, [selectedCandidate, selectedBank, startDate, endDate]);

  // PDF document for preview/download
  const pdfDocument =
    statementData && statementData.bankName === "AU Small Finance Bank" ? (
      <AUBankStatementPDF
        statementData={statementData}
        logo={selectedBank?.logo}
      />
    ) : (
      <Document>
        <Page size="A4" style={commonStyles.page}>
          <Text>
            Bank statement template for this bank is not yet implemented.
          </Text>
        </Page>
      </Document>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-[210mm] mx-auto">
        <div className="flex justify-between items-center mb-6 md:mb-12 mt-4 md:mt-6">
          <div className="ml-2 md:ml-4">
            <Link
              to="/"
              className="back-link flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4 md:h-5 md:w-5 mr-2" />
              <span className="text-sm md:text-base">Back to Home</span>
            </Link>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Generate Bank Statement
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Candidate Dropdown */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Candidate
              </label>
              <select
                value={selectedCandidate ? selectedCandidate.id : ""}
                onChange={(e) => {
                  const cand = candidates.find((c) => c.id === e.target.value);
                  setSelectedCandidate(cand || null);
                }}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Candidate</option>
                {candidates.map((candidate) => (
                  <option key={candidate.id} value={candidate.id}>
                    {candidate.candidateName}
                  </option>
                ))}
              </select>
            </div>
            {/* Bank Dropdown */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Bank
              </label>
              <select
                value={selectedBank ? selectedBank.id : ""}
                onChange={(e) => {
                  const bank = banks.find((b) => b.id === e.target.value);
                  setSelectedBank(bank || null);
                }}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Bank</option>
                {banks.map((bank) => (
                  <option key={bank.id} value={bank.id}>
                    {bank.bankName}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* Date Pickers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Statement Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Statement End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
        {/* PDF Preview and Download */}
        {statementData && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Preview
            </h3>
            <div className="mb-4" style={{ height: "80vh", minHeight: 500 }}>
              <PDFViewer width="100%" height="100%">
                {pdfDocument}
              </PDFViewer>
            </div>
            <PDFDownloadLink
              document={pdfDocument}
              fileName="bank-statement.pdf"
            >
              {({ loading }) => (
                <button className="bg-blue-600 text-white px-6 py-3 rounded-md flex items-center gap-2 hover:bg-blue-700 transition-colors">
                  <Download className="w-5 h-5" />
                  {loading ? "Preparing document..." : "Download PDF"}
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
