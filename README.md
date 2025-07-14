# Admin App - Portfolio Management System

A standalone Next.js 14 admin application for managing portfolio content, projects, tools, and user interactions. This app provides a secure, password-protected interface for content management with full CRUD operations.

## 🏗️ Architecture Overview

### Tech Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **ORM**: Prisma (for type-safe queries)
- **Styling**: Tailwind CSS + Shadcn UI
- **Authentication**: Supabase Auth
- **State Management**: React Server Components + Server Actions
- **Forms**: React Hook Form + Zod validation

### Core Features
- 🔐 **Secure Authentication**: Password-protected admin dashboard
- 📊 **Project Management**: Full CRUD operations for portfolio projects
- 🛠️ **Tool Management**: Manage development tools and technologies
- 🏷️ **Tag System**: Categorize projects with flexible tagging
- 📸 **Image Management**: Upload and manage project images
- 📈 **Analytics**: View chat analytics and user interactions
- 🎨 **Modern UI**: Responsive design with dark/light theme support

## 📁 Project Structure

```
admin-app/
├── app/                          # Next.js App Router
│   ├── admin/                    # Admin dashboard pages
│   │   ├── auth-check/          # Authentication verification
│   │   ├── chat/                # Chat analytics dashboard
│   │   ├── journey/             # Journey management
│   │   ├── tools/               # Tools management interface
│   │   └── page.tsx            # Main admin dashboard
│   ├── api/                     # API routes
│   │   └── admin/              # Admin-specific API endpoints
│   │       ├── chat-analytics/ # Chat usage analytics
│   │       ├── content-usage/  # Content interaction data
│   │       ├── debug/          # Debug utilities
│   │       ├── general-info/   # General site information
│   │       ├── journey/        # Journey CRUD operations
│   │       ├── projects/       # Project management API
│   │       ├── regenerate-embedding/ # AI embedding generation
│   │       ├── session-messages/ # Chat session data
│   │       ├── simulate-query/ # Query simulation tools
│   │       ├── tags/           # Tag management API
│   │       ├── tools/          # Tools CRUD operations
│   │       └── upload/         # File upload handling
│   ├── actions/                 # Server actions
│   │   ├── admin.ts            # Admin-specific actions
│   │   ├── journey-milestone.ts # Journey milestone actions
│   │   ├── journey-images.ts   # Journey image management
│   │   ├── prisma-admin.ts     # Prisma admin operations
│   │   └── tools.ts            # Tools management actions
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Landing page
├── components/                  # Reusable UI components
│   ├── ui/                     # Shadcn UI components
│   │   ├── button.tsx         # Button component
│   │   ├── card.tsx           # Card component
│   │   ├── toast.tsx          # Toast notifications
│   │   ├── toaster.tsx        # Toast container
│   │   └── ...                # Other UI components
│   └── admin/                  # Admin-specific components
│       ├── project-form.tsx   # Project creation/editing form
│       ├── tool-form.tsx      # Tool management form
│       └── image-upload.tsx   # Image upload component
├── lib/                        # Shared utilities and configurations
│   ├── database/               # Database connections
│   │   ├── supabase-admin.ts  # Admin Supabase client
│   │   └── supabase-server.ts # Server-side Supabase client
│   ├── types/                  # TypeScript type definitions
│   │   ├── database.ts        # Database schema types
│   │   ├── project.ts         # Project-related types
│   │   └── tool.ts            # Tool-related types
│   ├── helpers/                # Utility functions
│   │   └── project-helpers.ts # Project management utilities
│   ├── utils.ts                # General utilities
│   └── config/                 # Configuration files
│       └── supabase.ts        # Supabase configuration
├── hooks/                      # Custom React hooks
│   └── use-toast.ts           # Toast notification hook
├── prisma/                     # Database schema and migrations
│   └── schema.prisma          # Prisma schema definition
├── public/                     # Static assets
├── styles/                     # Additional stylesheets
├── .env.local                  # Environment variables (not in repo)
├── .env.template               # Environment template
├── next.config.mjs            # Next.js configuration
├── package.json                # Dependencies and scripts
├── tailwind.config.ts         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
└── README.md                  # This file
```

## 🔐 Authentication & Security

### Admin Access
- Password-protected admin dashboard
- Session-based authentication via Supabase
- Automatic session validation on all admin routes
- Secure API endpoints with authentication middleware

### Security Features
- Row Level Security (RLS) policies in Supabase
- Input validation with Zod schemas
- XSS protection for user inputs
- Secure file upload handling
- Environment variable protection

## 📊 Database Schema

### Core Tables
- **projects**: Portfolio projects with metadata
- **project_images**: Image assets for projects
- **project_tools**: Many-to-many relationship between projects and tools
- **project_tags**: Many-to-many relationship between projects and tags
- **tools**: Development tools and technologies
- **tags**: Categorization tags
- **general_info**: Site-wide information
- **chat_message**: AI chat interactions
- **conversation_sessions**: Chat session management

### Key Relationships
- Projects can have multiple images, tools, and tags
- Tools and tags are reusable across projects
- Chat messages are linked to conversation sessions
- All tables include audit fields (created_at, updated_at)

## 🛠️ API Endpoints

### Admin API Routes
- `GET /api/admin/projects` - List all projects
- `POST /api/admin/projects` - Create new project
- `GET /api/admin/projects/[id]` - Get specific project
- `PUT /api/admin/projects/[id]` - Update project
- `DELETE /api/admin/projects/[id]` - Delete project
- `GET /api/admin/tools` - List all tools
- `POST /api/admin/tools` - Create new tool
- `GET /api/admin/tags` - List all tags
- `POST /api/admin/tags` - Create new tag
- `GET /api/admin/chat-analytics` - Chat usage analytics
- `POST /api/admin/upload` - File upload handling

### Server Actions
- `createProject` - Create new project with validation
- `updateProject` - Update existing project
- `deleteProject` - Delete project and related data
- `uploadProjectImage` - Handle image uploads
- `manageProjectTools` - Link/unlink tools to projects
- `manageProjectTags` - Link/unlink tags to projects

## 🎨 UI Components

### Shadcn UI Components
- **Button**: Primary, secondary, and destructive variants
- **Card**: Content containers with headers and actions
- **Toast**: Notification system for user feedback
- **Form**: Form components with validation
- **Dialog**: Modal dialogs for confirmations
- **Badge**: Status and category indicators

### Admin-Specific Components
- **ProjectForm**: Create and edit project forms
- **ToolForm**: Tool management interface
- **ImageUpload**: Drag-and-drop image upload
- **ProjectGrid**: Display projects in grid layout
- **AnalyticsDashboard**: Chat and usage analytics

## 🔧 Development

### Available Scripts
```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking

# Database
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema changes
npm run db:studio    # Open Prisma Studio
```

### Code Style
- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Conventional commits for version control

### Testing
- Unit tests with Jest
- Integration tests for API endpoints
- E2E tests with Playwright (planned)

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch


### Environment Variables for Production
Ensure all required environment variables are set in your deployment platform:
- Supabase credentials
- Database connection string
- Admin authentication details
- OpenAI API key (if using AI features)

## 📈 Monitoring & Analytics

### Built-in Analytics
- Chat interaction tracking
- Content usage statistics
- User engagement metrics
- Error monitoring and logging


## 🆘 Support

### Common Issues
- **Authentication errors**: Check Supabase credentials and RLS policies
- **Database connection**: Verify DATABASE_URL and Prisma setup
- **Image uploads**: Ensure Supabase storage bucket is configured
- **Build errors**: Check TypeScript types and dependencies

### Getting Help
- Check existing issues in the repository
- Review Supabase and Next.js documentation
- Contact maintainers for critical issues
