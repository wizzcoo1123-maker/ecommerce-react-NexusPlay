# 🎮 NexusPlay — Gaming Consoles & Hardware E-Commerce

A modern, responsive, university semester project built with **React.js + Vite**, featuring a complete shopping flow, global cart state managed via **Context API + useReducer**, **localStorage persistence**, **React Router v7** routing, and dual-layer data fetching connecting to the free **Fake Store API** with an instant local JSON gaming fallback.

---

## 🔗 Project Links
- **Live Demo (Vercel):** `[Your Live Deployment URL will be placed here]`
- **GitHub Repository:** `[Your Public GitHub Repository URL will be placed here]`

---

## 🚀 Key Features

1. **Homepage:**
   - Futuristic gaming hero banner with call-to-actions and hardware spotlight
   - Value proposition cards (Warranty, Express Shipping, Secure Checkout, 24/7 Support)
   - Interactive platform category shortcuts (Home Consoles, Handhelds, Controllers, VR & Audio)
   - Top-rated featured hardware grid with quick Add-to-Cart

2. **Catalog & Products Page (`/products`):**
   - Responsive multi-column grid with custom card hover elevations
   - Live real-time search filtering across title, description, and brand
   - Category filtering pills with URL search-param synchronization (`?category=...`)
   - Price and rating sorting (Low to High, High to Low, Highest Rated, Alphabetical)
   - **Dual Data Source Toggle:** Switch between the custom **Gaming Consoles catalog** and the live **Fake Store API**, complete with network error detection and automatic fallback

3. **Product Detail Page (`/product/:id`):**
   - High-resolution hardware image display with automatic fallback handling
   - Dynamic star rating, live stock indicators, and manufacturer tags
   - Interactive quantity selector (+ / -) with boundary capping
   - Instant visual feedback on Add to Cart with quick navigation pill
   - Dynamic "Similar Hardware" recommendations row

4. **Shopping Cart (`/cart`):**
   - Itemized product listings with thumbnails, unit prices, and subtotal per line
   - Incremental and decremental quantity buttons and trash remove action
   - Real-time cart calculations: Subtotal, 5% estimated tax, and dynamic free shipping progress meter ($150 threshold)
   - Safe LocalStorage synchronization wrapped in `try/catch`
   - Clean, friendly empty cart state

5. **Checkout & Validation (`/checkout`):**
   - Complete checkout form: Full Name, Email, Phone, Street Address, City, Postal Code
   - Interactive payment method selector (Cash on Delivery, Credit/Debit Card, PayPal)
   - Simulated credit card inputs with validation when card payment is selected
   - Comprehensive client-side validation with real-time error clearance upon typing
   - Order review sidebar reflecting cart subtotal, shipping, and tax

6. **Order Confirmation (`/order-confirmation`):**
   - Unique generated order reference number (e.g. `NX-482910`)
   - Order dispatch timestamp and customer destination summary
   - Full purchased item breakdown with payment status
   - One-click **Print Receipt** action formatted specifically for clean hard-copy printing

7. **Admin Portal & Control Center (`/admin`):**
   - **Authentication:** Dedicated login portal (`/admin/login`) with session persistence.
     - **Username:** `anasrahim111`
     - **Password:** `12344`
   - **Protected Routes:** `AdminProtectedRoute` route guard shielding administrative controls.
   - **KPI Analytics:** Real-time Gross Revenue, Order Count, Catalog Inventory SKUs, and Low Stock (<5) alerts.
   - **Product Catalog Management (Full CRUD):** Add new hardware, edit pricing/specs/stock, or delete products with immediate live synchronization to storefront.
   - **Order Management:** Inspect customer destination details, view itemized invoice breakdowns, and toggle fulfillment statuses (`Processing`, `Shipped`, `Delivered`, `Cancelled`).
   - **Factory Data Reset:** Single-click demo restoration for examiner presentation.

8. **Universal Navigation & Responsive Layout:**
   - Sticky glassmorphic navbar with active link indicators
   - Live badge counter displaying the exact total quantity of cart items
   - Mobile responsive drawer hamburger menu
   - Rich footer featuring academic course details, instructor attribution, and quick links
   - Dedicated gaming-themed **404 Not Found** page

---

## 🛠️ Tech Stack & Architecture

| Layer | Technology |
|---|---|
| **Build Tool & Bundler** | [Vite](https://vitejs.dev/) (Fast Hot Module Replacement) |
| **UI Library** | React 19 (JavaScript ES6+, JSX) |
| **Routing** | React Router DOM v7 (`BrowserRouter`, `Routes`, `Route`, `useNavigate`, `useParams`, `useSearchParams`) |
| **State Management** | Context API (`createContext`, `useContext`) + `useReducer` |
| **Persistence** | Browser `localStorage` (safely handled with `try/catch`) |
| **Styling** | Plain CSS3 with CSS Custom Properties (Design Tokens), Flexbox, CSS Grid, Media Queries (zero heavy CSS dependencies) |
| **Data Fetching** | Native Fetch API with `AbortController` timeout handling |
| **API** | Free [Fake Store API](https://fakestoreapi.com/) + Local Fallback JSON Dataset |
| **Deployment Target** | Vercel (Configured with `vercel.json` SPA rewrite rules) |

---

## 📂 Project Directory Structure

```text
├── docs/
│   ├── REPORT.md            # Comprehensive Academic Project Hard-Copy Report
│   └── VIVA_NOTES.md         # Viva Preparation Notes & 15 Common Viva Q&A
├── public/
│   └── favicon.svg           # Custom gaming controller favicon
├── src/
│   ├── assets/              # Static media assets
│   ├── components/          # Modular reusable UI components
│   │   ├── CategoryCard.jsx # Platform category card
│   │   ├── ErrorMessage.jsx # Error fallback display card
│   │   ├── Footer.jsx       # Global footer with university credits
│   │   ├── LoadingSpinner.jsx # Animated loading spinner
│   │   ├── Navbar.jsx       # Header with live cart count badge & mobile menu
│   │   ├── ProductCard.jsx  # Reusable product card with quick add
│   │   ├── RatingStars.jsx  # Fractional star rating display
│   │   └── ScrollToTop.jsx  # Auto-scroll on route transition
│   ├── context/             # Global Application State
│   │   ├── CartContext.jsx  # Cart Context Provider & useCart custom hook
│   │   └── cartReducer.js   # Pure reducer function for all cart actions
│   ├── data/
│   │   ├── fallbackProducts.json # Curated gaming consoles catalog
│   │   └── fallbackProducts.js   # Fallback module export
│   ├── hooks/
│   │   └── useProducts.js   # Custom hook for fetching and switching catalogs
│   ├── pages/               # Routed Page Views
│   │   ├── CartPage.jsx     # Full shopping cart experience
│   │   ├── CheckoutPage.jsx # Address & payment form with validation
│   │   ├── HomePage.jsx     # Hero, categories, featured gear
│   │   ├── NotFoundPage.jsx # Gaming themed 404 handler
│   │   ├── OrderConfirmationPage.jsx # Receipt & confirmation view
│   │   ├── ProductDetailPage.jsx     # Single product specs & quantity
│   │   └── ProductsPage.jsx # Catalog with search, filters, and sort
│   ├── services/
│   │   └── api.js           # API fetch layer with timeout & local fallback
│   ├── styles/              # Plain CSS files
│   │   ├── cart.css
│   │   ├── checkout.css
│   │   ├── confirmation.css
│   │   ├── footer.css
│   │   ├── home.css
│   │   ├── index.css
│   │   ├── navbar.css
│   │   ├── notFound.css
│   │   ├── productDetail.css
│   │   ├── products.css
│   │   └── variables.css    # Central color palette & design tokens
│   ├── App.jsx              # Main App layout & route declarations
│   └── main.jsx             # React DOM root entry point
├── index.html               # Main HTML5 entry document
├── package.json             # NPM dependencies & build scripts
├── vercel.json              # Vercel deployment SPA rewrite configuration
└── vite.config.js           # Vite configuration
```

---

## 💻 Local Setup & Installation

Follow these steps to run the project locally on your machine:

### 1. Prerequisites
Ensure you have **Node.js** (v18 or higher) and **npm** installed:
```bash
node -v
npm -v
```

### 2. Clone or Extract the Project
Navigate to the project root folder:
```bash
cd "maam samra project"
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run the Development Server
```bash
npm run dev
```
Open your browser and navigate to the local URL displayed in the terminal (typically `http://localhost:5173/`).

### 5. Build for Production
To create an optimized production build:
```bash
npm run build
```
You can preview the built files locally:
```bash
npm run preview
```

---

## ☁️ Vercel Deployment Guide

1. Push your repository to your GitHub account (see Git instructions below).
2. Visit [Vercel](https://vercel.com/) and sign in with your GitHub account.
3. Click **"Add New..."** → **"Project"**.
4. Select your `ecommerce-react` repository from the list.
5. In **Framework Preset**, select **Vite**.
6. Keep the default build settings (`npm run build` and `dist` output directory).
7. Click **Deploy**. Vercel will automatically read `vercel.json` and deploy your app with full client-side routing support!

---

## 🎓 Academic viva & Project Hard-Copy
This project includes ready-to-print documentation prepared in the `/docs` folder:
- **`docs/REPORT.md`**: Formal project report formatted with title pages, system architecture diagrams, state flow explanations, and feature breakdowns.
- **`docs/VIVA_NOTES.md`**: Quick-revision cheat sheet covering key React concepts (Context API vs Redux, useReducer, useEffect, Routing, LocalStorage) and 15 viva questions with model answers.
