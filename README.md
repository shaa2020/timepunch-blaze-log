
# TimePunch - Time Tracking PWA

A beautiful and minimalist Progressive Web App for time tracking with offline support, data export, and dark/light mode.

## Features

### ⏰ Core Functionality
- **One-Click Time Tracking**: Large, accessible button to clock in/out
- **Automatic Duration Calculation**: Precise time tracking with hours and minutes
- **Persistent Storage**: All data saved locally using localStorage
- **Offline Support**: Full functionality without internet connection

### 🎨 Beautiful Design
- **Orange & Sky Blue Theme**: Modern, professional color scheme
- **Dark/Light Mode**: Seamless theme switching with system preference detection
- **Responsive Design**: Perfect on desktop, tablet, and mobile devices
- **High Contrast**: Accessible buttons and text in both themes

### 📊 Data Management
- **Work Log**: Complete history of all time entries
- **Export Options**: Download data as CSV or TXT files
- **Statistics**: Track total hours worked and session count
- **Real-time Updates**: Live clock and session duration display

### 📱 PWA Features
- **Installable**: Add to home screen on mobile devices
- **Offline First**: Works without internet connection
- **Fast Loading**: Cached resources for instant startup
- **Native Feel**: Standalone app experience

## Installation & Deployment

### Quick Start
1. Clone or download this repository
2. Run `npm install` to install dependencies
3. Run `npm run dev` for development or `npm run build` for production

### Deploy to Vercel
1. Push your code to GitHub
2. Connect your GitHub repo to [Vercel](https://vercel.com)
3. Deploy automatically - Vercel will handle the build process
4. Your PWA will be live with HTTPS (required for PWA features)

### Deploy to GitHub Pages
1. Run `npm run build` to create production build
2. Push the `dist` folder contents to your `gh-pages` branch
3. Enable GitHub Pages in repository settings
4. Access your app at `https://yourusername.github.io/repository-name`

### Deploy to Any Static Host
1. Run `npm run build`
2. Upload the contents of the `dist` folder to your web server
3. Ensure HTTPS is enabled (required for PWA features)

## PWA Installation

### On Mobile (iOS/Android)
1. Open the app in your mobile browser
2. Look for "Add to Home Screen" option in browser menu
3. Follow prompts to install
4. App will appear as native app on home screen

### On Desktop (Chrome/Edge/Safari)
1. Look for install icon in address bar
2. Click to install as desktop app
3. App will open in standalone window

## Technical Details

### Built With
- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Vite** - Fast build tool and dev server
- **Shadcn/UI** - High-quality UI components

### PWA Implementation
- **Manifest**: Complete PWA manifest with icons and metadata
- **Service Worker**: Caches resources for offline functionality
- **localStorage**: Persistent data storage without backend
- **Responsive Design**: Mobile-first approach

### Data Export Formats

#### CSV Export
```csv
Date,Clock In,Clock Out,Duration,Hours Worked
Monday, January 15, 2024,09:00:00 AM,05:30:00 PM,8h 30m,8.50
```

#### TXT Export
```
TimePunch Work Log
==================

Date: Monday, January 15, 2024
Clock In: 09:00:00 AM
Clock Out: 05:30:00 PM
Duration: 8h 30m
Hours: 8.50
```

## Browser Support

- ✅ Chrome 80+ (Full PWA support)
- ✅ Firefox 75+ (Limited PWA support)
- ✅ Safari 14+ (iOS PWA support)
- ✅ Edge 80+ (Full PWA support)

## Privacy & Security

- **No Data Collection**: All data stays on your device
- **No Server Required**: Works completely offline
- **Local Storage Only**: Uses browser's localStorage API
- **No Analytics**: No tracking or external connections

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and test thoroughly
4. Submit a pull request with clear description

## License

This project is open source and available under the MIT License.

---

**Ready to track your time?** 🚀

Deploy TimePunch today and start managing your work hours with style!
