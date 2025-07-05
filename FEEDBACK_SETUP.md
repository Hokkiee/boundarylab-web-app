# Feedback Database Setup Guide

## Overview
This guide will help you set up a complete feedback system with database storage, admin dashboard, and user feedback management.

## 1. Database Setup

### Step 1: Run the SQL Schema
Execute the SQL file to create the necessary tables:

```bash
# In your Supabase dashboard SQL editor, run:
psql -f database/feedback-schema.sql
```

Or copy and paste the contents of `database/feedback-schema.sql` into your Supabase SQL editor.

### Step 2: Verify Tables Created
The following tables should be created:
- `feedback` - Stores user feedback submissions
- `feedback_responses` - Stores admin responses to feedback
- `feedback_with_user_details` - View for admin dashboard

### Step 3: Set Up Admin Users
To make a user an admin, update their profile:

```sql
UPDATE profiles 
SET is_admin = true 
WHERE user_id = 'USER_ID_HERE';
```

## 2. Frontend Integration

### Step 1: Update Feedback Service
The `feedbackService.js` is already created and handles:
- ✅ Submitting feedback to database
- ✅ Retrieving user's own feedback
- ✅ Admin functions (view all, update status, etc.)

### Step 2: Update Feedback Page
The `FeedbackPage.jsx` has been updated to:
- ✅ Use the database service instead of console.log
- ✅ Handle errors properly
- ✅ Provide user feedback on success/failure

### Step 3: Admin Dashboard
A complete admin dashboard has been created at `AdminFeedbackPage.jsx`:
- ✅ View all feedback with filtering
- ✅ Update status and priority
- ✅ Statistics overview
- ✅ User information display

## 3. Routing Setup

### Add Admin Route
Add the admin feedback route to your `App.jsx`:

```jsx
// Import the admin page
import AdminFeedbackPage from './pages/AdminFeedbackPage'

// Add route (protect with admin check)
<Route 
  path="/admin/feedback" 
  element={<AdminFeedbackPage user={user} />} 
/>
```

## 4. Security & Permissions

### Row Level Security (RLS)
The database schema includes RLS policies that:
- ✅ Users can only see their own feedback
- ✅ Admins can see all feedback
- ✅ Only admins can update feedback status
- ✅ Users can see public responses to their feedback

### Admin Role Checking
To implement admin role checking in your frontend:

```jsx
// Check if user is admin
const checkIsAdmin = async (user) => {
  const { data } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('user_id', user.id)
    .single()
  
  return data?.is_admin || false
}
```

## 5. Features Included

### User Features
- ✅ Submit feedback with categories (bug, feature, general, appreciation)
- ✅ Optional email for follow-up
- ✅ View their own feedback history
- ✅ See public admin responses

### Admin Features
- ✅ View all feedback with filtering
- ✅ Update feedback status (new, reviewed, in_progress, resolved, closed)
- ✅ Set priority levels (low, medium, high, urgent)
- ✅ Add internal notes
- ✅ Respond to users (public/private responses)
- ✅ Statistics dashboard
- ✅ User information display

### Database Features
- ✅ Proper indexing for performance
- ✅ Automatic timestamps
- ✅ Data validation with constraints
- ✅ Soft deletes (user references set to null)
- ✅ Response tracking
- ✅ Admin audit trail

## 6. Next Steps

### Immediate
1. Run the SQL schema in your Supabase instance
2. Test the feedback submission on `/feedback`
3. Set up your first admin user
4. Access admin dashboard at `/admin/feedback`

### Optional Enhancements
1. **Email Notifications**: Send emails when feedback is submitted/responded to
2. **File Attachments**: Allow users to attach screenshots for bug reports
3. **Feedback Categories**: Add more specific subcategories
4. **Auto-Assignment**: Automatically assign feedback to team members
5. **Public Feedback Board**: Show feature requests publicly for voting
6. **Slack/Discord Integration**: Notify team channels of new feedback

### Email Integration Example
```jsx
// In your feedback service, add email notification
import { sendEmail } from './emailService'

async submitFeedback(feedbackData) {
  // ... existing code ...
  
  // Notify admins of new feedback
  await sendEmail({
    to: 'admin@boundarylab.app',
    subject: `New ${feedbackData.type} feedback`,
    template: 'new-feedback',
    data: { feedback: data }
  })
}
```

## 7. Environment Variables

Add these to your `.env` if using email notifications:
```
VITE_FEEDBACK_EMAIL=admin@yourdomain.com
VITE_ADMIN_NOTIFICATION_ENABLED=true
```

## 8. Monitoring & Analytics

Consider adding:
- Feedback submission rate tracking
- Response time metrics
- User satisfaction surveys
- Feature request voting
- Bug report resolution tracking

This feedback system provides a solid foundation for collecting, managing, and responding to user feedback in your BoundaryLab application.
