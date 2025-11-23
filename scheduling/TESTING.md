# Testing Overview

This document provides an overview of the test files and the components/functions they test.

## Test Files and Coverage

### AuthContext.test.tsx
**Component:** AuthContext Provider
**Coverage:** Authentication flow, user state management, Firestore integration, loading states, and error handling. Tests redirect logic, user data loading, and cleanup operations.

### AvailableSchedule.test.tsx
**Component:** AvailableSchedule
**Coverage:** Class listing display, empty state handling, class information rendering, and "Join Class" button functionality. Tests action callbacks with correct class IDs.

### helpers.test.ts
**Functions:** Utility helpers (toTitleCase, formatSchedule)
**Coverage:** String formatting functions, date/time formatting, edge cases, and special character handling.

### idToken.test.ts
**Function:** getUidFromRequest
**Coverage:** API request authentication, Bearer token extraction, token validation, error handling, and various header format scenarios.

### Login.test.tsx
**Component:** Login
**Coverage:** User authentication UI, form validation (sign in/sign up), authentication flow, loading states, error handling for various Firebase auth errors, and tab switching functionality.

### Logout.test.tsx
**Component:** Logout
**Coverage:** Logout button rendering, Firebase sign out functionality, navigation after logout, and error handling during sign out process.

### MyClasses.test.tsx
**Component:** MyClasses
**Coverage:** Enrolled class display, class information rendering, "Cancel" button functionality, empty state handling, and action callbacks for class cancellation.

### Navbar.test.tsx
**Component:** NavigationBar
**Coverage:** Navigation UI rendering, user display name handling, membership status display, title case conversion, and navigation links functionality.

### page.test.tsx
**Component:** Main Page
**Coverage:** Integration testing for main page layout, rendering of major sections (navbar, available classes, my classes), and overall component composition.

## Running Tests
To run the tests, use the following command in your terminal:

```bash
npm test
```

## Test Report

```
------------------------|---------|----------|---------|---------|-----------------------------------------------------
File                    | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
------------------------|---------|----------|---------|---------|-----------------------------------------------------
All files               |      94 |    84.84 |      88 |      94 |
 app                    |    67.9 |    77.77 |     100 |    67.9 |
  page.tsx              |    67.9 |    77.77 |     100 |    67.9 | 25-26,29-30,42-63
 src/components         |   97.03 |    80.64 |    87.5 |   97.03 |
  AvailableSchedule.tsx |     100 |      100 |     100 |     100 |
  Login.tsx             |   95.93 |    72.72 |   77.77 |   95.93 | 103-104,109,116,124,143-147,200-201,203-204,206-207
  Logout.tsx            |     100 |      100 |     100 |     100 |
  MyClasses.tsx         |     100 |      100 |     100 |     100 |
  Navbar.tsx            |     100 |      100 |     100 |     100 |
 src/contexts           |   97.29 |    94.11 |     100 |   97.29 |
  AuthContext.tsx       |   97.29 |    94.11 |     100 |   97.29 | 41-42
 src/helpers            |     100 |      100 |     100 |     100 |
  index.ts              |     100 |      100 |     100 |     100 |
 src/lib/firebase       |   88.23 |      100 |       0 |   88.23 |
  admin.ts              |   88.23 |      100 |       0 |   88.23 | 14-15
 src/lib/server         |     100 |      100 |     100 |     100 |
  idToken.ts            |     100 |      100 |     100 |     100 |
------------------------|---------|----------|---------|---------|-----------------------------------------------------

Test Suites: 9 passed, 9 total
Tests:       70 passed, 70 total
Snapshots:   0 total
Time:        6.766 s
Ran all test suites.
```