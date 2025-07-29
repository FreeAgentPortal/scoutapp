// Leagues data for scout profile selection
export const LEAGUES_DATA = [
  // Professional American Leagues
  "National Football League (NFL)",
  "National Basketball Association (NBA)",
  "Major League Baseball (MLB)",
  "National Hockey League (NHL)",
  "Major League Soccer (MLS)",
  "Women's National Basketball Association (WNBA)",
  "National Women's Soccer League (NWSL)",
  
  // Minor League / Development
  "XFL",
  "USFL",
  "G League",
  "Triple-A Baseball",
  "Double-A Baseball",
  "Single-A Baseball",
  "American Hockey League (AHL)",
  "East Coast Hockey League (ECHL)",
  "USL Championship",
  "USL League One",
  "MLS Next Pro",
  
  // College Sports
  "NCAA Division I Football (FBS)",
  "NCAA Division I Football (FCS)",
  "NCAA Division I Basketball",
  "NCAA Division II",
  "NCAA Division III",
  "NAIA",
  "NJCAA Division I",
  "NJCAA Division II",
  "NJCAA Division III",
  
  // International Soccer
  "Premier League (England)",
  "La Liga (Spain)",
  "Serie A (Italy)",
  "Bundesliga (Germany)",
  "Ligue 1 (France)",
  "Liga MX (Mexico)",
  "Brazilian Serie A",
  "Argentine Primera División",
  "UEFA Champions League",
  "UEFA Europa League",
  "FIFA World Cup",
  "Copa America",
  "CONCACAF Gold Cup",
  
  // International Basketball
  "EuroLeague",
  "FIBA Basketball World Cup",
  "Olympic Basketball",
  
  // High School
  "High School Football",
  "High School Basketball",
  "High School Baseball",
  "High School Soccer",
  "High School Track & Field",
  "High School Wrestling",
  "High School Swimming",
  "High School Tennis",
  "High School Golf",
  "High School Cross Country",
  
  // Youth/Amateur
  "Little League Baseball",
  "Pop Warner Football",
  "AAU Basketball",
  "Club Soccer",
  "Junior Hockey",
  "USA Swimming",
  "USA Track & Field",
  "Amateur Athletic Union (AAU)",
  
  // Combat Sports
  "Ultimate Fighting Championship (UFC)",
  "Bellator MMA",
  "ONE Championship",
  "Professional Fighters League (PFL)",
  "World Boxing Association (WBA)",
  "World Boxing Council (WBC)",
  "International Boxing Federation (IBF)",
  "World Boxing Organization (WBO)",
  
  // Other Professional Sports
  "Professional Golfers Association (PGA)",
  "Ladies Professional Golf Association (LPGA)",
  "Association of Tennis Professionals (ATP)",
  "Women's Tennis Association (WTA)",
  "Formula 1",
  "NASCAR Cup Series",
  "IndyCar Series",
  "Professional Bull Riders (PBR)",
  
  // International Multi-Sport
  "Summer Olympics",
  "Winter Olympics",
  "Paralympic Games",
  "Commonwealth Games",
  "Pan American Games",
  "Asian Games",
  "European Championships",
  
  // Esports
  "League of Legends Championship Series (LCS)",
  "Overwatch League",
  "Call of Duty League",
  "Counter-Strike Major Championships",
  "Dota 2 Pro Circuit",
  "Valorant Champions Tour",
] as const;

export type League = typeof LEAGUES_DATA[number];
