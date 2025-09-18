# Proxima - Sales Management System

A modern, responsive React application for managing client sales and product information, built with Material UI and React Router.

## Features

- **Authentication**: Simple login system with hardcoded admin credentials
- **Sales Management**: View, search, and filter sales
- **Product Management**: Create sales with multiple products and automatic calculations
- **Client Information**: Complete client and architect/mistry details
- **Responsive Design**: Fully responsive for desktop, tablet, and mobile devices

## Tech Stack

- **React 19** - Frontend framework
- **Material UI v5** - UI component library
- **React Router v6** - Client-side routing
- **Vite** - Build tool and development server

## Project Structure

```
src/
├── components/          # Reusable UI components
│   └── ProtectedRoute.jsx
├── pages/              # Main application pages
│   ├── Login.jsx
│   ├── SalesList.jsx
│   ├── CreateSale.jsx
│   └── ClientInfo.jsx
├── hooks/              # Custom React hooks
│   └── useAuth.js
├── utils/              # Helper functions
│   └── calc.js
├── App.jsx             # Main application component
├── main.jsx           # Application entry point
├── main.css           # Global styles
└── theme.js           # Material UI theme configuration
```

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser** and navigate to `http://localhost:5173`

## Demo Credentials

- **Username**: `admin`
- **Password**: `admin123`

## Features Overview

### Login Page
- Simple authentication form
- Form validation
- Modern Material UI design
- Demo credentials display

### Sales List Page
- Searchable and filterable sales
- Card-based layout
- Status indicators
- Create new sale button
- User profile and logout

### Create Sale Page
- Category selection
- Optional room field
- Dynamic product rows
- Automatic price calculations
- Discount support (percentage/amount)
- Grand total calculation

### Client Info Page
- Client details form
- Architect/Mistry information
- Review scanner sales
- Form validation
- Phone number validation

## Key Features

- **Responsive Design**: Optimized for all screen sizes
- **Form Validation**: Client-side validation with error messages
- **Price Calculations**: Automatic discount and total calculations
- **Data Persistence**: Local storage for demo purposes
- **Modern UI**: Clean, professional Material UI design
- **Navigation**: Protected routes and smooth navigation

## Development

- **Build**: `npm run build`
- **Preview**: `npm run preview`
- **Lint**: `npm run lint`

## Future Enhancements

- Database integration
- User management system
- File upload for review scanner
- Print functionality
- Export capabilities
- Advanced search filters
- Sale editing functionality

## License

This project is for demonstration purposes.