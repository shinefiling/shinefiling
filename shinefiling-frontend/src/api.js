// Dynamic Base URL to support both Localhost and Network Devices
const getBaseUrl = () => {
    const hostname = window.location.hostname;
    // If running on localhost, use localhost backend
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:8080/api';
    }
    // Otherwise use the specific IP backend (assuming backend runs on same host as served frontend)
    // You can also hardcode the IP here if the backend is on a different specific machine
    return `http://${hostname}:8080/api`;
};

export const BASE_URL = getBaseUrl();

// Helper for handling responses
const handleResponse = async (response) => {
    if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
            throw new Error("Unauthorized: Please login again.");
        }
        let errorMessage = `API Request Failed: ${response.status}`;
        try {
            const text = await response.text();
            // Try to parse JSON from text if possible, otherwise use text
            try {
                const json = JSON.parse(text);
                errorMessage = json.message || errorMessage;
            } catch {
                if (text) errorMessage = text;
            }
        } catch (e) {
            // Ignore text read error
        }
        throw new Error(errorMessage);
    }

    // Success, try parsing JSON
    try {
        const text = await response.text();
        return text ? JSON.parse(text) : null;
    } catch (error) {
        console.warn("Response parsing failed", error);
        return null;
    }
};

// Helper to get auth headers
const getAuthHeaders = () => {
    try {
        const userStr = localStorage.getItem('user');
        if (!userStr) return { 'Content-Type': 'application/json' };

        const user = JSON.parse(userStr);
        // Try common token fields
        const token = user.token || user.accessToken || user.jwt || user.access_token || user.id_token || (typeof user === 'string' ? user : null);

        if (token) {
            return {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            };
        }
    } catch (e) {
        console.error("Error reading auth token", e);
    }
    return { 'Content-Type': 'application/json' };
};

// --- AUTHENTICATION ---

export const signupUser = async (userData) => {
    const response = await fetch(`${BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
    });
    return handleResponse(response);
};

export const loginUser = async (credentials) => {
    try {
        const response = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        });
        return handleResponse(response);
    } catch (error) {
        console.error("Login API Error:", error);
        throw error;
    }
};

export const googleLogin = async (data) => {
    try {
        const response = await fetch(`${BASE_URL}/auth/google-login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return handleResponse(response);
    } catch (error) {
        console.error("Google Login API Error:", error);
        throw error;
    }
};

export const verifyOtp = async (data) => {
    const response = await fetch(`${BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return handleResponse(response);
};

export const resendOtp = async (email) => {
    const response = await fetch(`${BASE_URL}/auth/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
    });
    return handleResponse(response);
};



// --- FILE UPLOAD ---

export const uploadFile = async (file, category = "others") => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);

    // Manually construct headers to exclude Content-Type (let browser set it with boundary)
    const userStr = localStorage.getItem('user');
    let headers = {};
    if (userStr) {
        try {
            const user = JSON.parse(userStr);
            const token = user.token || user.accessToken || user.jwt || user.access_token || user.id_token || ((typeof user === 'string') ? user : null);
            if (token) headers['Authorization'] = `Bearer ${token}`;
        } catch (e) { }
    }

    const response = await fetch(`${BASE_URL}/upload`, {
        method: 'POST',
        headers: headers,
        body: formData,
    });
    return handleResponse(response);
};


// --- SERVICE REQUESTS ---


export const getServiceCatalog = async () => {
    const response = await fetch(`${BASE_URL}/admin/services`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    return handleResponse(response);
};

export const submitServiceRequest = async (requestData) => {
    const response = await fetch(`${BASE_URL}/services/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

// --- BUSINESS REGISTRATION SERVICE REQUESTS ---
export const submitPrivateLimitedRegistration = async (requestData) => {
    // Controller: PrivateLimitedCompanyController, Route: /api/service/private-limited-company/apply
    const response = await fetch(`${BASE_URL}/service/private-limited-company/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const updatePrivateLimitedStatus = async (id, status) => {
    const response = await fetch(`${BASE_URL}/service/private-limited-company/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
    });
    return handleResponse(response);
};

export const submitOnePersonCompanyRegistration = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/one-person-company/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const submitLlpRegistration = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/llp/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const submitPartnershipFirmRegistration = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/partnership-firm/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const submitSoleProprietorshipRegistration = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/sole-proprietorship/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const submitSection8CompanyRegistration = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/section-8-company/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const submitNidhiCompanyRegistration = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/nidhi-company/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const submitProducerCompanyRegistration = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/producer-company/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};


export const submitPublicLimitedCompanyRegistration = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/public-limited-company/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};


export const submitGstRegistration = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/gst-registration/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};


export const submitGstMonthlyReturn = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/gst-monthly-return/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};


export const submitGstAnnualReturn = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/gst-annual-return/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};


export const submitIncomeTaxReturn = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/income-tax-return/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};


export const submitTdsReturn = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/tds-return/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};





export const submitAdvanceTax = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/advance-tax/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};


export const submitTaxAudit = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/tax-audit/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};


export const submitAnnualRocFiling = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/annual-roc-filing/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};


export const submitDirectorKyc = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/director-kyc/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};


export const submitAddRemoveDirector = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/add-remove-director/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};


export const submitChangeRegisteredOffice = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/change-registered-office/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};


export const submitShareTransfer = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/share-transfer-filing/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};


export const submitIncreaseAuthorizedCapital = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/increase-authorized-capital/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};


export const submitMoaAoaAmendment = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/moa-aoa-amendment/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};


export const submitCompanyNameChange = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/company-name-change/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const submitStrikeOff = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/strike-off/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const submitFssaiLicense = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/fssai-license/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const submitShopEstablishment = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/shop-establishment/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const submitTradeLicense = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/trade-license/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const submitLabourLicense = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/labour-license/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const submitFactoryLicense = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/factory-license/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const updateTradeLicenseStatus = async (id, status) => {
    const response = await fetch(`${BASE_URL}/service/trade-license/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
    });
    return handleResponse(response);
};


export const submitDrugLicense = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/drug-license/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const submitFireNoc = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/fire-noc/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const updateFactoryLicenseStatus = async (id, status) => {
    const response = await fetch(`${BASE_URL}/service/factory-license/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
    });
    return handleResponse(response);
};

// --- NEW LICENSES (Fire, IEC, Bar, Shop) ---


export const updateFireNocStatus = async (id, status) => {
    const response = await fetch(`${BASE_URL}/service/fire-noc/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
    });
    return handleResponse(response);
};


export const submitIEC = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/iec/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const updateIECStatus = async (id, status) => {
    const response = await fetch(`${BASE_URL}/service/iec/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
    });
    return handleResponse(response);
};


export const submitBarLiquor = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/bar-liquor/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const updateBarLiquorStatus = async (id, status) => {
    const response = await fetch(`${BASE_URL}/service/bar-liquor/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
    });
    return handleResponse(response);
};

export const submitShopLicense = async (requestData) => {
    const email = requestData.email;
    const response = await fetch(`${BASE_URL}/shop-establishment/apply?email=${encodeURIComponent(email)}`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const updateShopLicenseStatus = async (id, status) => {
    const response = await fetch(`${BASE_URL}/shop-establishment/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
    });
    return handleResponse(response);
};

// --- BATCH 2 LICENSES (Labour, Drug, Pollution, Gumastha) ---


export const updateLabourLicenseStatus = async (id, status) => {
    const response = await fetch(`${BASE_URL}/service/labour-license/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
    });
    return handleResponse(response);
};


export const updateDrugLicenseStatus = async (id, status) => {
    const response = await fetch(`${BASE_URL}/service/drug-license/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
    });
    return handleResponse(response);
};


export const submitPollutionControl = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/pollution-control/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const updatePollutionControlStatus = async (id, status) => {
    const response = await fetch(`${BASE_URL}/service/pollution-control/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
    });
    return handleResponse(response);
};


export const submitGumasthaLicense = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/gumastha-license/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const updateGumasthaLicenseStatus = async (id, status) => {
    const response = await fetch(`${BASE_URL}/service/gumastha-license/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
    });
    return handleResponse(response);
};

// --- IP SERVICES ---


export const submitTrademarkRegistration = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/trademark-registration/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const updateTrademarkRegistrationStatus = async (id, status) => {
    const response = await fetch(`${BASE_URL}/service/trademark-registration/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
    });
    return handleResponse(response);
};


export const submitTrademarkObjection = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/trademark-objection/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const updateTrademarkObjectionStatus = async (id, status) => {
    const response = await fetch(`${BASE_URL}/service/trademark-objection/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
    });
    return handleResponse(response);
};


export const submitTrademarkHearing = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/trademark-hearing/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const updateTrademarkHearingStatus = async (id, status) => {
    const response = await fetch(`${BASE_URL}/service/trademark-hearing/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
    });
    return handleResponse(response);
};


export const submitTrademarkAssignment = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/trademark-assignment/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const updateTrademarkAssignmentStatus = async (id, status) => {
    const response = await fetch(`${BASE_URL}/service/trademark-assignment/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
    });
    return handleResponse(response);
};



export const submitTrademarkRenewal = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/trademark-renewal/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const updateTrademarkRenewalStatus = async (id, status) => {
    const response = await fetch(`${BASE_URL}/service/trademark-renewal/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
    });
    return handleResponse(response);
};


export const submitCopyrightRegistration = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/copyright-registration/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const updateCopyrightRegistrationStatus = async (id, status) => {
    const response = await fetch(`${BASE_URL}/service/copyright-registration/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
    });
    return handleResponse(response);
};


export const submitPatentFiling = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/patent-filing/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const updatePatentFilingStatus = async (id, status) => {
    const response = await fetch(`${BASE_URL}/service/patent-filing/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
    });
    return handleResponse(response);
};


export const submitDesignRegistration = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/design-registration/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const updateDesignRegistrationStatus = async (id, status) => {
    const response = await fetch(`${BASE_URL}/service/design-registration/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
    });
    return handleResponse(response);
};



// --- LABOUR LAW & HR SERVICES ---


export const submitPFRegistration = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/pf-registration/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const updatePFRegistrationStatus = async (id, status) => {
    const response = await fetch(`${BASE_URL}/service/pf-registration/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
    });
    return handleResponse(response);
};

export const submitPFFiling = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/pf-filing/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const updatePFFilingStatus = async (id, status) => {
    const response = await fetch(`${BASE_URL}/service/pf-filing/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
    });
    return handleResponse(response);
};


export const submitESIRegistration = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/esi-registration/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const updateESIRegistrationStatus = async (id, status) => {
    const response = await fetch(`${BASE_URL}/service/esi-registration/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
    });
    return handleResponse(response);
};

export const submitESIFiling = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/esi-filing/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const updateESIFilingStatus = async (id, status) => {
    const response = await fetch(`${BASE_URL}/service/esi-filing/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
    });
    return handleResponse(response);
};



export const submitProfessionalTax = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/professional-tax/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const updateProfessionalTaxStatus = async (id, status) => {
    const response = await fetch(`${BASE_URL}/service/professional-tax/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
    });
    return handleResponse(response);
};

export const submitLabourWelfareFund = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/labour-welfare-fund/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const updateLabourWelfareFundStatus = async (id, status) => {
    const response = await fetch(`${BASE_URL}/service/labour-welfare-fund/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
    });
    return handleResponse(response);
};

export const submitGratuityAct = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/gratuity-act/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const updateGratuityActStatus = async (id, status) => {
    const response = await fetch(`${BASE_URL}/service/gratuity-act/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
    });
    return handleResponse(response);
};

export const submitBonusAct = async (requestData) => {
    const response = await fetch(`${BASE_URL}/service/bonus-act/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const updateBonusActStatus = async (id, status) => {
    const response = await fetch(`${BASE_URL}/service/bonus-act/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
    });
    return handleResponse(response);
};

export const submitMinimumWages = async (requestData) => {
    const email = requestData.email;
    const response = await fetch(`${BASE_URL}/minimum-wages/apply?email=${encodeURIComponent(email)}`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const updateMinimumWagesStatus = async (id, status) => {
    const response = await fetch(`${BASE_URL}/minimum-wages/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
    });
    return handleResponse(response);
};

// --- BUSINESS CERTIFICATIONS ---


export const submitISOCertification = async (requestData) => {
    const email = requestData.email;
    const response = await fetch(`${BASE_URL}/service/iso-certification/submit?email=${encodeURIComponent(email)}`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const updateISOCertificationStatus = async (id, status) => {
    const response = await fetch(`${BASE_URL}/service/iso-certification/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
    });
    return handleResponse(response);
};

export const submitStartupIndia = async (requestData) => {
    const email = requestData.email;
    const response = await fetch(`${BASE_URL}/service/startup-india/submit?email=${encodeURIComponent(email)}`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const updateStartupIndiaStatus = async (id, status) => {
    const response = await fetch(`${BASE_URL}/service/startup-india/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
    });
    return handleResponse(response);
};

export const submitDigitalSignature = async (requestData) => {
    const email = requestData.email;
    const response = await fetch(`${BASE_URL}/service/digital-signature/submit?email=${encodeURIComponent(email)}`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const updateDigitalSignatureStatus = async (id, status) => {
    const response = await fetch(`${BASE_URL}/service/digital-signature/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
    });
    return handleResponse(response);
};

export const submitBarCode = async (requestData) => {
    const email = requestData.email;
    const response = await fetch(`${BASE_URL}/service/bar-code/submit?email=${encodeURIComponent(email)}`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const updateBarCodeStatus = async (id, status) => {
    const response = await fetch(`${BASE_URL}/service/bar-code/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
    });
    return handleResponse(response);
};

export const submitTanPan = async (requestData) => {
    const email = requestData.email;
    const response = await fetch(`${BASE_URL}/service/tan-pan/submit?email=${encodeURIComponent(email)}`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const updateTanPanStatus = async (id, status) => {
    const response = await fetch(`${BASE_URL}/service/tan-pan/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
    });
    return handleResponse(response);
};

export const submitMSMERegistration = async (requestData) => {
    const email = requestData.email;
    const response = await fetch(`${BASE_URL}/service/msme-registration/submit?email=${encodeURIComponent(email)}`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
    });
    return handleResponse(response);
};

export const updateMSMERegistrationStatus = async (id, status) => {
    const response = await fetch(`${BASE_URL}/service/msme-registration/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
    });
    return handleResponse(response);
};

export const getUserApplications = async (email) => {
    // Parallel fetch (Generic + 12 Specialized + 8 IP + 7 Labour Law + 6 Business Certifications + 9 Business Registration)
    const [
        genericRes, fssaiRes, tradeRes, factoryRes,
        fireRes, iecRes, barRes, shopRes,
        labourRes, drugRes, pollutionRes, gumasthaRes,
        tmRegRes, tmObjRes, tmHearRes, tmAsnRes, tmRenRes,
        cpyRes, patRes, desRes,
        pfRes, esiRes, ptRes, lwfRes, graRes, bonusRes, mwRes,
        msmeRes, isoRes, startupRes, dscRes, barCodeRes, tanPanRes,
        // Agreements & Financial Services are now handled by Generic Service Request Controller
        pvtRes,
        // opcRes, llpRes, firmRes, soleRes, sec8Res, nidhiRes, prodRes, pubRes
    ] = await Promise.allSettled([
        fetch(`${BASE_URL}/services/my-requests?email=${encodeURIComponent(email)}`, { headers: getAuthHeaders() }),
        fetch(`${BASE_URL}/fssai/my-requests?email=${encodeURIComponent(email)}`, { headers: getAuthHeaders() }),
        fetch(`${BASE_URL}/trade-license/my-applications?email=${encodeURIComponent(email)}`, { headers: getAuthHeaders() }),
        fetch(`${BASE_URL}/factory-license/my-applications?email=${encodeURIComponent(email)}`, { headers: getAuthHeaders() }),
        fetch(`${BASE_URL}/fire-noc/my-applications?email=${encodeURIComponent(email)}`, { headers: getAuthHeaders() }),
        fetch(`${BASE_URL}/iec/my-applications?email=${encodeURIComponent(email)}`, { headers: getAuthHeaders() }),
        fetch(`${BASE_URL}/bar-liquor/my-applications?email=${encodeURIComponent(email)}`, { headers: getAuthHeaders() }),
        fetch(`${BASE_URL}/shop-establishment/my-applications?email=${encodeURIComponent(email)}`, { headers: getAuthHeaders() }),
        fetch(`${BASE_URL}/labour-license/my-applications?email=${encodeURIComponent(email)}`, { headers: getAuthHeaders() }),
        fetch(`${BASE_URL}/drug-license/my-applications?email=${encodeURIComponent(email)}`, { headers: getAuthHeaders() }),
        fetch(`${BASE_URL}/pollution-control/my-applications?email=${encodeURIComponent(email)}`, { headers: getAuthHeaders() }),
        fetch(`${BASE_URL}/gumastha-license/my-applications?email=${encodeURIComponent(email)}`, { headers: getAuthHeaders() }),

        fetch(`${BASE_URL}/trademark-registration/my-applications?email=${encodeURIComponent(email)}`, { headers: getAuthHeaders() }),
        fetch(`${BASE_URL}/trademark-objection/my-applications?email=${encodeURIComponent(email)}`, { headers: getAuthHeaders() }),
        fetch(`${BASE_URL}/trademark-hearing/my-applications?email=${encodeURIComponent(email)}`, { headers: getAuthHeaders() }),
        fetch(`${BASE_URL}/trademark-assignment/my-applications?email=${encodeURIComponent(email)}`, { headers: getAuthHeaders() }),
        fetch(`${BASE_URL}/trademark-renewal/my-applications?email=${encodeURIComponent(email)}`, { headers: getAuthHeaders() }),
        fetch(`${BASE_URL}/copyright-registration/my-applications?email=${encodeURIComponent(email)}`, { headers: getAuthHeaders() }),
        fetch(`${BASE_URL}/patent-filing/my-applications?email=${encodeURIComponent(email)}`, { headers: getAuthHeaders() }),
        fetch(`${BASE_URL}/design-registration/my-applications?email=${encodeURIComponent(email)}`, { headers: getAuthHeaders() }),

        fetch(`${BASE_URL}/pf-registration/my-applications?email=${encodeURIComponent(email)}`, { headers: getAuthHeaders() }),
        fetch(`${BASE_URL}/esi-registration/my-applications?email=${encodeURIComponent(email)}`, { headers: getAuthHeaders() }),
        fetch(`${BASE_URL}/professional-tax/my-applications?email=${encodeURIComponent(email)}`, { headers: getAuthHeaders() }),
        fetch(`${BASE_URL}/labour-welfare-fund/my-applications?email=${encodeURIComponent(email)}`, { headers: getAuthHeaders() }),
        fetch(`${BASE_URL}/gratuity-act/my-applications?email=${encodeURIComponent(email)}`, { headers: getAuthHeaders() }),
        fetch(`${BASE_URL}/bonus-act/my-applications?email=${encodeURIComponent(email)}`, { headers: getAuthHeaders() }),
        fetch(`${BASE_URL}/minimum-wages/my-applications?email=${encodeURIComponent(email)}`, { headers: getAuthHeaders() }),

        fetch(`${BASE_URL}/service/msme-registration/my-applications?email=${encodeURIComponent(email)}`, { headers: getAuthHeaders() }),
        fetch(`${BASE_URL}/service/iso-certification/my-applications?email=${encodeURIComponent(email)}`, { headers: getAuthHeaders() }),
        fetch(`${BASE_URL}/service/startup-india/my-applications?email=${encodeURIComponent(email)}`, { headers: getAuthHeaders() }),
        fetch(`${BASE_URL}/service/digital-signature/my-applications?email=${encodeURIComponent(email)}`, { headers: getAuthHeaders() }),
        fetch(`${BASE_URL}/service/bar-code/my-applications?email=${encodeURIComponent(email)}`, { headers: getAuthHeaders() }),
        fetch(`${BASE_URL}/service/tan-pan/my-applications?email=${encodeURIComponent(email)}`, { headers: getAuthHeaders() }),

        // Business Registration
        fetch(`${BASE_URL}/service/private-limited-company/my-applications?email=${encodeURIComponent(email)}`, { headers: getAuthHeaders() }),
    ]);

    const orderMap = new Map();

    const processRes = async (res, type, labelFn) => {
        if (res.status === 'fulfilled' && res.value.ok) {
            try {
                const data = await res.value.json();
                if (Array.isArray(data)) {
                    data.forEach(item => {
                        let parsedData = {};
                        try {
                            if (typeof item.formData === 'string') parsedData = JSON.parse(item.formData);
                            else if (typeof item.formData === 'object') parsedData = item.formData;
                        } catch (e) { }

                        const mapped = {
                            ...parsedData, // Spread inner form data (businessName, submissionId)
                            ...item,       // Spread entity data (id, status, createdAt)
                            id: parsedData.submissionId || item.submissionId || item.id,
                            serviceName: labelFn(item),
                            status: item.status,
                            submittedAt: item.createdAt,
                            client: item.applicantName || (item.user ? item.user.fullName : 'Guest'),
                            service: type
                        };
                        const key = mapped.id;
                        if (key) orderMap.set(key.toString(), mapped);
                    });
                }
            } catch (e) { }
        }
    };

    // 1. Generic
    if (genericRes.status === 'fulfilled' && genericRes.value.ok) {
        try {
            const data = await genericRes.value.json();
            if (Array.isArray(data)) {
                data.forEach(item => {
                    const sName = (item.service || item.serviceName || "").toLowerCase();
                    const sId = (item.submissionId || item.id || "").toString().toUpperCase();

                    if (sName.includes('fssai') || sId.includes('FSSAI')) return;
                    if (sName.includes('trade license') || sId.startsWith('TL-')) return;
                    if (sName.includes('factory license') || sId.startsWith('FL-')) return;
                    if (sName.includes('fire noc') || sId.startsWith('FIRE-')) return;
                    if (sId.startsWith('IEC-')) return;
                    if (sId.startsWith('BAR-')) return;
                    if (sId.startsWith('SHOP-')) return;
                    if (sId.startsWith('LAB-')) return;
                    if (sId.startsWith('DRUG-')) return;
                    if (sId.startsWith('PCB-')) return;
                    if (sId.startsWith('GUM-')) return;
                    if (sId.startsWith('TM-')) return;
                    if (sId.startsWith('CPY-')) return;
                    if (sId.startsWith('PAT-')) return;
                    if (sId.startsWith('DES-')) return;
                    if (sName.includes('pf-') || sId.startsWith('PF-')) return;
                    if (sName.includes('esi-') || sId.startsWith('ESI-')) return;
                    if (sName.includes('private limited') || sName.includes('pvt ltd')) return; // Deduplicate Pvt Ltd
                    if (sId.startsWith('PT-')) return;
                    if (sId.startsWith('LWF-')) return;
                    if (sId.startsWith('GRA-')) return;
                    if (sId.startsWith('BONUS-')) return;
                    if (sId.startsWith('MW-')) return;

                    const key = item.submissionId || item.id;
                    if (key) orderMap.set(key.toString(), item);
                });
            }
        } catch (e) { }
    }

    // 2. Specialized
    await processRes(fssaiRes, 'FSSAI License', (f) => `FSSAI License(${f.licenseType})`);
    await processRes(tradeRes, 'Trade License', (t) => `Trade License(${t.planType})`);
    await processRes(factoryRes, 'Factory License', (f) => `Factory License(${f.planType})`);

    await processRes(fireRes, 'Fire NOC', (f) => `Fire NOC(${f.planType})`);
    await processRes(iecRes, 'IEC Registration', (i) => `IEC Registration(${i.planType})`);
    await processRes(barRes, 'Bar License', (b) => `Bar / Liquor License(${b.licenseType})`);
    await processRes(shopRes, 'Shop License', (s) => `Shop License(${s.category})`);

    await processRes(labourRes, 'Labour License', (l) => `Labour License(${l.planType})`);
    await processRes(drugRes, 'Drug License', (d) => `Drug License(${d.licenseType})`);
    await processRes(pollutionRes, 'Pollution Control', (p) => `Pollution Control(${p.certificateType})`);
    await processRes(gumasthaRes, 'Gumastha License', (g) => `Gumastha License`);

    await processRes(tmRegRes, 'Trademark Registration', (t) => `Trademark Reg(${t.businessType})`);
    await processRes(tmObjRes, 'Trademark Objection', (t) => `Trademark Objection(${t.applicationNumber})`);
    await processRes(tmHearRes, 'Trademark Hearing', (t) => `Trademark Hearing(${t.applicationNumber})`);
    await processRes(tmAsnRes, 'Trademark Assignment', (t) => `Trademark Assignment`);
    await processRes(tmRenRes, 'Trademark Renewal', (t) => `Trademark Renewal`);
    await processRes(cpyRes, 'Copyright Registration', (c) => `Copyright(${c.workCategory})`);
    await processRes(patRes, 'Patent Filing', (p) => `Patent Filing(${p.filingType})`);
    await processRes(desRes, 'Design Registration', (d) => `Design Reg(${d.designTitle})`);

    await processRes(pfRes, 'PF Registration', (p) => `PF Registration`);
    await processRes(esiRes, 'ESI Registration', (e) => `ESI Registration`);
    await processRes(ptRes, 'Professional Tax', (p) => `Professional Tax`);
    await processRes(lwfRes, 'Labour Welfare Fund', (l) => `Labour Welfare Fund`);
    await processRes(graRes, 'Gratuity Act', (g) => `Gratuity Act`);
    await processRes(bonusRes, 'Bonus Act', (b) => `Bonus Act`);
    await processRes(mwRes, 'Minimum Wages', (m) => `Minimum Wages`);

    await processRes(msmeRes, "MSME Registration", i => "MSME Registration");
    await processRes(isoRes, "ISO Certification", i => `ISO ${i.standard || ''}`);
    await processRes(startupRes, "Startup India", i => "Startup India Recognition");
    await processRes(dscRes, "Digital Signature", i => `DSC - Class ${i.classType || '3'}`);
    await processRes(barCodeRes, "Bar Code", i => "Bar Code Registration");
    await processRes(tanPanRes, "TAN / PAN", i => `${i.applicationType || 'PAN/TAN'} Application`);

    // await processRes(partnerRes, "Partnership Deed", i => "Partnership Deed Drafting");
    // await processRes(founderRes, "Founders Agreement", i => "Founders Agreement Drafting");
    // await processRes(shareRes, "Shareholders Agreement", i => "Shareholders Agreement Drafting");
    // await processRes(employRes, "Employment Agreement", i => "Employment Agreement Drafting");
    // await processRes(rentRes, "Rent Agreement", i => "Rent Agreement Drafting");
    // await processRes(franchiseRes, "Franchise Agreement", i => "Franchise Agreement Drafting");
    // await processRes(ndaRes, "NDA", i => "Non-Disclosure Agreement");
    // await processRes(vendorRes, "Vendor Agreement", i => "Vendor Agreement Drafting");

    // Genetic Financial Services
    // await processRes(cmaRes, "CMA Data Preparation", i => "CMA Data Preparation");
    // await processRes(projectRes, "Project Report", i => "Project Report (DPR)");
    // await processRes(loanRes, "Bank Loan Documentation", i => "Bank Loan Documentation");
    // await processRes(cashRes, "Cash Flow Compliance", i => "Cash Flow Compliance");
    // await processRes(pitchRes, "Startup Pitch Deck", i => "Startup Pitch Deck");
    // await processRes(valRes, "Business Valuation", i => "Business Valuation Report");

    // Business Registration
    await processRes(pvtRes, "Private Limited Company", i => "Private Limited Company");
    // await processRes(opcRes, "One Person Company", i => "One Person Company");
    // await processRes(llpRes, "Limited Liability Partnership", i => "Limited Liability Partnership");
    // await processRes(firmRes, "Partnership Firm", i => "Partnership Firm");
    // await processRes(soleRes, "Sole Proprietorship", i => "Sole Proprietorship");
    // await processRes(sec8Res, "Section 8 Company", i => "Section 8 Company");
    // await processRes(nidhiRes, "Nidhi Company", i => "Nidhi Company");
    // await processRes(prodRes, "Producer Company", i => "Producer Company");
    // await processRes(pubRes, "Public Limited Company", i => "Public Limited Company");

    return Array.from(orderMap.values());
};

export const getAllApplications = async () => {
    const res = await fetch(`${BASE_URL}/services/all`, {
        headers: getAuthHeaders(),
    });
    return handleResponse(res);
};



export const getAgentApplications = async (email) => {
    const response = await fetch(`${BASE_URL}/services/agent-requests?email=${encodeURIComponent(email)}`, {
        headers: getAuthHeaders()
    });
    return handleResponse(response);
};

export const submitAgentKyc = async (userId, kycData) => {
    const response = await fetch(`${BASE_URL}/users/${userId}/kyc`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(kycData),
    });
    return handleResponse(response);
};



export const approveAgentKyc = async (userId) => {
    const response = await fetch(`${BASE_URL}/users/${userId}/approve-kyc`, {
        method: 'PUT',
        headers: getAuthHeaders(),
    });
    return handleResponse(response);
};

export const rejectAgentKyc = async (userId, reason) => {
    const response = await fetch(`${BASE_URL}/users/${userId}/reject-kyc`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ reason }),
    });
    return handleResponse(response);
};

export const deleteUser = async (userId) => {
    const response = await fetch(`${BASE_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    return handleResponse(response);
};

// --- USER MANAGEMENT ---

export const getAllUsers = async () => {
    try {
        const response = await fetch(`${BASE_URL}/auth/users`, {
            headers: getAuthHeaders()
        });
        return await handleResponse(response);
    } catch (e) {
        console.warn("Backend /auth/users failed. " + e.message);
        throw e;
    }
};

export const updateUserRole = async (userId, newRole) => {
    const response = await fetch(`${BASE_URL}/auth/users/${userId}/role`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ role: newRole }),
    });
    return handleResponse(response);
};

export const assignAgentToRequest = async (requestId, agentId) => {
    const response = await fetch(`${BASE_URL}/services/${requestId}/assign`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ agentId }),
    });
    return handleResponse(response);
};

export const updateApplicationStatus = async (requestId, status) => {
    const response = await fetch(`${BASE_URL}/services/${requestId}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
    });
    return handleResponse(response);
};

// --- DASHBOARD STATS ---

export const getUserStats = async (userId) => {
    try {
        const response = await fetch(`${BASE_URL}/users/${userId}/stats`, {
            headers: getAuthHeaders()
        });
        if (response.ok) return await response.json();
    } catch (e) {
        console.warn("Failed to fetch user stats", e);
    }
    return {
        activeServices: 0,
        pendingActions: 0,
        totalDocuments: 0
    };
};

export const getUserPayments = async (userId) => {
    try {
        const response = await fetch(`${BASE_URL}/users/${userId}/payments`, {
            headers: getAuthHeaders()
        });
        if (response.ok) return await response.json();
    } catch (e) {
        console.warn("Failed to fetch user payments", e);
    }
    // Return empty array or mock if preferred
    return [];
};

export const updateUserProfile = async (userId, profileData) => {
    const response = await fetch(`${BASE_URL}/users/${userId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(profileData),
    });
    return handleResponse(response);
};

export const uploadProfilePicture = async (userId, file) => {
    const formData = new FormData();
    formData.append("file", file);

    const headers = getAuthHeaders();
    delete headers['Content-Type'];

    const response = await fetch(`${BASE_URL}/users/${userId}/profile-image`, {
        method: 'POST',
        headers: headers,
        body: formData
    });
    return handleResponse(response);
};

export const requestWithdrawal = async (userId, amount) => {
    // Simulating success for "A-Z" feel
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ success: true, message: "Withdrawal request submitted successfully." });
        }, 1000);
    });
};

export const submitSupportTicket = async (ticketData) => {
    const response = await fetch(`${BASE_URL}/tickets`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(ticketData),
    });
    return handleResponse(response);
};

// --- CHAT SYSTEM ---

export const getChatHistory = async (ticketId) => {
    const response = await fetch(`${BASE_URL}/chat/history/${ticketId}`, {
        headers: getAuthHeaders()
    });
    return handleResponse(response);
};

export const sendChatMessage = async (chatData) => {
    // chatData = { email, message, ticketId, role? }
    const response = await fetch(`${BASE_URL}/chat/send`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(chatData),
    });
    return handleResponse(response);
};

export const markChatAsRead = async (ticketId, role) => {
    const response = await fetch(`${BASE_URL}/chat/read/${ticketId}?role=${role}`, {
        method: 'PUT',
        headers: getAuthHeaders()
    });
    return response.ok;
};

export const getUnreadChatCounts = async () => {
    try {
        const response = await fetch(`${BASE_URL}/chat/unread`, {
            headers: getAuthHeaders()
        });
        if (response.ok) return await response.json();
    } catch (e) {
        console.warn("Failed to fetch chat counts", e);
    }
    return {};
};

export const getUserUnreadChatCounts = async (email) => {
    try {
        const response = await fetch(`${BASE_URL}/chat/unread/user?email=${encodeURIComponent(email)}`, {
            headers: getAuthHeaders()
        });
        if (response.ok) return await response.json();
    } catch (e) {
        console.warn("Failed to fetch user chat counts", e);
    }
    return {};
};

// --- CHAT ACTIONS ---

export const editChatMessage = async (ticketId, messageId, newMessage) => {
    const response = await fetch(`${BASE_URL}/chat/message/${ticketId}/${messageId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ message: newMessage })
    });
    return response.ok;
};

export const deleteChatMessage = async (ticketId, messageId) => {
    const response = await fetch(`${BASE_URL}/chat/message/${ticketId}/${messageId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });
    return response.ok;
};

export const clearChatHistory = async (ticketId) => {
    const response = await fetch(`${BASE_URL}/chat/history/${ticketId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });
    return response.ok;
};

export const setTypingStatus = async (ticketId, role, isTyping) => {
    await fetch(`${BASE_URL}/chat/typing/${ticketId}`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ role, isTyping })
    });
};

export const getTypingStatus = async (ticketId) => {
    try {
        const response = await fetch(`${BASE_URL}/chat/typing/${ticketId}`, { headers: getAuthHeaders() });
        if (response.ok) return await response.json();
    } catch (e) { }
    return [];
};

export const getAdminStats = async () => {
    const response = await fetch(`${BASE_URL}/admin/stats`, {
        headers: getAuthHeaders()
    });
    return handleResponse(response);
};

export const getClientAnalysis = async () => {
    const response = await fetch(`${BASE_URL}/admin/client-analysis`, {
        headers: getAuthHeaders()
    });
    return handleResponse(response);
};

// --- ADMIN ORDER ACTIONS ---

export const deleteAllChats = async (password) => {
    const response = await fetch(`${BASE_URL}/admin/delete-all-chats`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ password })
    });
    return handleResponse(response);
};

// --- FINANCIAL OPERATIONS ---

export const getFinancialData = async () => {
    const response = await fetch(`${BASE_URL}/admin/finance`, {
        headers: getAuthHeaders()
    });
    return handleResponse(response);
};



export const getAuditLogs = async () => {
    const response = await fetch(`${BASE_URL}/admin/logs`, {
        headers: getAuthHeaders()
    });
    return handleResponse(response);
};



// --- PRIVATE LIMITED AUTOMATION ---

export const verifyPrivateLimitedDocs = async (submissionId) => {
    const response = await fetch(`${BASE_URL}/admin/verify-docs/${submissionId}`, {
        method: 'POST',
        headers: getAuthHeaders()
    });
    return handleResponse(response);
};

export const startAutomation = async (orderId) => {
    const response = await fetch(`${BASE_URL}/admin/orders/${orderId}/automation/start`, {
        method: 'POST',
        headers: getAuthHeaders()
    });
    return handleResponse(response);
};

export const getAutomationLogs = async (orderId) => {
    const response = await fetch(`${BASE_URL}/admin/orders/${orderId}/automation/logs`, {
        headers: getAuthHeaders()
    });
    return handleResponse(response);
};

// --- AI PROMPT MANAGEMENT ---

export const getAllPrompts = async () => {
    const response = await fetch(`${BASE_URL}/prompts`, {
        headers: getAuthHeaders()
    });
    return handleResponse(response);
};

export const createPrompt = async (promptData) => {
    const response = await fetch(`${BASE_URL}/prompts`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(promptData),
    });
    return handleResponse(response);
};

export const updatePrompt = async (id, promptData) => {
    const response = await fetch(`${BASE_URL}/prompts/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(promptData),
    });
    return handleResponse(response);
};

export const deletePrompt = async (id) => {
    const response = await fetch(`${BASE_URL}/prompts/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });
    // Response might be empty 200 OK
    if (response.ok) return true;
    return handleResponse(response);
};

// --- NOTIFICATIONS ---

export const getNotifications = async (email) => {
    const response = await fetch(`${BASE_URL}/notifications?email=${encodeURIComponent(email)}`, {
        headers: getAuthHeaders()
    });
    return handleResponse(response);
};

export const getUnreadSystemNotifications = async () => {
    try {
        const response = await fetch(`${BASE_URL}/notifications/system/unread`, { headers: getAuthHeaders() });
        // Return array or empty array if fails
        if (response.ok) return await response.json();
    } catch (e) {
        console.warn("Failed to fetch system notifications", e);
    }
    return [];
};

export const markNotificationRead = async (id) => {
    const response = await fetch(`${BASE_URL}/notifications/${id}/read`, {
        method: 'POST',
        headers: getAuthHeaders()
    });
    return response.ok;
};

export const markAllNotificationsRead = async (email) => {
    const response = await fetch(`${BASE_URL} / notifications / mark - all - read ? email = ${encodeURIComponent(email)}`, {
        method: 'POST',
        headers: getAuthHeaders()
    });
    return response.ok;
};

// --- NOTIFICATION TEMPLATES ---

export const getTemplates = async () => {
    const response = await fetch(`${BASE_URL} / templates`, { headers: getAuthHeaders() });
    return handleResponse(response);
};

export const createTemplate = async (data) => {
    const response = await fetch(`${BASE_URL} / templates`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
    });
    return handleResponse(response);
};

export const updateTemplate = async (id, data) => {
    const response = await fetch(`${BASE_URL} / templates / ${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
    });
    return handleResponse(response);
};

export const deleteTemplate = async (id) => {
    const response = await fetch(`${BASE_URL} / templates / ${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });
    if (response.ok) return true;
    return handleResponse(response);
};


// --- AUTOMATION MANAGEMENT ---

export const getAutomationWorkflows = async () => {
    try {
        const response = await fetch(`${BASE_URL} / admin / automation / workflows`, {
            headers: getAuthHeaders()
        });
        return await handleResponse(response);
    } catch (e) {
        console.warn("Failed to fetch automation workflows: " + e.message);
        return [];
    }
};

export const createAutomationWorkflow = async (data) => {
    const response = await fetch(`${BASE_URL} / admin / automation / workflows`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
    });
    return handleResponse(response);
};

export const updateAutomationWorkflow = async (id, data) => {
    const response = await fetch(`${BASE_URL} / admin / automation / workflows / ${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
    });
    return handleResponse(response);
};

export const getAutomationSystemLogs = async () => {
    try {
        const response = await fetch(`${BASE_URL} / admin / automation / logs / system`, {
            headers: getAuthHeaders()
        });
        return await handleResponse(response);
    } catch (e) {
        return [];
    }
};

// --- LEGAL DRAFTING SERVICES ---

export const submitPartnershipDeed = async (formData) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const response = await fetch(`${BASE_URL} / service / partnership - deed / submit ? email = ${encodeURIComponent(user.email)}`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(formData)
    });
    return handleResponse(response);
};

export const updatePartnershipDeedStatus = async (id, status) => {
    const response = await fetch(`${BASE_URL} /service/partnership - deed / ${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
    });
    return handleResponse(response);
};

export const submitFoundersAgreement = async (formData) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const response = await fetch(`${BASE_URL}/service/founders-agreement/submit?email=${encodeURIComponent(user.email)}`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(formData)
    });
    return handleResponse(response);
};

export const updateFoundersAgreementStatus = async (id, status) => {
    const response = await fetch(`${BASE_URL}/service/founders-agreement/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
    });
    return handleResponse(response);
};

export const submitShareholdersAgreement = async (formData) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const response = await fetch(`${BASE_URL}/service/shareholders-agreement/submit?email=${encodeURIComponent(user.email)}`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(formData)
    });
    return handleResponse(response);
};

export const updateShareholdersAgreementStatus = async (id, status) => {
    const response = await fetch(`${BASE_URL}/service/shareholders-agreement/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
    });
    return handleResponse(response);
};

export const submitEmploymentAgreement = async (formData) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const response = await fetch(`${BASE_URL}/service/employment-agreement/submit?email=${encodeURIComponent(user.email)}`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(formData)
    });
    return handleResponse(response);
};

export const updateEmploymentAgreementStatus = async (id, status) => {
    const response = await fetch(`${BASE_URL}/service/employment-agreement/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
    });
    return handleResponse(response);
};

export const submitRentAgreementDrafting = async (formData) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const response = await fetch(`${BASE_URL}/service/rent-agreement/submit?email=${encodeURIComponent(user.email)}`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(formData)
    });
    return handleResponse(response);
};

export const updateRentAgreementStatus = async (id, status) => {
    const response = await fetch(`${BASE_URL}/service/rent-agreement/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
    });
    return handleResponse(response);
};

export const submitFranchiseAgreement = async (formData) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const response = await fetch(`${BASE_URL}/service/franchise-agreement/submit?email=${encodeURIComponent(user.email)}`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(formData)
    });
    return handleResponse(response);
};

export const updateFranchiseAgreementStatus = async (id, status) => {
    const response = await fetch(`${BASE_URL}/service/franchise-agreement/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
    });
    return handleResponse(response);
};

export const submitNDA = async (formData) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const response = await fetch(`${BASE_URL}/service/nda/submit?email=${encodeURIComponent(user.email)}`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(formData)
    });
    return handleResponse(response);
};

export const updateNDAStatus = async (id, status) => {
    const response = await fetch(`${BASE_URL}/service/nda/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
    });
    return handleResponse(response);
};

export const submitVendorAgreement = async (formData) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const response = await fetch(`${BASE_URL}/service/vendor-agreement/submit?email=${encodeURIComponent(user.email)}`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(formData)
    });
    return handleResponse(response);
};

export const updateVendorAgreementStatus = async (id, status) => {
    const response = await fetch(`${BASE_URL}/service/vendor-agreement/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
    });
    return handleResponse(response);
};

// --- SERVICE CATALOG MANAGEMENT ---
// --- SERVICE CATALOG MANAGEMENT ---

export const getServiceProducts = async () => {
    const response = await fetch(`${BASE_URL}/admin/services`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    return handleResponse(response);
};

export const createServiceProduct = async (data) => {
    // Note: Backend endpoint /admin/services for POST might not exist yet.
    const response = await fetch(`${BASE_URL}/admin/services`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });
    return handleResponse(response);
};

export const updateServiceProduct = async (id, data) => {
    const response = await fetch(`${BASE_URL}/admin/services/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });
    return handleResponse(response);
};

export const deleteServiceProduct = async (id) => {
    const response = await fetch(`${BASE_URL}/admin/service-products/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    return handleResponse(response);
};

// --- FINANCIAL SERVICES ---

export const submitFinancialService = async (slug, formData) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const response = await fetch(`${BASE_URL}/service/${slug}/submit?email=${encodeURIComponent(user.email)}`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(formData)
    });
    return handleResponse(response);
};


export const updateFinancialServiceStatus = async (slug, id, status) => {
    const response = await fetch(`${BASE_URL}/service/${slug}/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
    });
    return handleResponse(response);
};

// --- ADMIN CLEANUP ---
export const deleteOrder = async (orderId) => {
    const response = await fetch(`${BASE_URL}/admin/orders/${orderId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    return handleResponse(response);
};

// --- ADMIN USER & ORG MANAGEMENT ---

export const getDepartments = async () => {
    // Mock or Real Endpoint
    // If backend doesn't support depts, we return mock to prevent crash.
    // Or we can try to fetch.
    try {
        const response = await fetch(`${BASE_URL}/admin/departments`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });
        if (response.ok) return await response.json();
    } catch (e) { }

    return [
        { id: 1, name: 'Legal Board', count: 12, head: 'Adv. Sharma', color: 'bg-indigo-50 text-indigo-700' },
        { id: 2, name: 'Support Ops', count: 8, head: 'Priya K.', color: 'bg-pink-50 text-pink-700' },
        { id: 3, name: 'Finance', count: 4, head: 'Amit R.', color: 'bg-emerald-50 text-emerald-700' },
        { id: 4, name: 'Tech Team', count: 6, head: 'Suresh V.', color: 'bg-blue-50 text-blue-700' }
    ];
};

export const updateDepartment = async () => {
    // Placeholder
    return { success: true };
};

export const getSystemSettings = async () => {
    const response = await fetch(`${BASE_URL}/admin/settings`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    return handleResponse(response);
};

export const updateSystemSettings = async (settings) => {
    const response = await fetch(`${BASE_URL}/admin/settings`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(settings)
    });
    return handleResponse(response);
};
// --- FILE MANAGEMENT ---

export const getAllFiles = async () => {
    const response = await fetch(`${BASE_URL}/upload/all`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    return handleResponse(response);
};

export const deleteFile = async (id) => {
    const response = await fetch(`${BASE_URL}/upload/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    // Response might be empty 200 OK
    if (response.ok) return true;
    return handleResponse(response);
};

// --- TESTIMONIALS / FEEDBACK ---

export const submitTestimonial = async (testimonialData) => {
    const response = await fetch(`${BASE_URL}/testimonials`, {
        method: 'POST',
        headers: {
            ...getAuthHeaders(),
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(testimonialData),
    });
    return handleResponse(response);
};

export const getApprovedTestimonials = async () => {
    const response = await fetch(`${BASE_URL}/testimonials/approved`, {
        method: 'GET',
    });
    return handleResponse(response);
};

export const getAllTestimonials = async () => {
    const response = await fetch(`${BASE_URL}/testimonials/all`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    return handleResponse(response);
};
