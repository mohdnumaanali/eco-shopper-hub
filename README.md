# Eco Shopper Hub

# Project Title

EcoShopper – AI-Powered Eco-Friendly Shopping Assistant

# Goal

Build a fully functional, responsive website that helps users shop sustainably by:

- Searching products

- Displaying eco-friendly alternatives

- Showing sustainability ratings

- Providing recycling and eco-tips

- Offering a clean, modern, mobile-friendly UI

# Requirements

1. Functional website with frontend + backend

2. Responsive design (desktop + mobile)

3. Clean, modern, user-friendly UI

4. Clear user flow: search → results → eco alternatives → tips

5. Backend functionality for product data and user accounts

6. Database integration for storing products, ratings, and user preferences

7. Images should be automatically pulled from the internet (no manual upload required)

8. Deployment-ready (Netlify/Vercel for frontend, Render/Heroku for backend)

# Tech Stack

- Frontend: HTML, CSS (Tailwind/Bootstrap), JavaScript (React.js)

- Backend: Node.js + Express

- Database: MongoDB

- Hosting: Vercel (frontend), Render (backend)

- APIs: Use product info APIs or mock dataset, sustainability rating API if available

- Images: Auto-fetch from internet (Unsplash, Pexels, or Google Images)

# Pages

1. Home Page

   - Hero section with eco-friendly banner image (fetch from internet)

   - Search bar for products

   - Call-to-action: “Shop Smarter, Shop Greener”

   - Navigation menu: Home, Products, Eco Tips, About, Contact

2. Product Search Page

   - Search results grid with product images (auto-fetch from internet)

   - Each product card shows:

     - Product name

     - Image

     - Price

     - Eco rating (stars or badges)

     - Button: “View Alternatives”

3. Alternatives Page

   - Shows eco-friendly alternatives for selected product

   - Comparison table: Original vs. Alternatives

   - Sustainability score, material info, recycling options

   - Auto-fetch images from internet

4. Eco Tips Page

   - List of eco-friendly shopping tips

   - Categories: Reduce, Reuse, Recycle, Sustainable Brands

   - Auto-fetch relevant images (e.g., recycling bins, eco packaging)

5. About Page

   - Mission statement: “Helping people shop sustainably”

   - Team info (placeholder)

   - Auto-fetch eco-themed background image

6. Contact Page

   - Contact form (Name, Email, Message)

   - Backend integration to store messages

   - Auto-fetch eco-friendly illustration

# Features

- User login/signup (basic authentication)

- Save favorite eco-friendly products

- Sustainability rating system (1–5 stars)

- Recommendation engine (simple rule-based or AI-assisted)

- Responsive design (test on mobile + desktop)

- Dark mode toggle

- Accessibility features (alt text, ARIA labels)

# UI/UX Guidelines

- Clean, modern design

- Green + white color palette

- Rounded buttons, minimalistic layout

- Smooth animations (hover effects, transitions)

- Mobile-first approach

- Clear navigation flow

# Backend Functionality

- Product database (MongoDB)

- User accounts (login/signup)

- Favorites list

- Contact form submissions stored in DB

- API endpoints:

  - /products

  - /alternatives

  - /tips

  - /users

  - /favorites

# Deployment

- Frontend → Vercel

- Backend → Render

- Database → MongoDB Atlas

- Auto-deploy pipeline

# Images

- For all product cards, banners, and tips, fetch images automatically from internet sources (Unsplash, Pexels, Google Images).

- Do not require manual uploads.

- Example queries:

  - “eco-friendly shopping banner”

  - “sustainable product packaging”

  - “recycling tips illustration”

  - “organic cotton t-shirt”

  - “eco-friendly detergent”

# Final Deliverable

- Fully functional website

- Responsive design

- Clean UI

- Backend integration

- Auto-fetched images

- Ready for deployment

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/4bb7e7e2-3800-4f49-bbf1-b950a38e90f4).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
