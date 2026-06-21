# Anjaneya Road Carriers - Freight Billing & Consignment Manager

A comprehensive management system designed for Anjaneya Road Carriers to handle freight billing, consignment notes, and logistics tracking. Built using modern web technologies, it provides a clean, responsive interface for managing transport records, generating invoices (Bilty), and analyzing freight operations.

## Key Features

- **Freight Billing & Invoicing**: Efficiently generate and print consignment notes (Bilty/Bill of Lading).
- **Consignment Tracking**: Monitor consignment status and client dispatch records.
- **Client Management**: Maintain details of consignors and consignees.
- **Reporting & Analytics**: Analyze freight volumes, revenues, and routes.
- **Interactive UI**: Fully dark-themed dashboard built with Tailwind CSS and Radix UI components.

## Tech Stack

This project is built using:

- **Frontend Framework**: [React](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) powered by [Radix UI](https://www.radix-ui.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with animations
- **Database/Backend**: [Supabase](https://supabase.com/) integration
- **State & Queries**: [TanStack Query (React Query)](https://tanstack.com/query/latest)
- **Routing**: [React Router DOM](https://reactrouter.com/)
- **Testing**: [Vitest](https://vitest.dev/)

## Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (v18 or higher recommended) and `npm` installed.

### Setup Instructions

1. **Clone the repository**:
   ```sh
   git clone <repository-url>
   cd billty-master
   ```

2. **Install dependencies**:
   ```sh
   npm install
   ```

3. **Configure environment variables**:
   Create a `.env.local` file in the root directory and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server**:
   ```sh
   npm run dev
   ```
   The application will be running locally at `http://localhost:8080` (or the port specified in your console).

## Available Scripts

- `npm run dev`: Starts the Vite development server.
- `npm run build`: Compiles and packages the application for production.
- `npm run lint`: Performs lint checks on the codebase using ESLint.
- `npm run preview`: Previews the production build locally.
- `npm run test`: Runs the automated test suite using Vitest.
