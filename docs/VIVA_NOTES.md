# 🎓 VIVA PREPARATION & TECHNICAL REVISION NOTES
## NexusPlay — Gaming Consoles E-Commerce Project
**Instructor:** Ma'am Samra  
**Topic:** React.js, React Router, Context API, useReducer, Form Validation, REST API

---

## 📌 PART 1: CORE ARCHITECTURE EXPLAINED IN PLAIN LANGUAGE

### 1. How the Cart Context and `useReducer` Work
- **The Problem:** In React, state normally flows downward through props. If the `ProductDetail` component wants to tell the `Navbar` to update its cart badge, passing props up and down (prop drilling) becomes messy.
- **The Solution:** We create a global store using `createContext()`. We wrap our entire app inside `<CartProvider>`.
- **Why `useReducer`?** `useState` is fine for simple booleans or numbers, but a shopping cart has complex business logic (e.g. adding an existing product shouldn't duplicate it—it should increment quantity; reducing quantity below 1 should remove it).
- **How it works:**
  1. Any component calls `dispatch({ type: 'ADD_TO_CART', payload: { product, quantity } })`.
  2. The pure function `cartReducer(state, action)` receives the current state and the action.
  3. It executes a `switch(action.type)` block, immutably calculates the new state, and returns it.
  4. React re-renders all subscriber components (Navbar, CartPage, Checkout).
- **LocalStorage Sync:** Inside `CartProvider`, a `useEffect` listens to `[state.items]`. Whenever items change, it executes `localStorage.setItem('nexusplay_cart_data', JSON.stringify(state.items))` wrapped in a `try/catch` block.

---

### 2. How Routing Works (React Router v7)
- **Traditional Multi-Page Websites (MPA):** Clicking `<a href="/cart">` asks the server for `cart.html`. The screen flashes white, the page reloads, and JavaScript memory is erased.
- **Single Page Application (SPA):** We only load one `index.html`. React Router intercepts clicks on `<Link to="/cart">` and uses the browser's **HTML5 History API** (`window.history.pushState`).
- The URL changes in the address bar, but the browser **does not reload**. Instead, React Router unmounts the current page component and mounts the matching page component (e.g., `<CartPage />`).
- **Dynamic Parameters:** In `/product/:id`, the `:id` portion is a variable. The `ProductDetailPage` reads this via `const { id } = useParams()`.

---

### 3. How Data Fetching Works with `useEffect`
- Data fetching is a **side effect** (an operation outside React's pure rendering loop).
- We use the `useEffect` hook:
  ```js
  useEffect(() => {
    // 1. Set loading = true
    // 2. fetch() data from API
    // 3. Set products = data, loading = false
    // 4. Catch errors: if API fails, load local fallbackProducts.json
  }, [dependencies]);
  ```
- **Empty Dependency Array `[]`:** Runs once when the component mounts.
- **Timeout & Fallback:** We attach an `AbortController` with a 6-second timeout so the user never gets stuck on an infinite loading spinner. If the network drops or Fake Store API fails, our code catches the error and serves the rich local gaming dataset.

---

### 4. How Checkout Validation Works
- We use **Controlled Components**: Every `<input>` has its `value` tied to a React state object (`formData`) and updates via an `onChange` handler.
- When the user clicks **"Place Order"**:
  1. `validateForm()` inspects every field.
  2. **Full Name:** Checks `fullName.trim().length >= 3`.
  3. **Email:** Uses a regular expression (regex) to check for `@` and valid domain dots.
  4. **Phone:** Checks minimum digits and allowed characters (`+`, `-`, spaces, digits).
  5. **Card:** If Credit Card is selected, validates 16 numerical digits, `MM/YY` expiry format, and 3-4 digit CVC.
  6. If errors exist, they are stored in `errors` state and rendered under each input with red styling.
  7. If valid, the order object is assembled, the cart is cleared via `clearCart()`, and the user is routed to `/order-confirmation` with the order data.

---

### 5. Why Vite and Context API Were Chosen
- **Vite over Create React App:** CRA uses Webpack, which bundles the entire application before running. Vite leverages browser-native ES Modules (ESM) and esbuild (written in Go), starting the dev server in milliseconds and updating changes instantly (HMR).
- **Context API over Redux:** For this project, installing Redux Toolkit would add unnecessary boilerplate, bundle size, and mental overhead. React's native Context API with `useReducer` provides identical unidirectional data flow with zero external dependencies.

---

### 6. How Deployment on Vercel Works
- On a static host, when a user refreshes `https://site.com/products`, the server looks for a physical directory `/products/index.html` which does not exist, triggering a 404.
- We created a `vercel.json` file in the project root:
  ```json
  {
    "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
  }
  ```
- This instructs Vercel to route all HTTP requests to `index.html`. React Router then takes over and renders the correct view.

---

## 🎯 PART 2: 15 LIKELY VIVA QUESTIONS & MODEL ANSWERS

### Q1: What is the Virtual DOM and how does React use it?
**Answer:**  
The Virtual DOM is a lightweight JavaScript representation of the real DOM. When state changes, React creates a new Virtual DOM tree, compares it with the previous one (a process called "diffing" or reconciliation), and updates only the changed elements in the real browser DOM, maximizing performance.

---

### Q2: What is the difference between `useState` and `useReducer`?
**Answer:**  
`useState` is best for simple, independent pieces of state (like a modal toggle or text input). `useReducer` is preferred when state logic is complex, involves multiple sub-values, or when the next state depends on the previous state through defined action types.

---

### Q3: Why did you wrap your `localStorage` operations in `try/catch`?
**Answer:**  
Accessing `localStorage` can throw exceptions if the browser is in private/incognito mode with strict storage blockers, if the user's disk storage quota is exceeded, or if corrupted JSON is parsed. Wrapping it in `try/catch` ensures the application fails gracefully without crashing.

---

### Q4: Why is an empty dependency array `[]` used in `useEffect`?
**Answer:**  
An empty dependency array tells React that the effect does not depend on any props or state values, meaning it will only execute once when the component initially mounts, similar to `componentDidMount` in class components.

---

### Q5: What is "prop drilling" and how did you prevent it?
**Answer:**  
Prop drilling is the process of passing props through intermediate components that do not need the data themselves, just to get it to a deeply nested child. We solved this using the **Context API (`CartContext`)**, allowing any component to consume the cart directly with `useCart()`.

---

### Q6: What does the `key` prop do in your product list rendering?
**Answer:**  
The `key` prop provides a unique, stable identity for each element in an array (e.g., `key={product.id}`). It helps React's reconciliation algorithm identify which items have been added, moved, or deleted, preventing unnecessary re-renders of the entire list.

---

### Q7: What are Controlled Components in React?
**Answer:**  
A controlled component is an input element whose value is controlled by React state. Instead of the DOM holding the internal value, React manages it through `value={formData.email}` and updates it on user input via `onChange`.

---

### Q8: How did you implement routing without page reloads?
**Answer:**  
We used **React Router DOM v7** with `BrowserRouter`. It listens to browser navigation events and utilizes the HTML5 History API (`pushState` and `replaceState`) to change the URL client-side while swapping the rendered components without sending a new document request to the server.

---

### Q9: What happens if the Fake Store API goes down during your viva?
**Answer:**  
Our application has a built-in fault-tolerant service layer in `src/services/api.js`. If the Fake Store API is unreachable, times out, or returns a non-200 status, our code automatically catches the error and serves the local `fallbackProducts.json` dataset seamlessly with a friendly notice.

---

### Q10: How do you extract dynamic URL parameters like `/product/:id`?
**Answer:**  
We use the `useParams()` hook from React Router DOM. Calling `const { id } = useParams()` extracts the `:id` segment from the active URL path.

---

### Q11: Why is Vite faster than Webpack / Create React App?
**Answer:**  
Webpack bundles all JavaScript modules into a large file before starting the server. Vite uses native browser ES Modules during development and compiles individual files on-demand using esbuild (which is written in Go and runs 10-100x faster than JavaScript-based bundlers).

---

### Q12: What does a pure reducer function mean?
**Answer:**  
A pure reducer function (like our `cartReducer`) takes the current `state` and an `action`, and returns the next state without mutating the original state object and without causing side effects (such as direct DOM manipulation or API calls).

---

### Q13: Why is `vercel.json` necessary for deploying React Router apps?
**Answer:**  
Because static web hosts search for physical HTML files matching the requested URL path (e.g. `/products`). In an SPA, only `index.html` exists. The `vercel.json` rewrite rule forwards all route requests to `index.html`, allowing React Router to handle the URL on the client.

---

### Q14: How does your live cart item count badge work in the Navbar?
**Answer:**  
Inside `CartContext`, we compute `totalItems` using `reduce()`:
```js
const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
```
Because the `Navbar` consumes `useCart()`, any dispatch that alters `state.items` immediately causes `totalItems` to recalculate, instantly updating the badge number.

---

### Q15: How would you scale this project for enterprise production?
**Answer:**  
1. Replace simulated checkout with live payment processing (e.g., Stripe API).
2. Connect to a relational database backend (PostgreSQL with Node/Express or Supabase) with JWT authentication.
3. Add automated end-to-end testing with Playwright or Cypress.
4. Implement server-side rendering (SSR) using Next.js or Remix for SEO optimization.
