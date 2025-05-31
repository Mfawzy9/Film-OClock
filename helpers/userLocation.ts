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

export const isArabicCountry = async (
  countryCode: string,
): Promise<boolean> => {
  return arabicCountries.some((country) => country.code === countryCode);
};

export const fetchUserCountry = async (): Promise<boolean> => {
  try {
    const res = await fetch("https://ipapi.co/json/");
    const data = await res.json();
    const countryCode = data?.country;
    return isArabicCountry(countryCode);
  } catch (err) {
    console.error("Failed to fetch location:", err);
    return false;
  }
};
