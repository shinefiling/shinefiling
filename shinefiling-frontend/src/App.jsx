import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from './pages/HomePage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/DashboardPage';
import ServicesPage from './pages/ServicesPage';
import AboutUsPage from './pages/AboutUsPage';
import CareersPage from './pages/CareersPage';
import ContactUsPage from './pages/ContactUsPage';

// --- SEPARATE SERVICE PAGES ---
// --- SEPARATE SERVICE PAGES ---
import PrivateLimitedPage from './pages/services/business_registration/PrivateLimitedPage';


import {
  submitOnePersonCompanyRegistration,
  submitLlpRegistration,
  submitPartnershipFirmRegistration,
  submitSoleProprietorshipRegistration,
  submitSection8CompanyRegistration,
  submitNidhiCompanyRegistration,
  submitProducerCompanyRegistration,
  submitPublicLimitedCompanyRegistration
} from './api';
import OpcPage from './pages/services/business_registration/OpcPage';
import OpcRegistration from './pages/services/business_registration/OpcRegistration';
import LlpPage from './pages/services/business_registration/LlpPage';
import LlpRegistration from './pages/services/business_registration/LlpRegistration';
import PartnershipPage from './pages/services/business_registration/PartnershipPage';
import PartnershipRegistration from './pages/services/business_registration/PartnershipRegistration';
import ProprietorshipPage from './pages/services/business_registration/ProprietorshipPage';
import ProprietorshipRegistration from './pages/services/business_registration/ProprietorshipRegistration';
import Section8Page from './pages/services/business_registration/Section8Page';
import Section8Registration from './pages/services/business_registration/Section8Registration';
import NidhiPage from './pages/services/business_registration/NidhiPage';
import NidhiRegistration from './pages/services/business_registration/NidhiRegistration';
import ProducerPage from './pages/services/business_registration/ProducerPage';
import ProducerRegistration from './pages/services/business_registration/ProducerRegistration';
import PublicLimitedPage from './pages/services/business_registration/PublicLimitedPage';
import PublicLimitedRegistration from './pages/services/business_registration/PublicLimitedRegistration';
import RentAgreementPage from './pages/services/RentAgreementPage';
import GenericServicePage from './pages/services/GenericServicePage';


// Tax & Compliance
import GSTRegistrationPage from './pages/services/tax_compliance/GSTRegistration';
import GstPage from './pages/services/tax_registration/GstPage';
import GstRegistration from './pages/services/tax_registration/GstRegistration';
import GSTMonthlyReturnPage from './pages/services/tax_compliance/GSTMonthlyReturn';
import GstMonthlyReturnRegistration from './pages/services/tax_compliance/GstMonthlyReturnRegistration';
import GSTAnnualReturnPage from './pages/services/tax_compliance/GSTAnnualReturn';
import GstAnnualReturnRegistration from './pages/services/tax_compliance/GstAnnualReturnRegistration';
import IncomeTaxReturnPage from './pages/services/tax_compliance/IncomeTaxReturnPage';
import IncomeTaxRegistration from './pages/services/tax_compliance/IncomeTaxRegistration';
import TDSReturnFilingPage from './pages/services/tax_compliance/TDSReturnFiling';
import TdsReturnRegistration from './pages/services/tax_compliance/TdsReturnRegistration';
import ProfessionalTaxPage from './pages/services/tax_compliance/ProfessionalTaxPage';
import ProfessionalTaxRegistration from './pages/services/tax_compliance/ProfessionalTaxRegistration';
import AdvanceTaxFilingPage from './pages/services/tax_compliance/AdvanceTaxFilingPage';
import AdvanceTaxRegistration from './pages/services/tax_compliance/AdvanceTaxRegistration';
import TaxAuditFilingPage from './pages/services/tax_compliance/TaxAuditFilingPage';
import TaxAuditRegistration from './pages/services/tax_compliance/TaxAuditRegistration';

// ROC Compliance
import AnnualROCFilingPage from './pages/services/roc_filing/AnnualROCFiling';
import AnnualROCRegistration from './pages/services/roc_filing/AnnualROCRegistration';
import DirectorKYCPage from './pages/services/roc_filing/DirectorKYC';
import DirectorKycRegistration from './pages/services/roc_filing/DirectorKycRegistration';
import AddRemoveDirectorPage from './pages/services/roc_filing/AddRemoveDirector';
import AddRemoveDirectorRegistration from './pages/services/roc_filing/AddRemoveDirectorRegistration';
import ChangeRegisteredOfficePage from './pages/services/roc_filing/ChangeRegisteredOffice';
import ChangeRegisteredOfficeRegistration from './pages/services/roc_filing/ChangeRegisteredOfficeRegistration';
import ShareTransferFilingPage from './pages/services/roc_filing/ShareTransferFiling';
import ShareTransferRegistration from './pages/services/roc_filing/ShareTransferRegistration';
import IncreaseAuthorizedCapitalPage from './pages/services/roc_filing/IncreaseAuthorizedCapital';
import IncreaseAuthorizedCapitalRegistration from './pages/services/roc_filing/IncreaseAuthorizedCapitalRegistration';
import MOAAmendmentPage from './pages/services/roc_filing/MOAAmendment';
import MOAAmendmentRegistration from './pages/services/roc_filing/MOAAmendmentRegistration';
import CompanyNameChangePage from './pages/services/roc_filing/CompanyNameChange';
import CompanyNameChangeRegistration from './pages/services/roc_filing/CompanyNameChangeRegistration';
import StrikeOffCompanyPage from './pages/services/roc_filing/StrikeOffCompany';
import StrikeOffCompanyRegistration from './pages/services/roc_filing/StrikeOffCompanyRegistration';

// Licenses
import FSSAILicensePage from './pages/services/licenses/FSSAILicense';
import FSSAILicenseRegistration from './pages/services/licenses/FSSAILicenseRegistration';
import ShopEstablishmentLicensePage from './pages/services/licenses/ShopEstablishmentLicense';
import ShopEstablishmentRegistration from './pages/services/licenses/ShopEstablishmentRegistration';
import TradeLicensePage from './pages/services/licenses/TradeLicense';
import ApplyTradeLicense from './pages/services/licenses/ApplyTradeLicense';
import LabourLicensePage from './pages/services/licenses/LabourLicense';
import FactoryLicensePage from './pages/services/licenses/FactoryLicense';
import ApplyFactoryLicense from './pages/services/licenses/ApplyFactoryLicense';
import DrugLicensePage from './pages/services/licenses/DrugLicense';

import ApplyDrugLicense from './pages/services/licenses/ApplyDrugLicense';
import FireSafetyNOCPage from './pages/services/licenses/FireSafetyNOC';
import ApplyFireNoc from './pages/services/licenses/ApplyFireNoc';
import PollutionControlPage from './pages/services/licenses/PollutionControl';
import ApplyPollutionControl from './pages/services/licenses/ApplyPollutionControl';
import ImportExportCodePage from './pages/services/licenses/ImportExportCode';
import GumasthaLicensePage from './pages/services/licenses/GumasthaLicense';
import ApplyGumasthaLicense from './pages/services/licenses/ApplyGumasthaLicense';
import BarLiquorLicensePage from './pages/services/licenses/BarLiquorLicense';
import ApplyBarLiquorLicense from './pages/services/licenses/ApplyBarLiquorLicense';
import ApplyIEC from './pages/services/licenses/ApplyIEC';
import ApplyBarLiquor from './pages/services/licenses/ApplyBarLiquor';
import ApplyShopLicense from './pages/services/licenses/ApplyShopLicense';
import ApplyLabourLicense from './pages/services/licenses/ApplyLabourLicense';

// Intellectual Property
import TrademarkRegistrationPage from './pages/services/intellectual_property/TrademarkRegistration';
import TrademarkObjectionPage from './pages/services/intellectual_property/TrademarkObjection';
import TrademarkHearingSupportPage from './pages/services/intellectual_property/TrademarkHearing';
import TrademarkAssignmentPage from './pages/services/intellectual_property/TrademarkAssignment';
import TrademarkRenewalPage from './pages/services/intellectual_property/TrademarkRenewal';
import CopyrightRegistrationPage from './pages/services/intellectual_property/CopyrightRegistration';
import PatentFilingPage from './pages/services/intellectual_property/PatentFiling';
import DesignRegistrationPage from './pages/services/intellectual_property/DesignRegistration';

import ApplyTrademarkRegistration from './pages/services/intellectual_property/ApplyTrademarkRegistration';
import ApplyTrademarkObjection from './pages/services/intellectual_property/ApplyTrademarkObjection';
import ApplyTrademarkHearing from './pages/services/intellectual_property/ApplyTrademarkHearing';
import ApplyTrademarkAssignment from './pages/services/intellectual_property/ApplyTrademarkAssignment';
import ApplyTrademarkRenewal from './pages/services/intellectual_property/ApplyTrademarkRenewal';
import ApplyCopyrightRegistration from './pages/services/intellectual_property/ApplyCopyrightRegistration';
import ApplyPatentFiling from './pages/services/intellectual_property/ApplyPatentFiling';
import ApplyDesignRegistration from './pages/services/intellectual_property/ApplyDesignRegistration';

// Labour Law & HR
// Labour Law & HR
import ApplyProfessionalTax from './pages/services/labour_law_hr/ApplyProfessionalTax';
import ApplyLabourWelfareFund from './pages/services/labour_law_hr/ApplyLabourWelfareFund';
import ApplyGratuityAct from './pages/services/labour_law_hr/ApplyGratuityAct';
import ApplyBonusAct from './pages/services/labour_law_hr/ApplyBonusAct';
import ApplyMinimumWages from './pages/services/labour_law_hr/ApplyMinimumWages';

import PFRegistration from './pages/services/labour_law_hr/PFRegistration';
import ApplyPFRegistration from './pages/services/labour_law_hr/ApplyPFRegistration';
import PFFiling from './pages/services/labour_law_hr/PFFiling';
import ApplyPFFiling from './pages/services/labour_law_hr/ApplyPFFiling';
import ESIRegistration from './pages/services/labour_law_hr/ESIRegistration';
import ApplyESIRegistration from './pages/services/labour_law_hr/ApplyESIRegistration';
import ESIFiling from './pages/services/labour_law_hr/ESIFiling';
import ApplyESIFiling from './pages/services/labour_law_hr/ApplyESIFiling';

import ProfessionalTaxLabour from './pages/services/labour_law_hr/ProfessionalTax';
import LabourWelfareFund from './pages/services/labour_law_hr/LabourWelfareFund';
import GratuityAct from './pages/services/labour_law_hr/GratuityAct';
import BonusAct from './pages/services/labour_law_hr/BonusAct';
import MinimumWages from './pages/services/labour_law_hr/MinimumWages';

// Legal Drafting
import PartnershipDeed from './pages/services/legal_drafting/PartnershipDeed';
import ApplyPartnershipDeed from './pages/services/legal_drafting/ApplyPartnershipDeed';
import FoundersAgreement from './pages/services/legal_drafting/FoundersAgreement';
import ApplyFoundersAgreement from './pages/services/legal_drafting/ApplyFoundersAgreement';
import ShareholdersAgreement from './pages/services/legal_drafting/ShareholdersAgreement';
import ApplyShareholdersAgreement from './pages/services/legal_drafting/ApplyShareholdersAgreement';
import EmploymentAgreement from './pages/services/legal_drafting/EmploymentAgreement';
import ApplyEmploymentAgreement from './pages/services/legal_drafting/ApplyEmploymentAgreement';
import RentAgreementDrafting from './pages/services/legal_drafting/RentAgreementDrafting';
import ApplyRentAgreementDrafting from './pages/services/legal_drafting/ApplyRentAgreementDrafting';
import FranchiseAgreement from './pages/services/legal_drafting/FranchiseAgreement';
import ApplyFranchiseAgreement from './pages/services/legal_drafting/ApplyFranchiseAgreement';
import NDA from './pages/services/legal_drafting/NDA';
import ApplyNDA from './pages/services/legal_drafting/ApplyNDA';
import VendorAgreement from './pages/services/legal_drafting/VendorAgreement';
import ApplyVendorAgreement from './pages/services/legal_drafting/ApplyVendorAgreement';

// Business Certifications
import MSMERegistration from './pages/services/business_certifications/MSMERegistration';
import ApplyMSMERegistration from './pages/services/business_certifications/ApplyMSMERegistration';
import ISOCertification from './pages/services/business_certifications/ISOCertification';
import ApplyISOCertification from './pages/services/business_certifications/ApplyISOCertification';
import StartupIndia from './pages/services/business_certifications/StartupIndia';
import ApplyStartupIndia from './pages/services/business_certifications/ApplyStartupIndia';
import DigitalSignature from './pages/services/business_certifications/DigitalSignature';
import ApplyDigitalSignature from './pages/services/business_certifications/ApplyDigitalSignature';
import BarCodeRegistration from './pages/services/business_certifications/BarCodeRegistration';
import ApplyBarCode from './pages/services/business_certifications/ApplyBarCode';
import TanPanApplication from './pages/services/business_certifications/TanPanApplication';
import ApplyTanPan from './pages/services/business_certifications/ApplyTanPan';

// Financial Services
import CmaDataPreparation from './pages/services/financial_services/CmaDataPreparation';
import ApplyCmaDataPreparation from './pages/services/financial_services/ApplyCmaDataPreparation';
import ProjectReport from './pages/services/financial_services/ProjectReport';
import ApplyProjectReport from './pages/services/financial_services/ApplyProjectReport';
import BankLoanDocumentation from './pages/services/financial_services/BankLoanDocumentation';
import ApplyBankLoanDocumentation from './pages/services/financial_services/ApplyBankLoanDocumentation';
import CashFlowCompliance from './pages/services/financial_services/CashFlowCompliance';
import ApplyCashFlowCompliance from './pages/services/financial_services/ApplyCashFlowCompliance';
import StartupPitchDeck from './pages/services/financial_services/StartupPitchDeck';
import ApplyStartupPitchDeck from './pages/services/financial_services/ApplyStartupPitchDeck';
import BusinessValuation from './pages/services/financial_services/BusinessValuation';
import ApplyBusinessValuation from './pages/services/financial_services/ApplyBusinessValuation';


import AdminDashboardPage from './pages/AdminDashboardPage';
import AgentDashboardPage from './pages/AgentDashboardPage';
import FssaiOrderDetails from './pages/admin/views/master/FssaiOrderDetails';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Loader from './components/Loader';
import ChatWidget from './components/ChatWidget';

const App = () => {
  // Lazy Init to prevent flash of login redirect
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (e) {
      return null;
    }
  });
  const [initialLoading, setInitialLoading] = useState(true);

  // Initial App Load Simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  // Session Management (Super Admin Timeout: 2 Hours)
  useEffect(() => {
    if (!user) return;

    const checkSession = () => {
      // Session Timeout: 2 Hours for ALL users
      const loginTime = user.loginTimestamp;
      if (loginTime) {
        const now = Date.now();
        // 2 Hours = 2 * 60 * 60 * 1000 = 7200000 ms
        if (now - loginTime > 7200000) {
          console.warn("Session Expired");
          handleLogout();
        }
      }
    };

    // Check immediately on load
    checkSession();

    // Check every minute
    const interval = setInterval(checkSession, 60000);
    return () => clearInterval(interval);
  }, [user]);

  const handleLogin = (userData) => setUser(userData);

  const isLoggedIn = !!user;

  const location = useLocation();
  const hiddenRoutes = ['/dashboard', '/admin-dashboard', '/agent-dashboard', '/login', '/signup'];
  const shouldHideNavAndFooter = hiddenRoutes.includes(location.pathname);

  return (
    <>
      {initialLoading && <Loader text="Loading ShineFiling..." fullScreen={true} />}
      {!initialLoading && (
        <div className="flex flex-col min-h-screen">
          {!shouldHideNavAndFooter && <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} user={user} />}
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<Home isLoggedIn={isLoggedIn} onLogout={handleLogout} />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
              <Route path="/about-us" element={<AboutUsPage />} />
              <Route path="/contact-us" element={<ContactUsPage />} />
              <Route path="/careers" element={<CareersPage />} />

              {/* Protected Dashboard */}
              <Route path="/dashboard" element={isLoggedIn ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/login" />} />
              <Route path="/admin-dashboard" element={isLoggedIn ? <AdminDashboardPage onLogout={handleLogout} user={user} /> : <Navigate to="/login" />} />
              <Route path="/agent-dashboard" element={isLoggedIn ? <AgentDashboardPage onLogout={handleLogout} /> : <Navigate to="/login" />} />
              <Route path="/admin/fssai/:orderId" element={isLoggedIn ? <FssaiOrderDetails /> : <Navigate to="/login" />} />

              {/* Registration Routes */}
              {/* <Route path="/services/private-limited-company/register" element={<PrivateLimitedRegistration isLoggedIn={isLoggedIn} />} /> */}
              <Route path="/services/one-person-company/register" element={<OpcRegistration isLoggedIn={isLoggedIn} />} />
              <Route path="/services/llp-registration/register" element={<LlpRegistration isLoggedIn={isLoggedIn} />} />
              <Route path="/services/partnership-firm/register" element={<PartnershipRegistration isLoggedIn={isLoggedIn} />} />
              <Route path="/services/sole-proprietorship/register" element={<ProprietorshipRegistration isLoggedIn={isLoggedIn} />} />
              <Route path="/services/section-8-company/register" element={<Section8Registration isLoggedIn={isLoggedIn} />} />
              <Route path="/services/nidhi-company-registration/register" element={<NidhiRegistration isLoggedIn={isLoggedIn} />} />
              <Route path="/services/producer-company-registration/register" element={<ProducerRegistration isLoggedIn={isLoggedIn} />} />
              <Route path="/services/public-limited-company/register" element={<PublicLimitedRegistration isLoggedIn={isLoggedIn} />} />



              {/* Generic Service Application Route */}
              <Route path="/services/apply" element={<GenericServicePage />} />

              {/* --- SEPARATE SERVICE ROUTES --- */}
              <Route path="/services/private-limited-company" element={<PrivateLimitedPage isLoggedIn={isLoggedIn} onLogout={handleLogout} />} />
              <Route path="/services/one-person-company" element={<OpcPage isLoggedIn={isLoggedIn} onLogout={handleLogout} />} />
              <Route path="/services/llp-registration" element={<LlpPage isLoggedIn={isLoggedIn} onLogout={handleLogout} />} />
              <Route path="/services/partnership-firm" element={<PartnershipPage isLoggedIn={isLoggedIn} onLogout={handleLogout} />} />
              <Route path="/services/sole-proprietorship" element={<ProprietorshipPage isLoggedIn={isLoggedIn} onLogout={handleLogout} />} />
              <Route path="/services/section-8-company" element={<Section8Page isLoggedIn={isLoggedIn} onLogout={handleLogout} />} />

              {/* Updated Slugs to match common naming conventions */}
              <Route path="/services/nidhi-company-registration" element={<NidhiPage isLoggedIn={isLoggedIn} onLogout={handleLogout} />} />
              <Route path="/services/producer-company-registration" element={<ProducerPage isLoggedIn={isLoggedIn} onLogout={handleLogout} />} />
              <Route path="/services/public-limited-company" element={<PublicLimitedPage isLoggedIn={isLoggedIn} onLogout={handleLogout} />} />
              <Route path="/services/rent-agreement" element={<RentAgreementPage isLoggedIn={isLoggedIn} onLogout={handleLogout} />} />

              {/* Tax & Compliance Routes */}
              <Route path="/services/gst-registration" element={<GstPage isLoggedIn={isLoggedIn} />} />
              <Route path="/services/gst-registration/register" element={<GstRegistration isLoggedIn={isLoggedIn} />} />

              <Route path="/services/tax-compliance/gst-registration" element={<GSTRegistrationPage isLoggedIn={isLoggedIn} />} />
              <Route path="/services/tax-compliance/gst-monthly-return" element={<GSTMonthlyReturnPage isLoggedIn={isLoggedIn} />} />
              <Route path="/services/gst-monthly-return-filing/register" element={<GstMonthlyReturnRegistration isLoggedIn={isLoggedIn} />} />
              <Route path="/services/tax-compliance/gst-annual-return" element={<GSTAnnualReturnPage isLoggedIn={isLoggedIn} />} />
              <Route path="/services/gst-annual-return/register" element={<GstAnnualReturnRegistration isLoggedIn={isLoggedIn} />} />
              <Route path="/services/tax-compliance/income-tax-return" element={<IncomeTaxReturnPage isLoggedIn={isLoggedIn} />} />
              <Route path="/services/income-tax-return/register" element={<IncomeTaxRegistration isLoggedIn={isLoggedIn} />} />
              <Route path="/services/tax-compliance/tds-return-filing" element={<TDSReturnFilingPage isLoggedIn={isLoggedIn} />} />
              <Route path="/services/tds-return/register" element={<TdsReturnRegistration isLoggedIn={isLoggedIn} />} />
              <Route path="/services/tax-compliance/professional-tax" element={<ProfessionalTaxPage isLoggedIn={isLoggedIn} />} />
              <Route path="/services/professional-tax/register" element={<ProfessionalTaxRegistration isLoggedIn={isLoggedIn} />} />
              <Route path="/services/tax-compliance/advance-tax" element={<AdvanceTaxFilingPage isLoggedIn={isLoggedIn} />} />
              <Route path="/services/advance-tax/register" element={<AdvanceTaxRegistration isLoggedIn={isLoggedIn} />} />
              <Route path="/services/tax-compliance/tax-audit" element={<TaxAuditFilingPage isLoggedIn={isLoggedIn} />} />
              <Route path="/services/tax-audit/register" element={<TaxAuditRegistration isLoggedIn={isLoggedIn} />} />

              {/* ROC Filing Routes */}
              <Route path="/services/roc-filing/annual-return" element={<AnnualROCFilingPage isLoggedIn={isLoggedIn} />} />
              <Route path="/services/roc-filing/annual-return/register" element={<AnnualROCRegistration isLoggedIn={isLoggedIn} />} />
              <Route path="/services/roc-filing/director-kyc" element={<DirectorKYCPage isLoggedIn={isLoggedIn} />} />
              <Route path="/services/roc-filing/director-kyc/register" element={<DirectorKycRegistration isLoggedIn={isLoggedIn} />} />
              <Route path="/services/roc-filing/add-remove-director" element={<AddRemoveDirectorPage isLoggedIn={isLoggedIn} />} />
              <Route path="/services/roc-filing/add-remove-director/register" element={<AddRemoveDirectorRegistration isLoggedIn={isLoggedIn} />} />
              <Route path="/services/roc-filing/change-registered-office" element={<ChangeRegisteredOfficePage isLoggedIn={isLoggedIn} />} />
              <Route path="/services/roc-filing/change-registered-office/register" element={<ChangeRegisteredOfficeRegistration isLoggedIn={isLoggedIn} />} />
              <Route path="/services/roc-filing/share-transfer" element={<ShareTransferFilingPage isLoggedIn={isLoggedIn} />} />
              <Route path="/services/roc-filing/share-transfer/register" element={<ShareTransferRegistration isLoggedIn={isLoggedIn} />} />
              <Route path="/services/roc-filing/increase-authorized-capital" element={<IncreaseAuthorizedCapitalPage isLoggedIn={isLoggedIn} />} />
              <Route path="/services/roc-filing/increase-authorized-capital/register" element={<IncreaseAuthorizedCapitalRegistration isLoggedIn={isLoggedIn} />} />
              <Route path="/services/roc-filing/moa-amendment" element={<MOAAmendmentPage isLoggedIn={isLoggedIn} />} />
              <Route path="/services/roc-filing/moa-amendment/register" element={<MOAAmendmentRegistration isLoggedIn={isLoggedIn} />} />
              <Route path="/services/roc-filing/company-name-change" element={<CompanyNameChangePage isLoggedIn={isLoggedIn} />} />
              <Route path="/services/roc-filing/company-name-change/register" element={<CompanyNameChangeRegistration isLoggedIn={isLoggedIn} />} />
              <Route path="/services/roc-filing/strike-off-company" element={<StrikeOffCompanyPage isLoggedIn={isLoggedIn} />} />
              <Route path="/services/roc-filing/strike-off-company/register" element={<StrikeOffCompanyRegistration isLoggedIn={isLoggedIn} />} />

              {/* License Routes */}
              <Route path="/services/licenses/fssai-license" element={<FSSAILicensePage isLoggedIn={isLoggedIn} />} />
              <Route path="/services/licenses/fssai-license/register" element={<FSSAILicenseRegistration isLoggedIn={isLoggedIn} />} />
              <Route path="/services/licenses/shop-establishment-license" element={<ShopEstablishmentLicensePage isLoggedIn={isLoggedIn} />} />
              <Route path="/services/licenses/shop-act/register" element={<ShopEstablishmentRegistration isLoggedIn={isLoggedIn} />} />
              <Route path="/services/licenses/trade-license" element={<TradeLicensePage isLoggedIn={isLoggedIn} />} />
              <Route path="/services/licenses/trade-license/apply" element={<ApplyTradeLicense isLoggedIn={isLoggedIn} />} />
              <Route path="/services/licenses/labour-license" element={<LabourLicensePage isLoggedIn={isLoggedIn} />} />
              <Route path="/services/licenses/labour-license/apply" element={<ApplyLabourLicense isLoggedIn={isLoggedIn} />} />

              <Route path="/services/licenses/factory-license" element={<FactoryLicensePage isLoggedIn={isLoggedIn} />} />
              <Route path="/services/licenses/factory-license/apply" element={<ApplyFactoryLicense isLoggedIn={isLoggedIn} />} />

              <Route path="/services/licenses/drug-license" element={<DrugLicensePage isLoggedIn={isLoggedIn} />} />
              <Route path="/services/licenses/drug-license/apply" element={<ApplyDrugLicense isLoggedIn={isLoggedIn} />} />


              <Route path="/services/licenses/fire-safety-noc" element={<FireSafetyNOCPage isLoggedIn={isLoggedIn} />} />
              <Route path="/services/licenses/fire-safety-noc/apply" element={<ApplyFireNoc isLoggedIn={isLoggedIn} />} />

              <Route path="/services/licenses/pollution-control" element={<PollutionControlPage isLoggedIn={isLoggedIn} />} />
              <Route path="/services/licenses/pollution-control/apply" element={<ApplyPollutionControl isLoggedIn={isLoggedIn} />} />



              <Route path="/services/licenses/import-export-code" element={<ImportExportCodePage isLoggedIn={isLoggedIn} />} />
              <Route path="/services/licenses/import-export-code/apply" element={<ApplyIEC isLoggedIn={isLoggedIn} />} />

              <Route path="/services/licenses/gumastha-license" element={<GumasthaLicensePage isLoggedIn={isLoggedIn} />} />
              <Route path="/services/licenses/gumastha-license/apply" element={<ApplyGumasthaLicense isLoggedIn={isLoggedIn} />} />


              <Route path="/services/licenses/bar-liquor-license" element={<BarLiquorLicensePage isLoggedIn={isLoggedIn} />} />
              <Route path="/services/licenses/bar-liquor-license/apply" element={<ApplyBarLiquorLicense isLoggedIn={isLoggedIn} />} />

              <Route path="/services/licenses/shop-establishment/apply" element={<ApplyShopLicense isLoggedIn={isLoggedIn} />} />

              {/* Intellectual Property Routes */}
              <Route path="/services/intellectual-property/trademark-registration" element={<TrademarkRegistrationPage isLoggedIn={isLoggedIn} />} />
              <Route path="/services/intellectual-property/trademark-objection" element={<TrademarkObjectionPage isLoggedIn={isLoggedIn} />} />
              <Route path="/services/intellectual-property/trademark-hearing" element={<TrademarkHearingSupportPage isLoggedIn={isLoggedIn} />} />
              <Route path="/services/intellectual-property/trademark-assignment" element={<TrademarkAssignmentPage isLoggedIn={isLoggedIn} />} />
              <Route path="/services/intellectual-property/trademark-renewal" element={<TrademarkRenewalPage isLoggedIn={isLoggedIn} />} />
              <Route path="/services/intellectual-property/copyright-registration" element={<CopyrightRegistrationPage isLoggedIn={isLoggedIn} />} />
              <Route path="/services/intellectual-property/patent-filing" element={<PatentFilingPage isLoggedIn={isLoggedIn} />} />
              <Route path="/services/intellectual-property/design-registration" element={<DesignRegistrationPage isLoggedIn={isLoggedIn} />} />

              <Route path="/services/intellectual-property/trademark-registration/apply" element={<ApplyTrademarkRegistration isLoggedIn={isLoggedIn} />} />
              <Route path="/services/intellectual-property/trademark-objection/apply" element={<ApplyTrademarkObjection isLoggedIn={isLoggedIn} />} />
              <Route path="/services/intellectual-property/trademark-hearing/apply" element={<ApplyTrademarkHearing isLoggedIn={isLoggedIn} />} />
              <Route path="/services/intellectual-property/trademark-assignment/apply" element={<ApplyTrademarkAssignment isLoggedIn={isLoggedIn} />} />
              <Route path="/services/intellectual-property/trademark-renewal/apply" element={<ApplyTrademarkRenewal isLoggedIn={isLoggedIn} />} />
              <Route path="/services/intellectual-property/copyright-registration/apply" element={<ApplyCopyrightRegistration isLoggedIn={isLoggedIn} />} />
              <Route path="/services/intellectual-property/patent-filing/apply" element={<ApplyPatentFiling isLoggedIn={isLoggedIn} />} />
              <Route path="/services/intellectual-property/design-registration/apply" element={<ApplyDesignRegistration isLoggedIn={isLoggedIn} />} />

              {/* Labour Law & HR Routes */}


              {/* Legal Drafting Routes */}
              <Route path="/services/legal-drafting/partnership-deed" element={<PartnershipDeed isLoggedIn={isLoggedIn} />} />
              <Route path="/apply-partnership-deed" element={<ApplyPartnershipDeed isLoggedIn={isLoggedIn} />} />

              <Route path="/services/legal-drafting/founders-agreement" element={<FoundersAgreement isLoggedIn={isLoggedIn} />} />
              <Route path="/apply-founders-agreement" element={<ApplyFoundersAgreement isLoggedIn={isLoggedIn} />} />

              <Route path="/services/legal-drafting/shareholders-agreement" element={<ShareholdersAgreement isLoggedIn={isLoggedIn} />} />
              <Route path="/apply-shareholders-agreement" element={<ApplyShareholdersAgreement isLoggedIn={isLoggedIn} />} />

              <Route path="/services/legal-drafting/employment-agreement" element={<EmploymentAgreement isLoggedIn={isLoggedIn} />} />
              <Route path="/apply-employment-agreement" element={<ApplyEmploymentAgreement isLoggedIn={isLoggedIn} />} />

              <Route path="/services/legal-drafting/rent-agreement" element={<RentAgreementDrafting isLoggedIn={isLoggedIn} />} />
              <Route path="/apply-rent-agreement-drafting" element={<ApplyRentAgreementDrafting isLoggedIn={isLoggedIn} />} />

              <Route path="/services/legal-drafting/franchise-agreement" element={<FranchiseAgreement isLoggedIn={isLoggedIn} />} />
              <Route path="/apply-franchise-agreement" element={<ApplyFranchiseAgreement isLoggedIn={isLoggedIn} />} />

              <Route path="/services/legal-drafting/nda" element={<NDA isLoggedIn={isLoggedIn} />} />
              <Route path="/apply-nda" element={<ApplyNDA isLoggedIn={isLoggedIn} />} />

              <Route path="/services/legal-drafting/vendor-agreement" element={<VendorAgreement isLoggedIn={isLoggedIn} />} />
              <Route path="/apply-vendor-agreement" element={<ApplyVendorAgreement isLoggedIn={isLoggedIn} />} />

              <Route path="/services/labour-law/professional-tax/apply" element={<ApplyProfessionalTax isLoggedIn={isLoggedIn} />} />
              <Route path="/services/labour-law/labour-welfare-fund/apply" element={<ApplyLabourWelfareFund isLoggedIn={isLoggedIn} />} />
              <Route path="/services/labour-law/gratuity-act/apply" element={<ApplyGratuityAct isLoggedIn={isLoggedIn} />} />
              <Route path="/services/labour-law/bonus-act/apply" element={<ApplyBonusAct isLoggedIn={isLoggedIn} />} />
              <Route path="/services/labour-law/minimum-wages/apply" element={<ApplyMinimumWages isLoggedIn={isLoggedIn} />} />

              {/* Labour Law Landing Pages */}
              <Route path="/services/labour/pf-registration" element={<PFRegistration isLoggedIn={isLoggedIn} />} />
              <Route path="/services/labour/pf-filing" element={<PFFiling isLoggedIn={isLoggedIn} />} />
              <Route path="/services/labour/esi-registration" element={<ESIRegistration isLoggedIn={isLoggedIn} />} />
              <Route path="/services/labour/esi-filing" element={<ESIFiling isLoggedIn={isLoggedIn} />} />

              <Route path="/services/labour-law/professional-tax" element={<ProfessionalTaxLabour isLoggedIn={isLoggedIn} />} />
              <Route path="/services/labour-law/labour-welfare-fund" element={<LabourWelfareFund isLoggedIn={isLoggedIn} />} />
              <Route path="/services/labour-law/gratuity-act" element={<GratuityAct isLoggedIn={isLoggedIn} />} />
              <Route path="/services/labour-law/bonus-act" element={<BonusAct isLoggedIn={isLoggedIn} />} />

              <Route path="/services/labour-law/minimum-wages" element={<MinimumWages isLoggedIn={isLoggedIn} />} />

              {/* Labour Law Application Forms */}
              <Route path="/services/labour/pf-registration/apply" element={<ApplyPFRegistration isLoggedIn={isLoggedIn} />} />
              <Route path="/services/labour/pf-filing/apply" element={<ApplyPFFiling isLoggedIn={isLoggedIn} />} />
              <Route path="/services/labour/esi-registration/apply" element={<ApplyESIRegistration isLoggedIn={isLoggedIn} />} />
              <Route path="/services/labour/esi-filing/apply" element={<ApplyESIFiling isLoggedIn={isLoggedIn} />} />

              {/* Business Certifications Routes */}
              <Route path="/services/business-certifications/msme-registration" element={<MSMERegistration isLoggedIn={isLoggedIn} />} />
              <Route path="/services/business-certifications/msme-registration/apply" element={<ApplyMSMERegistration isLoggedIn={isLoggedIn} />} />
              <Route path="/services/business-certifications/iso-certification" element={<ISOCertification isLoggedIn={isLoggedIn} />} />
              <Route path="/services/business-certifications/iso-certification/apply" element={<ApplyISOCertification isLoggedIn={isLoggedIn} />} />
              <Route path="/services/business-certifications/startup-india" element={<StartupIndia isLoggedIn={isLoggedIn} />} />
              <Route path="/services/business-certifications/startup-india/apply" element={<ApplyStartupIndia isLoggedIn={isLoggedIn} />} />
              <Route path="/services/business-certifications/digital-signature" element={<DigitalSignature isLoggedIn={isLoggedIn} />} />
              <Route path="/services/business-certifications/digital-signature/apply" element={<ApplyDigitalSignature isLoggedIn={isLoggedIn} />} />
              <Route path="/services/business-certifications/bar-code" element={<BarCodeRegistration isLoggedIn={isLoggedIn} />} />
              <Route path="/services/business-certifications/bar-code/apply" element={<ApplyBarCode isLoggedIn={isLoggedIn} />} />
              <Route path="/services/business-certifications/tan-pan" element={<TanPanApplication isLoggedIn={isLoggedIn} />} />
              <Route path="/services/business-certifications/tan-pan/apply" element={<ApplyTanPan isLoggedIn={isLoggedIn} />} />

              {/* Financial Services Routes */}
              <Route path="/services/financial-services/cma-data-preparation" element={<CmaDataPreparation isLoggedIn={isLoggedIn} />} />
              <Route path="/services/financial-services/cma-data-preparation/apply" element={<ApplyCmaDataPreparation isLoggedIn={isLoggedIn} />} />

              <Route path="/services/financial-services/project-report" element={<ProjectReport isLoggedIn={isLoggedIn} />} />
              <Route path="/services/financial-services/project-report/apply" element={<ApplyProjectReport isLoggedIn={isLoggedIn} />} />

              <Route path="/services/financial-services/bank-loan-documentation" element={<BankLoanDocumentation isLoggedIn={isLoggedIn} />} />
              <Route path="/services/financial-services/bank-loan-documentation/apply" element={<ApplyBankLoanDocumentation isLoggedIn={isLoggedIn} />} />

              <Route path="/services/financial-services/cash-flow-compliance" element={<CashFlowCompliance isLoggedIn={isLoggedIn} />} />
              <Route path="/services/financial-services/cash-flow-compliance/apply" element={<ApplyCashFlowCompliance isLoggedIn={isLoggedIn} />} />

              <Route path="/services/financial-services/startup-pitch-deck" element={<StartupPitchDeck isLoggedIn={isLoggedIn} />} />
              <Route path="/services/financial-services/startup-pitch-deck/apply" element={<ApplyStartupPitchDeck isLoggedIn={isLoggedIn} />} />

              <Route path="/services/financial-services/business-valuation" element={<BusinessValuation isLoggedIn={isLoggedIn} />} />
              <Route path="/services/financial-services/business-valuation/apply" element={<ApplyBusinessValuation isLoggedIn={isLoggedIn} />} />




              {/* Loader Demo */}
              <Route path="/loader-demo" element={<Loader fullScreen={false} />} />
            </Routes>
          </div>
          {!shouldHideNavAndFooter && <Footer />}
          {/* Global Chat Widget - Hidden for Admins & on Admin Routes */}
          {!location.pathname.startsWith('/admin') && user?.role !== 'SUPER_ADMIN' && (
            <ChatWidget
              role={user?.role === 'AGENT' ? 'AGENT' : 'CLIENT'}
              userName={user?.fullName || 'Guest'}
            />
          )}
        </div>
      )}
    </>
  );
};


export default App;
