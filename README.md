# Titip.in - Web Frontend

Titip.in is a modern web application designed to facilitate **Jastip** (buying services) and **Preloved** (second-hand) transactions. Built with speed and user experience in mind, it provides a seamless interface for users to browse, request, and manage their listings.

## 🚀 Tech Stack

- **Framework:** [React 18](https://reactjs.org/) with [Vite](https://vitejs.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **Data Fetching:** [TanStack Query (React Query) v5](https://tanstack.com/query/latest)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Animations:** [Tailwind Animate](https://github.com/jamiebuilds/tailwind-animate)

## ✨ Key Features

- **Jastip Marketplace:** Browse and create buying service listings from various locations.
- **Preloved Store:** A dedicated space for high-quality second-hand goods.
- **User Dashboard:** Manage your own listings, requests, and profile.
- **Advanced Search:** Find specific items or services with ease.
- **Image Management:** Multi-image upload support for high-quality listings.
- **Real-time Feedback:** Interactive UI with Sonner toasts and Radix UI components.

## 🛠️ Getting Started

### Prerequisites

- [Node.js 20+](https://nodejs.org/)
- [npm](https://www.npmjs.com/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/titip-in/titip-in-web-fe.git
   cd titip-in-web-fe
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Copy `.env.example` to `.env` and adjust the values.
   ```bash
   cp .env.example .env
   ```
   Main variables:
   - `VITE_API_URL`: The base URL of your backend API.
   - `VITE_APP_NAME`: The name of the application.

4. **Run development server:**
   ```bash
   npm run dev
   ```

## 🏗️ Building for Production

To create an optimized production build:
```bash
npm run build
```
The output will be in the `dist/` directory.

## 🐳 Docker & CI/CD

This project is equipped with a robust CI/CD pipeline using **Jenkins** and **Docker**.

### Docker
The `Dockerfile` uses a multi-stage build:
1. **Builder Stage:** Uses `node:20-alpine` to build the Vite app.
2. **Production Stage:** Uses `nginx:alpine` to serve the static assets with a custom configuration for SPA support (React Router).

### Jenkins Pipeline
The `Jenkinsfile` automates the following stages:
1. **Install & Test:** Lints the code and checks for TypeScript errors.
2. **Build Docker Image:** Builds the image with necessary `build-args`.
3. **Push to Docker Hub:** Pushes the versioned image.
4. **Deploy to EC2:** Automatically updates the running container on the AWS EC2 instance.

## 📁 Project Structure

```text
src/
├── @/                # Shadcn UI components
├── components/       # Reusable UI & Layout components
├── hooks/            # Custom React hooks
├── lib/              # API configurations (Axios) & Utils
├── pages/            # Page-level components
├── stores/           # Zustand state management
├── types/            # TypeScript interfaces & types
└── main.tsx          # Application entry point
```

## 📄 License

This project is private and for internal use only.
