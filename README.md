# AccidentReports.com

A multi-page Next.js web application that provides free accident and police reports as a lead funnel for personal injury law firms.

## 🚀 Features

- **Free Accident Report Lookup**: Users can search and obtain accident reports at no cost
- **Multi-Step Funnel**: Guided 3-step process for report requests
- **Legal Lead Generation**: Built-in legal help conversion paths
- **SEO-Optimized Landing Pages**: State and city-specific pages for local SEO
- **Modern Tech Stack**: Built with Next.js 14+, TypeScript, and Tailwind CSS

## 📋 Pages Structure

### Main Funnel
- `/` - Home page
- `/get-report/step-1` - Accident details collection
- `/get-report/step-2` - Contact information
- `/get-report/step-3` - Report status and delivery
- `/reports/[reportId]` - Individual report view

### Marketing & Conversion
- `/legal-help` - Legal consultation request form
- `/states/[stateSlug]/accident-reports` - State-specific landing pages
- `/cities/[citySlug]/accident-reports` - City-specific landing pages

### Information Pages
- `/faq` - Frequently asked questions
- `/about` - About the service
- `/for-lawyers` - Partner program information
- `/terms` - Terms of service
- `/privacy` - Privacy policy

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Deployment**: Vercel (recommended)

## 📦 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd accident-reports
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file (optional):
```bash
cp .env.local.example .env.local
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## 🗂️ Project Structure

```
accident-reports/
├── app/
│   ├── (funnel)/          # Report request funnel pages
│   │   ├── get-report/    # 3-step report request
│   │   └── reports/       # Individual report pages
│   ├── (marketing)/       # Marketing and SEO pages
│   │   ├── states/        # State landing pages
│   │   ├── cities/        # City landing pages
│   │   ├── legal-help/    # Legal conversion page
│   │   └── ...            # Other marketing pages
│   ├── api/               # API routes
│   │   ├── report-requests/
│   │   ├── reports/
│   │   └── legal-leads/
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable React components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── PageContainer.tsx
│   ├── StepIndicator.tsx
│   └── CTABox.tsx
├── lib/                   # Utilities and data
│   ├── types.ts           # TypeScript interfaces
│   └── mockData.ts        # Mock data for MVP
└── public/                # Static assets
```

## 🔌 API Routes

### POST /api/report-requests
Create a new report request
- **Body**: `{ accidentDetails, contact }`
- **Returns**: `{ requestId, matchedReportId }`

### GET /api/reports/search
Search for reports
- **Query Params**: `state`, `city`, `date`
- **Returns**: Array of matching reports

### GET /api/reports/[reportId]
Get a specific report by ID
- **Returns**: Report object

### POST /api/legal-leads
Create a legal consultation request
- **Body**: `{ name, email, phone, state, description, reportId }`
- **Returns**: `{ leadId, success }`

## 🎨 Customization

### Styling
All styling is done with Tailwind CSS. Modify `tailwind.config.ts` for theme customization.

### Data
Currently uses mock data in `lib/mockData.ts`. Replace with real database connections as needed.

### SEO
Update metadata in individual page files and `app/layout.tsx` for SEO optimization.

## 🚢 Deployment on Vercel

1. Push code to GitHub repository
2. Connect repository to Vercel
3. Configure project settings (use default Next.js settings)
4. Deploy!

Vercel will automatically:
- Build the project
- Generate static pages
- Set up serverless functions for API routes
- Provide a production URL

## 📝 Future Enhancements

- [ ] Connect to real accident report databases
- [ ] Implement user authentication
- [ ] Add email notifications for report delivery
- [ ] Integrate payment processing (if adding premium features)
- [ ] Add analytics tracking (Google Analytics, etc.)
- [ ] Implement CRM integration for lead management
- [ ] Add automated testing

## 📄 License

This project is for demonstration purposes.

## 🤝 Contributing

This is a closed-source project for a specific business use case.
