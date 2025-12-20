# Private Limited Company Registration - Workflow Guide

This document details the complete end-to-end workflow for the Private Limited Company Registration service, covering the Customer's journey and the Admin's operational steps.

---

## 🚀 Phase 1: Customer Journey (Client Side)
*The user interacts with the website to initiate the request.*

1.  **Plan Selection**
    *   User visits the **Private Limited Registration** page.
    *   Selects a plan:
        *   **Startup (₹6,999):** Basic Incorporation.
        *   **Growth (₹14,999):** Adds GST & MSME (Trigger for Rent Agreement).
        *   **Enterprise (₹24,999):** Adds Trademark (Trigger for Brand Logo).

2.  **Data Entry**
    *   **Step 1:** Account Creation/Login.
    *   **Step 2:** **Company Details** (2 Proposed Names, Activity, Capital, Address).
    *   **Step 3:** **Director Details** (Name, Email, Mobile, PAN, Aadhaar).
    *   *Validation:* The system strictly checks PAN (e.g., `ABCDE1234F`), Aadhaar (12 digits), and Mobile (10 digits).

3.  **Smart Document Upload**
    *   The system dynamically lists required documents based on the **Plan**:
        *   *All Plans:* PAN, Aadhaar, Photo, Utility Bill.
        *   *Growth/Enterprise:* Adds **Rent Agreement** (required for GST).
        *   *Enterprise:* Adds **Brand Logo** (required for Trademark).

4.  **Payment & Submission**
    *   User completes payment via Razorpay/PhonePe.
    *   **Order Status:** Updates to `PAID`.
    *   User is redirected to their dashboard to track progress.

---

## 🛠️ Phase 2: Admin Verification (System Side)
*The Super Admin manages the order from the "Orders Management" Dashboard.*

1.  **Order Reception**
    *   The new order appears in the **Master Dashboard** list.
    *   Clicking "Details" opens the dedicated **Private Limited Workflow Panel**.

2.  **Tab 1: Company Details**
    *   Admin reviews consolidated info: Proposed Names, Director contacts, and Capital info.

3.  **Tab 2: Documents & Verification**
    *   Admin sees all uploaded files.
    *   **Action:** Can click specific files to view/download.
    *   **Action:** Can "Accept" or "Reject" individual docs (triggers email to client - *future scope*).
    *   **Milestone:** Clicking the blue **"Verify Verify All Docs"** button locks this stage and moves status to `DOCUMENTS_VERIFIED`.

---

## 🏛️ Phase 3: Government Filing (External)
*Admin interacts with the MCA (Ministry of Corporate Affairs) Portal.*

1.  **Preparation**
    *   Admin uses the "System Generated Forms" section (mock) to download draft SPICe+ Part A/B, eMOA, and eAOA data.

2.  **External Filing**
    *   Admin logs into the **MCA Official Portal** and files the actual application.
    *   MCA provides a **Service Request Number (SRN)**.

3.  **SRN Entry**
    *   Go to **Tab 3: Government Filing**.
    *   Input the SRN (e.g., `SRN99887766`) into the system.
    *   Click **"Mark Submitted"**.
    *   **Order Status:** Updates to `MCA_SUBMITTED`. The client sees "Application Submitted to Govt" on their timeline.

---

## ✅ Phase 4: Approval & Delivery
*Closing the order upon Government Approval.*

1.  **Outcome Wait Time**
    *   Wait for MCA approval (typically 3-7 days).

2.  **Tab 4: Final Delivery**
    *   Once approved, Admin receives the **Certificate of Incorporation (COI)**.
    *   **Plan-Based Checklist:** The system displays a checklist of *what else* needs to be delivered based on the initial plan:
        *   *Standard:* Deliver PAN, TAN, DSC, DIN.
        *   *Growth:* System reminds to process **GST** & **Udyam** now.
        *   *Enterprise:* System reminds to file **Trademark** & **INC-20A**.

3.  **Completion**
    *   Admin uploads the **COI PDF**.
    *   Click **"Upload COI & Complete"**.
    *   **Final Status:** Order marked `COMPLETED`.
    *   Client can download the Certificate from their User Dashboard.

---

## ⚡ Summary of Status Transitions
1.  `DETAILS_SUBMITTED` (Client entering data)
2.  `DOCS_UPLOADED` (Client uploaded files)
3.  `PAID` (Payment successful - **Admin Action Start**)
4.  `DOCUMENTS_VERIFIED` (Admin approved docs)
5.  `MCA_SUBMITTED` (Filed with Govt, SRN generated)
6.  `COMPLETED` (Incorporation Certificate Uploaded)
