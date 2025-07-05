# Announcement System Setup Guide

## Overview
This guide walks you through setting up the announcement system for production use. The system includes:
- Database schema for storing announcements
- API services for CRUD operations
- User-facing announcement page
- Admin interface for managing announcements
- Role-based access control

## Step 1: Database Setup

1. **Run the database migration:**
   ```bash
   # Execute the SQL file in your Supabase SQL editor
   # File: database/announcements-schema.sql
   ```

2. **Set up your first admin user:**
   ```sql
   -- Replace 'your-user-id' with your actual user ID
   UPDATE profiles 
   SET is_admin = true 
   WHERE id = 'your-user-id';
   ```

3. **Verify the setup:**
   ```sql
   -- Check if the announcements table exists
   SELECT * FROM announcements LIMIT 1;
   
   -- Check if you have admin access
   SELECT is_admin FROM profiles WHERE id = auth.uid();
   ```

## Step 2: Environment Configuration

Your `.env` file should already have the Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Step 3: Admin Access Setup

1. **Create your first admin user:**
   - Register a new account or use an existing one
   - Get your user ID from the Supabase dashboard
   - Run the SQL update to make yourself an admin

2. **Access the admin interface:**
   - Navigate to `/admin/announcements`
   - You should see the admin dashboard

## Step 4: Usage Instructions

### For End Users:
- Visit `/announcements` to see all published announcements
- Filter by category using the sidebar
- No authentication required for viewing

### For Admins:
- Visit `/admin/announcements` to manage announcements
- Create new announcements with the "New Announcement" button
- Edit existing announcements by clicking the edit icon
- Toggle featured/published status with the action buttons
- Delete announcements with the trash icon

## Step 5: Content Management

### Creating Announcements:
1. Click "New Announcement" in the admin interface
2. Fill in the required fields:
   - **Title**: Catchy title for your announcement
   - **Content**: Main announcement text
   - **Category**: Choose from predefined categories
   - **Author Name**: Who is publishing this
   - **Tags**: Comma-separated tags for organization
   - **Featured**: Whether to highlight this announcement
   - **Published**: Whether to make it visible to users

### Categories:
- **Product**: Product updates and launches
- **Features**: New feature announcements
- **Community**: Community-related news
- **Content**: Content updates and additions
- **Technical**: Technical improvements and fixes
- **Upcoming**: Future features and roadmap items

## Step 6: Security Considerations

### Row Level Security (RLS):
- All users can read published announcements
- Only admin users can create, update, or delete announcements
- Unpublished announcements are hidden from non-admin users

### Admin Role:
- Admin status is stored in the `profiles.is_admin` column
- Admin check is performed both client-side and server-side
- Admin routes are protected by authentication

## Step 7: Customization Options

### Adding New Categories:
1. Update the database check constraint:
   ```sql
   ALTER TABLE announcements 
   DROP CONSTRAINT IF EXISTS announcements_category_check;
   
   ALTER TABLE announcements 
   ADD CONSTRAINT announcements_category_check 
   CHECK (category IN ('product', 'features', 'community', 'content', 'technical', 'upcoming', 'your-new-category'));
   ```

2. Update the categories array in both:
   - `src/pages/AnnouncementPage.jsx`
   - `src/pages/AdminAnnouncementPage.jsx`

### Styling Customization:
- All components use Tailwind CSS
- Colors are defined in your existing theme
- Modify the gradient and color schemes as needed

## Step 8: Production Deployment

### Before Going Live:
1. **Test the complete flow:**
   - Create a test announcement as admin
   - Verify it appears on the public page
   - Test all CRUD operations

2. **Set up monitoring:**
   - Monitor database performance
   - Set up error tracking for the admin interface
   - Consider adding analytics for announcement views

3. **Backup strategy:**
   - Ensure regular backups of the announcements table
   - Test restoration procedures

### Performance Considerations:
- Announcements are loaded on page visit (not real-time)
- Consider adding pagination for large numbers of announcements
- Use database indexing for better query performance

## Troubleshooting

### Common Issues:

1. **"Access denied" error:**
   - Ensure your user has `is_admin = true` in the profiles table
   - Check that you're authenticated

2. **Announcements not loading:**
   - Verify Supabase connection
   - Check RLS policies are correctly set up
   - Ensure announcements are published

3. **Database errors:**
   - Verify the schema was created correctly
   - Check for any missing columns or constraints

### Getting Help:
- Check the browser console for error messages
- Verify network requests in the developer tools
- Check Supabase logs for database-related issues

## Future Enhancements

Consider adding these features later:
- Rich text editor for announcement content
- Image uploads for announcements
- Email notifications for new announcements
- Announcement scheduling
- Analytics for announcement views
- Comment system for announcements
- Multi-language support

## Conclusion

Your announcement system is now ready for production! The system provides a solid foundation with:
- Secure admin access
- User-friendly public interface
- Flexible content management
- Responsive design
- Database-driven content

Start by creating your first announcement and testing the complete workflow.
