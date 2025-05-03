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
    }}
  >
    {/* Border line at the top of footer */}
    <View
      style={{
        borderTopWidth: 1,
        borderTopColor: "#e4e4e4",
        borderTopStyle: "solid",
        width: "100%",
        marginBottom: 15,
      }}
    />
    
    {/* Auto-generated statement text and page number on the same line */}
    <View style={{ 
      flexDirection: "row", 
      width: "100%", 
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
      paddingHorizontal: 24
    }}>
      <View style={{ width: 24 }}>
        {/* Empty space to balance the layout */}
      </View>
      
      <Text
        style={{
          fontSize: 9,
          color: "#000",
          textAlign: "center",
          fontFamily: "Calibri",
          fontWeight: 400,
          flex: 1
        }}
      >
        This is an auto generated statement and requires no signature
      </Text>
      
      <Text
        style={{
          fontSize: 9,
          color: "#444",
          textAlign: "right",
          fontFamily: "Calibri",
          fontWeight: 400,
          width: 70,
        }}
        render={({ pageNumber, totalPages }) =>
          `Page ${pageNumber} of ${totalPages}`
        }
      />
    </View>
    
    <View style={{ borderTopWidth: 1,
        borderTopColor: "#b043ac",
        borderTopStyle: "solid",
        width: "100%",
        marginBottom: 15, }}>


    </View>

    {/* Review information text - purple and centered */}
    <Text
      style={{
        fontSize: 8,
        color: purple,
        textAlign: "center",
        marginBottom: 15,
        fontFamily: "Calibri",
        fontWeight: 400,
        paddingHorizontal: 20,
      }}
    >
      Please review the information provided in the statement. In case of any
      discrepancy, please inform the Bank immediately
    </Text>
    
    {/* Contact information in three columns */}
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        paddingLeft: 36,
        paddingRight: 36,
        marginBottom: 15,
      }}
    >
      {/* Left column */}
      <View style={{ flex: 1, alignItems: "flex-start" }}>
        <Text style={styles.footerText}>Call us at</Text>
        <Text style={styles.footerText}>1800 1200 1200</Text>
      </View>
      
      {/* Center column */}
      <View style={{ flex: 1, alignItems: "center" }}>
        <Text style={styles.footerText}>Website</Text>
        <Text style={styles.footerText}>www.aubank.in</Text>
        <Text style={[styles.footerText, { marginTop: 4 }]}>Email</Text>
        <Text style={styles.footerText}>customercare@aubank.in</Text>
      </View>
      
      {/* Right column */}
      <View style={{ flex: 1, alignItems: "flex-end" }}>
        <Text style={styles.footerText}>Write to us at</Text>
        <Text style={styles.footerText}>Reg. office address</Text>
        <Text style={[styles.footerText, { marginTop: 4 }]}>Follow us on</Text>
        <Text style={styles.footerText}>Facebook/Twitter</Text>
      </View>
    </View>
    
    {/* Bottom purple address bar */}
    <View style={{ backgroundColor: purple, padding: 8, width: "100%" }}>
      <Text style={styles.addressText}>
        19A, DHULESHWAR GARDEN, AJMER ROAD, JAIPUR - 302001, RAJASTHAN (INDIA)
        Ph.: +91 141 4110060/61, TOLL-FREE: 1800 1200 1200
      </Text>
    </View>
  </View>
);

// Helper: AU Small Finance Bank PDF Template
const AUBankStatementPDF = ({ statementData, logo }) => {
  // Format transaction data for display
  const formatTransactions = (transactions = []) => {
    return transactions.map((transaction) => {
      return {
        ...transaction,
        // No special formatting - let React-PDF handle wrapping
        description: transaction.description || "",
        chequeRefNo: transaction.chequeRefNo || "",
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
          padding: "10mm 8mm 20mm 8mm",
          backgroundColor: "white",
          width: "210mm",
          height: "297mm",
          position: "relative",
          fontFamily: "Calibri",
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
            marginBottom: 0,
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
        {/* Horizontal border line separating account info and table */}
        <View
          style={
            {
              // borderBottomWidth: 1,
              // borderBottomColor: "#d1d5db",
              // borderBottomStyle: "solid",
              // width: "100%",
              // marginBottom: 30,
              marginTop: 110,
            }
          }
        />
        {/* Table Section: pixel-perfect header/row alignment and styling */}
        <View
          style={[
            styles.tableContainer,
            {
              
              borderTopWidth: 1,
              borderTopColor: "#d1d5db",
              borderTopStyle: "solid",
              width: "100%",
            },
          ]}
        >
          <View style={styles.tableHeader}>
            <View style={[styles.tableCell, { flex: 1, padding: 0 }]}>
              <Text style={styles.tableHeaderText}>Transaction Date</Text>
            </View>
            <View style={[styles.tableCell, { flex: 1, padding: 0 }]}>
              <Text style={styles.tableHeaderText}>Value Date</Text>
            </View>
            <View style={[styles.tableCell, { flex: 2.2, padding: 0 }]}>
              <Text style={styles.tableHeaderText}>Description/Narration</Text>
            </View>
            <View style={[styles.tableCell, { flex: 1.2, padding: 0 }]}>
              <Text style={styles.tableHeaderText}>Cheque/Reference No.</Text>
            </View>
            <View style={[styles.tableCell, { flex: 0.9, padding: 0 }]}>
              <Text style={styles.tableHeaderText}>Debit</Text>
            </View>
            <View style={[styles.tableCell, { flex: 0.9, padding: 0 }]}>
              <Text style={styles.tableHeaderText}>Credit</Text>
            </View>
            <View
              style={[
                styles.tableCell,
                { flex: 1, borderRightWidth: 0, padding: 0 },
              ]}
            >
              <Text style={styles.tableHeaderText}>Balance</Text>
            </View>
          </View>

          {/* Generate transaction rows */}
          {formattedTransactions.map((transaction, index) => (
            <View style={styles.tableRow} key={index}>
              <View style={[styles.tableCell, { flex: 1, padding: 0 }]}>
                <Text style={styles.tableCellCenter}>
                  {transaction.transactionDate}
                </Text>
              </View>
              <View style={[styles.tableCell, { flex: 1, padding: 0 }]}>
                <Text style={styles.tableCellCenter}>
                  {transaction.valueDate}
                </Text>
              </View>
              <View style={[styles.tableCell, { flex: 2.2, padding: 0 }]}>
                <View style={styles.cellWrapper}>
                  <Text style={styles.wrapTextDescription}>
                    {transaction.description}
                  </Text>
                </View>
              </View>
              <View style={[styles.tableCell, { flex: 1.2, padding: 0 }]}>
                <View style={styles.cellWrapper}>
                  <Text style={styles.wrapTextReference}>
                    {transaction.chequeRefNo}
                  </Text>
                </View>
              </View>
              <View style={[styles.tableCell, { flex: 0.9, padding: 0 }]}>
                <Text style={styles.tableCellRight}>{transaction.debit}</Text>
              </View>
              <View style={[styles.tableCell, { flex: 0.9, padding: 0 }]}>
                <Text style={styles.tableCellRight}>{transaction.credit}</Text>
              </View>
              <View
                style={[
                  styles.tableCell,
                  { flex: 1, borderRightWidth: 0, padding: 0 },
                ]}
              >
                <Text style={styles.tableCellRight}>{transaction.balance}</Text>
              </View>
            </View>
          ))}

          {/* Only show sample row if no transactions */}
          {(!formattedTransactions || formattedTransactions.length === 0) && (
            <View style={styles.tableRow}>
              <View style={[styles.tableCell, { flex: 1, padding: 0 }]}>
                <Text style={styles.tableCellCenter}>01 Apr 2025</Text>
              </View>
              <View style={[styles.tableCell, { flex: 1, padding: 0 }]}>
                <Text style={styles.tableCellCenter}>01 Apr 2025</Text>
              </View>
              <View style={[styles.tableCell, { flex: 2.2, padding: 0 }]}>
                <View style={styles.cellWrapper}>
                  <Text style={styles.wrapTextDescription}>
                    UPI/DR/509157008024/K HOSMAHAMMAD/YESB/00226100000025/UPI AU
                    JAGATPURA
                  </Text>
                </View>
              </View>
              <View style={[styles.tableCell, { flex: 1.2, padding: 0 }]}>
                <View style={styles.cellWrapper}>
                  <Text style={styles.wrapTextReference}>
                    AUS20250401TS0TED6451FABCAE4289873
                  </Text>
                </View>
              </View>
              <View style={[styles.tableCell, { flex: 0.9, padding: 0 }]}>
                <Text style={styles.tableCellRight}>10.00</Text>
              </View>
              <View style={[styles.tableCell, { flex: 0.9, padding: 0 }]}>
                <Text style={styles.tableCellRight}>-</Text>
              </View>
              <View
                style={[
                  styles.tableCell,
                  { flex: 1, borderRightWidth: 0, padding: 0 },
                ]}
              >
                <Text style={styles.tableCellRight}>17,195.00</Text>
              </View>
            </View>
          )}
        </View>
        {/* Footer: updated to match exact design from reference image */}
        <AUStatementFooter purple={purple} />
      </Page>
    </Document>
  );
};

// Update styles to add footer-specific styles
const styles = StyleSheet.create({
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5", // Lighter gray matching reference image
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderStyle: "solid",
    borderBottomWidth: 0,
    minHeight: 30, // Exact height from reference
    fontFamily: "Calibri",
  },
  tableHeaderText: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    color: "#000000",
    textAlign: "center",
    padding: 8, // Exact padding from reference
    width: "100%",
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
    minHeight: 50, // Adjusted height from reference
    fontSize: 9,
    fontFamily: "Calibri",
  },
  tableCell: {
    borderRightWidth: 1,
    borderRightColor: "#d1d5db",
    borderRightStyle: "solid",
    fontFamily: "Calibri",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden", // Critical for preventing text overflow
  },
  cellWrapper: {
    width: "100%",
    height: "100%",
    padding: 4, // Reduced padding to match reference
    justifyContent: "center",
  },
  wrapTextDescription: {
    width: "95%",
    fontSize: 9, // Exact font size from reference
    lineHeight: 1.3, // Reduced line height to match reference
    textAlign: "left",
    hyphens: "auto", // Enable automatic hyphenation
    wordBreak: "break-word", // Force word breaking to prevent overflow
    color: "#000", // Exact text color from reference
    padding: 3, // Added padding inside text element
  },
  wrapTextReference: {
    width: "95%",
    fontSize: 9, // Exact font size from reference
    lineHeight: 1.3, // Reduced line height to match reference
    textAlign: "center",
    hyphens: "auto", // Enable automatic hyphenation
    wordBreak: "break-word", // Force word breaking to prevent overflow
    color: "#000", // Exact text color from reference
    padding: 3, // Added padding inside text element
  },
  tableCellCenter: {
    padding: 4, // Reduced padding to match reference
    width: "95%", // Reduced to ensure margin from cell edges
    textAlign: "center",
    fontSize: 9, // Exact font size from reference
    color: "#000", // Exact text color from reference
  },
  tableCellRight: {
    padding: 4, // Reduced padding to match reference
    width: "95%", // Reduced to ensure margin from cell edges
    textAlign: "right",
    fontSize: 9, // Exact font size from reference
    color: "#000", // Exact text color from reference
  },
  tableCellNarration: {
    flex: 2.2,
    padding: 0, // Remove padding from container
    borderRightWidth: 1,
    borderRightColor: "#d1d5db",
    borderRightStyle: "solid",
    fontFamily: "Calibri",
    overflow: "hidden",
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
  footerText: {
    fontSize: 9,
    color: "#444",
    fontFamily: "Calibri",
    lineHeight: 1.3,
  },
  addressText: {
    fontSize: 9,
    color: "white",
    textAlign: "center",
    fontFamily: "Calibri",
    lineHeight: 1.3,
  },
  tableContainer: {
    marginBottom: 100, // Keep space after table before footer
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
              "UPI/DR/509431982610/SHINDE GANESH BHANUDAS/YESB/002261100000025/UPI AU JAGATPURA",
            chequeRefNo: "AUS20250404TS0TE4EDB07CE82AF4224AFF",
            debit: "120.00",
            credit: "-",
            balance: "17,025.00",
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
