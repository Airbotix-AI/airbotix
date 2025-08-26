-- Seed data for Airbotix Database
-- Sample data for development and testing

-- Insert sample partners
INSERT INTO partners (id, name, type, description, contact_email, website_url, is_active) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'Lincoln Elementary School', 'school', 'Progressive elementary school focused on STEM education', 'info@lincolnelem.edu', 'https://lincolnelem.edu', true),
    ('550e8400-e29b-41d4-a716-446655440002', 'City Science Museum', 'organization', 'Interactive science museum with maker spaces', 'education@citysciencemuseum.org', 'https://citysciencemuseum.org', true),
    ('550e8400-e29b-41d4-a716-446655440003', 'TechForward Inc', 'company', 'Educational technology company providing robotics kits', 'partnerships@techforward.com', 'https://techforward.com', true),
    ('550e8400-e29b-41d4-a716-446655440004', 'Roosevelt High School', 'school', 'High school with advanced STEM programs', 'stem@roosevelthigh.edu', 'https://roosevelthigh.edu', true),
    ('550e8400-e29b-41d4-a716-446655440005', 'Community Learning Center', 'organization', 'After-school and summer programs for underserved communities', 'programs@communitylc.org', 'https://communitylc.org', true);

-- Insert sample workshops
INSERT INTO workshops (id, title, slug, description, content, duration_minutes, max_participants, min_grade, max_grade, difficulty_level, topics, materials_needed, learning_objectives, is_published) VALUES
    ('660e8400-e29b-41d4-a716-446655440001', 
     'Introduction to Robotics', 
     'intro-robotics',
     'Learn the basics of robotics with hands-on building and programming activities.',
     '# Introduction to Robotics\n\nThis workshop introduces students to the fundamentals of robotics through hands-on activities.\n\n## What We''ll Cover\n- Basic robot components\n- Simple programming concepts\n- Building your first robot\n\n## Activities\n1. Robot anatomy exploration\n2. Programming basic movements\n3. Challenge: Navigate a maze',
     90,
     20,
     3,
     6,
     'beginner',
     ARRAY['robotics', 'programming', 'engineering'],
     ARRAY['Robot kit', 'Computer/tablet', 'Workspace'],
     ARRAY['Understand basic robot components', 'Program simple robot movements', 'Apply problem-solving skills'],
     true),
    
    ('660e8400-e29b-41d4-a716-446655440002',
     'AI and Machine Learning Basics',
     'ai-ml-basics',
     'Explore artificial intelligence and machine learning concepts through interactive demos and simple projects.',
     '# AI and Machine Learning Basics\n\nDiscover the world of AI and machine learning through engaging activities.\n\n## Learning Goals\n- Understand what AI is\n- Explore machine learning concepts\n- Create simple AI projects\n\n## Projects\n1. Image recognition game\n2. Chatbot creation\n3. Prediction models',
     120,
     15,
     6,
     12,
     'intermediate',
     ARRAY['artificial-intelligence', 'machine-learning', 'computer-science'],
     ARRAY['Computer/laptop', 'Internet access', 'Scratch for AI tools'],
     ARRAY['Define artificial intelligence', 'Understand machine learning basics', 'Create simple AI applications'],
     true),
    
    ('660e8400-e29b-41d4-a716-446655440003',
     'Advanced Robot Programming',
     'advanced-robot-programming',
     'Deep dive into robot programming with sensors, actuators, and complex behaviors.',
     '# Advanced Robot Programming\n\nTake your robotics skills to the next level with advanced programming techniques.\n\n## Topics Covered\n- Sensor integration\n- Complex behaviors\n- Autonomous navigation\n- Robot communication\n\n## Projects\n1. Sensor-based decision making\n2. Multi-robot coordination\n3. Autonomous delivery robot',
     150,
     12,
     9,
     12,
     'advanced',
     ARRAY['robotics', 'programming', 'sensors', 'automation'],
     ARRAY['Advanced robot kit', 'Multiple sensors', 'Programming environment', 'Testing space'],
     ARRAY['Implement sensor-based programming', 'Design autonomous behaviors', 'Debug complex robot systems'],
     true),
    
    ('660e8400-e29b-41d4-a716-446655440004',
     'Build Your Own Smart Home',
     'smart-home-iot',
     'Learn about Internet of Things (IoT) by creating smart home devices and systems.',
     '# Build Your Own Smart Home\n\nExplore IoT concepts by building smart home devices.\n\n## What You''ll Build\n- Smart lights\n- Temperature monitoring\n- Security system\n- Home automation\n\n## Skills Developed\n1. IoT fundamentals\n2. Sensor networks\n3. Mobile app integration\n4. Data visualization',
     180,
     10,
     7,
     12,
     'intermediate',
     ARRAY['iot', 'smart-home', 'sensors', 'programming', 'mobile-apps'],
     ARRAY['Microcontroller kit', 'Sensors', 'WiFi module', 'Mobile device'],
     ARRAY['Understand IoT principles', 'Build connected devices', 'Create mobile interfaces'],
     true);

-- Insert sample workshop sessions
INSERT INTO workshop_sessions (id, workshop_id, partner_id, title, description, start_time, end_time, location, max_participants, status) VALUES
    ('770e8400-e29b-41d4-a716-446655440001',
     '660e8400-e29b-41d4-a716-446655440001',
     '550e8400-e29b-41d4-a716-446655440001',
     'Introduction to Robotics - Lincoln Elementary',
     'Beginner robotics workshop for elementary students',
     '2024-02-15 10:00:00+00',
     '2024-02-15 11:30:00+00',
     'Lincoln Elementary School - STEM Lab',
     20,
     'scheduled'),
    
    ('770e8400-e29b-41d4-a716-446655440002',
     '660e8400-e29b-41d4-a716-446655440002',
     '550e8400-e29b-41d4-a716-446655440002',
     'AI Basics - Science Museum Workshop',
     'Interactive AI workshop at the City Science Museum',
     '2024-02-20 14:00:00+00',
     '2024-02-20 16:00:00+00',
     'City Science Museum - Innovation Lab',
     15,
     'scheduled'),
    
    ('770e8400-e29b-41d4-a716-446655440003',
     '660e8400-e29b-41d4-a716-446655440003',
     '550e8400-e29b-41d4-a716-446655440004',
     'Advanced Robotics - Roosevelt High',
     'Advanced programming workshop for high school students',
     '2024-02-25 13:00:00+00',
     '2024-02-25 15:30:00+00',
     'Roosevelt High School - Computer Lab',
     12,
     'scheduled'),
    
    ('770e8400-e29b-41d4-a716-446655440004',
     '660e8400-e29b-41d4-a716-446655440004',
     '550e8400-e29b-41d4-a716-446655440005',
     'Smart Home IoT - Community Center',
     'Learn IoT by building smart home systems',
     '2024-03-01 10:00:00+00',
     '2024-03-01 13:00:00+00',
     'Community Learning Center - Maker Space',
     10,
     'scheduled');

-- Insert sample content pages
INSERT INTO content_pages (id, slug, title, content, meta_description, is_published) VALUES
    ('880e8400-e29b-41d4-a716-446655440001',
     'privacy-policy',
     'Privacy Policy',
     '{"type":"doc","content":[{"type":"heading","attrs":{"level":1},"content":[{"type":"text","text":"Privacy Policy"}]},{"type":"paragraph","content":[{"type":"text","text":"This privacy policy explains how Airbotix collects, uses, and protects your personal information."}]},{"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"Information We Collect"}]},{"type":"paragraph","content":[{"type":"text","text":"We collect information you provide directly to us, such as when you register for workshops or contact us."}]}]}',
     'Learn about how Airbotix handles your personal information and privacy.',
     true),
    
    ('880e8400-e29b-41d4-a716-446655440002',
     'terms-of-service',
     'Terms of Service',
     '{"type":"doc","content":[{"type":"heading","attrs":{"level":1},"content":[{"type":"text","text":"Terms of Service"}]},{"type":"paragraph","content":[{"type":"text","text":"These terms govern your use of Airbotix services and workshops."}]},{"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"Acceptance of Terms"}]},{"type":"paragraph","content":[{"type":"text","text":"By using our services, you agree to these terms and conditions."}]}]}',
     'Terms and conditions for using Airbotix services.',
     true);

-- Insert sample contact submissions
INSERT INTO contact_submissions (name, email, subject, message, type, status) VALUES
    ('Sarah Johnson', 'sarah.johnson@email.com', 'Partnership Inquiry', 'Hi, I represent Washington Middle School and we''re interested in bringing robotics workshops to our students. Could you provide more information about your programs?', 'partnership', 'new'),
    ('Mike Chen', 'mike.chen@techcorp.com', 'Corporate Partnership', 'We''re a local tech company interested in sponsoring workshops for underserved communities. What partnership opportunities are available?', 'partnership', 'in_progress'),
    ('Lisa Rodriguez', 'lisa.rodriguez@parent.com', 'Workshop Question', 'My daughter is in 4th grade and loves building things. Which workshops would be appropriate for her age group?', 'workshop_inquiry', 'resolved'),
    ('David Park', 'david.park@library.org', 'Program Information', 'Our public library is setting up a maker space. Can you help us design robotics programs for different age groups?', 'general', 'new');

-- Note: User profiles and registrations would typically be created through the application
-- rather than seeded directly, as they depend on authentication