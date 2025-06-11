export const arabicCountries = [
  { code: "AE", name: "United Arab Emirates" },
  { code: "SA", name: "Saudi Arabia" },
  { code: "QA", name: "Qatar" },
  { code: "KW", name: "Kuwait" },
  { code: "OM", name: "Oman" },
  { code: "BH", name: "Bahrain" },
  { code: "IQ", name: "Iraq" },
  { code: "JO", name: "Jordan" },
  { code: "LB", name: "Lebanon" },
  { code: "SY", name: "Syria" },
  { code: "YE", name: "Yemen" },
  { code: "PS", name: "Palestine" },
  { code: "EG", name: "Egypt" },
  { code: "SD", name: "Sudan" },
  { code: "DZ", name: "Algeria" },
  { code: "MA", name: "Morocco" },
  { code: "TN", name: "Tunisia" },
  { code: "LY", name: "Libya" },
  { code: "MR", name: "Mauritania" },
  { code: "DJ", name: "Djibouti" },
  { code: "SO", name: "Somalia" },
  { code: "KM", name: "Comoros" },
];

const CACHE_KEY = "isArabicCountryCache";
const TEN_DAYS_MS = 1000 * 60 * 60 * 24 * 10; // 10 days in milliseconds

export const isUserInArabicCountry = async (): Promise<boolean> => {
  if (typeof window === "undefined") return false; // Don't run on the server

  try {
    // 1. Try reading the cache
    const cached = localStorage.getItem(CACHE_KEY);

    if (cached) {
      const { isArabic, timestamp } = JSON.parse(cached);
      const age = Date.now() - timestamp;

      // 2. Use cached value if it's still valid
      if (age < TEN_DAYS_MS) {
        return isArabic;
      }
    }

    // 3. If no valid cache, fetch the user's country from IP
    const res = await fetch("https://ipapi.co/json/");
    const data = await res.json();
    const countryCode = data?.country?.toUpperCase();

    const isArabic = arabicCountries.some(
      (country) => country.code === countryCode,
    );

    // 4. Cache the result
    const cacheData = {
      isArabic,
      timestamp: Date.now(),
    };

    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));

    return isArabic;
  } catch (err) {
    console.error("Failed to fetch country:", err);
    return false;
  }
};
