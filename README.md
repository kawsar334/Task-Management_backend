
# Online Tutor Booking Platform - Backend

This is the **backend** repository for the Online Tutor Booking Platform. It handles the server-side logic, database operations, and API endpoints to support the frontend functionalities. The backend is built using **Node.js** and **Express.js**, with **MongoDB** as the database.


## Links
**Backend Links**
- [backend github link](https://github.com/kawsar334/server-Language-Exchange---Online-Tutor-Booking-Platform)
- [api Link on vercel](https://languageexchange-one.vercel.app/) +/endpoind 


**frontend Links**

- [Live Link1](https://gorgeous-shortbread-b2c9fe.netlify.app/)

- [frontend github link](https://github.com/kawsar334/client_Language-Exchange_Online-Tutor-Booking)


## **Features**
- 🔒 **Authentication System**:
  - JWT-based authentication for secure access
- 📦 **API Endpoints**:
  - CRUD operations for users, tutors, and bookings
- 🔍 **Search Functionality** for filtering tutors by language
- 📊 **Data Management**:
  - Booked tutors, reviews, and tutorials
- 🌐 Secure and production-ready server with proper error handling
- 🔄 **Pagination** for tutors on the Find Tutors page

---


## **Technologies Used**
- **Node.js** for server-side scripting
- **Express.js** for API and routing
- **MongoDB** with **Mongoose** for database management
- **JWT Authentication** for secure private routes
- **dotenv** for environment variable management
- **CORS** for handling cross-origin requests



## **API Endpoints**

### **Authentication**
- **Register a User**  
  `POST /register`  
  Registers a new user in the system.

- **Login**  
  `POST /users`  
  Authenticates a user and provides a JWT token.

- **Logout**  
  `POST /logout`  
  Logs out the user and clears the authentication token from cookies.

- **JWT Authentication**  
  `GET /jwt`  
  Verifies the JWT token from cookies to authenticate the user.

---

### **User Management**
- **Get All Users**  
  `GET /users`  
  Retrieves a list of all registered users.

- **Get User Details**  
  `GET /user/find/:id`  
  Fetches details of a specific user using their ID.

- **Update User**  
  `PATCH /users`  
  Updates a user's details in the database.

- **Delete User**  
  `DELETE /users/:id`  
  Deletes a user by their ID.

---

### **Tutorial Management**
- **Add a Tutorial**  
  `POST /addtutorial`  
  Adds a new tutorial to the system.

- **Get All Tutorials**  
  `GET /products`  
  Retrieves all available tutorials.

- **Get All Tutorials (Alternative)**  
  `GET /allproducts`  
  Retrieves all tutorials (alternative endpoint).

- **Get My Tutorials**  
  `GET /mytutorials/:email`  
  Retrieves the list of tutorials created by the logged-in user (JWT-protected).

- **Get a Single Tutorial**  
  `GET /tutorial/:tutorialId`  
  Fetches details of a single tutorial using its ID.

- **Get Tutor by Email**  
  `GET /tutor/:email`  
  Retrieves tutor details using their email address.

- **Find Tutorials by Language**  
  `GET /findLanguage/`  
  Searches for tutorials filtered by a specific language.

- **Update a Tutorial**  
  `PUT /updateTutorial/:id`  
  Updates a specific tutorial using its ID.

- **Delete a Tutorial**  
  `DELETE /tutorial/:id`  
  Deletes a tutorial using its ID.

---

### **Booking Management**
- **Add a Booking**  
  `POST /addbooked`  
  Creates a booking for a tutorial.

- **Get My Booked Tutorials**  
  `GET /mybooked/:email`  
  Retrieves a list of tutorials booked by the logged-in user.

- **Update Tutor Review**  
  `PATCH /updatedReview/:tutorId`  
  Updates a review for a specific tutor.

---

### **Reviews**
- **Create a Review**  
  `POST /reviews`  
  Adds a new review for a tutorial.

- **Get All Reviews**  
  `GET /reviews`  
  Fetches all reviews available in the system.

- **Get Review by ID**  
  `GET /reviews/:id`  
  Retrieves details of a review using its ID.

- **Update a Review**  
  `PUT /reviews/:id`  
  Updates an existing review by its ID.

- **Delete a Review**  
  `DELETE /reviews/:id`  
  Deletes a review using its ID.

---

### **Statistics**
- **Get Stats**  
  `GET /stats`  
  Retrieves overall statistics about tutorials, bookings, or users.

---

### **Root Endpoint**
- **Test API Status**  
  `GET /`  
  Confirms the API is running successfully.

