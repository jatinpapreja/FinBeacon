// constants/loans.ts

export type Loan = {
  name: string;
  details: string;
};

export type RegionKey = "APAC" | "US" | "Germany";
export type SectorKey =
  | "manufacturing"
  | "agriculture"
  | "services"
  | "retail"
  | "technology"
  | "woman";

export type LoanData = Record<
  RegionKey,
  Record<SectorKey, Loan[]>
>;

const loanData: LoanData = {
  APAC: {
    manufacturing: [
      { name: "Term Loans", details: "Funds for machine expansion in APAC." },
      { name: "Working Capital Loans", details: "Short-term inventory finance in APAC." },
      { name: "Mudra Loans", details: "Up to ₹10 lakh under PMMY." },
    ],
    agriculture: [
      { name: "Agri-Business Loan", details: "Supports allied activities for APAC farmers." },
      { name: "Kisan Credit Card (KCC)", details: "Crop loans for APAC region." },
      { name: "Subsidy-Linked Loans", details: "Interest subsidies for APAC MSMEs." },
    ],
    services: [
      { name: "Service Loans", details: "Travel, tourism supported loans in APAC." },
      { name: "Overdraft Facilities", details: "Instant overdraft for service MSMEs." },
    ],
    retail: [
      { name: "Merchant Loans", details: "Retail and shop expansion in APAC." },
      { name: "Business Credit Cards", details: "For trade expenses in APAC region." },
    ],
    technology: [
      { name: "Startup Tech Loans", details: "Funds for R&D and digital tech startups." },
      { name: "Innovation Grants", details: "Tech innovation grants in APAC." },
    ],
    woman: [
      { name: "Stree Shakti Loans", details: "Subsidized loans for women entrepreneurs." },
      { name: "Annapurna Yojana", details: "Hospitality/agriculture loans for women." },
    ],
  },
  US: {
    manufacturing: [
      { name: "SBA Loans", details: "Small Business Administration loans for manufacturers." },
      { name: "Equipment Financing", details: "Loans for machine purchase in US." },
    ],
    agriculture: [
      { name: "USDA Loans", details: "Loans supporting agriculture businesses in US." },
      { name: "Crop Insurance Loans", details: "Risk mitigation for farmers." },
    ],
    services: [
      { name: "Business Line of Credit", details: "Credit for service-based MSMEs in US." },
      { name: "SBA Express Loans", details: "Fast loans for service providers." },
    ],
    retail: [
      { name: "Merchant Cash Advances", details: "Cash advances for retail businesses." },
      { name: "Business Credit Cards", details: "Trade finance credit cards." },
    ],
    technology: [
      { name: "Tech Startup Loans", details: "Funds for software, hardware startups." },
      { name: "Innovation Tax Credits", details: "Tax credits for R&D investments." },
    ],
    woman: [
      { name: "Women-Owned Small Business Grants", details: "Federal grants for women entrepreneurs." },
      { name: "Community Advantage Loans", details: "Loans to minority and women-owned MSMEs." },
    ],
  },
  Germany: {
    manufacturing: [
      { name: "KfW Loans", details: "Loans by KfW Bank for manufacturing SMEs." },
      { name: "Equipment Financing", details: "Support for machinery from German banks." },
    ],
    agriculture: [
      { name: "Agricultural Credit", details: "Loans from German agricultural banks." },
      { name: "Renewable Energy Grants", details: "Funds supporting sustainable agri." },
    ],
    services: [
      { name: "Service SME Credit", details: "Loans for service providers in Germany." },
      { name: "Microloans", details: "Small loans supporting new MSMEs." },
    ],
    retail: [
      { name: "Retail Financing", details: "Loan programs for trade and retail businesses." },
      { name: "Business Accounts Overdraft", details: "Overdraft for retail SME accounts." },
    ],
    technology: [
      { name: "Innovation Loans", details: "Loans for tech innovation in Germany." },
      { name: "Research Grants", details: "Government grants for research projects." },
    ],
    woman: [
      { name: "Women Entrepreneurs Fund", details: "Funds for enterprises led by women." },
      { name: "Start-Up Grants", details: "Financial support for new women-led startups." },
    ],
  },
};

export default loanData;