# bank-api-nodejs

## User Object

| Property | Type     | Description                                                  |
| -------- | -------- | ------------------------------------------------------------ |
| id   | `String` | Unique id  |
| name     | `String` | User name(should also be unique to prevent duplicates |
| isActive  | `Boolean` |  Active or Inactive Account |
| cash     | `Number` | Default 0  |
| credit   | `Number` | Default 0  |

## Create User

Creates a new user with the given name and id returns the user name and id.

-   **URL**

    /Users/

-   **Method:**

    `POST`

### Parameters - `Request Body Parameters`

| Name   | Type     | Description                                    |
| ------ | -------- | ---------------------------------------------- |
| id     | `String` |                                                |
| name   | `String` |                                                |
| isActive | `Boolean` | Optional. Initial isActive value (Default false)  |
| cash   | `Number` | Optional. Initial cash value (Default 0)        |
| credit | `Number` | Optional. Initial credit value (Default 0)        |

## Update user(credit)

Updates single user (active account) and returns the new value of credit.

-   **URL**

    /Users/credit/:id/:creditvalue

-   **Method:**

    `PUT`

## Update user(Deposit cash to a user)

Updates single user (active account) and returns the new value of cash.

-   **URL**

    /Users/deposit/:id/:amount

-   **Method:**

    `PUT`

## Update user(Withdraw money from the user account)

Updates single user (active account) and returns the new value of cash or the new value of credit.

-   **URL**

    /Users/withdraw/:id/:amount

-   **Method:**

    `PUT`

## Transfer money

Gets the ids of the users to transfer money to/from (active account) and the amount to transfer.
Returns the cash value of received user.

-   **URL**

    /Users/transfer/:idFrom/:idTo/:amount

-   **Method:**

    `PUT`

## **Show User**

Returns json data about a single user.

-   **URL**

    /Users/:id

-   **Method:**

    `GET`

-   **URL Params**

    **Required:**

    `id=[integer]`

-   **Data Params**

    None

-   **Success Response:**

    -   **Code:** 200 <br />
        **Content:** `{ id : ..., name : "...", cash : ..., credit : ... }`

-   **Error Response:**

    -   **Code:** 400 <br />
        **Content:** `{ error : "User does not exist, check the ID you entered" }`

## **Show All Users**

Returns json data about all users.

-   **URL**

    /Users

-   **Method:**

    `GET`

-   **URL Params**

    None

-   **Data Params**

    None

-   **Success Response:**

    -   **Code:** 200 <br />
        **Content:** `{ id : ..., name : "...", cash : ..., credit : ... } { id : ..., name : "...", cash : ..., credit : ... }`...

## Filter user

Fetch the users that are active and have a specified amount of cash

-   **URL**

    /Users/filter/:fromAmount/:toAmount

-   **Method:**

    `GET`

## Active/Inactive

Activation or Inactivation of the user account

-   **URL**

    /Users/:id/active **OR** /Users/:id/inactive

-   **Method:**

    `PUT`
