# Database Setup Guide

## Prerequisites
- You have a Supabase project set up
- Your environment variables are configured in `.env.local`

## Step 1: Run Database Migrations

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project
3. Navigate to **SQL Editor** in the left sidebar
4. Run the following migrations in order:

### Migration 1: Initial Schema
Copy and paste the contents of `supabase/migrations/001_initial_schema.sql` and run it.

### Migration 2: RLS Policies
Copy and paste the contents of `supabase/migrations/002_rls_policies.sql` and run it.

### Migration 3: User Profile Trigger
Copy and paste the contents of `supabase/migrations/003_user_profile_trigger.sql` and run it.

## Step 2: Verify Setup

1. Go to **Table Editor** in your Supabase dashboard
2. You should see the following tables:
   - `users`
   - `connections`
   - `memories`

## Step 3: Test the Application

1. Start your development server: `npm run dev`
2. Sign up for a new account
3. Navigate to `/profile`
4. The profile page should now work correctly

## Troubleshooting

### If you get "Database not ready" errors:
- Make sure all migrations have been run successfully
- Check that the tables exist in your Supabase dashboard
- Verify your environment variables are correct

### If you get RLS policy errors:
- Make sure the RLS policies were created successfully
- Check that the `auth.uid()` function is working

### If the profile trigger doesn't work:
- New users might not get profiles automatically created
- You can manually create a profile for existing users by running:
  ```sql
  INSERT INTO public.users (id, email, name, gender)
  SELECT id, email, COALESCE(raw_user_meta_data->>'name', 'User'), raw_user_meta_data->>'gender'
  FROM auth.users
  WHERE id NOT IN (SELECT id FROM public.users);
  ```
