# 🔔 Notification System Setup Guide

## Database Setup

### Step 1: Run the SQL Schema
1. Open your Supabase dashboard
2. Go to the SQL Editor
3. Copy and run the SQL from `database/notifications-schema.sql`
4. This will create:
   - `notifications` table
   - Necessary indexes for performance
   - Row Level Security policies
   - Helper functions

### Step 2: Verify Table Creation
Run this query to verify the table was created:
```sql
SELECT * FROM notifications LIMIT 5;
```

### Step 3: Test Notification Creation
You can test the notification system by manually creating a notification:
```sql
INSERT INTO notifications (user_id, type, title, message, data)
VALUES (
  'your-user-id-here',
  'system',
  'Welcome! 🎉',
  'Welcome to BoundaryLab! Start exploring scenarios and connecting with the community.',
  '{}'
);
```

## Features Implemented

### ✅ Real-time Toast Notifications
- Appear in top-right corner
- Auto-dismiss after 5 seconds
- Different colors for different notification types
- Smooth slide-in/out animations

### ✅ Notification Bell in Sidebar
- Shows unread count with red badge
- Click to open notification panel
- Mark individual notifications as read
- "Mark all as read" functionality

### ✅ Database Integration
- Persistent notifications across devices
- Real-time updates using Supabase subscriptions
- Automatic cleanup of old notifications
- Row Level Security for user privacy

### ✅ Notification Types
- **Spark Notifications**: When someone sends you a spark
- **Forum Reply**: When someone replies to your post
- **System Notifications**: Welcome messages, updates, etc.
- **Achievement**: When you complete milestones
- **Profile View**: When someone views your profile

### ✅ Integration Points
- Spark system automatically creates notifications
- Forum interactions trigger notifications
- Achievement system can trigger notifications
- Welcome notifications for new users

## Usage Examples

### Creating Notifications in Code
```javascript
import { useNotifications } from '../contexts/NotificationContext'

function MyComponent() {
  const { createSparkNotification, showToast } = useNotifications()
  
  // Create a spark notification
  await createSparkNotification(recipientId, senderName, postTitle)
  
  // Show a toast (for testing)
  showToast({
    type: 'spark',
    title: 'Test Notification',
    message: 'This is a test notification!'
  })
}
```

### Checking Notification Count
```javascript
import { notificationService } from '../services/notificationService'

// Get unread count
const unreadCount = await notificationService.getUnreadCount(userId)

// Get all notifications
const notifications = await notificationService.getUserNotifications(userId)
```

## Testing the System

1. **Sign in with two different accounts**
2. **Send a spark from one account to another**
3. **Check the notification bell** - should show badge with count
4. **Check for toast notification** - should appear in top-right
5. **Click notification bell** - should show notification panel
6. **Mark notifications as read** - badge should update

## Demo Mode Support

The notification system works in both:
- **Database mode**: Full persistence and real-time updates
- **Demo mode**: Local notifications for testing without database

## Next Steps

You can extend the system by:
- Adding email notifications
- Adding push notifications
- Creating notification preferences
- Adding more notification types
- Adding notification sounds
- Creating notification templates
