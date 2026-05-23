import { config, configured } from "./config.js";
export async function generateSmartPlan(input) {
    const prompt = [
        "Create a compact tourism itinerary for Algerian coastal wilayas.",
        `Wilaya: ${input.wilaya ?? "suggest best"}.`,
        `Persons: ${input.persons ?? 2}. Budget: ${input.budget ?? "flexible"} ${input.currency ?? "DZD"}.`,
        `Selected offers: ${(input.selectedFacilities ?? []).map((item) => item.name).join(", ") || "none"}.`,
        `Bookings: ${(input.bookings ?? []).map((item) => item.facilityId).join(", ") || "none"}.`,
        "Return JSON with title, mood, wilaya, budget, days array.",
    ].join("\n");
    const aiPlan = await callOpenAiCompatible(prompt);
    if (aiPlan)
        return aiPlan;
    return heuristicPlan(input);
}
async function callOpenAiCompatible(prompt) {
    const provider = configured(config.ai.nvidiaKey)
        ? {
            key: config.ai.nvidiaKey,
            baseUrl: config.ai.nvidiaBaseUrl,
            model: config.ai.nvidiaModel,
        }
        : configured(config.ai.fallbackKey) && configured(config.ai.fallbackBaseUrl)
            ? {
                key: config.ai.fallbackKey,
                baseUrl: config.ai.fallbackBaseUrl,
                model: config.ai.fallbackModel,
            }
            : null;
    if (!provider)
        return null;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 9000);
    try {
        const response = await fetch(`${provider.baseUrl.replace(/\/$/, "")}/chat/completions`, {
            method: "POST",
            signal: controller.signal,
            headers: {
                "content-type": "application/json",
                authorization: `Bearer ${provider.key}`,
            },
            body: JSON.stringify({
                model: provider.model,
                messages: [
                    { role: "system", content: "You are Ajizour, a practical Algerian coastal trip planner. Return valid JSON only." },
                    { role: "user", content: prompt },
                ],
                temperature: 0.4,
            }),
        });
        if (!response.ok)
            return null;
        const data = (await response.json());
        const content = data.choices?.[0]?.message?.content;
        if (!content)
            return null;
        return JSON.parse(content);
    }
    catch {
        return null;
    }
    finally {
        clearTimeout(timer);
    }
}
function heuristicPlan(input) {
    const local = input.facilities.filter((facility) => !input.wilaya || facility.wilaya === input.wilaya);
    const base = [
        ...(input.selectedFacilities ?? []),
        ...local,
        ...input.facilities,
    ].filter((facility, index, all) => all.findIndex((item) => item.id === facility.id) === index);
    const picks = base.slice(0, Math.max(3, Math.min(5, base.length)));
    const wilaya = input.wilaya ?? picks[0]?.wilaya ?? "Bejaia";
    const budget = input.budget ?? picks.reduce((sum, item) => sum + item.price, 0);
    const persons = input.persons ?? 2;
    return {
        title: `Smart coastal plan for ${wilaya}`,
        mood: input.source === "bookings" ? "from bookings" : "AI-ready suggestion",
        wilaya,
        budget,
        days: [
            `Day 1: Check in or start with ${picks[0]?.name ?? "a coastal stay"}, then choose a nearby restaurant for ${persons} travelers.`,
            `Day 2: Book ${picks.find((item) => item.category === "activity")?.name ?? "a guided beach activity"} and keep the total near ${budget} ${input.currency ?? "DZD"}.`,
            `Day 3: Slow breakfast, final seaside walk, and flexible return plan with saved Ajizour offers.`,
        ],
    };
}
