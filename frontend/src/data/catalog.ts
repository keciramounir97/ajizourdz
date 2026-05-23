import facilitiesData from "../mock/facilities.json";
import adminPanelData from "../mock/adminPanel.json";
import heroSlidesData from "../mock/heroSlides.json";
import providerStatsData from "../mock/providerStats.json";
import coastalWilayasData from "../mock/wilayas.json";
import { AdminOffer, AdminRequest, Facility, ProviderStats, Role } from "../types/domain";

export const facilities = facilitiesData as Facility[];
export const coastalWilayas = coastalWilayasData as string[];
export const heroSlides = heroSlidesData as { titleKey: string; image: string }[];
export const providerStats = providerStatsData as Record<Role, ProviderStats>;
export const adminRequests = adminPanelData.requests as AdminRequest[];
export const adminOffers = adminPanelData.offers as AdminOffer[];

export function getFacilityById(id?: string) {
  return facilities.find((facility) => facility.id === id);
}

export function getFacilitiesByCategory(category: Facility["category"]) {
  return facilities.filter((facility) => facility.category === category);
}
