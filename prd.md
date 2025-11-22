# StillWaters - Product Requirements Document

## Project Overview

**App Name:** StillWaters  
**Type:** Mobile Bible Study Application (iOS & Android)  
**Development Approach:** Solo developer using React Native  
**AI Assistant:** Claude Code  

## Core Concept

StillWaters is a Bible study companion app that provides AI-powered, multi-perspective theological answers to user questions. Named after Psalm 23:2, it offers a peaceful digital space for biblical exploration.

## Technical Stack

### Frontend
- **Framework:** React Native with Expo
- **UI Library:** React Native Elements (with custom water-themed styling)
- **Navigation:** React Navigation
- **State Management:** Context API (keep it simple)
- **Icons:** React Native Vector Icons

### Backend
- **Runtime:** Node.js with Express
- **Database:** PostgreSQL via Supabase
- **Authentication:** Supabase Auth
- **AI Integration:** OpenAI API or Claude API
- **Hosting:** Vercel or Railway
- **File Storage:** Supabase Storage (for future features)

### Development Tools
- **Version Control:** Git/GitHub
- **CI/CD:** GitHub Actions
- **Analytics:** Mixpanel or Google Analytics (post-launch)
- **Error Tracking:** Sentry (post-launch)

## Core Features (MVP)

### 1. AI Chatbot ("The Guide")
**Priority:** P0 - Essential

**Implementation Requirements:**
- Text input field for user questions
- AI response display with formatted text
- Scripture references with inline display
- Multiple theological perspectives per response
- Conversation history (local storage)
- Max 5 free questions/day, unlimited for premium

**API Response Structure:**
```json
{
  "question": "user's question",
  "primary_scripture": {
    "reference": "John 3:16",
    "text": "For God so loved...",
    "translation": "NIV"
  },
  "interpretations": [
    {
      "tradition": "Protestant",
      "view": "explanation..."
    },
    {
      "tradition": "Catholic",
      "view": "explanation..."
    }
  ],
  "context": "historical/cultural context",
  "application": "practical application",
  "related_verses": ["Romans 5:8", "1 John 4:9"]
}
```

### 2. FAQ Section ("The Well")
**Priority:** P0 - Essential

**Implementation Requirements:**
- Categories list view
- Question/Answer detail view
- Search functionality
- Bookmark capability
- Offline storage for viewed FAQs
- 50% accessible free, 100% premium

**Data Structure:**
```json
{
  "id": "unique_id",
  "category": "Core Christian Beliefs",
  "question": "What is the Trinity?",
  "answer": {
    "summary": "brief answer",
    "detailed": "full explanation",
    "scriptures": ["Matthew 28:19", "2 Corinthians 13:14"],
    "perspectives": [...],
    "is_premium": false
  }
}
```

### 3. Daily Devotional ("Daily Streams")
**Priority:** P1 - Important

**Implementation Requirements:**
- Daily verse display
- Brief reflection/commentary
- "Read More" integration with chatbot
- Local notifications for daily reminder
- Streak tracking

### 4. Personal Journal ("Reflection Pool")
**Priority:** P1 - Important

**Implementation Requirements:**
- Simple text editor
- Scripture linking (tap to add verse)
- Tags for organization
- Local storage (encrypted)
- Search functionality
- Cloud backup (premium only)

### 5. User Account & Settings
**Priority:** P0 - Essential

**Implementation Requirements:**
- Optional account creation
- Guest mode functionality
- Preferred Bible translation
- Notification preferences
- Light/Dark theme toggle
- Subscription management

## Design System

### Color Palette
```css
/* Primary - Water Blues */
--primary-blue: #5B9BD5;
--primary-dark: #4A7BA7;
--primary-light: #E3F2FD;

/* Secondary - Calm Grays */
--gray-dark: #424242;
--gray-medium: #757575;
--gray-light: #F5F5F5;

/* Accent - Soft Teal */
--accent: #4DB6AC;

/* Semantic */
--success: #81C784;
--warning: #FFB74D;
--error: #E57373;
```

### Typography
```css
/* Headings */
--font-heading: 'Merriweather', serif;

/* Body Text */
--font-body: 'Inter', sans-serif;

/* Scripture */
--font-scripture: 'Lora', serif;
```

### Component Patterns
- **Cards:** Rounded corners (8px), subtle shadow, white background
- **Buttons:** Rounded (24px), ripple effect on press
- **Inputs:** Underline style with floating label
- **Navigation:** Bottom tab bar with 4 items max

## Database Schema

### Tables

```sql
-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE,
  created_at TIMESTAMP,
  subscription_tier TEXT DEFAULT 'free',
  subscription_expires TIMESTAMP,
  preferred_translation TEXT DEFAULT 'NIV'
);

-- Conversations
CREATE TABLE conversations (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  question TEXT,
  response JSONB,
  created_at TIMESTAMP
);

-- Journal Entries
CREATE TABLE journal_entries (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  content TEXT,
  tags TEXT[],
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Bookmarks
CREATE TABLE bookmarks (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  content_type TEXT, -- 'faq', 'verse', 'devotional'
  content_id TEXT,
  created_at TIMESTAMP
);

-- Usage Tracking
CREATE TABLE usage_tracking (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  feature TEXT,
  action TEXT,
  created_at TIMESTAMP
);
```

## API Endpoints

### Authentication
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh
```

### Chatbot
```
POST /api/chat/question
GET /api/chat/history
GET /api/chat/quota  // remaining questions for free users
```

### FAQ
```
GET /api/faq/categories
GET /api/faq/category/:id
GET /api/faq/question/:id
GET /api/faq/search?q=query
```

### Journal
```
GET /api/journal/entries
POST /api/journal/entry
PUT /api/journal/entry/:id
DELETE /api/journal/entry/:id
```

### User
```
GET /api/user/profile
PUT /api/user/settings
GET /api/user/subscription
POST /api/user/subscription/upgrade
```

## Monetization

### Free Tier
- 5 chatbot questions per day
- 50% of FAQ content
- Basic daily devotional
- Local journal storage
- 1 active study plan

### Premium Tier ($4.99/month or $49.99/year)
- Unlimited chatbot questions
- 100% FAQ access
- Enhanced devotionals
- Cloud journal backup
- Unlimited study plans
- Additional Bible translations
- No ads (future consideration)
- Offline mode for all content

## Development Phases

### Phase 1: Foundation (Weeks 1-4)
- [ ] Project setup (React Native, Expo)
- [ ] Basic navigation structure
- [ ] Authentication flow
- [ ] Database setup (Supabase)
- [ ] Design system implementation

### Phase 2: Core Features (Weeks 5-8)
- [ ] AI chatbot integration
- [ ] FAQ structure and data
- [ ] Basic journal functionality
- [ ] Daily devotional system
- [ ] Local storage implementation

### Phase 3: Premium Features (Weeks 9-12)
- [ ] Payment integration (Stripe/RevenueCat)
- [ ] Subscription management
- [ ] Cloud sync for journal
- [ ] Enhanced chatbot features
- [ ] Push notifications

### Phase 4: Polish (Weeks 13-16)
- [ ] UI/UX refinement
- [ ] Performance optimization
- [ ] Beta testing
- [ ] Bug fixes
- [ ] App store assets preparation

### Phase 5: Launch (Week 17+)
- [ ] App store submission
- [ ] Marketing website
- [ ] Launch campaign
- [ ] User feedback collection

## File Structure
```
stillwaters/
├── src/
│   ├── components/
│   │   ├── common/
│   │   ├── chat/
│   │   ├── faq/
│   │   ├── journal/
│   │   └── devotional/
│   ├── screens/
│   │   ├── HomeScreen.js
│   │   ├── ChatScreen.js
│   │   ├── FAQScreen.js
│   │   ├── JournalScreen.js
│   │   └── SettingsScreen.js
│   ├── navigation/
│   │   └── AppNavigator.js
│   ├── services/
│   │   ├── api.js
│   │   ├── ai.js
│   │   ├── storage.js
│   │   └── auth.js
│   ├── utils/
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   └── themes.js
│   └── App.js
├── assets/
│   ├── images/
│   ├── fonts/
│   └── icons/
├── package.json
├── app.json
└── PRD.md
```

## Environment Variables
```env
# API Keys
OPENAI_API_KEY=
SUPABASE_URL=
SUPABASE_ANON_KEY=

# Config
API_BASE_URL=
ENVIRONMENT=development

# Features
MAX_FREE_QUESTIONS=5
CACHE_DURATION=3600

# Payments (future)
STRIPE_KEY=
REVENUECAT_KEY=
```

## Testing Strategy

### Unit Tests
- Utility functions
- API response parsing
- Data validation

### Integration Tests
- API endpoints
- Database operations
- Authentication flow

### E2E Tests (Critical Paths)
- User registration/login
- Asking a question
- Purchasing premium
- Journal CRUD operations

## Performance Targets
- App launch: < 3 seconds
- Screen navigation: < 300ms
- Chatbot response: < 5 seconds
- Search results: < 1 second
- Offline mode activation: Instant

## Security Considerations
- JWT token rotation
- API rate limiting
- Input sanitization
- SQL injection prevention
- Encrypted local storage for sensitive data
- HTTPS only for API calls
- No storage of payment information

## Analytics Events to Track
```javascript
// Core Events
'app_open'
'user_signup'
'user_login'
'question_asked'
'faq_viewed'
'journal_entry_created'
'subscription_started'
'subscription_cancelled'

// Engagement Events
'session_duration'
'daily_streak'
'feature_used'
'share_content'
'bookmark_created'
```

## Error Handling
- Network errors: Retry with exponential backoff
- API errors: User-friendly messages
- Validation errors: Inline field messages
- Critical errors: Sentry reporting
- Offline mode: Queue actions for sync

## Accessibility Requirements
- Minimum touch target: 44x44pt
- Color contrast ratio: 4.5:1 minimum
- Screen reader support
- Font scaling support
- Keyboard navigation (tablets)

## App Store Information

### Keywords
- Bible study
- Scripture
- Devotional
- Christian
- Faith
- Biblical questions
- Theology
- Prayer journal
- Daily verse
- Spiritual growth

### Category
- Primary: Education
- Secondary: Books

### Age Rating
- 4+ (No objectionable content)

## Success Metrics
- DAU (Daily Active Users): Target 70% of MAU
- Conversion Rate: Target 3% free to paid
- Retention D7: Target 40%
- Retention D30: Target 25%
- App Store Rating: Target 4.5+
- Chatbot Usage: Avg 3 questions/user/day
- NPS Score: Target 50+

## Notes for Claude Code

### Development Priorities
1. Get basic app structure working first
2. Focus on chatbot as the core differentiator
3. Keep UI simple and clean
4. Optimize for performance on older devices
5. Implement offline mode early
6. Add analytics after core features work

### Common Commands
```bash
# Development
npx expo start
npx expo run:ios
npx expo run:android

# Building
eas build --platform ios
eas build --platform android

# Testing
npm test
npm run test:e2e
```

### Key Libraries to Use
- expo
- react-navigation
- react-native-elements
- axios (for API calls)
- react-query (for caching)
- react-native-async-storage
- react-native-vector-icons
- react-native-reanimated (for animations)

### Remember
- This is a solo project - keep scope manageable
- User experience > feature count
- Test on real devices early and often
- Get user feedback throughout development
- Ship MVP quickly, iterate based on feedback

---
*Last Updated: [Current Date]*
*Version: 1.0.0*