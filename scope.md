# Memora – Implementation Plan

## Project Overview

Memora is an interactive world map where people can save and share their memories with others. Users can create accounts, connect with partners, friends, or groups, and mark locations with shared photos, notes, or videos. Each relationship type has a distinct symbol (❤️ for couples, ⭐ for friends, 🎉 for groups), allowing memories to be visually organized.

## Tech Stack

- **Frontend**: Next.js (React-based framework)
- **UI**: Tailwind CSS + shadcn/ui
- **Backend**: Supabase (authentication, database, file storage)
- **Maps**: Mapbox or Leaflet.js
- **Deployment**: Vercel (frontend) + Supabase cloud hosting

## Implementation Phases

### Phase 1: Project Setup & Foundation
- [x] Initialize Next.js project with TypeScript
- [x] Set up Tailwind CSS and shadcn/ui
- [ ] Configure Supabase project and environment variables
- [ ] Set up project structure and folder organization
- [ ] Create basic layout components
- [ ] Set up version control (Git) and deployment pipeline

### Phase 2: Authentication System
- [ ] Set up Supabase authentication
- [ ] Create user registration page/component
- [ ] Create login page/component
- [ ] Implement password reset functionality
- [ ] Create user profile management
- [ ] Add optional gender info to user profiles
- [ ] Implement authentication middleware/guards

### Phase 3: Database Schema & User Management
- [ ] Design and create database tables:
  - [ ] Users table
  - [ ] Connections table (relationships between users)
  - [ ] Memories table (photos, notes, videos)
  - [ ] Locations table
- [ ] Set up Row Level Security (RLS) policies
- [ ] Create database functions and triggers if needed
- [ ] Test database operations

### Phase 4: User Connections System
- [ ] Create connection request functionality
- [ ] Implement connection acceptance/rejection
- [ ] Add different relationship types (couple, friend, group)
- [ ] Create connections management interface
- [ ] Add connection status indicators
- [ ] Implement group creation and management

### Phase 5: Interactive Map Integration
- [ ] Choose between Mapbox and Leaflet.js (research and decide)
- [ ] Set up map component
- [ ] Implement location search functionality
- [ ] Add marker placement on map
- [ ] Create different marker icons for relationship types (❤️, ⭐, 🎉)
- [ ] Implement map clustering for dense areas
- [ ] Add map controls (zoom, pan, etc.)

### Phase 6: Memory Management System
- [ ] Create memory upload functionality
- [ ] Implement file storage with Supabase Storage
- [ ] Add support for photos, notes, and videos
- [ ] Create memory editing/deletion functionality
- [ ] Implement memory privacy settings
- [ ] Add memory tagging and categorization

### Phase 7: Gallery & Memory Display
- [ ] Create shared gallery interface per connection
- [ ] Organize memories by location
- [ ] Implement memory filtering and sorting
- [ ] Add memory detail view/modal
- [ ] Create slideshow/carousel for photos
- [ ] Add video player functionality
- [ ] Implement memory sharing features

### Phase 8: UI/UX Polish
- [ ] Responsive design implementation
- [ ] Dark/light mode toggle
- [ ] Loading states and skeleton screens
- [ ] Error handling and user feedback
- [ ] Accessibility improvements
- [ ] Performance optimizations

### Phase 9: Testing & Quality Assurance
- [ ] Unit tests for core functionality
- [ ] Integration tests for user flows
- [ ] End-to-end testing
- [ ] Performance testing
- [ ] Security testing
- [ ] Cross-browser compatibility testing

### Phase 10: Deployment & Launch
- [ ] Set up production Supabase environment
- [ ] Configure Vercel deployment
- [ ] Set up monitoring and analytics
- [ ] Create deployment documentation
- [ ] Perform final testing in production environment
- [ ] Launch application

## Core Features (MVP Status)

- [ ] ✅ User registration & authentication (neutral signup, with optional gender info)
- [ ] ✅ Ability to connect with another user (couple, friend, group)
- [ ] ✅ Interactive world map with markers
- [ ] ✅ Upload photos, notes, or videos linked to a location
- [ ] ✅ Different icons for different relationship types (❤️, ⭐, 🎉)
- [ ] ✅ Shared gallery per connection (organized by location)

## Current Status

**Phase**: Not Started
**Next Steps**: Begin Phase 1 - Project Setup & Foundation

---

*This document will be updated as implementation progresses. Completed items will be marked with ✅.*
