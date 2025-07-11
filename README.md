# 🎨 BG Removal: AI-Powered Background Removal Web App

A full-stack application that enables users to remove backgrounds from images using AI APIs. Built with modern React frontend, Node.js/Express backend with MongoDB, Clerk authentication, Razorpay payment integration, and serverless deployment on Vercel.

![Demo](https://img.shields.io/badge/Demo-Live-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)
![React](https://img.shields.io/badge/React-18-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)

---

## ✨ Project Features

* **🔐 User Authentication** via Clerk (sign-in/sign-up)
* **💳 Credit Management System**:
    * Default of 5 credits per user
    * Deducts a credit per background removal operation
    * Real-time credit balance display
    * Visual warnings when credits are low
    * Automatic redirection to purchase page when credits are zero
* **💰 Payment Integration** via Razorpay:
    * Multiple credit packages (Basic: 100 credits, Advanced: 500 credits, Business: 5000 credits)
    * Secure payment processing with Razorpay Gateway
    * Automatic credit top-up after successful payment
    * Transaction history tracking
    * Payment verification and webhook handling
* **🤖 AI Background Removal** via ClipDrop API
* **🔒 Secure Routes** with JWT + Clerk backend SDK
* **🎨 Modern UI/UX** with responsive design and smooth animations
* **☁️ Serverless Deployment** powered by Vercel
* **📊 MongoDB Database** for storing users, credits, and transactions

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, Tailwind CSS, Clerk |
| Backend | Node.js, Express, Mongoose |
| Authentication | Clerk API (JWT + Webhooks) |
| Payment Gateway | Razorpay |
| AI API | ClipDrop API |
| Database | MongoDB Atlas |
| Deployment | Vercel (serverless functions) |

---

## 🚀 Setup & Installation

### 1. Clone the repository

```bash
git clone https://github.com/karanmittal09/BG-Removal.git
cd BG-Removal
```

### 2. Backend Setup

```bash
cd server
npm install
```

#### Create `.env` in `/server`:

```dotenv
MONGODB_URI=<your-mongo-uri>
CLIPDROP_API=<your-clipdrop-api-key>
CLERK_WEBHOOK_SECRET=<your-clerk-webhook-secret>
RAZORPAY_KEY_ID=<your-razorpay-key-id>
RAZORPAY_KEY_SECRET=<your-razorpay-key-secret>
```

### 3. Frontend Setup

```bash
cd client
npm install
```

#### Create `.env` in `/client`:

```dotenv
VITE_BACKEND_URL=http://localhost:4000
VITE_CLERK_PUBLISHABLE_KEY=<your-clerk-pk>
VITE_RAZORPAY_KEY_ID=<your-razorpay-key-id>
```

---

## 🔧 API Keys Setup

### Clerk Setup
1. Create account at [Clerk.dev](https://clerk.dev)
2. Create new application
3. Get publishable key and webhook secret
4. Configure webhook endpoint: `/api/user/webhooks`

### ClipDrop API Setup
1. Sign up at [ClipDrop](https://clipdrop.co/apis)
2. Get API key from dashboard
3. Add to environment variables

### Razorpay Setup
1. Create account at [Razorpay](https://razorpay.com)
2. Get Key ID and Key Secret from dashboard
3. Configure webhook endpoint: `/api/user/verify-razor`
4. Add payment methods and test credentials

### MongoDB Setup
1. Create cluster at [MongoDB Atlas](https://mongodb.com/atlas)
2. Get connection string
3. Add to environment variables

---

## 💻 Development

### Run Frontend + Backend Locally:

Open two terminals:

**Backend:**
```bash
cd server
npm run dev  # uses nodemon
```

**Frontend:**
```bash
cd client
npm run dev
```

Visit `http://localhost:5173` to test the app.

### Use Ngrok for Webhook Testing (Optional)

```bash
npx ngrok http 4000
```

Then update the Clerk and Razorpay webhook URLs to:
```
https://<your-ngrok-id>.ngrok.io/api/user/webhooks
https://<your-ngrok-id>.ngrok.io/api/user/verify-razor
```

---

## 🚀 Production Deployment (Vercel)

### 1. Install CLI & deploy

```bash
npm install -g vercel
cd server
vercel link
vercel --prod
```

### 2. Set environment variables in Vercel dashboard:

* `MONGODB_URI`
* `CLIPDROP_API`
* `CLERK_WEBHOOK_SECRET`
* `RAZORPAY_KEY_ID`
* `RAZORPAY_KEY_SECRET`

### 3. Frontend deployment

Deploy the client separately or use Vercel's monorepo feature.

---

## 📱 Usage

1. **Sign-up** or **Sign-in** through Clerk on the frontend
2. You start with **5 free credits**
3. **Upload an image** and remove the background
4. See updated credit balance on **result page** and **navbar**
5. When credits run low, **purchase more** via Razorpay
6. Backend securely processes payments and updates credits
7. Download your processed images with transparent backgrounds

---

## 💳 Payment Plans

| Plan | Credits | Price | Best For |
|------|---------|-------|----------|
| Basic | 100 | ₹199 | Personal use |
| Advanced | 500 | ₹499 | Small business |
| Business | 5000 | ₹1999 | Enterprise |

---

## 📊 Database Schema Overview

### **UserModel**
```javascript
{
    clerkId: String,
    email: String,
    firstName: String,
    lastName: String,
    photo: String,
    creditBalance: Number // default: 5
}
```

### **TransactionModel**
```javascript
{
    clerkId: String,
    plan: String,
    amount: Number,
    credits: Number,
    date: Number,
    payment: Boolean
}
```

---

## 📁 Project Structure

```
/BG-Removal
├── client/                     # React + Clerk (frontend)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── assets/
└── server/                     # Express API + MongoDB (backend)
    ├── controllers/
    ├── middlewares/
    ├── models/
    ├── routes/
    ├── server.js              # Express app (exported for Vercel)
    └── vercel.json            # Serverless routing config
```

---

## 💰 Razorpay Integration Details

### Payment Flow
1. User selects a credit package on `/buy` page
2. Frontend initiates payment with Razorpay
3. Razorpay handles secure payment processing
4. Payment success triggers verification endpoint
5. Backend verifies payment and updates user credits
6. User redirected to home page with updated credits

### Security Features
- Payment verification using Razorpay signatures
- Secure webhook handling
- Transaction logging in MongoDB
- Credit balance validation
- Error handling for failed payments

### Test Mode
Use Razorpay test credentials for development:
- Test Card: 4111 1111 1111 1111
- Any future expiry date
- Any CVV

---

## 🔄 API Endpoints

### User Routes
- `POST /api/user/webhooks` - Clerk user creation webhook
- `GET /api/user/credits` - Get user credit balance
- `POST /api/user/pay-razor` - Initialize Razorpay payment
- `POST /api/user/verify-razor` - Verify payment and update credits

### Image Routes
- `POST /api/image/remove-bg` - Remove background from image

---

## 🎯 Key Features Implemented

### Credit System
- ✅ Real-time credit tracking
- ✅ Visual credit warnings
- ✅ Automatic redirection when credits are zero
- ✅ Credit deduction on successful image processing

### Payment System
- ✅ Multiple payment plans
- ✅ Secure Razorpay integration
- ✅ Payment verification
- ✅ Automatic credit top-up
- ✅ Transaction history

### UI/UX Enhancements
- ✅ Modern gradient design
- ✅ Responsive layout
- ✅ Smooth animations
- ✅ Interactive components
- ✅ Professional styling

---

## 🚨 Important Notes

1. **Environment Variables**: Ensure all required environment variables are set
2. **Webhook URLs**: Configure correct webhook URLs in Clerk and Razorpay dashboards
3. **CORS**: Backend configured for cross-origin requests
4. **File Upload**: Uses multer for handling image uploads
5. **Error Handling**: Comprehensive error handling throughout the application

---

## 🤝 Contributing

Pull requests and feedback are welcome!
Before adding features, please open an issue to discuss scope.

---

## 📄 License

[MIT](LICENSE) - Feel free to use this for your own projects!

---

## ❓ Questions?

Reach out via GitHub Discussions or open an issue.

---

> ⭐ **Star this repo** if you found it helpful!
