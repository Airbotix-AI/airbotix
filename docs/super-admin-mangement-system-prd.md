# Airbotix Super Admin Management System
## Product Requirements Document (PRD)

---

## 📋 Product Overview

### What We're Building
A web-based admin dashboard for Airbotix internal staff to manage educational operations: content, users, students, workshops, courses, and teachers. This replaces current spreadsheet-based workflows with a centralized management system.

### Current Pain Points
- Workshop content scattered across Google Drive folders
- Student enrollment managed via Excel sheets
- Teacher scheduling through WhatsApp, WeChat and email coordination
- Course materials inconsistently organized
- No unified user access control system

### Success Goals
- Centralize all educational content in one searchable system
- Streamline workshop booking and teacher assignment workflow
- Maintain comprehensive student records and progress tracking
- Standardize course delivery across all programs

---

## 🎯 Core User Journey

### Primary Users: Airbotix Admin Team

**Daily Operations:**
1. **Content Management**: Update lesson plans, upload new materials
2. **Workshop Coordination**: Review bookings, assign teachers, prepare materials
3. **Student Tracking**: Manage enrollments, track attendance and progress
4. **Teacher Scheduling**: Coordinate availability and workshop assignments
5. **Course Oversight**: Ensure consistent curriculum delivery

---

## 🏗️ Functional Modules

### Module 1: Content Management System (CMS)
**Purpose**: Centralized repository for all educational materials and content

**Core Functions:**
- **Content Library**: Store and organize lesson plans by age group (K-12)
- **Resource Management**: Upload videos, handouts, assessment sheets, project templates
- **Material Database**: Track workshop supplies, robotics kits, software requirements
- **Content Organization**: Categorize by difficulty level, duration, learning objectives
- **Search & Filter**: Find content by keywords, age group, topic, or duration

**User Workflow:**
1. Admin uploads new lesson plan with metadata (age, topic, duration, materials)
2. System automatically categorizes and makes searchable
3. Teacher accesses relevant materials when preparing for workshop
4. Content can be linked to specific workshops and courses

**Key Outputs:**
- Organized content library with 100% of current materials uploaded
- Material checklists automatically generated for each workshop type
- Teachers can find relevant resources within 2 clicks

---

### Module 2: Identity & Access Management (IAM + RBAC)
**Purpose**: Secure user authentication with role-based access and basic change tracking

**User Roles & Permissions:**
- **Super Admin**: Full system access - can create/edit/delete all content
- **Content Manager**: CMS and courses (full access), other modules (read-only)
- **Operations Coordinator**: Students, workshops, teachers (full access), CMS (read-only)
- **Teacher**: Assigned workshops only (read), student progress (update only)

**Core Functions:**
- **User Authentication**: Supabase Auth with email magic links
- **Role Assignment**: Assign and modify user roles via profiles.role field
- **Access Control**: Module visibility based on user role
- **Session Management**: Automatic logout after inactivity
- **Change Tracking**: Basic logging of critical data changes (student info updates, workshop modifications)

**Business Rules:**
- Only Super Admin can create new user accounts
- Teachers can only see workshops they're assigned to
- Role changes require Super Admin approval
- Student information changes logged with user ID and timestamp for security compliance

**Data Protection:**
Given the educational context involving student information, minimal change tracking is essential:
- **Student Updates**: Log who modified student records and when
- **Workshop Changes**: Track capacity and enrollment modifications  
- **Critical Actions**: Record user actions affecting student safety or privacy

**Implementation**: Use simple `change_logs` table with user_id, table_name, record_id, action, and timestamp. This provides accountability without full audit complexity.

---

### Module 3: Student Management
**Purpose**: Comprehensive student records and enrollment tracking

**Core Functions:**
- **Student Profiles**: Store name, age, grade, school, parent contact, learning preferences
- **Enrollment Processing**: Register students for workshops and courses
- **Attendance Tracking**: Mark present/absent during workshops
- **Progress Recording**: Teacher observations, skill development notes, achievements
- **Communication Log**: Parent updates, feedback, and correspondence history

**Key Workflows:**
1. **New Student**: Create profile → assign to workshop → generate materials list
2. **Workshop Day**: Check attendance → update progress notes → record achievements
3. **Course Tracking**: Monitor multi-session progress → issue certificates upon completion
4. **Parent Communication**: Generate progress reports → send updates

**Business Requirements:**
- Support minimum 200 student profiles
- Track attendance across multiple workshops per student
- Generate parent reports showing learning progression
- Maintain student privacy with restricted teacher access

---

### Module 4: Workshop Management
**Purpose**: End-to-end workshop planning, scheduling, and execution with concurrency protection

**Core Functions:**
- **Workshop Planning**: Define workshop details (title, age group, capacity, materials)
- **Calendar Scheduling**: Visual calendar with drag-and-drop workshop placement
- **Teacher Assignment**: Match available teachers to workshops based on expertise
- **Student Enrollment**: Manage workshop capacity and waitlists with atomic operations
- **Resource Planning**: Generate material checklists and setup instructions
- **Session Tracking**: Record attendance, notes, and outcomes

**Workshop Lifecycle:**
1. **Create Workshop**: Select template → set date/time → assign teacher → open enrollment
2. **Pre-Workshop**: Generate student list → prepare materials → confirm teacher
3. **Workshop Day**: Check attendance → conduct session → collect feedback
4. **Post-Workshop**: Update student records → archive session notes → plan follow-up

**Business Rules:**
- Maximum capacity enforcement with automatic waitlist
- Teacher conflict prevention (no double-booking)
- Material requirements calculated based on enrolled student count
- Workshop templates ensure consistent delivery standards

**Concurrency & Data Integrity:**
Given multiple admin staff may simultaneously manage enrollments, critical operations must handle race conditions:

- **Enrollment Protection**: Use Supabase database functions or transactions to ensure atomic enrollment checks (verify capacity → enroll student → update count)
- **Teacher Assignment**: Implement optimistic locking to prevent double-booking when two admins assign same teacher simultaneously
- **Capacity Management**: Real-time enrollment counts with database-level constraints to prevent over-enrollment
- **Conflict Detection**: Server-side validation for all scheduling operations with immediate user feedback

**Implementation Notes:**
- **Database Constraints**: Workshop capacity limits enforced at database level
- **Real-time Updates**: Supabase real-time subscriptions notify all users of enrollment changes
- **Error Handling**: Clear user messages when enrollment fails due to capacity or conflicts
- **Retry Logic**: Automatic retry for failed operations due to concurrent access

---

### Module 5: Course Management
**Purpose**: Multi-session program organization and progress tracking

**Core Functions:**
- **Course Design**: Create multi-session courses with learning progression
- **Session Planning**: Define individual workshops within course sequence  
- **Enrollment Management**: Register students for complete course programs
- **Progress Tracking**: Monitor student advancement through course levels
- **Certification**: Issue completion certificates based on attendance and assessment

**Course Types:**
- **Taster Sessions**: Single workshop introductions
- **Short Courses**: 3-4 sessions over consecutive weeks
- **Term Programs**: 8-12 sessions over school semester
- **Holiday Intensives**: Daily sessions during school breaks

**Key Workflows:**
1. **Course Setup**: Define session sequence → set learning objectives → create assessment criteria
2. **Student Enrollment**: Register for full course → automatic workshop assignments
3. **Progress Monitoring**: Track session attendance → record skill development → assess completion
4. **Certification**: Verify completion criteria → generate certificates → update student records

---

### Module 6: Teacher Management
**Purpose**: Teacher scheduling, assignment, and performance tracking

**Core Functions:**
- **Teacher Profiles**: Contact info, qualifications, expertise areas, availability
- **Schedule Management**: Track availability, assign workshops, prevent conflicts
- **Skill Matching**: Match teacher expertise to workshop requirements
- **Performance Tracking**: Collect feedback, monitor workshop quality, identify training needs
- **Resource Coordination**: Manage equipment allocation and travel planning

**Key Workflows:**
1. **Teacher Onboarding**: Create profile → assess skills → set availability → assign first workshop
2. **Workshop Assignment**: Check availability → match skills → confirm assignment → send details
3. **Workshop Delivery**: Provide materials access → track attendance → collect feedback
4. **Performance Review**: Analyze feedback → identify development areas → plan training

**Business Requirements:**
- Support minimum 10 teacher profiles with varying availability
- Prevent scheduling conflicts across all teachers
- Match teacher skills (AI vs Robotics) to workshop requirements
- Track teacher utilization and performance metrics

---

## 🔗 Module Integration Requirements

### Cross-Module Data Flow
- **CMS ↔ Workshops**: Lesson plans automatically linked to workshop types
- **Workshops ↔ Students**: Enrollment data flows to attendance tracking
- **Workshops ↔ Teachers**: Assignment triggers material access and preparation
- **Courses ↔ Workshops**: Multi-session courses create workshop series
- **Students ↔ Teachers**: Progress notes and communication centralized
- **IAM**: Access control applied consistently across all modules

### Shared Features
- **Universal Search**: Find students, workshops, content, or teachers across system
- **Dashboard Overview**: Key metrics and urgent tasks from all modules
- **Notification System**: Alerts for schedule changes, new enrollments, deadlines
- **Quick Actions**: Common tasks (create workshop, enroll student) accessible from any page

---

## 📊 Success Metrics

### Immediate Goals (Month 1)
- **Content Migration**: 100% of current lesson plans uploaded and categorized in CMS
- **User Adoption**: All 3 admin staff actively using system for daily tasks
- **Workshop Scheduling**: Zero scheduling conflicts (currently 1-2 per month)
- **Data Accuracy**: Student enrollment errors reduced from 20% to under 5%

### Short-term Goals (Month 3)
- **Process Efficiency**: Workshop coordination time reduced by 50% (from 2 hours to 1 hour per workshop)
- **Teacher Utilization**: Eliminate teacher double-booking (currently 1-2 incidents per month)
- **Student Tracking**: 90% of workshops have complete attendance and progress records
- **Content Accessibility**: Teachers find required materials within 2 clicks, 95% of the time

### Long-term Goals (Month 6)
- **Reporting Capability**: Generate 3 key reports (student attendance rates, teacher utilization, course completion rates)
- **System Coverage**: 100% of workshops planned and tracked through system (eliminate spreadsheets)
- **Data Quality**: Maintain 95% data accuracy across student records and workshop information
- **Operational Scalability**: Handle 50% increase in workshop volume with same admin staff time

### Quantifiable KPIs
- **Workshop Management**: Process workshop from planning to completion in under 30 minutes
- **Student Records**: Access complete student history within 10 seconds
- **Teacher Assignment**: Identify and assign available teacher within 5 minutes
- **Content Discovery**: Find specific lesson plan or resource within 1 minute
- **Attendance Tracking**: Complete workshop attendance in under 2 minutes
- **Progress Reporting**: Generate student progress report in under 3 minutes

---

---

## 🛠️ Technical Requirements

### Frontend Architecture
- **Framework**: React 18 + Vite + TypeScript
- **Styling**: TailwindCSS for consistent UI components
- **Routing**: React Router (HashRouter for GitHub Pages compatibility)
- **State Management**: React Context for user auth, local state for modules
- **Responsive Design**: Mobile-first approach with tablet optimization

### Backend & Infrastructure
- **Database**: Supabase Postgres (managed, free tier up to 500MB)
- **Authentication**: Supabase Auth with email magic links
- **File Storage**: Supabase Storage for lesson materials and images
- **Email Service**: SendGrid for notifications and communications
- **Analytics**: Google Analytics 4 (optional)

### Deployment & Hosting
- **Frontend Hosting**: Vercel (zero-config deployment, preview branches)
- **CI/CD**: Vercel Auto Deploy (push to main triggers production build)
- **Environment**: Production and staging environments with branch previews

### Data Architecture
- **Database Tables**: Users, Students, Teachers, Workshops, Content, Courses
- **Real-time Updates**: Supabase real-time subscriptions for live data sync
- **Row-Level Security**: Database-level permissions aligned with user roles
- **File Management**: Organized folder structure in Supabase Storage

### Security & Compliance
- **Authentication**: Secure session management with automatic timeout
- **Data Protection**: Student information encrypted and access-controlled
- **RBAC Implementation**: Role permissions enforced at database level
- **Backup Strategy**: Automatic daily backups through Supabase

### Mobile & Responsive Design Requirements

#### Target Devices & Use Cases
- **Desktop (Admin)**: Primary interface for content management and detailed planning
- **Tablet (Teachers)**: Workshop delivery, attendance tracking, progress notes
- **Mobile (Optional)**: Quick status checks and basic information access

#### Tablet Optimization (Primary Mobile Focus)
**Device Targets**: iPad (10.9"), Android tablets (10-11"), Surface Pro
**Orientation**: Both portrait and landscape support

**Core Interface Adaptations**:
- **Touch-Friendly Controls**: Minimum 44px touch targets for buttons and interactive elements
- **Simplified Navigation**: Bottom tab bar for quick module switching during workshops
- **Workshop Mode**: Dedicated mobile layout for teachers during session delivery
- **Quick Actions**: Large, easily accessible buttons for common tasks (mark attendance, add notes)

#### Mobile-Specific Features

**Workshop Delivery Mode (Teachers)**:
```
📱 Workshop Dashboard:
- Large student roster with photo thumbnails
- One-tap attendance marking (present/absent)
- Quick note-taking with pre-defined tags
- Emergency contact information readily accessible
- Material checklist with large checkboxes
```

**Responsive Breakpoints**:
- **Mobile**: < 768px (simplified interface, vertical navigation)
- **Tablet**: 768px - 1024px (hybrid interface, workshop delivery mode)
- **Desktop**: > 1024px (full admin interface, multi-column layouts)

#### Mobile Interface Guidelines

**Navigation**:
- **Desktop**: Left sidebar with full module names and icons
- **Tablet**: Collapsible sidebar or bottom tab navigation
- **Mobile**: Bottom tab navigation with icons only

**Data Tables**:
- **Desktop**: Full table view with all columns
- **Tablet**: Card-based layout with swipe actions
- **Mobile**: List view with expandable details

**Forms & Input**:
- **Touch Optimization**: Large input fields, dropdown alternatives
- **Input Methods**: Voice-to-text for progress notes, photo capture for materials
- **Validation**: Immediate visual feedback, simplified error messages

**Workshop-Specific Mobile Features**:
- **Offline Capability**: Basic attendance tracking works without internet
- **Auto-sync**: Data synchronizes when connection restored
- **Photo Integration**: Capture workshop moments, student projects
- **Quick Communication**: Send updates to parents via integrated messaging

#### Performance Requirements (Mobile)
- **Load Time**: Under 2 seconds on 3G connection
- **Touch Response**: Immediate visual feedback for all interactions
- **Battery Efficiency**: Optimize for 4+ hour workshop sessions
- **Data Usage**: Minimize bandwidth consumption for teachers with limited data

#### Accessibility (Mobile)
- **Font Scaling**: Support iOS/Android system font size preferences
- **High Contrast**: Readable in various lighting conditions (classroom to outdoor)
- **Voice Control**: Basic voice commands for hands-free operation during workshops
- **Landscape Mode**: Full functionality in both orientations

---

## 🚧 Implementation Phases

### Phase 1: Foundation (Weeks 1-2)
- **IAM System**: User roles, authentication, basic access control
- **Dashboard Structure**: Main navigation and module framework
- **CMS Core**: Content upload, basic categorization, search functionality

**Success Criteria**: Admin staff can log in, upload content, and navigate between modules

### Phase 2: Operations (Weeks 3-4)
- **Student Management**: Create profiles, enrollment, attendance tracking
- **Workshop System**: Calendar interface, scheduling, teacher assignment
- **Teacher Coordination**: Availability management, conflict prevention

**Success Criteria**: Complete workshop can be planned and executed through system

### Phase 3: Advanced Features (Weeks 5-6)
- **Course Management**: Multi-session programs, progress tracking
- **System Integration**: Cross-module data flow and shared features
- **Reporting & Analytics**: Basic reports and performance metrics

**Success Criteria**: All current spreadsheet processes replaced with system workflows

---

## 🎯 Definition of Done

### Functional DoD (Module Completion Standards)

#### CMS Module ✅
- [ ] Upload and categorize lesson plans with metadata (age, topic, duration)
- [ ] Search content by keywords, age group, or topic
- [ ] Link materials to specific workshops
- [ ] Generate material checklists based on workshop type
- [ ] Content accessible to teachers based on workshop assignments

#### IAM Module ✅
- [ ] User login/logout with role assignment
- [ ] Role-based page visibility (teachers see only assigned workshops)
- [ ] Session timeout after 30 minutes inactivity
- [ ] Super Admin can create/modify user accounts

#### Student Management ✅
- [ ] Create student profiles with contact and learning preference info
- [ ] Enroll students in workshops with capacity limits
- [ ] Mark attendance during workshops
- [ ] Record progress notes and achievements
- [ ] Generate basic student history reports

#### Workshop Management ✅
- [ ] Create workshops using templates (age group, capacity, materials)
- [ ] Visual calendar scheduling with drag-and-drop
- [ ] Assign teachers based on availability and skills
- [ ] Prevent double-booking and over-enrollment
- [ ] Generate pre-workshop material lists and student rosters

#### Course Management ✅
- [ ] Create multi-session courses with learning progression
- [ ] Enroll students in complete course sequences
- [ ] Track progress across course sessions
- [ ] Issue completion certificates based on attendance criteria

#### Teacher Management ✅
- [ ] Maintain teacher profiles with availability and expertise
- [ ] Assign workshops with conflict detection
- [ ] Teacher dashboard shows assigned workshops and materials
- [ ] Teachers can update student attendance and progress

### System DoD (Technical Performance Standards)

#### Performance Requirements ✅
- [ ] Page load times under 3 seconds on standard internet
- [ ] Support 5 concurrent users without performance degradation
- [ ] Mobile responsive on tablets (teachers use during workshops)
- [ ] Search results return within 2 seconds

#### Security & Reliability ✅
- [ ] User sessions secure with proper timeout
- [ ] Data validation prevents common errors (double-booking, over-capacity)
- [ ] Role permissions properly restrict access to authorized content
- [ ] System recovers gracefully from connection interruptions

#### Compatibility ✅
- [ ] Works on Chrome and Safari browsers
- [ ] Tablet-friendly interface for teacher use during workshops
- [ ] Data exports to Excel for external reporting needs
- [ ] Integration ready for future payment systems

### Business DoD (Operational Impact Standards)

#### Process Replacement ✅
- [ ] 100% of workshop scheduling moved from WhatsApp to system
- [ ] All student records migrated from Excel to centralized system
- [ ] Teacher assignments coordinated through system calendar
- [ ] Content discovery replaces folder-hunting in Google Drive

#### Efficiency Improvements ✅
- [ ] Workshop planning time reduced from 2 hours to under 30 minutes
- [ ] Student information accessible within 10 seconds during workshops
- [ ] Teacher materials preparation streamlined to under 15 minutes
- [ ] Zero scheduling conflicts after system implementation

#### Quality Assurance ✅
- [ ] All workshop sessions have complete attendance records
- [ ] Student progress tracking consistent across all programs
- [ ] Course delivery standardized using organized content library
- [ ] Teacher feedback collected and stored for program improvement

#### User Adoption ✅
- [ ] All admin staff (3 people) actively using system daily
- [ ] Teachers prefer system over manual coordination methods
- [ ] New staff can be trained on system within 30 minutes
- [ ] System reduces rather than increases daily workload

### Acceptance Criteria Summary
**The system is complete when**: Admin staff can plan, execute, and track a complete workshop from initial request through student progress reporting entirely within the system, without resorting to spreadsheets, messaging apps, or manual coordination.

This system will enable Airbotix to deliver consistent, high-quality educational programs while reducing administrative overhead and supporting sustainable growth.