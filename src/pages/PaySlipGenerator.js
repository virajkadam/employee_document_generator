import React, { useState } from "react";
import { Link } from "react-router-dom";
import CompanyDetailsForm from "../pages/companyDetails";
import PaySlip from "../components/PaySlip";
import { ArrowLeft } from "lucide-react";

function PaySlipGenerator() {
  const [companyDetails, setCompanyDetails] = useState({});

  const handleUpdateCompanyDetails = (details) => {
    setCompanyDetails(details);
  };

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
          <CompanyDetailsForm
            onUpdateCompanyDetails={handleUpdateCompanyDetails}
          />

          <div className="">
            <PaySlip companyDetails={companyDetails} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaySlipGenerator;
