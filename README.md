# Customer-records-keeping-api
## Backend service
   - This is a backend service allows vendors of any shop to keep records of their customers about the items they purchased. The api automatically evaluates the total price for each customer before saving.

## Functions the API(web service)
  - Allows users to save and manage their customer records.
   
### Functions of a user
    - Create an account.
    - Fetch user credentials.
    - Update/Edit his/her credentials.
    - Delete his/her account.
    - Create customer details.
    - Fetch customers records.
    - Update/Edit customer details their create.
    - Delete customer details they create.
    

### Deployment - Production Server
    - Heroku 
    - MongoDB Atlas (AWS Region)


### Technology, Tools, programming language, frameworks used:
    - Java Script
    - Node JS
    - Postman
    - MongoDB
    - Robo 3T/MongoDB Compass
    - NPM modules:
        * axios
        * bcrypt
        * express
        * jsonwebtoken
        * mongodb
        * env-cmd
        * mongoose
        * validator

# Endpoints
  #### BASE URL
    - Local development: http://localhost:<portNumber> 
            Example: http://localhost:3000
    - production: ...

  #### POST: Create account -> /v1/account/create/users
        Fields:
        email - required
        password - required
  #### POST: User login -> /v1/account/users/login
        Fields:
        email - required
        password - required
  #### GET: View user profile details -> /v1/account/users/me
  #### POST: Logout from a single device -> /v1/account/users/logout
  #### POST: Logout from all devices -> /v1/account/users/logoutAll
  #### PATCH: Update user credentials -> /v1/account/update/users/me
        Fields:
        email - required
        password - required
  #### DELETE: Delete user account -> /v1/account/users/delete/me
      - NB: Upon successful deletion of account, all customer records created by that very user will be deleted.

  #### POST: Create customer record -> /v1/records/create
        Fields:
        firstname - required
        lastname - required
        othername - not required
        email" - not required
        contact - required
        date_purchase - default
        product_name - required
        address - not required
        quantity - required
        unit_price - required
        total_price - get computed automatically (quantity * unit_price)
  #### GET: Fetch customers records you create -> /v1/records
  #### PATCH: Update a particular customer record -> /v1/records/update/{customer_id}
  #### DELETE: Remove/Delete a particular customer -> /v1/records/delete/{customer_id}




