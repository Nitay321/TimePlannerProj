# **App Name**: FlowZone

## Core Features:

- Multi-View Task Management: Allows users to manage tasks in Inbox, Today, Tomorrow, and All Tasks views.
- Project-Based Task Grouping: Enables users to group tasks based on projects.
- Advanced Calendar Interface: Provides Month, Week, and Day views for scheduled tasks.
- Drag-and-Drop Functionality: Supports drag-and-drop for tasks, utilizing react-beautiful-dnd to reorder tasks within views, updating their order in the database.
- Time-Based Scheduling with Validation: Allows users to schedule tasks with time validation and no conflicts.
- AI-Powered Smart Scheduling Assistant: Uses generative AI as a tool to suggest optimal times for tasks based on user habits and calendar availability, while considering external factors.
- User Authentication and Persistence: Users can log in and out, with persistent user auth stored on Firestore

## Style Guidelines:

- Primary color: Light pastel blue (#A8D0E6) to create a calming and professional environment.
- Background color: Off-white (#F0F4F8) for light mode and dark gray (#2D3142) for dark mode.
- Accent color: Deep blue (#4B5E8A) for interactive elements and highlights.
- Headline font: 'Space Grotesk' (sans-serif) for a computerized, techy, scientific feel, and headline text; body text will use 'Inter' (sans-serif).
- Code font: 'Source Code Pro' for any code snippets or technical details displayed.
- Use clean, minimalist icons from a library like Material Icons for task types, project categories, and navigation.
- Modern, card-based layout with clear sections and intuitive navigation. Responsive design for desktop and mobile.
- Subtle animations for task transitions, modal appearances, and drag-and-drop feedback to enhance the user experience without being distracting.