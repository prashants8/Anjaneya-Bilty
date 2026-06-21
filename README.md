# Anjaneya Road Carriers - Freight Billing & Consignment Manager

A comprehensive management system designed for Anjaneya Road Carriers to handle freight billing, consignment notes, and logistics tracking. Built using modern web technologies, it provides a clean, responsive interface for managing transport records, generating invoices (Bilty), and analyzing freight operations.

## Key Features

- **Freight Billing & Invoicing**: Efficiently generate and print consignment notes (Bilty/Bill of Lading).
- **Consignment Tracking**: Monitor consignment status and client dispatch records.
- **Client Management**: Maintain details of consignors and consignees.
- **Reporting & Analytics**: Analyze freight volumes, revenues, and routes.
- **Interactive UI**: Fully dark-themed dashboard built with Tailwind CSS and Radix UI components.
- **User Data Isolation**: Secure multi-user environment where users only view, edit, or delete their own data.

## Tech Stack

This project is built using:

- **Frontend Framework**: [Next.js](https://nextjs.org/) (App Router) with [React](https://react.dev/) and [TypeScript](https://www.typescriptlang.org/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) powered by [Radix UI](https://www.radix-ui.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with animations
- **Database/Backend**: [Supabase](https://supabase.com/) integration
- **State & Queries**: [TanStack Query (React Query)](https://tanstack.com/query/latest)

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
   Create a `.env.local` file in the root directory and add your Supabase credentials. The project supports both standard Next.js (`NEXT_PUBLIC_`) and legacy (`VITE_`) prefixes:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

4. **Start the development server**:
   ```sh
   npm run dev
   ```
   The application will run locally at `http://localhost:8080`.

## Available Scripts

- `npm run dev`: Starts the Next.js development server on port 8080.
- `npm run build`: Compiles and packages the application for production.
- `npm run start`: Previews the production build locally on port 8080.
- `npm run lint`: Performs lint checks using ESLint.

## Windows exFAT Compatibility

If you are running or building this project on an **exFAT** formatted drive on Windows, standard Next.js / Webpack builds can crash with `EISDIR` errors (because exFAT does not support native Windows symbolic links). 

To solve this, the project includes a pre-load script (`patch-fs.cjs`) that monkey-patches Node's file system API. The project scripts in `package.json` are pre-configured to automatically run with `cross-env NODE_OPTIONS="--require ./patch-fs.cjs"`, so everything works out of the box.
