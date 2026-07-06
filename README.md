# SPMS (Student Project Management System)

A modern, highly interactive, and feature-rich Student Project Management System designed to streamline project collaboration, task allocation, and progress tracking among students, faculty, and administrators.

The project features a sleek, dark-themed responsive UI, interactive data visualizations, smooth animations, and simulated 3D components.

---

## 🚀 Key Features

*   **Role-Based Access Control (RBAC)**: Custom dashboards, routes, and capabilities tailored for three user roles:
    *   **Admin**: Manage users, roles, system parameters, and oversee all projects.
    *   **Faculty**: Create projects, assign tasks, review student submissions, and analyze metrics.
    *   **Student**: Track assigned projects, manage task lists, update task progress, and view grades/reports.
*   **Comprehensive Project & Task Tracking**:
    *   Dynamic kanban boards and project task lists.
    *   Task priorities (High, Medium, Low) and state workflows (To Do, In Progress, Review, Completed).
    *   Overall project progress percentage calculation based on task completion.
*   **Analytics & Reports**: Highly interactive graphs and charts using **Recharts** displaying project health, task breakdowns, user performance, and submission timelines.
*   **Modern Interactive UI**:
    *   Micro-animations and fluid sidebar transitions powered by **Framer Motion**.
    *   3D visual canvas integration powered by **Three.js** / **React Three Fiber**.
    *   Responsive layouts and grid structures styled with **Tailwind CSS**.
    *   Real-time notifications via **React Hot Toast**.

---

## 🛠️ Technology Stack

### Core Frontend & Build
*   **React (v19)**: Component-driven UI library.
*   **Vite (v8)**: Fast building and Hot Module Replacement (HMR) development server.
*   **React Router Dom (v7)**: Routing system with layout hierarchies and security guards.

### UI & Aesthetics
*   **Tailwind CSS (v3)**: Utility-first CSS styling.
*   **Framer Motion (v12)**: Animation engine for rich hover and transition effects.
*   **React Three Fiber & Drei**: 3D graphics rendering wrapper for Three.js.
*   **Lucide React**: Clean SVG icons.
*   **React Hot Toast**: Action-oriented status popups.

### Analytics & Forms
*   **Recharts**: SVG chart library.
*   **React Hook Form**: Simplified, performant form collection and validation.

---

## 📁 Directory Structure

```text
SPMS/
├── public/                 # Static assets (favicons, generic icons)
├── src/
│   ├── assets/             # Images and local media assets
│   ├── components/         # Reusable presentation and form components
│   │   ├── common/         # Modals, Datatables, Badges, Loaders, Progressbars
│   │   ├── forms/          # UserForm, ProjectForm, TaskForm, RoleForm
│   │   └── layout/         # Navbar, Sidebar, and DashboardLayout components
│   ├── context/            # AuthContext (JWT/Mock validation) and ThemeContext
│   ├── data/               # mockData.js (Simulated database structure)
│   ├── pages/              # Page-level components
│   │   ├── auth/           # Login / Registration views
│   │   ├── dashboard/      # Role-specific dashboards (Admin, Faculty, Student)
│   │   ├── profile/        # User Profile settings
│   │   ├── projects/       # Project lists and detail views
│   │   ├── reports/        # Analytics, graphs, and print-ready reports
│   │   ├── roles/          # Security groups & permissions mapping
│   │   ├── tasks/          # Personal and project task tracking lists
│   │   └── users/          # User directory and profile view sheets
│   ├── routes/             # AppRoutes (Public, Protected routes configuration)
│   ├── services/           # Service layer for simulated backend API requests
│   ├── index.css           # Global CSS variables & Tailwind directives
│   └── main.jsx            # Main app mounting point
├── .env                    # Local environment variables
├── .gitignore              # Ignored files (node_modules, builds, secrets)
├── package.json            # NPM dependencies and project scripts
├── tailwind.config.js      # Tailwind customization config
└── vite.config.js          # Vite build optimization configuration
```

---

## ⚙️ Getting Started

### Prerequisites

*   [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
*   [npm](https://www.npmjs.com/) (packaged with Node.js)

### Installation

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/DhruvDave2006/SPMS.git
    cd SPMS
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Setup**:
    Create a `.env` file in the root directory (already included locally with standard configuration):
    ```env
    VITE_USE_MOCK=true
    VITE_API_BASE_URL=https://localhost:7000/api
    ```

4.  **Start Development Server**:
    ```bash
    npm run dev
    ```
    The application will be accessible locally at `http://localhost:5173`.

### NPM Scripts

*   `npm run dev`: Starts the local Vite development server with Hot Module Replacement.
*   `npm run build`: Bundles the project assets for production deployment into the `dist/` directory.
*   `npm run preview`: Previews the production build locally.
*   `npm run lint`: Runs `Oxlint` to check code consistency and find potential syntax/runtime issues.

---

## 🤝 Contributing

1.  Create a branch for your feature: `git checkout -b feature/your-feature-name`
2.  Commit your modifications: `git commit -m 'Add some feature'`
3.  Push to the remote branch: `git push origin feature/your-feature-name`
4.  Open a Pull Request on GitHub.
