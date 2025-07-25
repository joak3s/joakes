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

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm
- Supabase account and project
- PostgreSQL database (via Supabase)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd admin-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.template .env.local
   ```
   
   Edit `.env.local` with your actual values:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   
   # Database
   DATABASE_URL=your_database_url
   
   # Authentication
   ADMIN_EMAIL=your_admin_email
   ADMIN_PASSWORD=your_admin_password
   
   # OpenAI (for AI features)
   OPENAI_API_KEY=your_openai_api_key
   
   # Optional: Analytics
   GOOGLE_ANALYTICS_ID=your_ga_id
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run database migrations
   npx prisma db push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. **Access the admin dashboard**
   Navigate to `http://localhost:3000/admin` and log in with your admin credentials.

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

### Other Platforms
- **Netlify**: Configure build settings for Next.js
- **Railway**: Direct deployment with environment variables
- **Docker**: Use provided Dockerfile for containerized deployment

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

### Integration Options
- Google Analytics 4
- Sentry for error tracking
- LogRocket for session replay
- Custom analytics endpoints

## 🔄 Data Migration

### From Original Portfolio
The admin app is designed to work with the existing portfolio database. Key migration steps:

1. **Database Schema**: Uses the same Prisma schema as the main portfolio
2. **Authentication**: Shares Supabase authentication with main app
3. **File Storage**: Uses the same Supabase storage bucket
4. **Environment Variables**: Can share the same Supabase project

### Standalone Setup
To run as a completely separate application:

1. Create new Supabase project
2. Set up new database schema
3. Configure separate storage bucket
4. Update environment variables
5. Migrate data if needed

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Code Standards
- Follow TypeScript best practices
- Write comprehensive tests
- Update documentation for new features
- Ensure accessibility compliance
- Follow security best practices

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

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

---

**Built with ❤️ using Next.js, Supabase, and TypeScript** 