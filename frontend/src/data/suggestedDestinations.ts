// Curated destination candidates for the mocked "Not sure where to go?" flow.
// This is a frontend prototype: suggestions are ranked by a deterministic
// scoring function (no real AI call). Accessibility is intentionally NOT part
// of ranking here — these are all broadly accessible cities, and per-attraction
// accessibility is handled later when building the itinerary.

export interface SuggestedDestination {
  id: string;
  /** Display name used to fill the destination field, e.g. "Singapore". */
  name: string;
  country: string;
  /** Ideal trip length window, in whole days. */
  idealDaysMin: number;
  idealDaysMax: number;
  /** Comfortable upper bound for group size this destination suits well. */
  goodForGroupSizeMax: number;
  /** Rough per-person, per-day spend (same currency as the Step 1 budget field, RM). */
  approxDailyBudgetPerPerson: number;
  /** Short note on why the city works for mixed-ability groups. */
  accessibilityNote: string;
  blurb: string;
  /** Template used to pre-fill the trip name when this destination is picked. */
  suggestedTripNameTemplate: string;
}

export const SUGGESTED_DESTINATIONS: SuggestedDestination[] = [
  {
    id: 'singapore',
    name: 'Singapore',
    country: 'Singapore',
    idealDaysMin: 3,
    idealDaysMax: 5,
    goodForGroupSizeMax: 8,
    approxDailyBudgetPerPerson: 260,
    accessibilityNote: 'Step-free MRT and wide, level walkways citywide',
    blurb: 'Compact, easy to get around, and packed with food and gardens.',
    suggestedTripNameTemplate: 'Singapore City Escape',
  },
  {
    id: 'kuala-lumpur',
    name: 'Kuala Lumpur',
    country: 'Malaysia',
    idealDaysMin: 2,
    idealDaysMax: 4,
    goodForGroupSizeMax: 10,
    approxDailyBudgetPerPerson: 150,
    accessibilityNote: 'Covered walkways and lifts across major malls and transit',
    blurb: 'Great value city break with landmarks, markets, and easy transit.',
    suggestedTripNameTemplate: 'Kuala Lumpur Getaway',
  },
  {
    id: 'penang',
    name: 'Penang',
    country: 'Malaysia',
    idealDaysMin: 2,
    idealDaysMax: 4,
    goodForGroupSizeMax: 6,
    approxDailyBudgetPerPerson: 130,
    accessibilityNote: 'Flat George Town core with step-free hawker seating routes',
    blurb: 'A relaxed food-and-heritage weekend with short travel distances.',
    suggestedTripNameTemplate: 'Penang Food Weekend',
  },
  {
    id: 'bangkok',
    name: 'Bangkok',
    country: 'Thailand',
    idealDaysMin: 3,
    idealDaysMax: 6,
    goodForGroupSizeMax: 10,
    approxDailyBudgetPerPerson: 170,
    accessibilityNote: 'BTS Skytrain lifts and level malls near major stops',
    blurb: 'Vibrant markets, temples, and dining with plenty for larger groups.',
    suggestedTripNameTemplate: 'Bangkok City Adventure',
  },
  {
    id: 'tokyo',
    name: 'Tokyo',
    country: 'Japan',
    idealDaysMin: 5,
    idealDaysMax: 8,
    goodForGroupSizeMax: 6,
    approxDailyBudgetPerPerson: 320,
    accessibilityNote: 'Elevator-equipped metro hubs and step-free transfers',
    blurb: 'A longer trip rewarded with neighborhoods, culture, and food.',
    suggestedTripNameTemplate: 'Tokyo Spring Escape',
  },
  {
    id: 'bali',
    name: 'Bali',
    country: 'Indonesia',
    idealDaysMin: 4,
    idealDaysMax: 7,
    goodForGroupSizeMax: 8,
    approxDailyBudgetPerPerson: 200,
    accessibilityNote: 'Resort areas with level access and accessible transfers',
    blurb: 'Slow-paced beaches and villas that suit longer, restful trips.',
    suggestedTripNameTemplate: 'Bali Retreat',
  },
  {
    id: 'hong-kong',
    name: 'Hong Kong',
    country: 'Hong Kong',
    idealDaysMin: 3,
    idealDaysMax: 5,
    goodForGroupSizeMax: 8,
    approxDailyBudgetPerPerson: 280,
    accessibilityNote: 'MTR lifts and elevated walkway network across the city',
    blurb: 'Dense, walkable, and well-connected with harbourside highlights.',
    suggestedTripNameTemplate: 'Hong Kong City Break',
  },
  {
    id: 'taipei',
    name: 'Taipei',
    country: 'Taiwan',
    idealDaysMin: 3,
    idealDaysMax: 5,
    goodForGroupSizeMax: 8,
    approxDailyBudgetPerPerson: 190,
    accessibilityNote: 'Accessible MRT with lifts at every station',
    blurb: 'Friendly food city with easy transit and gentle day trips.',
    suggestedTripNameTemplate: 'Taipei Discovery',
  },
];

export interface RankInput {
  /** Whole days of the trip (from Step 1 dates). */
  days: number;
  /** Number of travelers (from Step 1). */
  participants: number;
  /** Total trip budget in RM (from Step 1). */
  budget: number;
}

export interface RankedDestination extends SuggestedDestination {
  /** 0–100 overall fit score, higher is better. */
  score: number;
  /** One-line, human-readable reason this destination ranked where it did. */
  rationale: string;
}

/** Clamp a value into the [0, 1] range. */
const clamp01 = (value: number): number => Math.max(0, Math.min(1, value));

/**
 * Score how well a day count fits a destination's ideal window.
 * Perfect (1.0) when inside the window; decays as it drifts outside.
 */
const scoreDays = (days: number, min: number, max: number): number => {
  if (days >= min && days <= max) return 1;
  const distance = days < min ? min - days : days - max;
  return clamp01(1 - distance / 4);
};

/** Score group-size fit. Full marks at/under the comfortable max, decaying after. */
const scoreGroup = (participants: number, groupMax: number): number => {
  if (participants <= groupMax) return 1;
  return clamp01(1 - (participants - groupMax) / 6);
};

/**
 * Score budget fit by comparing the user's per-person-per-day budget against the
 * destination's rough daily cost. Being at or above the cost scores full marks;
 * being under scores proportionally lower.
 */
const scoreBudget = (
  budget: number,
  days: number,
  participants: number,
  dailyCost: number
): number => {
  const safeDays = Math.max(1, days);
  const safeParticipants = Math.max(1, participants);
  const perPersonPerDay = budget / safeDays / safeParticipants;
  if (perPersonPerDay >= dailyCost) return 1;
  return clamp01(perPersonPerDay / dailyCost);
};

const buildRationale = (
  destination: SuggestedDestination,
  input: RankInput,
  parts: { days: number; group: number; budget: number }
): string => {
  const reasons: string[] = [];

  if (parts.days >= 0.99) {
    reasons.push(`ideal for a ${input.days}-day trip`);
  } else if (input.days < destination.idealDaysMin) {
    reasons.push(`doable in ${input.days} days, though it shines with a bit longer`);
  } else {
    reasons.push(`works for ${input.days} days at a relaxed pace`);
  }

  if (parts.group >= 0.99) {
    reasons.push(`comfortable for a group of ${input.participants}`);
  } else {
    reasons.push(`manageable for ${input.participants} with some planning`);
  }

  if (parts.budget >= 0.99) {
    reasons.push('and fits your budget comfortably');
  } else if (parts.budget >= 0.6) {
    reasons.push('and is reachable within your budget');
  } else {
    reasons.push('though it may stretch your budget');
  }

  // Capitalize the first letter for a clean sentence.
  const sentence = reasons.join(', ');
  return sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.';
};

/**
 * Deterministically rank curated destinations by day-range, group-size, and
 * budget fit. Pure function: same input always yields the same ordered output.
 * Always returns the full list (best-first) so callers can take the top N.
 */
export const rankDestinations = (input: RankInput): RankedDestination[] => {
  const days = Number.isFinite(input.days) && input.days > 0 ? Math.round(input.days) : 3;
  const participants =
    Number.isFinite(input.participants) && input.participants > 0
      ? Math.round(input.participants)
      : 1;
  const budget = Number.isFinite(input.budget) && input.budget > 0 ? input.budget : 0;

  const normalized: RankInput = { days, participants, budget };

  return SUGGESTED_DESTINATIONS.map((destination) => {
    const parts = {
      days: scoreDays(days, destination.idealDaysMin, destination.idealDaysMax),
      group: scoreGroup(participants, destination.goodForGroupSizeMax),
      // If no budget was entered, don't penalize on budget (treat as neutral full marks).
      budget:
        budget > 0
          ? scoreBudget(budget, days, participants, destination.approxDailyBudgetPerPerson)
          : 1,
    };

    // Weighted blend: day fit matters most, then group, then budget.
    const score = Math.round((parts.days * 0.45 + parts.group * 0.3 + parts.budget * 0.25) * 100);

    return {
      ...destination,
      score,
      rationale: buildRationale(destination, normalized, parts),
    };
  }).sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    // Stable tiebreaker for deterministic ordering.
    return a.id.localeCompare(b.id);
  });
};
