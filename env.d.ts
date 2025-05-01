/// <reference types="node" />

declare namespace NodeJS {
  interface ProcessEnv {
    // ======================
    // TMDB Configuration
    // ======================
    TMDB_API_KEY: string;
    TMDB_ACCESS_TOKEN: string;
    NEXT_PUBLIC_BASE_URL: string;
    NEXT_PUBLIC_BASE_IMG_URL_W500: string;
    NEXT_PUBLIC_BASE_IMG_URL_W200: string;
    NEXT_PUBLIC_BASE_IMG_URL_W1280: string;
    NEXT_PUBLIC_BASE_IMG_URL_ORI: string;

    // ======================
    // YouTube API
    // ======================
    NEXT_PUBLIC_YOUTUBE_API_KEY: string;

    // ======================
    // MYMEMORY API
    // ======================
    NEXT_PUBLIC_MYMEMORY_API_KEY: string;

    // ======================
    // Rapid API
    // ======================
    RAPIDAPI_KEY: string;

    // ======================
    // Firebase Client Configuration
    // ======================
    NEXT_PUBLIC_FIREBASE_API_KEY: string;
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: string;
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: string;
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: string;
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: string;
    NEXT_PUBLIC_FIREBASE_APP_ID: string;

    // ======================
    // Firebase Admin SDK (SERVER-ONLY)
    // ======================
    /**
     * @warning Never prefix with NEXT_PUBLIC_ as this exposes your private key
     * @description Service account email from Firebase
     */
    FIREBASE_ADMIN_CLIENT_EMAIL: string;
    FIREBASE_ADMIN_PRIVATE_KEY: string;

    // ======================
    // TV Watch Servers
    // ======================
    NEXT_PUBLIC_TV_SERVER_1_URL: string;
    NEXT_PUBLIC_TV_SERVER_2_URL: string;
    NEXT_PUBLIC_TV_SERVER_3_URL: string;
    NEXT_PUBLIC_TV_SERVER_4_URL: string;
    NEXT_PUBLIC_TV_SERVER_5_URL: string;
    NEXT_PUBLIC_TV_SERVER_6_URL: string;
    NEXT_PUBLIC_TV_SERVER_7_URL: string;
    NEXT_PUBLIC_TV_SERVER_8_URL: string;
    NEXT_PUBLIC_TV_SERVER_9_URL: string;
    NEXT_PUBLIC_TV_SERVER_10_URL: string;
    NEXT_PUBLIC_TV_SERVER_11_URL: string;
    NEXT_PUBLIC_TV_SERVER_12_URL: string;
    NEXT_PUBLIC_TV_SERVER_13_URL: string;
    NEXT_PUBLIC_TV_SERVER_14_URL: string;
    NEXT_PUBLIC_TV_SERVER_15_URL: string;
    NEXT_PUBLIC_TV_SERVER_16_URL: string;
    NEXT_PUBLIC_TV_SERVER_17_URL: string;
    NEXT_PUBLIC_TV_SERVER_18_URL: string;
    NEXT_PUBLIC_TV_SERVER_19_URL: string;
    NEXT_PUBLIC_TV_SERVER_20_URL: string;
    NEXT_PUBLIC_TV_SERVER_21_URL: string;
    NEXT_PUBLIC_TV_SERVER_22_URL: string;
    NEXT_PUBLIC_TV_SERVER_23_URL: string;
    NEXT_PUBLIC_TV_SERVER_24_URL: string;
    NEXT_PUBLIC_TV_SERVER_25_URL: string;
    NEXT_PUBLIC_TV_SERVER_26_URL: string;
    NEXT_PUBLIC_TV_SERVER_27_URL: string;

    // ======================
    // Movie Watch Servers
    // ======================
    NEXT_PUBLIC_MOVIE_SERVER_1_URL: string;
    NEXT_PUBLIC_MOVIE_SERVER_2_URL: string;
    NEXT_PUBLIC_MOVIE_SERVER_3_URL: string;
    NEXT_PUBLIC_MOVIE_SERVER_4_URL: string;
    NEXT_PUBLIC_MOVIE_SERVER_5_URL: string;
    NEXT_PUBLIC_MOVIE_SERVER_6_URL: string;
    NEXT_PUBLIC_MOVIE_SERVER_7_URL: string;
    NEXT_PUBLIC_MOVIE_SERVER_8_URL: string;
    NEXT_PUBLIC_MOVIE_SERVER_9_URL: string;
    NEXT_PUBLIC_MOVIE_SERVER_10_URL: string;
    NEXT_PUBLIC_MOVIE_SERVER_11_URL: string;
    NEXT_PUBLIC_MOVIE_SERVER_12_URL: string;
    NEXT_PUBLIC_MOVIE_SERVER_13_URL: string;
    NEXT_PUBLIC_MOVIE_SERVER_14_URL: string;
    NEXT_PUBLIC_MOVIE_SERVER_15_URL: string;
    NEXT_PUBLIC_MOVIE_SERVER_16_URL: string;
    NEXT_PUBLIC_MOVIE_SERVER_17_URL: string;
    NEXT_PUBLIC_MOVIE_SERVER_18_URL: string;
    NEXT_PUBLIC_MOVIE_SERVER_19_URL: string;
    NEXT_PUBLIC_MOVIE_SERVER_20_URL: string;
    NEXT_PUBLIC_MOVIE_SERVER_21_URL: string;
    NEXT_PUBLIC_MOVIE_SERVER_22_URL: string;
    NEXT_PUBLIC_MOVIE_SERVER_23_URL: string;
    NEXT_PUBLIC_MOVIE_SERVER_24_URL: string;
    NEXT_PUBLIC_MOVIE_SERVER_25_URL: string;
    NEXT_PUBLIC_MOVIE_SERVER_26_URL: string;
    NEXT_PUBLIC_MOVIE_SERVER_27_URL: string;

    // Other environment variables
    NODE_ENV: "development" | "production" | "test";
  }
}
