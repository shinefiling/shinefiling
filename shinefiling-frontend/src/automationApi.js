import { BASE_URL } from './api';

// Helper to get auth headers
const getAuthHeaders = () => {
    try {
        const userStr = localStorage.getItem('user');
        if (!userStr) return { 'Content-Type': 'application/json' };

        const user = JSON.parse(userStr);
        const token = user.token || user.accessToken || user.jwt;

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

// Helper for handling responses
const handleResponse = async (response) => {
    if (!response.ok) {
        const error = await response.text();
        throw new Error(error || `Request failed: ${response.status}`);
    }
    try {
        const text = await response.text();
        return text ? JSON.parse(text) : null;
    } catch (error) {
        return null;
    }
};

// ========================================
// BUSINESS REGISTRATION AUTOMATION APIs
// ========================================

/**
 * Start automation for any business registration type
 * @param {string} submissionId - The submission ID from application
 * @param {string} registrationType - Type: PRIVATE_LIMITED_COMPANY, OPC, LLP, etc.
 */
export const startBusinessRegistrationAutomation = async (submissionId, registrationType) => {
    const response = await fetch(`${BASE_URL}/business-registration/automation/start`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ submissionId, registrationType })
    });
    return handleResponse(response);
};

/**
 * Get automation status for a submission
 */
export const getAutomationStatus = async (submissionId) => {
    const response = await fetch(`${BASE_URL}/business-registration/automation/status/${submissionId}`, {
        method: 'GET',
        headers: getAuthHeaders()
    });
    return handleResponse(response);
};

/**
 * Get automation logs for a submission
 */
export const getAutomationLogs = async (submissionId) => {
    const response = await fetch(`${BASE_URL}/business-registration/automation/logs/${submissionId}`, {
        method: 'GET',
        headers: getAuthHeaders()
    });
    return handleResponse(response);
};

// ========================================
// ADMIN - BUSINESS REGISTRATION APIs
// ========================================

/**
 * Get all applications ready for portal submission (Super Admin)
 */
export const getReadyForPortalApplications = async () => {
    const response = await fetch(`${BASE_URL}/admin/business-registration/ready-for-portal`, {
        method: 'GET',
        headers: getAuthHeaders()
    });
    return handleResponse(response);
};

/**
 * Mark application as submitted to government portal (Super Admin)
 */
export const markApplicationAsSubmitted = async (submissionId, srn, notes = '') => {
    const response = await fetch(`${BASE_URL}/admin/business-registration/${submissionId}/mark-submitted`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ srn, notes })
    });
    return handleResponse(response);
};

/**
 * Update SRN for an application (Super Admin)
 */
export const updateApplicationSRN = async (submissionId, srn) => {
    const response = await fetch(`${BASE_URL}/admin/business-registration/${submissionId}/update-srn`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ srn })
    });
    return handleResponse(response);
};

/**
 * Update application status (Super Admin)
 */
export const updateApplicationStatus = async (submissionId, status) => {
    const response = await fetch(`${BASE_URL}/admin/business-registration/${submissionId}/update-status`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
    });
    return handleResponse(response);
};

/**
 * Upload certificate for completed application (Super Admin)
 */
export const uploadApplicationCertificate = async (submissionId, certificatePath) => {
    const response = await fetch(`${BASE_URL}/admin/business-registration/${submissionId}/upload-certificate`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ certificatePath })
    });
    return handleResponse(response);
};

/**
 * Get all business registration applications (Super Admin)
 */
export const getAllBusinessRegistrationApplications = async () => {
    const response = await fetch(`${BASE_URL}/admin/business-registration/all`, {
        method: 'GET',
        headers: getAuthHeaders()
    });
    return handleResponse(response);
};

/**
 * Get specific application details
 */
export const getBusinessRegistrationApplication = async (submissionId) => {
    const response = await fetch(`${BASE_URL}/admin/business-registration/${submissionId}`, {
        method: 'GET',
        headers: getAuthHeaders()
    });
    return handleResponse(response);
};

// Registration Type Constants
export const REGISTRATION_TYPES = {
    PRIVATE_LIMITED: 'PRIVATE_LIMITED_COMPANY',
    OPC: 'ONE_PERSON_COMPANY',
    LLP: 'LIMITED_LIABILITY_PARTNERSHIP',
    PARTNERSHIP: 'PARTNERSHIP_FIRM',
    SOLE_PROPRIETORSHIP: 'SOLE_PROPRIETORSHIP',
    SECTION_8: 'SECTION_8_NGO_COMPANY',
    NIDHI: 'NIDHI_COMPANY',
    PRODUCER: 'PRODUCER_COMPANY',
    PUBLIC_LIMITED: 'PUBLIC_LIMITED_COMPANY'
};

// Status Constants
export const APPLICATION_STATUS = {
    SUBMITTED: 'SUBMITTED',
    AUTOMATION_STARTED: 'AUTOMATION_STARTED',
    DOCUMENTS_VERIFIED: 'DOCUMENTS_VERIFIED',
    DOCUMENT_GENERATION: 'DOCUMENT_GENERATION',
    FORMS_FILLED: 'FORMS_FILLED',
    DSC_READY: 'DSC_READY',
    DIN_READY: 'DIN_READY',
    PACKAGE_CREATED: 'PACKAGE_CREATED',
    READY_FOR_PORTAL_SUBMISSION: 'READY_FOR_PORTAL_SUBMISSION',
    GOV_SUBMITTED: 'GOV_SUBMITTED',
    PROCESSING: 'PROCESSING',
    COMPLETED: 'COMPLETED',
    AUTOMATION_FAILED: 'AUTOMATION_FAILED'
};
