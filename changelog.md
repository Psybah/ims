# Changelog

## Phase 1: Improve Authentication Robustness (Completed)
- **User Data Fetch on Reload:** Implemented in `AuthContext.tsx` to retrieve user data from local storage on page load if a token exists.
- **User Feedback for Errors:** Modified `AuthContext.tsx` to return specific error messages from the backend for login/registration failures. Updated `LoginForm.tsx` and `SignupForm.tsx` to display these error messages to the user.
- **Basic Token Expiration:** Added an `axios` response interceptor in `src/lib/api.ts` to handle 401 (Unauthorized) errors, clearing local storage and redirecting to the login page.
- **Automatic Login After Registration:** Modified `AuthContext.tsx` to automatically log in the user after a successful registration.

## Phase 2: Verify API Configuration (Completed)
- Confirmed `VITE_API_V1_URL` and `VITE_API_V2_URL` are correctly set in `.env` to the Azure instance URLs (`http://20.80.82.90:3000/api/v1` and `http://20.80.82.90:3000/api/v2`).

## Phase 3: Integrate Core Features (Completed)
- **List Folders:** Updated `src/pages/user/UserFiles.tsx` to fetch folders and files from the backend using `GET /api/v2/files/folders` and `GET /api/v2/files/folders/{folderId}`. Replaced `useFileStorage` with direct API calls and implemented state management for loading, errors, and displaying items.
- **Create Folder:** Implemented in `src/pages/user/UserFiles.tsx` to create new folders using `POST /api/v2/files/create/folder`.
- **Upload File to Root/Folder:** Implemented in `src/pages/user/UserFiles.tsx` to upload files using `POST /api/v2/files/upload/file` (for root) and `POST /api/v2/files/upload/file/{folderId}` (for specific folders).
- **Get Folder by ID:** Implemented as part of the `fetchItems` function in `src/pages/user/UserFiles.tsx` to retrieve specific folder contents.

## Phase 4: Integrate User Management (Completed)
- **Get All Users:** Updated `src/pages/admin/AdminUsers.tsx` to fetch user data from the backend using `GET /api/v1/users`. Modified the `User` interface, removed mock data, and adjusted rendering logic to match the backend data structure. Added a toast message for unsupported suspend/activate user functionality.
- **Create Admin & Member Account:** Implemented in `src/components/AddUserModal.tsx` to create new user accounts using `POST /api/v1/users/add-user`. Adjusted form fields and API call to match backend documentation.
