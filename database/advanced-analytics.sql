-- Advanced Analytics Views and Functions for BoundaryLab
-- Run these in your Supabase SQL Editor

-- 1. User engagement analytics view
CREATE OR REPLACE VIEW user_engagement_analytics AS
SELECT 
    p.id,
    p.display_name,
    p.created_at as joined_at,
    COUNT(DISTINCT usc.id) as scenarios_completed,
    COUNT(DISTINCT fp.id) as forum_posts_created,
    COUNT(DISTINCT fc.id) as forum_comments_made,
    COUNT(DISTINCT us.id) as sparks_sent,
    COUNT(DISTINCT us2.id) as sparks_received,
    COUNT(DISTINCT ugp.id) as terms_learned,
    COALESCE(p.spark_count, 0) as total_sparks_received,
    CASE 
        WHEN COUNT(DISTINCT usc.id) > 10 THEN 'High'
        WHEN COUNT(DISTINCT usc.id) > 5 THEN 'Medium'
        ELSE 'Low'
    END as engagement_level,
    DATE_TRUNC('week', p.created_at) as joined_week
FROM profiles p
LEFT JOIN user_scenario_completions usc ON p.id = usc.user_id
LEFT JOIN forum_posts fp ON p.id = fp.author_id
LEFT JOIN forum_comments fc ON p.id = fc.author_id
LEFT JOIN user_sparks us ON p.id = us.sender_id
LEFT JOIN user_sparks us2 ON p.id = us2.recipient_id
LEFT JOIN user_glossary_progress ugp ON p.id = ugp.user_id
GROUP BY p.id, p.display_name, p.created_at, p.spark_count;

-- 2. Content performance analytics
CREATE OR REPLACE VIEW content_performance_analytics AS
SELECT 
    fp.id,
    fp.title,
    fp.category,
    fp.created_at,
    fp.upvotes,
    COUNT(DISTINCT fc.id) as comment_count,
    COUNT(DISTINCT us.id) as spark_count,
    COUNT(DISTINCT fl.id) as like_count,
    ROUND(
        (fp.upvotes + COUNT(DISTINCT fc.id) * 2 + COUNT(DISTINCT us.id) * 3) / 
        GREATEST(DATE_PART('day', NOW() - fp.created_at), 1), 2
    ) as engagement_score,
    CASE 
        WHEN COUNT(DISTINCT fc.id) > 10 THEN 'Viral'
        WHEN COUNT(DISTINCT fc.id) > 5 THEN 'Popular'
        WHEN COUNT(DISTINCT fc.id) > 1 THEN 'Engaging'
        ELSE 'Quiet'
    END as content_status
FROM forum_posts fp
LEFT JOIN forum_comments fc ON fp.id = fc.post_id
LEFT JOIN user_sparks us ON fp.id = us.post_id
LEFT JOIN forum_likes fl ON fp.id = fl.post_id
WHERE fp.is_published = true
GROUP BY fp.id, fp.title, fp.category, fp.created_at, fp.upvotes;

-- 3. Learning progress analytics
CREATE OR REPLACE VIEW learning_progress_analytics AS
SELECT 
    gt.category,
    COUNT(DISTINCT gt.id) as total_terms,
    COUNT(DISTINCT ugp.id) as times_learned,
    ROUND(COUNT(DISTINCT ugp.id)::numeric / COUNT(DISTINCT gt.id) * 100, 2) as learning_rate,
    AVG(DATE_PART('day', ugp.learned_at - ugp.created_at)) as avg_days_to_learn
FROM glossary_terms gt
LEFT JOIN user_glossary_progress ugp ON gt.id = ugp.term_id AND ugp.is_learned = true
WHERE gt.is_published = true
GROUP BY gt.category;

-- 4. Scenario effectiveness analytics
CREATE OR REPLACE VIEW scenario_effectiveness_analytics AS
SELECT 
    s.id,
    s.title,
    s.category,
    s.difficulty,
    COUNT(DISTINCT usc.id) as completion_count,
    COUNT(DISTINCT CASE WHEN usc.reflection IS NOT NULL AND LENGTH(usc.reflection) > 50 THEN usc.id END) as meaningful_reflections,
    ROUND(
        COUNT(DISTINCT CASE WHEN usc.reflection IS NOT NULL AND LENGTH(usc.reflection) > 50 THEN usc.id END)::numeric / 
        GREATEST(COUNT(DISTINCT usc.id), 1) * 100, 2
    ) as reflection_rate,
    AVG(sc.boundary_strength) as avg_boundary_strength_chosen
FROM scenarios s
LEFT JOIN user_scenario_completions usc ON s.id = usc.scenario_id
LEFT JOIN scenario_choices sc ON usc.choice_id = sc.id
WHERE s.is_published = true
GROUP BY s.id, s.title, s.category, s.difficulty;

-- 5. Community health metrics
CREATE OR REPLACE VIEW community_health_metrics AS
SELECT 
    DATE_TRUNC('week', created_at) as week,
    COUNT(DISTINCT CASE WHEN table_name = 'forum_posts' THEN id END) as new_posts,
    COUNT(DISTINCT CASE WHEN table_name = 'forum_comments' THEN id END) as new_comments,
    COUNT(DISTINCT CASE WHEN table_name = 'user_sparks' THEN id END) as new_sparks,
    COUNT(DISTINCT CASE WHEN table_name = 'profiles' THEN id END) as new_users,
    COUNT(DISTINCT CASE WHEN table_name = 'user_scenario_completions' THEN id END) as scenario_completions
FROM (
    SELECT 'forum_posts' as table_name, id, created_at FROM forum_posts
    UNION ALL
    SELECT 'forum_comments' as table_name, id, created_at FROM forum_comments
    UNION ALL
    SELECT 'user_sparks' as table_name, id, created_at FROM user_sparks
    UNION ALL
    SELECT 'profiles' as table_name, id, created_at FROM profiles
    UNION ALL
    SELECT 'user_scenario_completions' as table_name, id, completed_at as created_at FROM user_scenario_completions
) combined_data
GROUP BY DATE_TRUNC('week', created_at)
ORDER BY week DESC;

-- 6. Function to get user journey insights
CREATE OR REPLACE FUNCTION get_user_journey_insights(user_uuid UUID)
RETURNS TABLE (
    activity_type TEXT,
    activity_date TIMESTAMP WITH TIME ZONE,
    activity_details JSONB,
    days_since_join INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        'Profile Created' as activity_type,
        p.created_at as activity_date,
        jsonb_build_object('display_name', p.display_name) as activity_details,
        0 as days_since_join
    FROM profiles p
    WHERE p.id = user_uuid
    
    UNION ALL
    
    SELECT 
        'Scenario Completed' as activity_type,
        usc.completed_at as activity_date,
        jsonb_build_object(
            'scenario_title', s.title,
            'reflection_length', LENGTH(COALESCE(usc.reflection, ''))
        ) as activity_details,
        DATE_PART('day', usc.completed_at - p.created_at)::INTEGER as days_since_join
    FROM user_scenario_completions usc
    JOIN scenarios s ON usc.scenario_id = s.id
    JOIN profiles p ON usc.user_id = p.id
    WHERE usc.user_id = user_uuid
    
    UNION ALL
    
    SELECT 
        'Forum Post Created' as activity_type,
        fp.created_at as activity_date,
        jsonb_build_object(
            'title', fp.title,
            'category', fp.category,
            'upvotes', fp.upvotes
        ) as activity_details,
        DATE_PART('day', fp.created_at - p.created_at)::INTEGER as days_since_join
    FROM forum_posts fp
    JOIN profiles p ON fp.author_id = p.id
    WHERE fp.author_id = user_uuid
    
    ORDER BY activity_date;
END;
$$ LANGUAGE plpgsql;

-- 7. Function to get trending content
CREATE OR REPLACE FUNCTION get_trending_content(days_back INTEGER DEFAULT 7)
RETURNS TABLE (
    content_type TEXT,
    content_id UUID,
    title TEXT,
    engagement_score NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        'forum_post' as content_type,
        fp.id as content_id,
        fp.title,
        (fp.upvotes * 1.0 + comment_count * 2.0 + spark_count * 3.0) / 
        GREATEST(DATE_PART('day', NOW() - fp.created_at), 1) as engagement_score,
        fp.created_at
    FROM forum_posts fp
    LEFT JOIN (
        SELECT 
            post_id,
            COUNT(*) as comment_count
        FROM forum_comments
        WHERE created_at > NOW() - INTERVAL '1 day' * days_back
        GROUP BY post_id
    ) comments ON fp.id = comments.post_id
    LEFT JOIN (
        SELECT 
            post_id,
            COUNT(*) as spark_count
        FROM user_sparks
        WHERE created_at > NOW() - INTERVAL '1 day' * days_back
        GROUP BY post_id
    ) sparks ON fp.id = sparks.post_id
    WHERE fp.created_at > NOW() - INTERVAL '1 day' * days_back
    ORDER BY engagement_score DESC
    LIMIT 10;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions for authenticated users to view analytics
GRANT SELECT ON user_engagement_analytics TO authenticated;
GRANT SELECT ON content_performance_analytics TO authenticated;
GRANT SELECT ON learning_progress_analytics TO authenticated;
GRANT SELECT ON scenario_effectiveness_analytics TO authenticated;
GRANT SELECT ON community_health_metrics TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_journey_insights(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_trending_content(INTEGER) TO authenticated;
