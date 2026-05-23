import { Booking, Facility, SmartPlan } from "../types/domain";
import { facilities, getFacilityById } from "./catalog";

export function makePlanFromReservations(bookings: Booking[]): SmartPlan {
  const reservedFacilities = bookings
    .map((booking) => getFacilityById(booking.facilityId))
    .filter(Boolean) as Facility[];
  const base = reservedFacilities.length ? reservedFacilities : facilities.slice(0, 3);
  const wilaya = mostCommon(base.map((facility) => facility.wilaya)) ?? "Bejaia";
  const days = base.map((facility, index) => {
    const food =
      base.find((item) => item.category === "food") ??
      facilities.find((item) => item.category === "food");
    const activity =
      base.find((item) => item.category === "activity") ??
      facilities.find((item) => item.category === "activity");

    return `Day ${index + 1}: Start with ${facility.name} in ${facility.city}, add ${food?.name ?? "a local coastal table"}, then finish with ${activity?.name ?? "a sunset coastal walk"}.`;
  });

  return {
    title: `Smart plan from my reservations in ${wilaya}`,
    mood: "reserved trip",
    wilaya,
    budget: base.reduce((sum, facility) => sum + facility.price, 0),
    days,
  };
}

export function makeSuggestedPlan(): SmartPlan {
  const picks = [
    facilities.find((facility) => facility.category === "sleep" && facility.wilaya === "Bejaia"),
    facilities.find((facility) => facility.category === "food"),
    facilities.find((facility) => facility.category === "activity"),
  ].filter(Boolean) as Facility[];

  return {
    title: "Suggested cozy coastal escape",
    mood: "cozy discovery",
    wilaya: "Bejaia",
    budget: picks.reduce((sum, facility) => sum + facility.price, 0),
    days: [
      `Day 1: Check in at ${picks[0]?.name ?? "a coastal stay"}, walk by the marina, then enjoy a calm seafood dinner.`,
      `Day 2: Try ${picks[2]?.name ?? "a guided activity"}, take photos near the cliffs, and reserve ${picks[1]?.name ?? "a local restaurant"}.`,
      "Day 3: Slow breakfast, beach time, souvenir stop, then a relaxed return route along the coast.",
    ],
  };
}

export function makeCustomPlan(wilaya: string, mood: string, daysCount: number): SmartPlan {
  const localPicks = facilities.filter((facility) => facility.wilaya === wilaya);
  const picks = localPicks.length ? localPicks : facilities.slice(0, 4);
  const days = Array.from({ length: daysCount }).map((_, index) => {
    const primary = picks[index % picks.length];
    const food = facilities.find((item) => item.category === "food") ?? primary;
    return `Day ${index + 1}: ${primary.name} in ${primary.city}, then ${food.name} and a sunset walk on the coast.`;
  });

  return {
    title: `${daysCount}-day ${mood} plan in ${wilaya}`,
    mood,
    wilaya,
    budget: picks.reduce((sum, item) => sum + item.price, 0),
    days,
  };
}

export function makePlanFromSelection(facilityIds: string[]): SmartPlan {
  const selected = facilityIds
    .map((id) => getFacilityById(id))
    .filter(Boolean) as Facility[];
  const base = selected.length ? selected : facilities.slice(0, 3);
  const wilaya = mostCommon(base.map((facility) => facility.wilaya)) ?? "Bejaia";
  const sleep = base.find((facility) => facility.category === "sleep") ?? facilities.find((facility) => facility.category === "sleep");
  const food = base.find((facility) => facility.category === "food") ?? facilities.find((facility) => facility.category === "food");
  const activity = base.find((facility) => facility.category === "activity") ?? facilities.find((facility) => facility.category === "activity");

  return {
    title: `Smart AI plan from activity context in ${wilaya}`,
    mood: "activity context",
    wilaya,
    budget: base.reduce((sum, facility) => sum + facility.price, 0),
    days: [
      `Day 1: Start with ${sleep?.name ?? base[0].name}, then settle into ${wilaya} with a light coastal walk.`,
      `Day 2: Reserve ${food?.name ?? base[0].name} and add ${activity?.name ?? "a guided local activity"} for the strongest trip day.`,
      "Day 3: Keep the morning flexible, revisit saved offers, and finish with a sunset viewpoint.",
    ],
  };
}

function mostCommon(values: string[]) {
  return values
    .sort(
      (a, b) =>
        values.filter((value) => value === b).length -
        values.filter((value) => value === a).length,
    )[0];
}
