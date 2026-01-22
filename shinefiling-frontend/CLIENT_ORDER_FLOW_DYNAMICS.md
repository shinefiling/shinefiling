# Client-Side Service Order Flow Documentation

This document outlines the step-by-step process of how a client selects, applies for, and completes an order for a service on the ShineFiling platform.

## Phase 1: Service Discovery
Users can find services through three main entry points:
1.  **Navbar Megamenus**: Hovering over categories (Business Reg, Tax, etc.) shows a list of services.
2.  **Navbar Search**: Real-time search that filters all 103 services.
3.  **Home Page Hero/Sections**: Promoting popular services like GST or Company Registration.

## Phase 2: Plan Selection (Landing Page)
Each service has a dedicated landing page (e.g., `/services/private-limited-company`).
- Users see **three standardized pricing cards** (Startup, Growth, Enterprise).
- Each card has a "Get Started" or "Buy Now" button.
- **Dynamic Logic**: Clicking a button triggers a redirect:
  `window.location.href = "/services/[service-slug]/register?plan=[selected-plan]"`

## Phase 3: The Registration Funnel
The core business logic happens inside specific registration components (e.g., `PrivateLimitedRegistration.jsx`).

### Step 1: Authentication Guard
- The system checks if the user is logged in (`AuthContext`).
- If not logged in, they are redirected to `/login` but the "Target URL" (with the plan param) is saved in the navigation state, so they return to the exact same step after logging in.

### Step 2: Multi-Step Form Execution
Orders are processed in a 5-step interactive wizard:

1.  **Service Details**: Collecting core data (Company names, business activity, address, capital).
2.  **Entity Specifics**: Collecting details about Directors, Partners, or Applicants (Name, PAN, Aadhaar, etc.).
3.  **Document Management**:
    - Uses the `uploadFile` API to send files to the backend immediately.
    - Tracks file metadata (ID, Filename, URL) in the component state.
4.  **Application Review**: A summary view showing the selected plan, price, and primary data entered.
5.  **Payment & Submission**:
    - Displays a "Pay Now" simulation.
    - On clicking "Submit", it calls the specific API service (e.g., `submitPrivateLimitedRegistration`).
    - The payload includes `submissionId`, `formData`, `documents`, and `plan`.

## Phase 4: Order Completion
1.  **Success State**: The UI switches to a success screen showing the Order ID and "Next Steps".
2.  **Dashboard Integration**: The order is now visible in the Client's `DashboardPage.jsx` under "Active Services".
3.  **Admin Notify**: The order appears in the Master Admin's "Operations & Finance" -> "Orders Management" section for processing.

---

## Technical Maintenance
If you need to change the order flow:
- **To change prices/features**: View the `plans` object inside the specific `Registration.jsx` file.
- **To add a field**: Update the `formData` state and the `renderStepContent` switch case.
- **To add a document**: Update the `Document Management` array in Step 3 of the component.
