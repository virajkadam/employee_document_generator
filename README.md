# Bank Statement Security Enhancements

This module provides security enhancements for bank statement PDFs to ensure they appear authentic when subjected to forensic analysis.

## Problem Addressed

Our bank statement PDFs were flagged with security concerns:

- PDF Producer showing as "Microsoft: Print To PDF" 
- Missing digital signature
- No metadata tying to a bank system
- Empty or default Author/Title information

## Solution

We've implemented a non-invasive solution that enhances PDF security **without modifying the original BankStatement.js file**. Our approach:

1. **Enhanced Metadata**: We modify the PDF metadata to properly identify the bank and statement details
2. **Document Verification**: We add a unique document ID and verification URL
3. **Drop-in Component**: Our solution can be easily added to the existing application

## Implementation

We've created several components that can be used independently or together:

### 1. Utility Functions

Located in `src/utils/pdfSecurityUtils.js`, these functions handle the core PDF enhancement:

```js
import { enhancePDFMetadata, downloadEnhancedPDF } from '../utils/pdfSecurityUtils';

// Example usage
const enhancedPdfBytes = await enhancePDFMetadata(pdfBytes, bankData, statementData);
downloadEnhancedPDF(enhancedPdfBytes, 'secure-bank-statement.pdf');
```

### 2. React Hook

Located in `src/hooks/useSecurePDF.js`, this hook provides a simple interface for React components:

```jsx
import { useSecurePDF } from '../hooks/useSecurePDF';

function MyComponent() {
  const { enhanceAndDownloadPDF } = useSecurePDF();
  
  const handleDownload = () => {
    enhanceAndDownloadPDF(
      pdfDocument,
      'bank-statement.pdf',
      bankData,
      statementData
    );
  };
  
  return <button onClick={handleDownload}>Download Secure PDF</button>;
}
```

### 3. Downloader Component

Located in `src/components/SecureBankStatementDownloader.js`, this is a ready-to-use button component:

```jsx
import SecureBankStatementDownloader from '../components/SecureBankStatementDownloader';

function MyComponent() {
  return (
    <SecureBankStatementDownloader 
      pdfDocument={pdfDocument}
      statementData={statementData}
      bankData={bankData}
      fileName="bank-statement.pdf"
    />
  );
}
```

### 4. Enhanced Bank Statement Page

We've also created a drop-in replacement page at `src/pages/v2/EnhancedBankStatement.js` that wraps the original BankStatement component and adds our security features.

## Getting Started

1. Install required dependencies:

```bash
npm install pdf-lib --save
```

2. Choose your integration method:

- **Simple**: Add the `SecureBankStatementDownloader` component next to your existing download button
- **Advanced**: Use the `useSecurePDF` hook in your custom component
- **Replacement**: Use the `EnhancedBankStatement` page instead of the original BankStatement

## Example Integration

```jsx
import React from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import SecureBankStatementDownloader from '../components/SecureBankStatementDownloader';

function BankStatementPage() {
  // Your existing code...
  
  return (
    <div>
      <h1>Bank Statement</h1>
      
      {/* PDF Viewer */}
      <PDFViewer width="100%" height="500px">
        {pdfDocument}
      </PDFViewer>
      
      {/* Download options */}
      <div className="flex gap-4 mt-4">
        {/* Original download button */}
        <PDFDownloadLink document={pdfDocument} fileName="bank-statement.pdf">
          {({ loading }) => (
            <button className="bg-gray-600 text-white px-4 py-2 rounded">
              {loading ? "Loading..." : "Standard Download"}
            </button>
          )}
        </PDFDownloadLink>
        
        {/* New secure download button */}
        <SecureBankStatementDownloader 
          pdfDocument={pdfDocument}
          statementData={statementData}
          bankData={selectedBank}
          fileName="secure-bank-statement.pdf"
        />
      </div>
    </div>
  );
}
```

## Security Features Added

The enhanced PDFs include:

- Proper PDF producer information (e.g., "AU Small Finance Bank Statement System v1.0")
- Bank-specific creator and title information
- Document ID and verification metadata
- Detailed statement information in metadata (account number, date, branch, etc.)
- Verification URL in metadata
- Same visual appearance as the standard version

## Technical Details

Our implementation uses the `pdf-lib` library to modify PDF metadata after it's generated by React-PDF. This approach allows us to maintain compatibility with the existing codebase while adding security enhancements.

```js
// Example of metadata added
pdfDoc.setProducer(`${bankData.bankName} Statement System v1.0`);
pdfDoc.setCreator(`${bankData.bankName} Financial Services`);
pdfDoc.setTitle(`${bankData.bankName} Statement - ${statementData.accountNumber}`);
pdfDoc.setSubject(`Account Statement for ${statementData.statementPeriod}`);
pdfDoc.setKeywords(['bank statement', 'financial record', bankData.bankName]);
pdfDoc.setCustomMetadata('DocumentID', docId);
pdfDoc.setCustomMetadata('IssueDate', new Date().toISOString());
pdfDoc.setCustomMetadata('IssuingBank', bankData.bankName);
``` 