# 🎬 FilmO'Clock

[![Next.js](https://img.shields.io/badge/Built%20with-Next.js%2015-blue)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Styled%20with-TailwindCSS-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Backend-Firebase-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)](https://vercel.com/)

A modern movie and TV show discovery platform featuring real-time translations, personalized watchlist and favorites management, responsive RTL support, and smooth browsing across trending, popular, and top-rated titles. FilmO'Clock offers secure authentication, real-time language switching, lazy loading for better performance, and an SEO-optimized, lightning-fast user experience.

## Technologies Used

- **[Next.js 15](https://nextjs.org/)**: Framework for server-rendered React apps.
- **[TypeScript](https://www.typescriptlang.org/)**: Static type checking.
- **[Tailwind CSS](https://tailwindcss.com/)**: Utility-first CSS for responsive design.
- **[Redux Toolkit](https://redux-toolkit.js.org/)**: Global state management.
- **[RTK Query](https://redux-toolkit.js.org/rtk-query/overview)**: Efficient data fetching and caching.
- **[Firebase](https://firebase.google.com/)**: Authentication and real-time database (Firestore).
- **[next-intl](https://next-intl-docs.vercel.app/)**: Internationalization support.
- **[Google Translate API](https://rapidapi.com/gatzuma/api/google-translate1/)**: Translation service.
- **[Formik](https://formik.org/)**: Form handling and management.
- **[Yup](https://github.com/jquense/yup)**: Schema validation for forms.
- **[Framer Motion](https://www.framer.com/motion/)**: Smooth UI animations.
- **[Swiper](https://swiperjs.com/)**: Mobile-friendly carousel components.
- **[React Intersection Observer](https://www.npmjs.com/package/react-intersection-observer)**: Component lazy loading.
- **[Sonner](https://sonner.emilkowal.ski/)**: Lightweight toast notifications.
- **[React Icons](https://react-icons.github.io/react-icons/)**: Icon library integration.

## Features

- Browse trending, popular, and top-rated movies and TV shows
- Detailed movie and TV show pages with overviews, genres, and runtime
- Watchlist and favorites (requires authentication)
- Secure authentication using Firebase
- Translation support (Google Translate, MyMemory)
- RTL layout support for Arabic language users
- Real-time language switching (English/Arabic)
- SEO-friendly with server-side data fetching
- Fast lazy loading of components and images
- Smooth UI animations with Framer Motion
- Fully responsive design for all devices

## Security

- All sensitive API keys (e.g., translation services) are protected server-side using **Next.js API Routes**.
- Frontend clients never directly access third-party services; all external requests are securely handled through internal proxy endpoints.
- Authentication and user data are securely managed with **Firebase Authentication**.
