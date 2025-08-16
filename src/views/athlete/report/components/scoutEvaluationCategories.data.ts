export const scoutEvaluationCategories = [
  {
    category: "Mental & Intangible Attributes",
    attributes: [
      "Instincts",
      "Vision",
      "Creativity", 
      "Motor", 
      "Effort", 
      "Toughness",
      "Accuracy",
      "Elusiveness",
      "Route Running",
      "Production",
      "Motor",
      "Ability to Break Tackles"
    ],
  },
  {
    category: "Athleticism",
    attributes: [
      "Running Ability", 
      "Ability to Break Tackles", 
      "Elusiveness", 
      "Recovery Speed", 
      "Fluidity"],
  },
  {
    category: "Physical Tools",
    attributes: ["Leverage Use"],
  },
  {
    category: "Technical Skills",
    attributes: [
      "Ball Security",
      "Pocket Awareness",
      "Accuracy",
      "Route Running",
      "Contested Catch Ability",
      "Production",
      "Run Blocking",
      "Pass Blocking",
      "Sustainable Blocks",
      "Blocking: Finish",
      "Blocking: Effort",
      "Blocking: Toughness",
      "Blocking: Leverage Use",
      "Coverage: Recovery Speed",
      "Coverage: Fluidity",
      "Press Coverage",
      "Man Coverage",
      "Zone Coverage",
      "Defensive Run Support",
      "Shed Ability",
    ],
  },
  {
    category: "Potential & Projection",
    attributes: [],
  },
  {
    category: "Overall",
    attributes: [],
  },
] as const;

export type EvaluationCategory = (typeof scoutEvaluationCategories)[number];
export type EvaluationAttribute = EvaluationCategory["attributes"][number];
