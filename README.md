# 🛒 TechNova

**TechNova** is a full-stack e-commerce web application built using the **MERN stack** (MongoDB, Express.js, React, Node.js). It showcases electronics like smartwatches, mobiles, water purifiers, and air conditioners with a modern UI, product filtering, cart functionality, and responsive design.

> 🟢 Live Demo: [https://technova-web.onrender.com](https://technova-web.onrender.com)

---

## ✨ Features

### ✅ User-Facing
- 🔎 Category-wise and brand-wise filtering
- 🎯 Sorting by price & rating
- 🔁 Infinite scroll (pagination)
- 🛒 Add to cart / Buy now
- 📱 Responsive product detail view
- ⭐ Customer reviews (local, extendable)
- 🔗 External product links (e.g. Flipkart)

### 🧠 Backend
- 🔧 REST APIs for products & users
- 🎯 Filter, sort, paginate products
- 🆕 New arrivals & top-rated by category
- 🧵 Related product suggestions
- 🔒 User info fetch by ID (JWT-ready)
- 🌐 CORS configured for deployment

---

## 🛠 Tech Stack

| Layer      | Tech Used                       |
|------------|---------------------------------|
| Frontend   | React + Vite + Tailwind CSS     |
| Backend    | Node.js + Express + MongoDB     |
| Database   | MongoDB with Mongoose           |
| Animations | Framer Motion                   |
| Hosting    | Render (Frontend + Backend)     |

---

## 🚀 Deployment

### 🌍 Hosted Frontend
🔗 [`https://technova-web.onrender.com`](https://technova-web.onrender.com)

### 🌐 Backend API Base
🔗 `https://technova-520v.onrender.com`

Ensure this matches your backend's Render deployment.

---

## 🧪 Environment Variables

### 🔧 `.env` (Backend)

PORT=5000
MONGO_URI=your_mongo_connection_string
CLIENT_URL=https://technova-web.onrender.com


### 🌐 `.env.production` (Frontend)

In `client/.env.production`:

- VITE_API_URL=https://technova-520v.onrender.com
- VITE_USER_API_URL=https://technova-520v.onrender.com
- VITE_PRODUCT_API_URL=https://technova-520v.onrender.com
- VITE_PRODUCT_IMAGE_BASE_URL=https://technova-520v.onrender.com


> Ensure images (like `/water/xyz.jpg`) are publicly accessible from backend with `express.static('public')` setup.

---

## 🧾 Usage

### 🖥️ Local Setup

#### 1. Clone the Repo

```bash
git clone https://github.com/your-username/technova.git
cd technova
```
### 2. Start Backend

```bash
cd server
npm install
npm run dev
```

### 3. Start Frontend

```bash
cd client
npm install
npm run dev
```

🙋‍♂️ Author
---
Made by [Aaradhana Parmar] 💻

---
📄 License
Licensed under the MIT License.





