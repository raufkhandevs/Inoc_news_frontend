# News Aggregator

A modern news aggregation platform built with Next.js 14, React 19, TypeScript, and shadcn/ui. This application allows users to customize their news feed, manage preferences, and stay updated with the latest news from various sources.

![News Aggregator Screenshot](/placeholder.svg?height=400&width=800)

## Features

- 🔐 **Authentication System**
  - User registration and login
  - Cookie-based JWT token storage
  - Protected routes with middleware
  - Profile management and preferences
  - User preferences persistence

- 📰 **News Feed Management**
  - Explore tab for all news
  - Personalized "My Feeds" based on preferences
  - Category-based filtering
  - Author-based filtering
  - Real-time search functionality
  - Advanced pagination system

- 🎯 **Content Filtering**
  - Multi-select category filters
  - Author selection system
  - Source-based filtering
  - Combined filters support
  - Filter state persistence

- 📱 **Responsive Design**
  - Mobile-first approach
  - Adaptive layouts
  - Collapsible sidebar
  - Dynamic grid system
  - Smooth transitions

- 🎨 **Modern UI/UX**
  - Dark/Light mode support
  - Clean and intuitive interface
  - Loading states and skeletons
  - Toast notifications
  - Interactive cards
  - Avatar system

- ⚡ **Performance**
  - Server-side rendering
  - React Query for data fetching
  - Debounced search
  - Optimized images
  - Lazy loading
  - Efficient state management

## Tech Stack

- **Framework:** Next.js 14
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **State Management:** React Query + Context
- **Authentication:** JWT with HTTP-only cookies
- **HTTP Client:** Axios
- **Form Handling:** React Hook Form
- **Icons:** Lucide React
- **Utilities:** 
  - clsx/tailwind-merge for class management
  - js-cookie for cookie handling
  - date-fns for date formatting

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git
- Docker (optional)

### Standard Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/news-aggregator.git
cd news-aggregator
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
```bash
cp .env.example .env
```
Edit `.env` with your configuration.

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Docker Installation

The application can be run using Docker for both development and production environments.

1. Clone the repository and navigate to the project directory:
```bash
git clone https://github.com/yourusername/news-aggregator.git
cd news-aggregator
```

2. Set up environment variables:
```bash
cp .env.example .env
```
Edit `.env` with your configuration. This file will be used directly by the development server.

3. Development mode:
```bash
# Start the development server with hot-reload
docker-compose up web-dev
```
The development server will use the `.env` file directly, making it easy to update environment variables during development.

4. Production mode:
```bash
# Build and start the production server
docker-compose up web-prod
```
For production, environment variables should be set in your deployment environment or passed directly to docker-compose.

5. Build production image manually:
```bash
docker build -t news-frontend .
docker run -p 3000:3000 --env-file .env.production news-frontend
```

### Docker Configuration

The project includes:
- Multi-stage Dockerfile for optimized builds
- Development configuration with hot-reload and direct `.env` file usage
- Production configuration with optimized builds
- Volume mounts for local development
- Environment variable handling
  - Development: Uses `.env` file directly
  - Production: Uses environment variables from deployment platform
- Network isolation

Key Docker files:
- `Dockerfile`: Multi-stage build configuration
- `docker-compose.yml`: Development and production service definitions
- `.dockerignore`: Excludes unnecessary files from builds

## Project Structure

```
news-aggregator/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication routes
│   ├── api/               # API routes
│   └── page.tsx           # Main page
├── components/            # Reusable components
│   ├── ui/               # UI components
│   └── ...               # Feature components
├── lib/                   # Utility functions
│   ├── hooks/            # Custom hooks
│   ├── services/         # API services
│   └── types/            # TypeScript types
└── public/               # Static assets
```

## Features in Detail

### Authentication Flow
- Register with email/password
- Login with credentials
- Secure token storage
- Automatic token refresh
- Session management

### News Feed System
- Explore all articles
- Personalized feed based on preferences
- Advanced filtering options
- Real-time search
- Pagination with page numbers

### User Preferences
- Category selection
- Author following
- Source filtering
- Preference persistence
- Easy preference updates

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.