# To run the project, follow these steps:

1.  Clone the repository with the API.

    ```
    git@github.com:fra1m/EcapzTest.git
    ```

2.  Set up and create a .env file for testing with the necessary variables.

    ```
    API_PORT=3000
    API_HOST=http://localhost:
    Project=
    Secret=
    Domein=
    URL=
    Email=
    DnsName=
    ```

# Test with Postman

1. Open Postman.

2. Paste the link from the logger (or use the one below) and use CRUD operations.
   ```
   http://localhost:3000
   ```

# REST API - CRUD операции

- `POST http://localhost:3000/token` – Creates credit card token is valid for 20 minutes.
- `POST http://localhost:3000/status` – Process a payment.
