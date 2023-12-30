# Bank API Server Documentation

## Overview

This API provides basic functionalities for managing users in a banking system. Each user has a unique ID, full name, cash amount, credit amount, and an isActive status.

## Endpoints

### 1. Get All Users

-   **Endpoint**: `GET /api/v1/bank`
-   **Description**: Retrieve a list of all users.
-   **Response**: Array of user objects.

### 1. Create User

-   **Endpoint**: `POST /api/v1/bank`
-   **Request Body**: `{ "fullName": <userFullName>,"cash": <initialCash>,"credit": <initialCredit> }`
-   **Description**: Creates new user with unique id, full name, cash and credit (default 0) and isActive.
-   **Response**: Created user object.

### 2. Get User by ID

-   **Endpoint**: `GET /api/v1/bank/:userId`
-   **Parameters**: `id` (User ID)
-   **Description**: Retrieve a user by their unique ID.
-   **Response**: User object.

### 3. Deposit to Cash

-   **Endpoint**: `PUT /api/v1/bank/deposit/:userId`
-   **Parameters**: `id` (User ID)
-   **Request Body**: `{ "amount": <depositAmount> }`
-   **Description**: Deposit money to a user's cash balance.
-   **Response**: Updated user object.

### 4. Update Credit

-   **Endpoint**: `PUT /api/v1/bank/update-credit/:userId`
-   **Parameters**: `id` (User ID)
-   **Request Body**: `{ "amount": <newCreditAmount> }`
-   **Description**: Update a user's credit balance.
-   **Response**: Updated user object.

### 5. Withdraw from Cash

-   **Endpoint**: `PUT /api/v1/bank/withdraw/:userId`
-   **Parameters**: `id` (User ID)
-   **Request Body**: `{ "amount": <withdrawAmount> }`
-   **Description**: Withdraw money from a user's cash balance. If insufficient cash, withdraw from credit.
-   **Response**: Updated user object.

### 6. Transfer Money

-   **Endpoint**: `PUT /api/v1/bank/transfer`
-   **Request Body**: `{ "senderId": <senderUserId>, "receiverId": <receiverUserId>, "amount": <transferAmount> }`
-   **Description**: Transfer money from one user to another. If insufficient cash, use credit.
-   **Response**: Updated user objects for sender and receiver.

### 7. Activate User

-   **Endpoint**: `PUT /api/v1/bank/activate/:userId`
-   **Parameters**: `id` (User ID)
-   **Description**: Activate a user.
-   **Response**: Updated user object.

### 8. Deactivate User

-   **Endpoint**: `PUT /api/v1/bank/deactivate/:userId`
-   **Parameters**: `id` (User ID)
-   **Description**: Deactivate a user.
-   **Response**: Updated user object.

### 9. Filter Active Users by Balance

-   **Endpoint**: `GET /api/v1/bank/filter-active-by-balance/:balance`
-   **Parameters**: `balance` (minimum required balance)
-   **Description**: Filter active users based on their total balance (sum of credit and cash).
-   **Response**: Array of user objects.

### 10. Filter Active Users by Cash

-   **Endpoint**: `GET /api/v1/bank/filter-active-by-cash/:cash`
-   **Parameters**: `cash` (minimum required cash)
-   **Description**: Filter active users based on their cash balance.
-   **Response**: Array of user objects.

### 11. Filter Active Users by Credit

-   **Endpoint**: `GET /api/v1/bank/filter-active-by-credit/:credit`
-   **Parameters**: `credit` (minimum required credit)
-   **Description**: Filter active users based on their credit balance.
-   **Response**: Array of user objects.

## Error Handling

All possible errors are handled using an error handler middleware. The API returns appropriate error responses with status codes and error messages.
