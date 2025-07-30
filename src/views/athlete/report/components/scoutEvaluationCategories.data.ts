export const scoutEvaluationCategories = [
  {
    category: "Mental & Intangible Attributes",
    attributes: ["Football IQ", "Competitiveness", "Coachability", "Leadership", "Discipline", "Focus"],
  },
  {
    category: "Athleticism",
    attributes: ["Speed", "Acceleration", "Agility", "Balance", "Explosiveness"],
  },
  {
    category: "Physical Tools",
    attributes: ["Size", "Strength", "Flexibility", "Mobility", "Frame"],
  },
  {
    category: "Technical Skills",
    attributes: [
      "Footwork",
      "Hands",
      "Ball Skills",
      "Tackling Technique",
      "Blocking Technique",
      "Coverage Ability",
      "Throwing Mechanics",
    ],
  },
  {
    category: "Potential & Projection",
    attributes: ["Ceiling", "Versatility", "Durability", "Injury Risk"],
  },
  {
    category: "Overall",
    attributes: ["Diamond Rating"],
  },
] as const;

export type EvaluationCategory = (typeof scoutEvaluationCategories)[number];
export type EvaluationAttribute = EvaluationCategory["attributes"][number];
