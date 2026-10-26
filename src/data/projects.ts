import type { Project } from '../types/portfolio'

const screenshot = (name: string) => `images/projects/${name}.png`

// One case study per solution; repeated captures are intentionally omitted.
export const projects: Project[] = [
  {
    id: 'jumex',
    title: 'JUMEX POS & Store Management',
    category: 'RETAIL / BUSINESS APP',
    status: 'Project showcase',
    description:
      'A store management app for sales, stock, customer discounts, and employee records. Staff can save sales offline and sync them when the connection returns.',
    technologies: [
      'React.js',
      'JavaScript / JSX',
      'Vite',
      'Material UI (MUI)',
      'Node.js',
      'Express.js',
      'Firebase Cloud Firestore',
      'Firebase Authentication',
      'Firebase Cloud Storage',
      'IndexedDB',
      'localStorage',
      'Cache Storage',
      'Render',
      'React Router',
      'REST APIs / Fetch',
      'SheetJS (XLSX)',
    ],
    cardTechnologies: ['React.js', 'Material UI', 'Node.js', 'Cloud Firestore', 'IndexedDB'],
    image: 'images/projects/jumex/point-of-sale.png',
    imageAlt:
      'JUMEX point of sale with a customer cart, product search, stock levels, discounts, and payment options',
    role: 'Full-stack business application development',
    overview:
      'JUMEX brings everyday store work into one app. Staff can process sales, check stock, and manage customer discounts. The same system keeps employee records, attendance, weekly payroll, and sales profit reports. It also keeps products and pending sales in the browser so staff can work when the internet is unavailable.',
    problem:
      'The store needed a clear way to handle sales and stock while keeping customer prices and employee records up to date. Staff also needed to keep serving customers during internet interruptions and send pending sales to the cloud when the connection returned.',
    contribution:
      'I built the React screens and connected them to the Node.js and Express backend for checkout and inventory transactions. I used Firestore for the main records and IndexedDB for offline products and pending sales. I also worked on customer discounts, employee records, attendance, weekly payroll, product history, and profit reports.',
    features: [
      'Checkout with product search, customer selection, discounts, and payment options',
      'Stock counts, unit quantities, and monthly inventory adjustments',
      'Customer prices and discounts for each product and sale unit',
      'Employee profiles with role, hire date, and account status',
      'Attendance calendar with present, absent, and partial-day records',
      'Weekly payroll with attendance pay, deductions, paid status, and printable payslips',
      'Product change history with old values, new values, dates, and users',
      'Profit reports with sales, costs, margins, and date and cashier filters',
      'Offline product access and pending sales saved in IndexedDB',
      'Pending sales sync to Firestore when the connection returns',
      'User sign-in with Firebase Authentication',
      'Spreadsheet exports with SheetJS',
    ],
    architecture: [
      {
        title: 'Store screens',
        description:
          'React, Vite, and Material UI provide the cashier, product, sales history, and admin screens. React Router handles navigation, and Fetch sends requests to the backend.',
      },
      {
        title: 'Checkout and stock updates',
        description:
          'A Node.js and Express backend runs on Render. It handles checkout requests and inventory transactions, with Firestore as the main cloud database.',
      },
      {
        title: 'Offline work',
        description:
          'IndexedDB keeps products and pending sales on the device. Pending sales sync to Firestore when the connection returns. The app also uses localStorage and Cache Storage for browser storage.',
      },
      {
        title: 'Cloud records and files',
        description:
          'Firestore stores products, sales, credit, customers, users, and product history. Firebase Authentication handles sign-in, while Firebase Cloud Storage stores files. SheetJS supports spreadsheet exports.',
      },
    ],
    outcome:
      'Staff can handle sales, check stock, and look up customer prices in one place. Offline products and saved pending sales help them keep working during internet interruptions, with sales syncing when the connection returns. The owner can also review attendance, weekly pay, stock changes, and profit from the same system.',
    gallery: [
      {
        image: 'images/projects/jumex/point-of-sale.png',
        alt: 'JUMEX checkout with customer cart, products, prices, and payment methods',
        caption: 'Find products, choose a customer, apply discounts, and complete a sale.',
      },
      {
        image: 'images/projects/jumex/inventory-reconciliation.png',
        alt: 'JUMEX monthly inventory with stock counts, adjustments, and export controls',
        caption: 'Compare stock counts, review differences, and export inventory remarks.',
      },
      {
        image: 'images/projects/jumex/customer-discounts.png',
        alt: 'Customer discount settings with product units, prices, costs, and discounts',
        caption: 'Set customer discounts for each product and sale unit.',
      },
      {
        image: 'images/projects/jumex/employee-management.png',
        alt: 'Employee list with search, role and status filters, and employee summary totals',
        caption: 'Manage employee profiles and find staff by name, role, or status.',
      },
      {
        image: 'images/projects/jumex/attendance-calendar.png',
        alt: 'Employee attendance calendar showing present, absent, and partial-day entries',
        caption: 'Review daily attendance in a monthly calendar.',
      },
      {
        image: 'images/projects/jumex/weekly-payroll.png',
        alt: 'Weekly payroll with attendance pay, deductions, take-home pay, and a print payslip option',
        caption: 'Check attendance pay, deductions, and take-home pay for the week.',
      },
      {
        image: 'images/projects/jumex/product-history.png',
        alt: 'Product history showing dates, products, changed fields, old and new stock values, and users',
        caption: 'See what changed in a product record and which user made the change.',
      },
      {
        image: 'images/projects/jumex/profit-report.png',
        alt: 'Sales profit report with revenue, cost, profit, margin, and cashier and date filters',
        caption: 'Review sales profit and filter the report by product, cashier, or date.',
      },
    ],
  },
  {
    id: 'abiso',
    title: 'Abiso Shipping & Order Management',
    category: 'PHP / BUSINESS APP',
    status: 'Project showcase',
    description:
      'A PHP web app for managing shipping orders, company accounts, and members. It includes dashboards and activity logs, with views for desktop and mobile.',
    technologies: ['PHP'],
    image: 'images/projects/abiso/desktop-dashboard.png',
    imageFit: 'contain',
    previewInset: {
      image: 'images/projects/abiso/mobile-orders-notifications.png',
      alt: 'Abiso mobile dashboard with an order and a notification',
    },
    imageAlt:
      'Abiso desktop dashboard with company totals, shipping orders, payment information, and notifications',
    role: 'Business application interface development',
    overview:
      'Abiso brings shipping orders, company information, and user accounts into one app. The dashboard shows account totals, recent orders, and notifications. The screenshots include desktop and mobile views.',
    problem:
      'Shipping teams need to check orders, manage company members, and keep track of account changes. These details need to be easy to find on both a computer and a phone.',
    contribution:
      'I worked on the dashboard, member management, order views, and activity log screens. I also worked on layouts that make the main information easier to read on desktop and mobile.',
    features: [
      'Dashboard totals for companies, admins, staff, and inactive accounts',
      'Order lists with dates, amounts, payment details, and status',
      'Member search, company details, roles, and account actions',
      'Activity logs with filters for users and actions',
      'Notifications for order requests and updates',
      'Desktop and mobile dashboard layouts',
    ],
    outcome:
      'Users can review orders, check account information, and follow recent changes in one place. The mobile views keep key details available on a smaller screen.',
    gallery: [
      {
        image: 'images/projects/abiso/desktop-dashboard.png',
        alt: 'Abiso company dashboard with orders and notifications',
        caption: 'Desktop dashboard with account totals, order status, and notifications.',
      },
      {
        image: 'images/projects/abiso/admin-overview.png',
        alt: 'Abiso admin dashboard with order, member, and company totals',
        caption: 'Admin overview with summary totals and an order search.',
      },
      {
        image: 'images/projects/abiso/member-management.png',
        alt: 'Abiso member list with search, company, role, and create user controls',
        caption: 'Search members, check their company and role, and create user accounts.',
      },
      {
        image: 'images/projects/abiso/system-logs.png',
        alt: 'Abiso activity log with creation and edit entries and user and action filters',
        caption: 'Review account activity and filter entries by user or action.',
      },
      {
        image: 'images/projects/abiso/mobile-dashboard.png',
        alt: 'Abiso mobile dashboard with company totals and order approval cards',
        caption: 'Mobile dashboard with summary totals and order approval cards.',
      },
      {
        image: 'images/projects/abiso/mobile-orders-notifications.png',
        alt: 'Abiso mobile screen with account totals, a pending order, and a request notification',
        caption: 'Mobile view with account totals, a pending order, and notifications.',
      },
    ],
  },
  {
    id: 'task-app',
    title: 'Team Task & Project Hub',
    category: 'POWER APPS',
    status: 'Project showcase',
    description:
      'An app I built for the Pacer tech team to manage daily tasks, recurring work, and client projects in one place.',
    technologies: ['Power Apps', 'Power Fx', 'SharePoint'],
    image: screenshot('Screenshot 2026-01-16 214015'),
    imageAlt:
      'Pacer Task App showing today’s tasks, priorities, status, date filters, and team navigation',
    role: 'Microsoft 365 and Power Apps development',
    overview:
      'This Power Apps application helps the Pacer tech team plan their day and keep track of tasks. It also gives them quick access to projects, clients, and team tools.',
    problem:
      'The team needed an easy way to see what was due today, check upcoming work, and find client and project information.',
    contribution:
      'I built the task screens, date filters, and navigation. I brought the main task and project tools together so the team could find them from one app.',
    features: [
      'Daily tasks with due dates, priorities, clients, and status',
      'Pending tasks with start and end date filters',
      'Links to Kanban, team availability, and task calendars',
      'Quick access to projects, recurring tasks, templates, guides, and clients',
    ],
    outcome: 'The team can review daily work and open related tools from one place.',
  },
  {
    id: 'business-folders',
    title: 'Business Document Workspace',
    category: 'SHAREPOINT / SPFx',
    status: 'Project showcase',
    description:
      'SharePoint tools I built for Xclusive to create business folders, update document details, and keep client files organized.',
    technologies: ['SharePoint', 'SPFx', 'TypeScript', 'REST APIs'],
    image: screenshot('Screenshot 2026-01-16 212757'),
    imageAlt:
      'Create a Business folder form with business name, industry, status, and analyst fields in the Xclusive intranet',
    role: 'SharePoint custom solution development',
    overview:
      'These SharePoint tools help Xclusive organize business documents across regional sites. Staff can create folders and add useful details such as industry, status, and analyst.',
    problem:
      'Staff needed a consistent way to set up client folders and keep business details up to date without repeating the same manual steps.',
    contribution:
      'I built the folder creation forms, settings, and tag editing panel. I also added library actions to help staff manage business documents.',
    features: [
      'Create business folders with business name, industry, status, and analyst',
      'Choose the document library and folder structure',
      'Update status, industry, and analyst tags from a side panel',
      'Document library views for brokers and analysts',
    ],
    outcome: 'Staff can set up business folders and manage document details within SharePoint.',
    gallery: [
      {
        image: screenshot('Screenshot 2026-01-16 212757'),
        alt: 'Business folder creation form',
        caption: 'Create a business folder with its name, industry, status, and analyst.',
      },
      {
        image: screenshot('Screenshot 2024-02-01 195938'),
        alt: 'Folder creation web part and configuration panel',
        caption: 'Configure folder creation for a selected library and security group.',
      },
      {
        image: screenshot('Screenshot 2024-02-20 162436'),
        alt: 'Broker document library with business metadata columns',
        caption: 'Organize broker documents by status, industry, analyst, and broker.',
      },
      {
        image: screenshot('Screenshot 2026-01-16 212242'),
        alt: 'Change Tags panel alongside a SharePoint library',
        caption: 'Update business details from the Change Tags panel.',
      },
    ],
  },
  {
    id: 'office-boost',
    title: 'Office Boost Outlook Add-in',
    category: 'MICROSOFT 365',
    status: 'Project showcase',
    description:
      'An Outlook add-in I built to save emails and attachments to SharePoint and find files without leaving the email window.',
    technologies: ['Outlook Add-ins', 'SharePoint', 'TypeScript', 'REST APIs'],
    image: screenshot('Screenshot 2026-01-16 210737'),
    imageAlt:
      'Office Boost Outlook add-in showing SharePoint document search and files selected for an outgoing email',
    role: 'Outlook add-in and SharePoint integration development',
    overview:
      'Office Boost connects Outlook with SharePoint. Users can save an email to a chosen folder or search for documents to attach to a message.',
    problem:
      'Users had to switch between Outlook and SharePoint to save emails or find documents. I wanted to make these steps easier from the email window.',
    contribution:
      'I built the add-in screens and SharePoint connections for choosing folders, saving email content, and searching for documents.',
    features: [
      'Choose a SharePoint site and destination folder',
      'Save emails with or without attachments',
      'Search SharePoint documents while writing an email',
      'Select documents to add to an outgoing email',
    ],
    outcome: 'Users can save emails and find SharePoint files while staying in Outlook.',
    gallery: [
      {
        image: screenshot('Screenshot 2023-08-09 154128'),
        alt: 'Save to SharePoint task pane in Outlook',
        caption: 'Select a SharePoint destination and save emails with attachments.',
      },
      {
        image: screenshot('Screenshot 2026-01-16 210737'),
        alt: 'SharePoint document search and selected attachments in Outlook',
        caption: 'Search SharePoint and select documents while composing an email.',
      },
    ],
  },
  {
    id: 'invoice-approvals',
    title: 'Invoice Approval Dashboard',
    category: 'WORKFLOW AUTOMATION',
    status: 'Project showcase',
    description:
      'A SharePoint dashboard that helps the finance team check invoice details, approvers, and payment status at a glance.',
    technologies: ['SharePoint', 'Power Automate', 'List Formatting'],
    image: screenshot('Screenshot 2023-07-19 121514'),
    imageAlt:
      'SharePoint Finance dashboard with invoice cards displaying approved, rejected, and paid statuses',
    role: 'SharePoint and approval workflow development',
    overview:
      'This dashboard shows invoice requests as cards in SharePoint. Each card includes key invoice details and a clear approval or payment status.',
    problem:
      'The finance team needed a simple way to check invoice information and see which requests were approved, rejected, or paid.',
    contribution:
      'I created the invoice card view and worked on the approval workflow in SharePoint.',
    features: [
      'Invoice number, date, amount, and approver information',
      'Clear labels for approved, rejected, and paid invoices',
      'Invoice cards that are easy to scan',
      'Access to archived invoices beside current requests',
    ],
    outcome: 'The finance team can check invoice progress without opening each request.',
  },
  {
    id: 'vehicle-management',
    title: 'Vehicle & Service Management',
    category: 'POWER APPS',
    status: 'Project showcase',
    description:
      'An app for seven20 electrical to manage vehicle records, assigned operators, and service dates, with a calendar for maintenance.',
    technologies: ['Power Apps', 'Power Fx', 'SharePoint'],
    image: screenshot('Screenshot_20221213_112725'),
    imageAlt:
      'Vehicle database with registration records, operators, maintenance dates, and a new vehicle form',
    role: 'Power Apps business application development',
    overview:
      'This app keeps vehicle records and service schedules together. Users can add vehicle details, check maintenance dates, and view service bookings on a calendar.',
    problem:
      'The team needed one place to check vehicle details and plan service dates so they could see when vehicles would be unavailable.',
    contribution: 'I built the vehicle list, entry forms, status controls, and service calendar.',
    features: [
      'Vehicle registration, make, model, year, and operator records',
      'Last service, next service, and registration expiry fields',
      'Vehicle condition, retired status, and known issues',
      'Monthly service calendar with vehicle filters and notes',
    ],
    outcome: 'The team can check vehicle records and plan maintenance from the same app.',
    gallery: [
      {
        image: screenshot('Screenshot_20221213_112725'),
        alt: 'Vehicle database and entry form',
        caption: 'Maintain vehicle records, operators, condition, and service dates.',
      },
      {
        image: screenshot('Screenshot_20221213_112848'),
        alt: 'Monthly vehicle service calendar',
        caption: 'Review service bookings and vehicle availability by month.',
      },
    ],
  },
  {
    id: 'configurable-faqs',
    title: 'Configurable FAQ Experience',
    category: 'SHAREPOINT / SPFx',
    status: 'Project showcase',
    description:
      'A SharePoint FAQ web part where site owners can add questions, group them by category, and include links and images in answers.',
    technologies: ['SharePoint', 'SPFx', 'TypeScript', 'React'],
    image: screenshot('Screenshot 2024-10-17 145341'),
    imageAlt: 'SharePoint FAQ accordion with an expanded answer and web part settings panel',
    role: 'Custom SharePoint web part development',
    overview:
      'This web part displays questions as an expandable list. Site owners can manage the answers, categories, and links through simple settings.',
    problem:
      'Site owners needed a way to keep common questions and answers up to date without asking a developer to change the code.',
    contribution:
      'I built the expandable question list, support for images and links, and the screens for managing questions and categories.',
    features: [
      'Expandable questions with rich text, images, and links',
      'Categories and question ordering',
      'Editable links and extra question details',
      'Settings for the source list and how questions open',
    ],
    outcome: 'Site owners can publish and update FAQs for different teams using the same web part.',
    gallery: [
      {
        image: screenshot('Screenshot 2024-10-17 145341'),
        alt: 'FAQ accordion with SharePoint configuration pane',
        caption: 'Publish an expandable FAQ linked to a SharePoint list.',
      },
      {
        image: screenshot('Screenshot 2024-10-17 145610'),
        alt: 'Expanded FAQ answer containing rich text and an image',
        caption: 'Add links and images to an answer.',
      },
      {
        image: screenshot('Screenshot 2024-10-17 160345'),
        alt: 'FAQ category configuration interface',
        caption: 'Create and order FAQ categories.',
      },
      {
        image: screenshot('Screenshot 2024-10-17 160413'),
        alt: 'Question and answer management table',
        caption: 'Manage questions, answers, links, and category assignments.',
      },
    ],
  },
  {
    id: 'adc-intranet',
    title: 'ADC SharePoint Intranet',
    category: 'MICROSOFT 365',
    status: 'Project showcase',
    description:
      'A SharePoint intranet for All Data Communications, with company news, team information, and quick links to everyday resources.',
    technologies: ['SharePoint Online', 'Site Navigation', 'Web Parts'],
    image: screenshot('Screenshot 2023-04-03 120323'),
    imageAlt:
      'All Data Communications intranet with branded navigation, a company hero banner, news, and resource tiles',
    role: 'SharePoint intranet customization and configuration',
    overview:
      'The ADC intranet gives employees a home page for company information. It uses company branding and clear links to news, documents, people, and resources.',
    problem:
      'Employees needed an easy starting point to find company updates, documents, and team information.',
    contribution:
      'I worked on the page layout, company branding, and navigation settings in SharePoint.',
    features: [
      'Company-branded colors, header, and image banner',
      'Global navigation to documents, pages, team information, and FAQs',
      'Company news and updates',
      'Quick access to mission, team, and business department resources',
    ],
    outcome: 'Employees can find company updates and shared resources from one home page.',
  },
  {
    id: 'giba-webparts',
    title: 'Calendar & Content Web Parts',
    category: 'SHAREPOINT / SPFx',
    status: 'Project showcase',
    description:
      'SharePoint web parts for GIBA, including an availability calendar, image links, and a carousel that page owners can add to their sites.',
    technologies: ['SharePoint', 'SPFx', 'TypeScript', 'React'],
    image: screenshot('Screenshot 2023-04-03 143243'),
    imageAlt:
      'GIBA SharePoint availability calendar and custom image links web part in the component picker',
    role: 'Custom SharePoint component development',
    overview:
      'These web parts add a team calendar, image links, and a carousel to GIBA’s SharePoint pages. Page owners can find and add them through the normal SharePoint editor.',
    problem:
      'Page owners needed useful components for showing team availability and visual content without building each page from scratch.',
    contribution:
      'I built the calendar, image link, and carousel components and made them available in the SharePoint web part picker.',
    features: [
      'Monthly availability calendar with leave and meeting entries',
      'A clear note about the calendar’s time zone',
      'Image links that page owners can add to a page',
      'A carousel available from the SharePoint web part picker',
    ],
    outcome: 'Page owners can add these components to their sites using the SharePoint editor.',
    gallery: [
      {
        image: screenshot('Screenshot 2023-04-03 143243'),
        alt: 'Availability calendar and image links web part picker',
        caption: 'Availability information and custom image links within SharePoint.',
      },
      {
        image: screenshot('Screenshot 2023-04-03 144349'),
        alt: 'Custom PS Carousel web part in the SharePoint picker',
        caption: 'Add the custom carousel through the SharePoint editor.',
      },
    ],
  },
  {
    id: 'app-launcher',
    title: 'Employee App Launcher',
    category: 'SHAREPOINT / SPFx',
    status: 'Project showcase',
    description:
      'A searchable app launcher that helps employees find business tools, check device support, and open useful guides.',
    technologies: ['SharePoint', 'SPFx', 'TypeScript'],
    image: screenshot('Screenshot 2023-07-13 161525'),
    imageFit: 'contain',
    imageAlt:
      'Pacer app launcher with a personalized greeting, app search, active apps, guides, and device indicators',
    role: 'SharePoint application hub development',
    overview:
      'This launcher lists the team’s business apps in one panel. It includes a search box, app icons, device information, and links to guides.',
    problem:
      'Employees needed a simple way to find the right internal app and check how to use it.',
    contribution:
      'I built the app list, search, show and hide controls, and the information shown on each app card.',
    features: [
      'Personalized greeting and application search',
      'Active app count and a show or hide option',
      'App icons and supported device indicators',
      'Guide links next to the apps',
    ],
    outcome: 'Employees can find business apps and their guides from one panel.',
  },
  {
    id: 'account-notifications',
    title: 'Account Notification Web Part',
    category: 'SHAREPOINT / SPFx',
    status: 'Project showcase',
    description:
      'A SharePoint web part that shows accounts on hold, with settings to choose the source list, background color, and corner style.',
    technologies: ['SharePoint', 'SPFx', 'TypeScript'],
    image: screenshot('Screenshot_20221117_064738'),
    imageAlt:
      'Accounts on Hold notification panel with a gradient background and list of account entries',
    role: 'SharePoint notification component development',
    overview:
      'This web part displays account notices from a SharePoint list. Site owners can choose the list and adjust the look to match their page.',
    problem:
      'The team needed important account notices to be easy to see on the intranet. Site owners also needed control over how the notices looked.',
    contribution:
      'I built the account list display and settings for the source list, background color, and rounded corners.',
    features: [
      'Selectable SharePoint list as the content source',
      'A clear list of account notices',
      'Settings for background color and rounded corners',
      'Support for different page layouts and backgrounds',
    ],
    outcome:
      'Staff can see account notices on the intranet, and site owners can adjust the web part to fit their pages.',
    gallery: [
      {
        image: screenshot('Screenshot_20221117_064738'),
        alt: 'Account notification panel in a SharePoint page section',
        caption: 'Display account notices as a reusable page component.',
      },
      {
        image: screenshot('Screenshot_20221118_092033'),
        alt: 'Notification configuration with list, color, and border radius controls',
        caption: 'Choose the source list, color, and corner style.',
      },
    ],
  },
  {
    id: 'ste-hub',
    title: 'seven20 Employee Hub',
    category: 'MICROSOFT 365',
    status: 'Project showcase',
    description:
      'A SharePoint home page for seven20 electrical, with company news, an image carousel, and links to operations and administration resources.',
    technologies: ['SharePoint Online', 'Web Parts', 'Site Branding'],
    image: screenshot('Screenshot_20221116_070530'),
    imageAlt:
      'seven20 electrical employee hub with a city-image carousel, navigation, news, and department links',
    role: 'SharePoint intranet development and customization',
    overview:
      'The seven20 employee hub brings company updates and department links onto one SharePoint home page. It includes an image carousel and uses the company’s branding.',
    problem:
      'Employees needed one starting point for company news and the resources they use for daily work.',
    contribution:
      'I worked on the home page layout, branding, content display, and links to department resources.',
    features: [
      'Company-branded intranet header and navigation',
      'Image carousel with captions and slide indicators',
      'Company news area',
      'Quick links to operations and administration resources',
    ],
    outcome:
      'Employees can check company updates and open department resources from the same page.',
  },
]
