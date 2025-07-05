# 🔐 Google OAuth Setup Guide for BoundaryLab

## 📋 Complete Setup Checklist

### Step 1: Google Cloud Console Setup

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Create/Select Project**:
   - Create a new project or select your existing BoundaryLab project
   - Note the project ID for reference

3. **Enable Required APIs**:
   - Go to "APIs & Services" → "Library"
   - Search and enable these APIs:
     - **Google+ API** (required for OAuth)
     - **Google Identity Toolkit API** (recommended)

4. **Create OAuth 2.0 Credentials**:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client IDs"
   - Application type: **Web application**
   - Name: `BoundaryLab OAuth`

5. **Configure Authorized URIs**:
   
   **Authorized JavaScript origins**:
   ```
   http://localhost:3000
   http://localhost:3001
   http://localhost:3002
   http://localhost:3003
   http://localhost:3004
   http://localhost:3005
   http://localhost:3006
   https://www.boundarylab.co
   https://boundarylab.co
   https://ydwemzpbtawiairfysdi.supabase.co
   ```
   
   **Authorized redirect URIs**:
   ```
   https://ydwemzpbtawiairfysdi.supabase.co/auth/v1/callback
   https://www.boundarylab.co/auth/v1/callback
   ```

6. **Copy Your Credentials**:
   - **Client ID**: `1234567890-abcdefghijklmnop.apps.googleusercontent.com`
   - **Client Secret**: `GOCSPX-your_secret_here`

### Step 2: Supabase Configuration

1. **Open Supabase Dashboard**: https://app.supabase.com/
2. **Go to Authentication**: Settings → Authentication → Providers
3. **Enable Google Provider**:
   - Toggle "Enable Sign in with Google" to **ON**
   - Paste your **Client ID** from Google Console
   - Paste your **Client Secret** from Google Console
   - Callback URL should be: `https://ydwemzpbtawiairfysdi.supabase.co/auth/v1/callback`

4. **Save Configuration**

### Step 3: Test Your Setup

1. **Local Development**:
   - Start your dev server: `npm run dev`
   - Go to: http://localhost:3000/login
   - Click "Google" button
   - Should redirect to Google OAuth consent screen

2. **Production**:
   - Deploy your app
   - Test Google sign-in on live domain
   - Verify users are created in Supabase Auth

## 🔧 Code Implementation

The Google OAuth is now implemented in your app:

### Login Page Features:
- ✅ Google sign-in button (functional)
- ✅ Error handling for OAuth flows
- ✅ Automatic redirect after successful login

### Registration Page Features:
- ✅ "Continue with Google" button
- ✅ Same OAuth flow as login
- ✅ Automatic profile creation

### Key Functions Added:
```javascript
// Login page
const handleGoogleLogin = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/`
    }
  })
}

// Registration page  
const handleGoogleSignUp = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/`
    }
  })
}
```

## 🚨 Common Issues & Solutions

### Issue 1: "Error 400: redirect_uri_mismatch"
**Solution**: Check your authorized redirect URIs in Google Console match exactly:
- `https://ydwemzpbtawiairfysdi.supabase.co/auth/v1/callback`
- `https://www.boundarylab.co/auth/v1/callback`

### Issue 2: "requested path is invalid" error
**Solution**: 
- Make sure your Google Cloud Console has the correct redirect URI
- If using a custom domain, use `https://www.boundarylab.co/auth/v1/callback`
- If using default Supabase domain, use `https://ydwemzpbtawiairfysdi.supabase.co/auth/v1/callback`
- The app now automatically handles OAuth callbacks and cleans up URLs
- Clear browser cache and cookies if the error persists
**Solution**: 
- Verify OAuth consent screen is configured
- Add test users if in development mode
- Publish app for production use

### Issue 3: Users not created in database
**Solution**: Check that your `handle_new_user()` trigger is working:
```sql
-- Verify trigger exists
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
```

### Issue 4: Local development issues
**Solution**: Make sure you have:
- `http://localhost:3000` in authorized origins
- `https://ydwemzpbtawiairfysdi.supabase.co/auth/v1/callback` in redirect URIs

### Issue 5: "requested path is invalid" error
**Solution**: 
- Simplified redirect to root path (`/`) instead of specific routes
- Landing page now handles authenticated users automatically
- Clear browser cache and cookies if the error persists

## 🎯 Testing Checklist

- [ ] Google Cloud Console project created
- [ ] APIs enabled (Google+ API)
- [ ] OAuth credentials created
- [ ] Authorized URIs configured correctly
- [ ] Supabase Google provider enabled
- [ ] Client ID and Secret added to Supabase
- [ ] Local testing successful
- [ ] Production testing successful
- [ ] User profiles auto-created
- [ ] Redirect to landing page working
- [ ] Authenticated users redirected to app

## 🔐 Security Best Practices

1. **Environment Variables**: Store sensitive data in environment variables
2. **HTTPS Only**: Use HTTPS in production for OAuth callbacks
3. **Domain Verification**: Verify your domain in Google Console
4. **Scopes**: Only request necessary OAuth scopes
5. **Rate Limiting**: Implement rate limiting for auth endpoints

## 🎨 UI Enhancements Added

- **Interactive Google Button**: Hover effects and animations
- **Visual Feedback**: Loading states and error handling
- **Consistent Styling**: Matches your brand colors
- **Responsive Design**: Works on mobile and desktop
- **Accessibility**: Proper ARIA labels and keyboard navigation

Your Google OAuth integration is now ready! Just add your credentials to Supabase and you'll have a seamless social login experience. 🚀
