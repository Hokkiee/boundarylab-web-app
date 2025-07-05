# 🔐 OAuth Testing Guide

## Pre-Test Setup

### 1. Supabase Configuration
**CRITICAL**: Update your Supabase dashboard with these exact settings:

1. **Go to**: Supabase Dashboard → Authentication → URL Configuration
2. **Site URL**: `https://www.boundarylab.co`
3. **Redirect URLs**: Add `https://www.boundarylab.co/auth/v1/callback`

**Note**: The redirect URL in Supabase should match what Google expects, but Supabase uses a different internal callback system.

### 2. Google OAuth Configuration
Ensure your Google OAuth client has:
- **Authorized JavaScript origins**: `https://www.boundarylab.co`
- **Authorized redirect URIs**: `https://www.boundarylab.co/auth/v1/callback`

**IMPORTANT**: The redirect URI must include `/v1/` as shown above!

## Test Scenarios

### 🧪 Test 1: Local OAuth Test Page
1. Open `oauth-test.html` in browser
2. Click "Test Supabase Connection" → Should pass
3. Click "Test Google OAuth" → Should redirect to Google
4. **Expected**: After Google auth, redirects to `https://www.boundarylab.co/auth/callback`

### 🧪 Test 2: Local Development Server
1. Run `npm run dev` (starts on http://localhost:3005)
2. Go to Login page
3. Click "Sign in with Google"
4. **Expected**: Uses production redirect URL, not localhost

### 🧪 Test 3: Production Build
1. Run `npm run build && npm run preview`
2. Test OAuth flow in preview server
3. **Expected**: Same behavior as development

## Common Issues & Solutions

### Issue: "Invalid redirect URL"
**Solution**: Supabase Site URL doesn't match redirect URL domain
- Check Site URL is `https://www.boundarylab.co`
- Check Redirect URLs include `https://www.boundarylab.co/auth/callback`

### Issue: "OAuth client not found"
**Solution**: Google OAuth client misconfigured
- Verify authorized origins and redirect URIs in Google Console

### Issue: "CORS error"
**Solution**: Domain mismatch
- Ensure all URLs use the same domain (www.boundarylab.co)

## Success Criteria

✅ OAuth test page successfully initiates Google OAuth  
✅ Google OAuth redirects to correct callback URL  
✅ OAuthCallback.jsx processes the auth response  
✅ User is authenticated and redirected to dashboard  
✅ No console errors during the flow  
✅ Works consistently across all test scenarios  

## Next Steps After OAuth Works

1. Test the full app flow end-to-end
2. Test announcement system in production
3. Complete ALPHA_RELEASE_CHECKLIST.md
4. Deploy to production domain

## Debug Information

If OAuth fails, check:
1. Browser console for errors
2. Network tab for failed requests
3. Supabase Auth logs
4. Google OAuth client logs

The key insight is that **all OAuth flows should use the production URL** regardless of where the app is running, because that's where users will actually access the app.
