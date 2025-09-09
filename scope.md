# Memora – Implementation Plan

## Project Overview

Memora is an interactive world map where people can save and share their memories with others. Users can create accounts, connect with partners, friends, or groups, and mark locations with shared photos, notes, or videos. Each relationship type has a distinct symbol (❤️ for couples, ⭐ for friends, 🎉 for groups), allowing memories to be visually organized.

## Tech Stack

- **Frontend**: Next.js (React-based framework)
- **UI**: Tailwind CSS + shadcn/ui
- **Backend**: Supabase (authentication, database, file storage)
- **Maps**: Mapbox GL JS (interactive maps with clustering)
- **Deployment**: Vercel (frontend) + Supabase cloud hosting

## Implementation Phases

### Phase 1: Project Setup & Foundation ✅
- [x] Initialize Next.js project with TypeScript
- [x] Set up Tailwind CSS and shadcn/ui
- [x] Configure Supabase project and environment variables
- [x] Set up project structure and folder organization
- [x] Create basic layout components
- [x] Set up version control (Git) and deployment pipeline

### Phase 2: Authentication System ✅
- [x] Set up Supabase authentication
- [x] Create user registration page/component
- [x] Create login page/component
- [x] Implement password reset functionality
- [x] Create reset password page with enhanced UX
- [x] Create user profile management
- [x] Add optional gender info to user profiles
- [x] Implement authentication middleware/guards

### Phase 3: Database Schema & User Management ✅
- [x] Design and create database tables:
  - [x] Users table
  - [x] Connections table (relationships between users)
  - [x] Memories table (photos, notes, videos)
  - [x] Locations table (integrated into memories)
- [x] Set up Row Level Security (RLS) policies
- [x] Create database functions and triggers if needed
- [x] Test database operations

### Phase 4: User Connections System ✅
- [x] Create connection request functionality
- [x] Implement connection acceptance/rejection
- [x] Add different relationship types (couple, friend, group)
- [x] Create connections management interface
- [x] Add connection status indicators
- [ ] Implement group creation and management

### Phase 5: Interactive Map Integration ✅
- [x] Choose between Mapbox and Leaflet.js (Mapbox selected)
- [x] Set up map component with full-screen layout
- [x] Implement location search functionality
- [x] Add marker placement on map
- [x] Create different marker icons for relationship types (❤️, ⭐, 🎉)
- [x] Implement map clustering for dense areas
- [x] Add map controls (zoom, pan, etc.)

### Phase 6: Immersive Layout & Navigation ✅
- [x] Create full-screen map background
- [x] Implement floating left navigation bar (300px width)
- [x] Add app logo and branding in navigation
- [x] Create active connections display with avatars and names
- [x] Implement collapsible connections list with search
- [x] Add action buttons (Add Memory, Create Connection)
- [x] Create top-right profile dropdown (32px avatar)
- [x] Implement modal-based interactions (no page navigation)
- [x] Add hover effects and active states for navigation items

### Phase 7: Memory Management System ✅
- [x] Create memory upload functionality (modal)
- [x] Implement file storage with Supabase Storage
- [x] Add support for photos, notes, and videos
- [x] Create memory editing/deletion functionality
- [x] Implement memory privacy settings (personal vs shared)
- [x] Add memory tagging and categorization (couple, friend, group, personal)
- [x] Connect memories to map markers
- [x] Implement multiple file uploads (up to 10 photos, 5 videos)
- [x] Add file preview functionality with modal
- [x] Create reusable deletion confirmation modal
- [x] Implement file deletion with owner permissions
- [x] Add manual file upload to existing memories

### Phase 8: Gallery & Memory Display ✅
- [x] Create shared gallery interface per connection
- [x] Organize memories by location
- [x] Implement memory filtering and sorting
- [x] Add memory detail view/modal
- [x] Create slideshow/carousel for photos
- [x] Add video player functionality
- [x] Implement memory sharing features
- [x] Add connection details modal with shared memories
- [x] Implement clickable memory cards in connection modal
- [x] Add memory type indicators (personal, couple, friend, group)
- [x] Display shared user information in memory details

### Phase 9: Real-time Features ✅
- [x] Implement real-time active status tracking
- [x] Add live notifications for new connections
- [x] Create real-time memory updates
- [x] Implement presence indicators
- [x] Add real-time connection status updates
- [x] Implement immediate UI updates for connection actions
- [ ] Add live chat functionality (future enhancement)

### Phase 10: UI/UX Polish ✅
- [x] Responsive design implementation
- [x] Loading states and skeleton screens
- [x] Error handling and user feedback
- [x] Toast notification system implementation
- [x] Modal spacing and button layout improvements
- [x] File preview modal with navigation
- [x] Reusable deletion confirmation modal
- [x] Improved button spacing and UX
- [ ] Dark/light mode toggle
- [ ] Accessibility improvements
- [ ] Performance optimizations

### Phase 11: Testing & Quality Assurance (deferred)
- [x] Unit tests for core functionality (basic coverage in place)
- [ ] Integration tests for user flows (deferred)
- [ ] End-to-end testing (deferred)
- [ ] Performance testing (deferred)
- [ ] Security testing (deferred)
- [ ] Cross-browser compatibility testing (deferred)

### Phase 12: Deployment & Launch
- [ ] Set up production Supabase environment
- [ ] Configure Vercel deployment
- [ ] Set up monitoring and analytics
- [ ] Create deployment documentation
- [ ] Perform final testing in production environment
- [ ] Launch application

## Core Features (MVP Status)

- [x] ✅ User registration & authentication (neutral signup, with optional gender info)
- [x] ✅ Ability to connect with another user (couple, friend, group)
- [x] ✅ Interactive world map with markers
- [x] ✅ Upload photos, notes, or videos linked to a location
- [x] ✅ Different icons for different relationship types (❤️, ⭐, 🎉)
- [x] ✅ Shared gallery per connection (organized by location)
- [x] ✅ Memory editing and deletion functionality
- [x] ✅ File preview and management system
- [x] ✅ Real-time connection status updates
- [x] ✅ Professional modal interactions and UX

## Current Layout & Navigation

### **Immersive Map Interface**
- **Full-screen map background** using Mapbox GL JS
- **Floating left navigation** (300px width) with backdrop blur
- **Top-right profile dropdown** with 32px circular avatar
- **Modal-based interactions** - no page navigation for actions

### **Left Navigation Features**
- **App branding** with logo and name
- **Active connections section** with:
  - Connection count badge
  - Collapsible list (top 5 connections)
  - Search functionality
  - Relationship type icons (❤️, ⭐, 🎉)
  - Add connection button (+ icon)
- **Action buttons** for common tasks
- **Hover effects** and **active states**

### **Profile Dropdown**
- **My Profile** - Edit profile information
- **Settings** - App preferences and account settings
- **Logout** - Sign out functionality

### **Map Controls**
- **Zoom controls** (top-right)
- **Search bar** (top-left)
- **Add memory button** (bottom-right, floating)
- **Memory markers** with relationship type icons
- **Hover effects** on markers

## Current Status

**Phase**: Phase 12 - Deployment & Launch (in progress)
**Next Steps**: Set up production Supabase and Vercel, configure monitoring, finalize docs, run smoke tests, launch

**Key Achievements:**
- ✅ Immersive full-screen map interface
- ✅ Floating navigation with active connections
- ✅ Modal-based user interactions
- ✅ Real-time connection management
- ✅ Mapbox integration with custom markers
- ✅ Profile and settings modals
- ✅ Complete memory management system
- ✅ File upload and preview functionality
- ✅ Connection details and shared memories
- ✅ Professional UI/UX with toast notifications
- ✅ Reusable components and improved spacing
 - ✅ Test framework set up (Jest + RTL) and initial unit tests added:
   - `locationService` core behaviors
   - UI components: Button, Dialog, DeleteConfirmationModal
   - FloatingNavigation tests in progress

---

*This document will be updated as implementation progresses. Completed items will be marked with ✅.*
