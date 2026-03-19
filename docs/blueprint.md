# **App Name**: TaskFlow Pro

## Core Features:

- Secure User Authentication: Allows users to register, log in, and log out securely. Implements password hashing, JWT-based authentication (Access and Refresh tokens), and manages tokens in local storage for persistent sessions.
- Robust Task Management API: A Node.js backend API (powered by SQLite via Prisma) for authenticated users to perform full CRUD operations on their personal tasks, including server-side pagination, filtering by status, and searching by title.
- Interactive Task Dashboard: A responsive frontend display of tasks fetched from the API, offering client-side filtering and search functionalities to enhance user task management.
- Intuitive Task CRUD UI: Provides user-friendly forms and controls for adding new tasks, editing existing details, toggling completion status, and deleting tasks. Features modern toast notifications for user feedback.
- Modern Responsive Design: A polished and adaptive user interface built with Next.js and Tailwind CSS, ensuring a top-notch and fully responsive experience across all desktop and mobile devices.

## Style Guidelines:

- The primary color, #297BA3, is a deep, professional blue-green chosen to evoke feelings of focus, organization, and stability. This color serves as the main interactive and branding hue for the application.
- The background color, #EDF2F6, is a very light desaturated blue, creating a clean, airy canvas that promotes clarity and minimizes eye strain, aligning with a sense of calm productivity.
- An accent color, #75DCF0, is a vibrant, clear sky blue that provides energetic contrast against the primary and background hues. It will be used judiciously for calls to action, highlights, and status indicators.
- Body and headline font: 'Inter', a contemporary grotesque sans-serif. Its clean lines and excellent readability contribute to a modern, objective, and efficient aesthetic, perfectly suited for a task management application.
- Utilize a consistent set of clean, minimalist line icons for all UI actions (e.g., add, edit, delete, complete, filter, search). Icons should be easily recognizable and complement the modern, polished aesthetic derived from Tailwind CSS components.
- Embrace a mobile-first, grid-based layout approach. Prioritize clear visual hierarchy, ample whitespace, and intuitive information grouping to ensure usability and scannability on all screen sizes.
- Implement subtle, functional animations. This includes smooth transitions for UI state changes (like task completion), responsive feedback on button presses, and modern, unobtrusive toast notifications for actions and errors.