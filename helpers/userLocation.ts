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

const CACHE_KEY = "isArabicCountry";
const CACHE_TIME_KEY = "isArabicCountryTimestamp";
const TEN_DAYS_MS = 1000 * 60 * 60 * 24 * 10; // 10 days

export const isUserInArabicCountry = async (): Promise<boolean> => {
  if (typeof window === "undefined") return false;

  try {
    // Check localStorage
    const cached = localStorage.getItem(CACHE_KEY);
    const cachedTime = localStorage.getItem(CACHE_TIME_KEY);

    if (cached && cachedTime) {
      const age = Date.now() - Number(cachedTime);
      if (age < TEN_DAYS_MS) return cached === "true";
    }

    // Fetch country from IP
    const res = await fetch("https://ipapi.co/json/");
    const data = await res.json();
    const countryCode = data?.country?.toUpperCase();

    const isArabic = arabicCountries.some(
      (country) => country.code === countryCode,
    );

    // Save to localStorage
    localStorage.setItem(CACHE_KEY, String(isArabic));
    localStorage.setItem(CACHE_TIME_KEY, String(Date.now()));

    return isArabic;
  } catch (err) {
    console.error("Failed to fetch country:", err);
    return false;
  }
};
