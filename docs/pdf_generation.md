# Employee Document Generator - PDF Generation Overview

## Introduction

The Employee Document Generator is a React application that creates various employment-related documents such as appointment letters, offer letters, relieving letters, and appraisal letters. A key feature of this application is the ability to generate and download documents as PDFs.

## PDF Generation Implementation

### Libraries Used

- **jsPDF**: The core library for generating PDF documents
- **html2canvas**: Used to convert HTML content to canvas, which is then rendered as images in the PDF

### Core Methodology

All document templates use a similar approach for generating PDFs:

1. **HTML Rendering**: Document content is rendered in React components
2. **Off-screen Elements**: Content is rendered in hidden divs with specific page classes (e.g., `offer-letter-page`, `appointment-letter-page`)
3. **Canvas Conversion**: Each page is converted to a canvas using `html2canvas`
4. **PDF Creation**: Canvas images are added to a jsPDF document
5. **Multi-page Support**: For multi-page documents, additional pages are added to the PDF

### Custom Hook Implementation

There is a custom hook `useDownloadPDF` in `src/hooks/useDownloadPDF.js` that provides PDF generation functionality:

```javascript
// src/hooks/useDownloadPDF.js
import { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export function useDownloadPDF() {
  const containerRef = useRef(null);

  const handleDownload = async () => {
    if (!containerRef.current) return;

    const pdf = new jsPDF("p", "mm", "a4");
    const elements =
      containerRef.current.getElementsByClassName("offer-letter-page");

    for (let i = 0; i < elements.length; i++) {
      const canvas = await html2canvas(elements[i]);
      const imgData = canvas.toDataURL("image/jpeg", 1.0);

      if (i > 0) {
        pdf.addPage();
      }

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
    }

    pdf.save("document.pdf");
  };

  return { containerRef, handleDownload };
}
```

However, most document templates implement their own version of the PDF generation function rather than directly using this hook.

### Document-Specific Implementation

Each document type (Appointment Letter, Offer Letter, etc.) has its own implementation of the `handleDownload` function with slight variations:

```javascript
// Example from AppointmentLetter.js
const handleDownload = async () => {
  if (!containerRef.current) return;

  const pdf = new jsPDF("p", "mm", "a4");
  const elements = containerRef.current.getElementsByClassName("appointment-letter-page");

  for (let i = 0; i < elements.length; i++) {
    const canvas = await html2canvas(elements[i]);
    const imgData = canvas.toDataURL("image/jpeg", 1.0);

    if (i > 0) {
      pdf.addPage();
    }

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
  }

  pdf.save("appointment-letter.pdf");
};
```

### Styling and Layout

The documents use consistent styling approaches:

1. **A4 Size**: Pages are styled to match A4 dimensions (210mm × 297mm)
2. **Consistent Headers/Footers**: Each page has a company header and footer
3. **Dynamic Content**: Content is populated from form inputs and Firebase data
4. **Company Branding**: Colors and logos are customized based on company settings
5. **Hidden Rendering**: Content is rendered off-screen using absolute positioning

```css
/* Common styling pattern */
.appointment-letter-page {
  width: 210mm;
  min-height: 297mm;
  padding: 20mm;
}
```

### Data Integration

- **Firebase Integration**: Company and candidate data is fetched from Firestore
- **Dynamic Forms**: User inputs are captured in form state and reflected in the document
- **Salary Calculations**: Custom functions process salary data for display in tables
- **Date Formatting**: Standardized date formatting across all templates

## Document Types

The application supports multiple document types:

1. **Appointment Letter** (`src/pages/AppointmentLetter.js`)
2. **Offer Letter** (`src/pages/OfferLetter.js`)
3. **Relieving Letter** (`src/pages/RelievingLetter.js`)
4. **Appraisal Letter** (`src/pages/AppraisalLetter.js`)
5. **Increment Letter** (`src/pages/IncrementLetter.js`)

## Enhancement Opportunities

Based on best practices from web research, potential improvements could include:

1. **Code Consolidation**: Standardize PDF generation by reusing the `useDownloadPDF` hook
2. **CSS Paged Media**: Consider using dedicated libraries that better support CSS Paged Media specifications
3. **Performance Optimization**: Optimize canvas rendering for larger documents
4. **Accessibility**: Ensure generated PDFs maintain accessibility features
5. **Template Management**: Create a more modular template system

## References

For more information on PDF generation in web applications:
- [Smashing Magazine: How To Create A PDF From Your Web Application](https://www.smashingmagazine.com/2019/06/create-pdf-web-application/)
- Libraries documentation: [jsPDF](https://github.com/parallax/jsPDF) and [html2canvas](https://github.com/niklasvh/html2canvas) 