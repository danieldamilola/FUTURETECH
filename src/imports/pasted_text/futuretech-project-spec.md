# FutureTech Blog Platform - Project Specification

## Overview
FutureTech is designed to be a premier tech blogging platform and knowledge-sharing community. Drawing inspiration from platforms like Quora, Medium, and Hashnode, it will serve as a hub where authors can publish long-form tech articles, ask technical questions, and engage in meaningful discussions.

## Core Features
1. **Advanced Authentication & Authorization**
   - Email/Password login and registration.
   - OAuth integration (GitHub, Google) for seamless developer onboarding.
   - Role-based access control (Admin, Moderator, Author, User).

2. **User Profiles & Reputation System**
   - Customizable public profiles (Bio, social links, tech stack).
   - Reputation/Karma points earned through upvotes on articles, questions, and answers.
   - "Follow" system allowing users to follow specific authors or topics.

3. **Content Creation & Publishing (Blog)**
   - Markdown-compatible Rich Text Editor with live preview.
   - Support for syntax highlighting in code blocks.
   - Draft management and autosave capabilities.
   - Cover image uploads and SEO meta descriptions for individual posts.

4. **Q&A System (Quora/StackOverflow style)**
   - Dedicated space to ask technical questions.
   - Answers with upvote/downvote mechanics.
   - Ability for the original poster to mark an "Accepted Answer".

5. **Feed & Personalization**
   - "For You" feed generated based on followed tags and authors.
   - "Trending" feed highlighting the most engaging content of the week.
   - "Recent" feed for chronologically ordered content.

6. **Engagement & Social Features**
   - Nested commenting system on both articles and Q&A.
   - Real-time notifications for replies, upvotes, and mentions.
   - Bookmarking system to save articles or questions for later reading.

7. **Categorization & Search**
   - Tagging system (e.g., `#React`, `#Nextjs`, `#SystemDesign`).
   - Global full-text search across articles, questions, users, and tags.

8. **Admin & Moderation**
   - Admin dashboard to manage reported content and ban malicious users.
   - Analytics overview (user growth, popular topics, active authors).

9. **Podcasts (Audio Content)**
   - Ability for verified authors or moderators to upload and publish podcast episodes.
   - Embedded audio player for users to listen directly on the platform.
   - Podcast categorization by tech topics and tags.

## Page Structure
### Public / Main Pages
- `/` - **Home / Feed:** The main dashboard showing personalized and trending content.
- `/explore` - **Explore:** Discover new topics, trending tags, and top-rated authors.
- `/blog` - **Articles:** A general feed exclusively for blog posts.
- `/blog/[slug]` - **Article View:** Reading page for a specific article.
- `/questions` - **Q&A Board:** The main hub for all questions.
- `/questions/[id]` - **Question Thread:** A specific question and its answers.
- `/podcasts` - **Podcasts:** A feed dedicated to tech audio podcasts.
- `/podcasts/[slug]` - **Podcast Player:** Single episode view with embedded audio player.
- `/search?q=...` - **Search Results:** Displaying hits across the platform.

### User & Author Pages
- `/profile/[username]` - **Public Profile:** Shows a user's articles, questions, and recent activity.
- `/settings` - **Account Settings:** Manage profile details, notifications, and connected accounts.
- `/new/post` - **Create Article:** The rich text editor for writing a new blog post.
- `/new/question` - **Ask Question:** Form to submit a new question to the community.
- `/drafts` - **My Drafts:** Private list of unpublished content.
- `/bookmarks` - **Saved Items:** Private list of bookmarked posts and questions.

### Mentorship Pages
- `/mentors` - **Find a Mentor:** Browse verified senior developers available for mentorship.
- `/mentors/[username]` - **Mentor Profile:** A mentor's public page showing expertise, rates, availability, and reviews.
- `/mentorship/book/[username]` - **Book a Session:** Schedule and pay for a 1-on-1 mentorship session.
- `/mentorship/dashboard` - **My Sessions:** Track upcoming, ongoing, and completed mentorship sessions.

## Architecture & Technology Stack
- **Frontend Framework:** Next.js (App Router) for Server-Side Rendering (SSR) and superior SEO.
- **Database & Backend:** Supabase (PostgreSQL) for relational data management, Authentication, Storage, and Real-time subscriptions.
- **Styling:** Tailwind CSS for rapid, responsive UI development.
- **Icons & Animations:** Lucide React / React Icons, Framer Motion for micro-interactions.

## Future Enhancements (Phase 2)
- **Monetization / Tipping:** Allow users to support their favorite authors via Stripe integration.
- **Collaborative Editing:** Multiple authors working on the same draft in real-time.
- **Newsletters:** Allow authors to send their articles directly to their followers' email inboxes.
- **AI Integration:** AI-powered content summaries, tag suggestions, and toxicity filters for comments.

## Business Model
To ensure sustainability and profitability, FutureTech will focus on the following revenue streams:
1. **Sponsorships & Advertising**
   - Displaying highly relevant, non-intrusive sponsorships and ads in the feed or sidebar from tech companies, bootcamps, and SaaS tools.
2. **Ad-Free Experience (Subscription)**
   - A paid tier for users who want to browse the platform, read articles, and listen to podcasts completely free of advertisements.
3. **Job Board (Tech Careers)**
   - Companies pay a fee to list open developer/tech positions on a dedicated `/jobs` page. Given the highly targeted tech audience, this is a premium offering for recruiters.
4. **Mentorship Marketplace (Platform Commission)**
   - Junior developers and beginners can browse and book paid 1-on-1 sessions with verified senior engineers or experienced authors on the platform.
   - Mentors set their own hourly or per-session rates. FutureTech takes a platform commission (e.g., 15–20%) on every completed session.
   - Payments are handled securely via Stripe. Mentors are paid out after the session is confirmed complete.
   - Mentors can offer: Code reviews, Career coaching, Interview prep, Portfolio reviews, and Tech stack guidance.
