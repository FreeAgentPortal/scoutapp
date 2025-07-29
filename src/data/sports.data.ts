// Sports data for scout profile selection
export const SPORTS_DATA = [
  // American Sports
  "American Football",
  "Baseball",
  "Basketball",
  "Ice Hockey",
  "Soccer",
  
  // Olympic Sports
  "Track and Field",
  "Swimming",
  "Gymnastics",
  "Tennis",
  "Golf",
  "Volleyball",
  "Wrestling",
  "Boxing",
  "Weightlifting",
  "Cycling",
  "Rowing",
  "Sailing",
  "Shooting",
  "Archery",
  "Fencing",
  "Judo",
  "Taekwondo",
  "Badminton",
  "Table Tennis",
  "Handball",
  "Water Polo",
  "Field Hockey",
  "Rugby",
  "Softball",
  "Lacrosse",
  
  // Winter Sports
  "Alpine Skiing",
  "Cross Country Skiing",
  "Figure Skating",
  "Speed Skating",
  "Snowboarding",
  "Curling",
  "Biathlon",
  "Bobsled",
  "Luge",
  "Skeleton",
  
  // Combat Sports
  "Mixed Martial Arts",
  "Karate",
  "Brazilian Jiu-Jitsu",
  "Kickboxing",
  "Muay Thai",
  
  // Other Popular Sports
  "Cricket",
  "Australian Football",
  "Netball",
  "Squash",
  "Racquetball",
  "Bowling",
  "Darts",
  "Billiards",
  "Chess",
  "Esports",
] as const;

export type Sport = typeof SPORTS_DATA[number];
