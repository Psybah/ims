# File Management System (IMS)

A modern, professional file management system built with React and TypeScript, featuring role-based access control, intuitive file organization, and a comprehensive administrative interface.

![File Management System](https://img.shields.io/badge/React-18.3.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue)
![Vite](https://img.shields.io/badge/Vite-5.4.1-green)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.11-cyan)

## 🚀 Features

### Core File Management
- **File Upload & Download** - Support for single and multiple file uploads
- **Folder Management** - Create, organize, and navigate folder structures
- **File Preview** - Built-in file viewer with support for multiple file types
- **Search & Filter** - Advanced search capabilities across files and folders
- **Sorting Options** - Sort by name, date modified, or file size

### User Management
- **Role-Based Access Control** - Separate admin and user interfaces
- **User Authentication** - Secure login system with demo accounts
- **Permission Management** - Granular control over user permissions
- **Storage Quotas** - Individual storage limits and usage tracking

### Administrative Features
- **System Dashboard** - Comprehensive analytics and system overview
- **User Administration** - Manage users, roles, and permissions
- **Trash Management** - Recycle bin with restoration capabilities
- **Bulk Operations** - Efficient batch file operations
- **System Analytics** - Storage usage, activity logs, and performance metrics

### User Experience
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **Dark/Light Theme** - User preference-based theme switching
- **Professional UI** - Modern interface built with shadcn/ui components
- **Real-time Notifications** - Toast notifications for user feedback
- **Breadcrumb Navigation** - Easy navigation through folder hierarchies

## 🛠️ Technologies

### Frontend Framework
- **React 18.3.1** - Modern React with hooks and functional components
- **TypeScript 5.5.3** - Type-safe development
- **Vite 5.4.1** - Fast build tool and development server

### UI & Styling
- **shadcn/ui** - Professional component library built on Radix UI
- **Tailwind CSS 3.4.11** - Utility-first CSS framework
- **Lucide React** - Beautiful, customizable icons
- **next-themes** - Dark/light theme management

### State Management & Routing
- **React Router DOM 6.26.2** - Client-side routing
- **TanStack Query 5.56.2** - Server state management
- **React Context** - Application state management

### Forms & Validation
- **React Hook Form 7.53.0** - Performant form handling
- **Zod 3.23.8** - TypeScript-first schema validation

### Data Visualization
- **Recharts 2.12.7** - Responsive charts and analytics
- **date-fns 3.6.0** - Date manipulation and formatting

## 📦 Installation

### Prerequisites
- Node.js 18.x or higher
- npm, yarn, or bun package manager

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ims-1
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   bun install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   bun dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:8080`

### Build for Production

```bash
npm run build
npm run preview
```

## 🔐 Demo Accounts

The application includes demo accounts for testing:

### Admin Account
- **Email:** `admin@filemanagement.com`
- **Password:** `demo123456`
- **Features:** Full administrative access, user management, system analytics

### User Account
- **Email:** `chinedu@company.com`
- **Password:** `demo123456`
- **Features:** Personal file management, limited system access

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # shadcn/ui component library (50+ components)
│   ├── AppSidebar.tsx   # Main navigation sidebar
│   ├── DashboardLayout.tsx # Layout wrapper
│   ├── FileViewModal.tsx   # File preview modal
│   └── LoginForm.tsx       # Authentication interface
├── contexts/
│   └── AuthContext.tsx     # Authentication state management
├── hooks/
│   ├── useFileStorage.ts   # File management logic
│   └── use-toast.ts        # Notification system
├── pages/
│   ├── admin/              # Administrative interfaces
│   │   ├── AdminDashboard.tsx
│   │   ├── AdminFiles.tsx
│   │   ├── AdminUsers.tsx
│   │   ├── AdminPermissions.tsx
│   │   └── AdminTrash.tsx
│   └── user/               # User interfaces
│       ├── UserDashboard.tsx
│       └── UserFiles.tsx
├── lib/
│   └── utils.ts            # Utility functions
└── App.tsx                 # Main application component
```

## 🚦 Usage

### For Users
1. **Login** with your credentials
2. **Upload Files** using the upload button or drag-and-drop
3. **Organize** files into folders for better management
4. **Search** for files using the search bar
5. **Preview** files by clicking on them
6. **Download** files when needed

### For Administrators
1. **Access Admin Dashboard** for system overview
2. **Manage Users** - add, edit, or remove user accounts
3. **Set Permissions** - control user access levels
4. **Monitor Storage** - track usage and manage quotas
5. **System Maintenance** - handle trash, backups, and cleanup

## 🎨 Theming

The application supports both dark and light themes with a professional color scheme:

- **Primary Colors:** Professional blue palette
- **Typography:** Clear, readable font hierarchy
- **Spacing:** Consistent spacing system
- **Shadows:** Subtle depth and elevation
- **Animations:** Smooth transitions and micro-interactions

## 🔧 Configuration

### Environment Variables
Currently, the application uses local storage for data persistence. For production deployment, consider configuring:

- Backend API endpoints
- Authentication providers
- File storage services
- Analytics tracking

### Customization
- **Themes:** Modify `src/index.css` for custom color schemes
- **Components:** Extend shadcn/ui components in `src/components/ui/`
- **Routing:** Add new routes in `src/App.tsx`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use ESLint configuration for code consistency
- Write descriptive commit messages
- Test your changes thoroughly

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the excellent component library
- [Radix UI](https://www.radix-ui.com/) for accessible UI primitives
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Lucide](https://lucide.dev/) for beautiful icons

## 📞 Support

For questions, issues, or feature requests, please [open an issue](https://github.com/your-username/ims-1/issues) on GitHub.

---

**Built with ❤️ using modern web technologies**
