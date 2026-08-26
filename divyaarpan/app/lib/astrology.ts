export const ASTROLOGY_SERVICES = [
  { code: "KUNDLI", name: "Kundli Consultation", amount: 110100 },
  { code: "CAREER", name: "Career & Business Guidance", amount: 150100 },
  { code: "RELATIONSHIP", name: "Relationship Guidance", amount: 130100 },
  { code: "MUHURAT", name: "Muhurat Guidance", amount: 90100 },
] as const;

export type AstrologyServiceCode =
  (typeof ASTROLOGY_SERVICES)[number]["code"];

export function getAstrologyService(code: string) {
  return ASTROLOGY_SERVICES.find((service) => service.code === code) || null;
}
