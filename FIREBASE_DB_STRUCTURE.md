# Firestore Database Structure

This document describes the current structure of the Firestore database as of the latest analysis.

---

## Collections (Tables)

### 1. `candidates`
- **Description:** Stores information about individual candidates/employees.
- **Sample Fields:**
  - `DateOfJoining`: string (e.g., "2024-07-01")
  - `candidateName`: string (e.g., "Sugat Sarwade")
  - `department`: string (e.g., "Frontend Development")
  - `designation`: string (e.g., "Frontend Developer")
  - `employeeCode`: string (e.g., "556859")
  - `inhandSalary`: string (e.g., "600000")
  - `lastWorkingDate`: string (e.g., "2025-06-30")
  - `location`: string (address)
  - `packageLPA`: string or number (e.g., "8")
  - `panNo`: string (e.g., "ABCDE1234F")

---

### 2. `companies`
- **Description:** Stores information about companies.
- **Sample Fields:**
  - `address`: string (e.g., company address)
  - `cin`: string (e.g., company identification number)
  - `color`: string (e.g., color code)
  - `email`: string (e.g., company email)
  - `hrMobile`: string (e.g., HR mobile number)
  - `hrName`: string (e.g., HR name)
  - `logo`: string (base64 image or URL)
  - `mobile`: string (company mobile number)
  - `name`: string (company name)
  - `serverColor`: string (e.g., "red")
  - `website`: string (company website URL)

---

### 3. `bankStatements`
- **Description:** Stores individual bank statement records for users.
- **Sample Fields:**
  - `name`: string (e.g., "Sugat Bhimraj Sarwade")
  - `customerId`: string (e.g., "37875637")
  - `customerType`: string (e.g., "Individual - Full KYC")
  - `address`: string (e.g., full address)
  - `statementDate`: timestamp or string (e.g., "2025-05-02")
  - `statementPeriod`: map (e.g., `{ from: "2025-04-01", to: "2025-04-30" }`)
  - `accountNumber`: string (e.g., "2401254461733954")
  - `accountType`: string (e.g., "AU Salary Account-Value")
  - `branch`: string (e.g., "Pune East Street Camp")
  - `ifsc`: string (e.g., "AUBL0002544")
  - `nominee`: string (e.g., "Not Registered")

- **Sample Document:**
```json
{
  "name": "Sugat Bhimraj Sarwade",
  "customerId": "37875123",
  "customerType": "Individual - Full KYC",
  "address": "At.po.paranda Ta.paranda Osmanabad, Khandoba Chouk Paranda, Paranda - 413502, Maharashtra - India",
  "statementDate": "2025-05-02",
  "statementPeriod": {
    "from": "2025-04-01",
    "to": "2025-04-30"
  },
  "accountNumber": "2401254461733123",
  "accountType": "AU Salary Account-Value",
  "branch": "Pune East Street Camp",
  "ifsc": "AUBL0002544",
  "nominee": "Not Registered"
}
```

---

## Notes
- There are currently **only two collections**: `candidates` and `companies`.
- Each document in a collection represents a single record (candidate or company).
- Fields may vary slightly between documents, but the above are the most common fields observed.

---

_Last updated: [auto-generated]_ 