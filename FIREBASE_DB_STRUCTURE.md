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

## Notes
- There are currently **only two collections**: `candidates` and `companies`.
- Each document in a collection represents a single record (candidate or company).
- Fields may vary slightly between documents, but the above are the most common fields observed.

---

_Last updated: [auto-generated]_ 