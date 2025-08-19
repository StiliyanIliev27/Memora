# Troubleshooting Guide - Supabase Authentication

## "Failed to fetch" Error Solutions

### 1. Check Environment Variables

Make sure your `.env.local` file exists and contains the correct values:

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Important Notes:**
- The URL should start with `https://` and end with `.supabase.co`
- The anon key should be a long string starting with `eyJ...`
- Make sure there are no extra spaces or quotes around the values

### 2. Verify Supabase Project Settings

1. Go to your Supabase dashboard
2. Navigate to Settings > API
3. Copy the "Project URL" and "anon public" key
4. Make sure these match your `.env.local` file

### 3. Check Supabase Authentication Settings

1. Go to Authentication > Settings in your Supabase dashboard
2. Make sure "Enable email confirmations" is configured as needed
3. Check that your site URL is added to the allowed redirect URLs

### 4. Common Issues and Solutions

#### Issue: Environment variables not loading
**Solution:** Restart your development server after adding `.env.local`

#### Issue: CORS errors
**Solution:** Add your localhost URL to Supabase allowed origins:
- Go to Settings > API in Supabase
- Add `http://localhost:3000` to "Additional Allowed Origins"

#### Issue: Network connectivity
**Solution:** Check if you can access your Supabase project URL directly in the browser

#### Issue: Invalid API key
**Solution:** Regenerate your API keys in Supabase dashboard

### 5. Debug Steps

1. **Check the browser console** for detailed error messages
2. **Use the EnvChecker component** on the signup page to verify configuration
3. **Test the connection** by visiting your Supabase project URL
4. **Check network tab** in browser dev tools for failed requests

### 6. Testing Your Setup

1. Start the development server: `npm run dev`
2. Visit `http://localhost:3000/signup`
3. Check the "Environment Check" card at the top
4. Try to sign up with a test email
5. Check browser console for any error messages

### 7. Still Having Issues?

If you're still experiencing problems:

1. **Check Supabase Status**: Visit https://status.supabase.com
2. **Verify Project Status**: Make sure your Supabase project is active
3. **Check Billing**: Ensure your project hasn't been paused due to billing
4. **Contact Support**: Use the Supabase Discord or GitHub issues

### 8. Quick Fix Commands

```bash
# Restart development server
npm run dev

# Clear Next.js cache
rm -rf .next
npm run dev

# Check if environment variables are loaded
echo $NEXT_PUBLIC_SUPABASE_URL
```
