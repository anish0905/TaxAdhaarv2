export const servicesData: any = {
  // --- INCOME TAX SERVICES ---
 "income-tax": {
  title: "Income Tax Services",
  category: "Taxation",
  icon: "💎",
  variants: [
    {
      id: "it-registration",
      label: "New User Registration",
      note: "One-time account setup on the Income Tax portal for first-time filers.",
      docs: ["PAN Card", "Aadhaar Card", "Active Mobile & Email"],
      returns: "Portal Login Credentials",
      questions: [
        { id: "aadhaar_link", text: "Is your Mobile Number linked with Aadhaar?", type: "boolean" },
        { id: "father_name", text: "Full Father's Name (as per PAN)?", type: "text" },
        { id: "first_time", text: "Is this your first ever tax interaction?", type: "boolean" }
      ]
    },
    {
      id: "itr-filing",
      label: "ITR Filing (Salaried/Biz)",
      note: "Yearly return filing to report income and claim tax refunds. Best for ITR 1, 2, 3 & 4.",
      docs: ["Form 16/Bank Statement", "Investment Proofs", "PAN/Aadhaar"],
      returns: "ITR-V (Acknowledgement)",
      // Questions yahan ITR ke liye sabse important hain
      questions: [
        { id: "q1", text: "Do you have income from Shares/Stocks/Crypto?", type: "boolean" },
        { id: "q2", text: "Annual Home Loan interest paid (if any)?", type: "number" },
        { id: "q3", text: "Do you have any foreign assets or income?", type: "boolean" },
        { id: "q4", text: "Any other source of income (Rent/Lottery)?", type: "text" }
      ]
    },
    {
      id: "tds-returns",
      label: "TDS Filing",
      note: "Quarterly filing for businesses who deduct tax on salaries or professional fees.",
      docs: ["Deductee Details", "Challan Records", "TAN Number"],
      returns: "Form 24Q / 26Q",
      questions: [
        { id: "challan_paid", text: "Are all TDS Challans paid for this quarter?", type: "boolean" },
        { id: "deductee_type", text: "Type of payment (Salary/Contract/Rent)?", type: "text" },
        { id: "lower_deduction", text: "Any Lower Deduction certificates available?", type: "boolean" }
      ]
    },
    {
      id: "pan-tan",
      label: "PAN/TAN Apply",
      note: "Apply for a new Business PAN or TAN (for TDS deduction).",
      docs: ["Identity Proof", "Address Proof", "Incorporation Docs"],
      returns: "PAN/TAN Card",
      questions: [
        { id: "app_type", text: "Application for (New PAN / New TAN / Correction)?", type: "text" },
        { id: "entity_type", text: "Entity Type (Firm/Company/Trust/Individual)?", type: "text" }
      ]
    }
  ]
},

  // --- GST SERVICES ---
"gst-services": {
  title: "GST Compliance",
  category: "Taxation",
  icon: "⚡",
  variants: [
    {
      id: "gst-reg",
      label: "New Registration",
      note: "Mandatory for E-commerce or businesses with turnover > ₹20/40 Lakhs.",
      docs: ["PAN/Aadhaar of Owner", "Photo", "EB Bill", "NOC/Rent Agreement"],
      returns: "GSTIN Certificate",
      // Registration ke liye specific sawal
      questions: [
        { id: "biz_name", text: "Proposed Business Name?", type: "text" },
        { id: "biz_nature", text: "Nature of Business (e.g. Retail, Service)?", type: "text" },
        { id: "hsn_code", text: "HSN/SAC Codes (if known)?", type: "text" },
        { id: "turnover", text: "Estimated Annual Turnover?", type: "number" }
      ]
    },
    {
      id: "gst-monthly",
      label: "Monthly Filing",
      note: "For Regular taxpayers to claim ITC and stay compliant.",
      docs: ["Sales Invoices", "Purchase Bills", "Bank Statement"],
      returns: "GSTR-1 & 3B",
      // Filing ke liye specific sawal
      questions: [
        { id: "otp_access", text: "Do you have access to GST Registered Mobile?", type: "boolean" },
        { id: "nil_return", text: "Is this a Nil Return (No Sales/Purchase)?", type: "boolean" },
        { id: "e_invoice", text: "Did you generate any E-invoices this month?", type: "boolean" }
      ]
    },
    {
      id: "gst-composition",
      label: "Composition Filing",
      note: "For small retailers/restaurants with low fixed tax rates.",
      docs: ["Total Sales Summary", "GST Portal OTP"],
      returns: "CMP-08 (Quarterly)",
      questions: [
        { id: "total_sales", text: "Total Sales Amount for this Quarter?", type: "number" },
        { id: "purchase_tax", text: "Any RCM (Reverse Charge) Purchases?", type: "boolean" }
      ]
    },
    {
      id: "gst-amendment",
      label: "Amendment (Update)",
      note: "Change address, phone, or business name in your GST records.",
      docs: ["New Address Proof", "Authorisation Letter"],
      returns: "Revised GST Certificate",
      questions: [
        { id: "change_type", text: "What do you want to change (Address/Mobile/Name)?", type: "text" },
        { id: "effective_date", text: "Effective date for this change?", type: "date" }
      ]
    }
  ]
},
  // --- BUSINESS REGISTRATION ---
"business-registration": {
  title: "Company Incorporation",
  category: "Registration",
  icon: "🏢",
  variants: [
    {
      id: "pvt-ltd",
      label: "Pvt Ltd Company",
      note: "Best for startups looking for funding and high scalability.",
      docs: ["2 Directors KYC", "Office EB Bill", "NOC", "Digital Signature (DSC)"],
      returns: "COI, PAN, TAN included",
      questions: [
        { id: "co_names", text: "Provide 2 Proposed Company Names?", type: "text" },
        { id: "auth_capital", text: "Authorized Capital Amount (e.g. 1,00,000)?", type: "number" },
        { id: "biz_objective", text: "Primary Business Objective (Main Work)?", type: "text" },
        { id: "director_split", text: "Shareholding split between Directors (%)?", type: "text" }
      ]
    },
    {
      id: "llp",
      label: "LLP Formation",
      note: "Low compliance alternative to Pvt Ltd for service businesses.",
      docs: ["Partners KYC", "LLP Agreement", "Address Proof"],
      returns: "LLP Incorporation",
      questions: [
        { id: "llp_name", text: "Proposed LLP Name?", type: "text" },
        { id: "contribution", text: "Total Monetary Contribution of Partners?", type: "number" },
        { id: "designated_partners", text: "Number of Designated Partners?", type: "number" }
      ]
    },
    {
      id: "msme",
      label: "MSME/Udyam",
      note: "Get government benefits and easy bank loans for small businesses.",
      docs: ["Aadhaar linked with Mobile", "PAN Card", "Business Category"],
      returns: "Udyam Certificate",
      questions: [
        { id: "emp_count", text: "Total Number of Employees?", type: "number" },
        { id: "investment", text: "Total Investment in Plant & Machinery?", type: "number" },
        { id: "bank_details", text: "Business Bank Account No. & IFSC?", type: "text" }
      ]
    }
  ]
},

  // --- INTELLECTUAL PROPERTY (IPR) ---
"trademark": {
  title: "Trademark & Legal",
  category: "Legal",
  icon: "🛡️",
  variants: [
    {
      id: "tm-filling",
      label: "Trademark Filing",
      note: "Protect your Brand Name and Logo from competitors.",
      docs: ["Logo Image", "Form 48 (Power of Attorney)", "Brand Usage Proof"],
      returns: "TM Application Number",
      questions: [
        { id: "tm_name", text: "Brand Name to be registered?", type: "text" },
        { id: "tm_class", text: "Business Class (if known, e.g., Class 35 for Trading)?", type: "text" },
        { id: "tm_usage", text: "Are you already using this name? (Provide Start Date)", type: "date" },
        { id: "tm_type", text: "What do you want to protect? (Wordmark / Logo / Both)", type: "text" }
      ]
    },
    {
      id: "tm-objection",
      label: "Objection Reply",
      note: "Legal reply to Trademark Registry if your brand is challenged.",
      docs: ["Objection Notice", "Brand Evidence", "Invoices"],
      returns: "Examination Report Reply",
      questions: [
        { id: "application_no", text: "Trademark Application Number?", type: "text" },
        { id: "obj_reason", text: "Reason for Objection (as per Notice)?", type: "text" },
        { id: "hearing_needed", text: "Is a personal hearing already scheduled?", type: "boolean" }
      ]
    }
  ]
},

  // --- EXPORT COMPLIANCE ---
 "export-compliance": {
  title: "Export & Import Setup",
  category: "Legal",
  icon: "✈️",
  variants: [
    {
      id: "lut-filing",
      label: "LUT Filing",
      note: "Export services/goods without paying IGST upfront. Saves cash flow.",
      docs: ["GST Certificate", "2 Witness Details", "Previous Export Data"],
      returns: "GST RFD-11",
      questions: [
        { id: "financial_year", text: "Financial Year for which LUT is required?", type: "text" },
        { id: "export_type", text: "What are you exporting? (Goods / Services / Both)", type: "text" },
        { id: "prev_compliance", text: "Did you file LUT last year as well?", type: "boolean" }
      ]
    },
    {
      id: "iec-code",
      label: "Import Export Code",
      note: "Mandatory license for importing or exporting from India.",
      docs: ["PAN Card", "Cancelled Cheque", "Address Proof"],
      returns: "IEC Certificate",
      questions: [
        { id: "nature_entity", text: "Nature of Entity (Proprietorship/Partnership/Company)?", type: "text" },
        { id: "bank_name", text: "Bank Account Holder Name (as per Cheque)?", type: "text" },
        { id: "dgft_id", text: "Do you have an existing DGFT Portal login?", type: "boolean" }
      ]
    }
  ]
}
};