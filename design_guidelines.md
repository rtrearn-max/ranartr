# RTR Official Earnings - Design Guidelines

## Design Approach

**Selected Framework**: Design System Approach (Material Design + Ant Design Financial Patterns)

**Rationale**: This is a utility-focused financial application requiring trust, clarity, and efficiency. Drawing from Material Design's robust component system and Ant Design's proven financial dashboard patterns ensures professional credibility while maintaining functional excellence.

**Core Design Principles**:
- Financial Trust: Clean, professional aesthetic that inspires confidence
- Information Clarity: Clear visual hierarchy for complex financial data
- Workflow Efficiency: Streamlined processes for transactions and management
- Dual Experience: Distinct but cohesive admin vs. user interfaces

---

## Typography System

### Font Families
- **Primary**: Inter (via Google Fonts) - Clean, professional, excellent for data
- **Accent**: Poppins (via Google Fonts) - Friendly for headings and CTAs
- **Monospace**: JetBrains Mono - For transaction IDs, amounts, balances

### Typography Hierarchy

**Display & Headings**:
- Page Titles: text-4xl font-bold (Poppins)
- Section Headers: text-2xl font-semibold (Poppins)
- Card Headers: text-lg font-semibold (Inter)
- Subsection Titles: text-base font-medium (Inter)

**Body Text**:
- Primary Content: text-base font-normal (Inter)
- Secondary Info: text-sm font-normal (Inter)
- Labels: text-sm font-medium (Inter)
- Helper Text: text-xs (Inter)

**Data Display**:
- Large Amounts (Dashboard): text-3xl font-bold (JetBrains Mono)
- Medium Amounts (Cards): text-xl font-semibold (JetBrains Mono)
- Small Amounts (Lists): text-base font-medium (JetBrains Mono)
- Transaction IDs: text-xs font-mono (JetBrains Mono)

---

## Layout System

### Spacing Scale
**Core Units**: Tailwind 2, 4, 6, 8, 12, 16, 24, 32
- Micro spacing: 2, 4 (tight elements, form field gaps)
- Component padding: 4, 6, 8 (cards, buttons, inputs)
- Section spacing: 12, 16, 24 (between card groups, dashboard sections)
- Page margins: 24, 32 (main content areas)

### Grid Structure

**Dashboard Layouts**:
- Admin Panel: Sidebar (w-64) + Main Content (flex-1)
- User Panel: Sidebar (w-64 lg, hidden mobile) + Main (flex-1)
- Card Grids: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4

**Container Widths**:
- Max Dashboard Width: max-w-7xl
- Form Containers: max-w-2xl
- Modal Content: max-w-4xl

---

## Component Library

### Navigation

**Admin Sidebar**:
- Fixed left sidebar (w-64, h-screen)
- Logo/branding at top (h-16)
- Collapsible menu sections with icons (Lucide React)
- Active state with distinct treatment
- Bottom section for admin profile/logout

**User Sidebar**:
- Similar structure to admin but simplified
- Prominent balance display at top
- Quick action buttons (Deposit, Withdraw)
- Mobile: Hamburger menu with slide-in drawer

**Top Bar** (Both Panels):
- Search functionality
- Notifications bell with badge
- User/Admin avatar with dropdown
- Mobile menu toggle

### Dashboard Cards

**Stat Cards** (Balance, Totals):
- Consistent height (h-32)
- Icon in corner (size-8)
- Large value display (text-3xl)
- Label below value (text-sm)
- Optional trend indicator (+/- with arrow)

**Activity Cards**:
- Full-width on mobile, 2-col on desktop
- Timeline/list view for transactions
- Status badges (Pending/Approved/Rejected)
- Expandable details on click

**Analytics Cards**:
- Chart/graph area with adequate padding (p-6)
- Legend and filters integrated
- Responsive aspect ratio

### Forms & Inputs

**Input Fields**:
- Consistent height (h-12)
- Clear labels above (text-sm font-medium)
- Placeholder text for guidance
- Error states with message below (text-xs)
- Icon prefix/suffix where appropriate

**Buttons**:
- Primary CTA: Large (h-12), full-width on mobile
- Secondary: Medium (h-10)
- Tertiary: Text-only with icon
- Icon buttons: Square (size-10)
- Loading states with spinner

**Upload Components**:
- Drag-and-drop zone with dashed border
- File preview thumbnails
- Clear file name and size display
- Remove button for uploaded files

### Data Tables

**Transaction Tables**:
- Sticky header row
- Alternating row treatment for readability
- Action column on right
- Sortable columns with indicators
- Pagination controls at bottom
- Mobile: Stack into cards with key info

**Columns**:
- Date/Time: w-40
- Transaction ID: w-32 (truncate with tooltip)
- Amount: w-24 (right-aligned)
- Status: w-24 (badge)
- Actions: w-20

### Gamification Elements

**Spin Wheel**:
- Centered canvas element (size-96)
- Surrounding glow/shadow for emphasis
- Large spin button below (h-16)
- Prize segments clearly labeled
- Animation: Smooth rotation with easing
- Result modal with confetti effect

**Daily Reward**:
- Card-based presentation
- Countdown timer prominently displayed
- Large claim button when available
- Reward amount highlighted (text-4xl)
- Disabled state when unavailable

**Plan Cards**:
- Vertical card layout (h-auto)
- Plan name and badge at top
- Price prominently displayed (text-2xl)
- Coin requirement with icon
- Profit rate highlighted
- Duration and benefits list
- Purchase button at bottom (h-12)
- Best value badge for featured plans

### Modals & Overlays

**Modal Structure**:
- Backdrop with blur effect
- Centered content box (max-w-2xl)
- Header with title and close button
- Body content with appropriate padding (p-6)
- Footer with action buttons (right-aligned)

**Toast Notifications**:
- Fixed top-right position
- Auto-dismiss after 5s
- Icon prefix indicating type
- Stacked when multiple

**Confirmation Dialogs**:
- Simpler structure (max-w-md)
- Icon at top center
- Clear message
- Dual buttons (Cancel/Confirm)

### Status Indicators

**Badges**:
- Pill-shaped with padding (px-3 py-1)
- Text size: text-xs font-medium
- States: Active, Pending, Approved, Rejected, Expired
- Icon prefix for clarity

**Progress Indicators**:
- Linear progress bars for plan duration
- Circular progress for loading states
- Percentage text overlay when applicable

### Icons

**Icon Library**: Lucide React (via CDN)

**Usage**:
- Navigation: size-5
- Stat cards: size-8
- Buttons: size-4
- Form inputs: size-5
- Tables: size-4
- Always pair with text for clarity

---

## Responsive Behavior

**Breakpoints**:
- Mobile: base (< 640px)
- Tablet: md (768px+)
- Desktop: lg (1024px+)
- Large Desktop: xl (1280px+)

**Mobile Adaptations**:
- Collapsible sidebar to hamburger menu
- Stack card grids to single column
- Tables transform to stacked cards
- Reduce padding (p-4 instead of p-6)
- Hide less critical data columns

**Desktop Enhancements**:
- Multi-column layouts for efficiency
- Hover states for interactive elements
- Tooltips for additional context
- Sidebar always visible

---

## Accessibility Standards

- Maintain WCAG 2.1 AA compliance
- All interactive elements keyboard navigable
- ARIA labels for icon-only buttons
- Focus indicators clearly visible (ring-2)
- Form validation with clear error messaging
- Screen reader announcements for status changes

---

## Animations (Minimal)

**Permitted Animations**:
- Page transitions: Fade in (duration-200)
- Modal entry/exit: Scale + fade (duration-300)
- Spin wheel rotation: Custom easing with momentum
- Toast notifications: Slide in from right (duration-300)
- Loading spinners: Continuous rotation
- Hover states: Transition all (duration-150)

**No Animations For**:
- Data updates (instant)
- Form submissions (use loading states)
- Table sorting/filtering
- Tab switching

---

## Images

**Hero Image**: None - This is a financial dashboard application, not a marketing site

**Icon Usage**: Lucide React icons throughout for consistency and performance

**User-Generated Content**:
- Transaction screenshot uploads: Display as thumbnails (max-w-xs) with lightbox on click
- Profile avatars: Circular (size-10 for sidebar, size-16 for profile page)

---

## Platform-Specific Notes

**Admin Panel Distinctions**:
- Denser information display
- Advanced controls and settings
- Bulk action capabilities
- Comprehensive analytics views

**User Panel Focus**:
- Simplified navigation
- Prominent balance displays
- Easy access to earning features
- Clear transaction history

This design system creates a trustworthy, efficient, and professional financial platform while accommodating the unique gamification elements that differentiate RTR Official Earnings.