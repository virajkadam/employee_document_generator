import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PaySlipGenerator from "./pages/PaySlipGenerator";
import OfferLetter from "./pages/OfferLetter";
import AppointmentLetter from "./pages/AppointmentLetter";
import RelievingLetter from "./pages/RelievingLetter";
import AppraisalLetter from "./pages/AppraisalLetter";
import IncrementLetter from "./pages/IncrementLetter";
import ManageCompany from "./pages/ManageCompany";
import ManageStudent from "./pages/ManageStudent";
// Import our v2 PDF components
import OfferLetterV2 from "./pages/v2/OfferLetter";
import AppointmentLetterV2 from "./pages/v2/AppointmentLetter";
import PaySlipGeneratorV2 from "./pages/v2/PaySlipGenerator";
import RelievingLetterV2 from "./pages/v2/RelievingLetter";
import AppraisalLetterV2 from "./pages/v2/AppraisalLetter";
import ManageBank from "./pages/v2/ManageBank";
import BankStatement from "./pages/v2/BankStatement";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/manage-company" element={<ManageCompany />} />
        <Route path="/manage-student" element={<ManageStudent />} />
        <Route path="/payslip" element={<PaySlipGenerator />} />
        <Route path="/offer-letter" element={<OfferLetter />} />
        <Route path="/appointment-letter" element={<AppointmentLetter />} />
        <Route path="/relieving-letter" element={<RelievingLetter />} />
        <Route path="/appraisal-letter" element={<AppraisalLetter />} />
        <Route path="/increment-letter" element={<IncrementLetter />} />
        
        {/* v2 Routes with React-PDF Implementation */}
        <Route path="/v2/offer-letter" element={<OfferLetterV2 />} />
        <Route path="/v2/appointment-letter" element={<AppointmentLetterV2 />} />
        <Route path="/v2/payslip" element={<PaySlipGeneratorV2 />} />
        <Route path="/v2/relieving-letter" element={<RelievingLetterV2 />} />
        <Route path="/v2/appraisal-letter" element={<AppraisalLetterV2 />} />
        <Route path="/v2/manage-bank" element={<ManageBank />} />
        <Route path="/v2/bank-statement" element={<BankStatement />} />

        <Route
          path="*"
          element={
            <div className="min-h-screen flex items-center justify-center">
              <h1 className="text-2xl">Page not found</h1>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
