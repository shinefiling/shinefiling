# CRM & Dashboard Implementation Plan

## Overview
This plan outlines the implementation of a comprehensive CRM and Dashboard system for ShineFiling. The system will support multiple roles (Client, Super Admin, Admin, Agent, CA, Employee) with specific workflows for service request management, payment binding, work assignment, and communication.

## 1. User Roles & Permissions
We will update the backend `User` entity to support the following distinct roles:
- **CLIENT**: End user requesting services.
- **SUPER_ADMIN**: Top-level admin, manages all requests, binds amounts, approves final work.
- **ADMIN**: Subordinate to Super Admin (specific permissions to be defined, likely read-only or limited management).
- **AGENT**: Referral partner, earns commission.
- **CA (Chartered Accountant)**: Professional partner, verifies amounts, manages employees, executes work.
- **EMPLOYEE**: Works under CA, processes documents.

## 2. Workflows & Dashboard Logic

### 2.1. Client Dashboard
- **Features**:
    - service selection catalog.
    - Document upload interface.
    - Payment interface (view bound amount, pay).
    - Status tracking (Requested -> Processing -> Completed).
    - Communication channel (Chat/Call with CA/Support).

### 2.2. Super Admin Dashboard
- **Workflow**:
    1. Receives Service Request from Client.
    2. **Bind Amount**: Manually fixes/binds the service fee for the specific request.
    3. **Assign Work**: specific work details and sends to CA.
    4. **Final Approval**: Reviews completed work from CA before releasing to Client.
- **Changes**:
    - Remove existing automation triggers (as requested).
    - Add "Bind Amount" & "Assign to CA" interface.
    - Add "Employee" & "CA" management section (CRUD).

### 2.3. CA Dashboard
- **Workflow**:
    1. Receives assigned work from Super Admin.
    2. **Validation**: Checks if the bound amount is correct.
        - If *Correct*: Accepts/Binds work.
        - If *Incorrect*: Rejects/Communicates with Super Admin.
    3. **Work Management**:
        - Can perform work directly.
        - OR Assign work to an **Employee**.
    4. **Employee Management**: Section to add/manage Employees.
    5. **Communication**: Chat/Call with Client (if approved by Super Admin).

### 2.4. Employee Dashboard
- **Workflow**:
    1. Receives tasks assigned by CA.
    2. Processes documents/filings.
    3. Submits work back to CA for review.
- **Features**:
    - Task list.
    - Document view/upload.
    - Status update.

### 2.5. Agent Dashboard
- **Features**:
    - track referred clients.
    - **Commission System**: View commission earned per service/client.
    - Withdrawal request/status.

### 2.6. Admin Dashboard
- **Features**:
    - View-only access or limited management (as "Super Admin ku killa").

## 3. Communication System
- Implement a real-time Chat/Call system.
- **Logic**:
    - Client <-> Support/CA.
    - CA <-> Super Admin.
    - CA <-> Employee.
- **UI**: Embed `ChatWidget` with role-based rooms.

## 4. Technical Implementation Steps

### Phase 1: Backend Updates (Java/Spring Boot)
1.  **Update User Model**: Add `CA`, `EMPLOYEE` to `Role` enum/string.
2.  **Service Request Entity**: Add fields for `boundAmount`, `assignedCaId`, `assignedEmployeeId`, `workStatus`, `adminComments`.
3.  **Controllers**:
    - `SuperAdminController`: Endpoints to list requests, bind amount, assign CA.
    - `CAController`: Endpoints to view requests, accept/reject, assign Employee, add Employees.
    - `EmployeeController`: Endpoints to view tasks, update status.
    - `AgentController`: Logic for commission calculation.

### Phase 2: Frontend Dashboard Creation (React)
1.  **Roles Setup**: Update `AuthContext` and Routing to handle new roles.
2.  **Super Admin Dashboard**:
    - Remove automation widgets.
    - Create "Service Request Manager" table.
    - Create "Amount Binding" modal.
3.  **CA Dashboard**:
    - Create "Incoming Requests" view.
    - Create "Employee Management" section (Add/List Employees).
    - Create "Work Allocation" modal.
4.  **Employee Dashboard**:
    - Simple task list view.
5.  **Client Dashboard Updates**:
    - Show "Pending Payment" only after Super Admin binds amount.
6.  **Agent Dashboard Updates**:
    - Ensure commission logic reflects real-time data.

### Phase 3: Communication & Polish
1.  **Chat Integration**: Ensure specific channels are created upon work assignment.
2.  **Testing**: Verify the full flow: Client Req -> SA Bind -> CA Assign -> Emp Work -> CA Review -> SA Approve -> Client Done.

## 5. Approval
Waiting for user approval to proceed with Phase 1.
