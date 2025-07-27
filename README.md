# 🛍 BusyBuy - E-commerce Web App

BusyBuy is a fully responsive e-commerce web application built with **React** and **Firebase Firestore**. It allows users to register, browse products, add them to cart, filter by category/price, place orders, and view their order history.

---

##  Features

###  Authentication
- ✅ **Register Page** – New users can register using Firebase Auth.
- ✅ **Login Page** – Existing users can securely log in.

###  Home Page
- ✅ Displays a list of available products.
- ✅ Includes a **search bar** to filter products by name.
- ✅ A **sidebar** to filter products by category and price range (combined filtering).

### 🛒 Cart Page
- ✅ Shows all products added to cart.
- ✅ Users can **increase or decrease quantity**.
- ✅ Remove items from the cart.

###  Orders Page
- ✅ Shows list of **purchased products**.
- ✅ Displays **order date** and quantity.

###  Product Card Component
- ✅ Displays product **image, title, price**.
- ✅ Add/Remove from cart.
- ✅ Shows **+/- buttons** only if rendered inside Cart Page.

###  Filter & Search
-  Sidebar filters by **price** and **category**.
-  Works **along with** the search functionality.

###  UX Enhancements
-  Conditional rendering for **loading** and **no data** using `react-spinners`.
-  Async feedback via **toast notifications** using `react-toastify`.

---

##  Tech Stack

| Tech         | Purpose                           |
|--------------|-----------------------------------|
| **React**    | Frontend library                  |
| **Firebase** | Auth & Firestore DB               |
| **React Router** | Page routing                  |
| **React Toastify** | Toast notifications         |
| **React Spinners** | Loader UI                   |
| **SCSS / CSS Modules** | Styling                 |
