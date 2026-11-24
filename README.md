# Enterprise Dynamic Form Builder — Frontend Client

> Built with **React 18**, **Redux Toolkit**, **Vite**, and **Tailwind CSS**, featuring a zero-hardcoding dynamic form renderer, pluggable field registry, and real-time builder canvas.

---

### Step 1: Install Dependencies

From the repository root:

```bash

# Install frontend dependencies
cd ../frontend && npm install
```

### Step 2: Configure Environment Variables

`frontend/.env.example` are provided:

```bash

VITE_API_BASE_URL=/api

```

### Step 3: Run the Application

Open terminal tabs:

**Terminal (Frontend Client):**

```bash
cd frontend
npm run dev
```

_Open `http://localhost:5173` in your browser._

---

## Admin Credentials

The database automatically seeds an administrator account upon launch:

- **Email**: `admin@formbuilder.com`
- **Password**: `Admin@12345`
- **Role**: `admin`

_(You may also register new administrator accounts via the `/register` route)._

---

## Key Features

### 1. Admin Form Builder

- **Visual Drag & Reorder Canvas**: Add, edit, remove, and reorder form fields (Move Up / Down) with real-time UI synchronization.
- **Form Metadata Management**: Configure form title, description, department, designation, role, creator email, mobile, and gender.
- **Draft & Publish Workflow**: Save forms as **Draft** during authoring and toggle to **Published** to enable public access.
- **Interactive Live Preview**: Switch instantaneously between the builder canvas and interactive test mode without leaving the editor.

### 2. Dynamic Form Rendering (`/forms/:formId`)

- **Zero Hard-Coding**: Renders fields dynamically from backend JSON schemas using a pluggable **Field Registry Pattern**.
- **Extensible Architecture**: Supports 9 core field types (`TEXT`, `EMAIL`, `NUMBER`, `PHONE`, `TEXTAREA`, `DATE`, `SELECT`, `RADIO`, `CHECKBOX`) with full client-side validation states, loading indicators, and confirmation screens.
- **Responsive & Accessible UI**: Styled with Tailwind CSS for clean presentation across desktop and mobile viewports.

### 3. Submissions Management & Analytics

- **Dynamic Tabular View**: Table columns adapt automatically to the active form's field schema.
- **Pagination & Search**: Supports server-side pagination (`page`, `limit`, `totalPages`, `totalCount`) alongside instant client-side data filtering.
- **Submission Inspector**: Modal view displaying individual submission payloads along with client metadata (IP address, user agent, timestamp).
- **CSV Export & Deletion**: One-click CSV download and single-record deletion.

---

## Redux Toolkit State Management Strategy

In accordance with Section 4 of the technical assessment:

> _"Explain which state belongs in Redux and which state can remain local to a component."_

### Slices Overview:

1. `authSlice`: Stores current user profile, JWT token, and session auth status.
2. `formsSlice`: Manages admin forms list, status/search filters, and server-side pagination metadata.
3. `formBuilderSlice`: Manages the active form definition being created or edited, field reordering, selected field ID, builder vs preview mode toggle, and `isDirty` change tracking.
4. `formRendererSlice`: Stores the public form definition fetched by ID, field input values, touched flags, and submission status.
5. `submissionsSlice`: Manages paginated submissions for a specific form, selected submission record for detail inspection, and deletion states.

### Redux State vs Component-Local State

- **Belongs in Redux**: Application-wide state that must survive route transitions or be shared across disconnected components (e.g., authentication, active form drafts being previewed, submission lists).
- **Belongs in Local State (`useState`)**: Ephemeral, UI-only interactions (e.g., intermediate keystroke values before validation, modal open/close toggles, mobile dropdown menus). Placing these in Redux causes unnecessary store dispatches and global component re-renders.

---

## Folder Structure

```text
frontend/
├── src/
│   ├── api/                # Axios client with JWT interceptors & API service wrappers
│   ├── components/
│   │   ├── common/         # Navbar, Modal, Badge, LoadingSpinner, EmptyState
│   │   ├── formBuilder/    # FieldPalette, FieldCard, FieldConfigModal, FormMetadataModal
│   │   ├── formRenderer/   # DynamicFormRenderer, FieldRegistry, reusable field components
│   │   └── submissions/    # SubmissionsTable, SubmissionDetailModal, Pagination
│   ├── pages/              # Dashboard, FormBuilder, PublicForm, Submissions, Auth pages
│   ├── store/              # Redux Toolkit store and 5 isolated slices
│   ├── App.jsx             # Client-side routing & ProtectedRoute guards
│   └── main.jsx            # Application entry point
├── index.html
├── tailwind.config.js
├── vite.config.js
└── package.json
```
