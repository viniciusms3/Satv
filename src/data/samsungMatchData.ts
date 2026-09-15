// Match & live broadcast data from BigCo Samsung TV Plus
export interface PlayerStats {
  goals: number;
  assists: number;
  passAccuracy: string;
  keyPasses: number;
  shots: number;
  shotsOnTarget: number;
  tackles: number;
  interceptions: number;
  dribbles: number;
  minutesPlayed: number;
}

export interface HeatmapZone {
  x: number;
  y: number;
  intensity: number;
}

export interface Player {
  id: number;
  name: string;
  number: number;
  position: string;
  x: number; // 0-100
  y: number; // 0-100
  hasYellowCard?: boolean;
  hasSubbed?: boolean;
  stats: PlayerStats;
  rating: number;
  heatmapZones: HeatmapZone[];
}

export interface Team {
  name: string;
  shortName: string;
  color: string;
  formation: string;
  players: Player[];
}

export interface MatchEvent {
  type: "goal" | "penalty" | "yellow" | "red" | "substitution" | "injury_sub" | "var";
  minute: number;
  player: string;
  team: "home" | "away";
  assistedBy?: string;
  playerOut?: string;
  detail?: string;
  scoreAfter?: string;
}

export interface StatItem {
  label: string;
  home: number | string;
  away: number | string;
  homePercent: number;
  awayPercent: number;
}

export const matchInfo = {
  competition: "Premier League · Matchweek 32",
  venue: "Stamford Bridge, London",
  minute: 68,
  isLive: true,
  homeScore: 2,
  awayScore: 1,
  homeTeam: {
    name: "Chelsea FC",
    shortName: "CHE",
    color: "#034694",
  },
  awayTeam: {
    name: "Manchester City",
    shortName: "MCI",
    color: "#6CABDD",
  },
};

export const matchStats: StatItem[] = [
  { label: "Possession", home: "48%", away: "52%", homePercent: 48, awayPercent: 52 },
  { label: "xG", home: 1.84, away: 1.21, homePercent: 60, awayPercent: 40 },
  { label: "Shots", home: 12, away: 9, homePercent: 57, awayPercent: 43 },
  { label: "Shots on Target", home: 5, away: 3, homePercent: 62, awayPercent: 38 },
  { label: "Corners", home: 6, away: 4, homePercent: 60, awayPercent: 40 },
  { label: "Pass Accuracy", home: "86%", away: "91%", homePercent: 49, awayPercent: 51 },
  { label: "Fouls", home: 11, away: 8, homePercent: 58, awayPercent: 42 },
];

export const matchEvents: MatchEvent[] = [
  {
    type: "goal",
    minute: 23,
    player: "Cole Palmer",
    team: "home",
    assistedBy: "Enzo Fernández",
    detail: "Left foot curler into bottom corner",
    scoreAfter: "1 - 0",
  },
  {
    type: "yellow",
    minute: 34,
    player: "Rodri",
    team: "away",
    detail: "Tactical foul breaking counter-attack",
  },
  {
    type: "goal",
    minute: 41,
    player: "Erling Haaland",
    team: "away",
    assistedBy: "Kevin De Bruyne",
    detail: "Header from close range",
    scoreAfter: "1 - 1",
  },
  {
    type: "penalty",
    minute: 59,
    player: "Cole Palmer",
    team: "home",
    detail: "Panenka penalty to right side",
    scoreAfter: "2 - 1",
  },
  {
    type: "substitution",
    minute: 63,
    player: "Jeremy Doku",
    playerOut: "Jack Grealish",
    team: "away",
    detail: "Tactical change",
  },
];

export const chelseaPlayers: Player[] = [
  {
    id: 1,
    name: "Robert Sánchez",
    number: 1,
    position: "GK",
    x: 8,
    y: 50,
    rating: 7.2,
    stats: {
      goals: 0,
      assists: 0,
      passAccuracy: "74%",
      keyPasses: 0,
      shots: 0,
      shotsOnTarget: 0,
      tackles: 0,
      interceptions: 2,
      dribbles: 0,
      minutesPlayed: 68,
    },
    heatmapZones: [{ x: 8, y: 50, intensity: 0.9 }],
  },
  {
    id: 2,
    name: "Malo Gusto",
    number: 27,
    position: "RB",
    x: 24,
    y: 18,
    rating: 7.4,
    stats: {
      goals: 0,
      assists: 0,
      passAccuracy: "88%",
      keyPasses: 2,
      shots: 0,
      shotsOnTarget: 0,
      tackles: 4,
      interceptions: 1,
      dribbles: 2,
      minutesPlayed: 68,
    },
    heatmapZones: [{ x: 30, y: 22, intensity: 0.8 }],
  },
  {
    id: 3,
    name: "Levi Colwill",
    number: 6,
    position: "CB",
    x: 20,
    y: 40,
    rating: 7.0,
    stats: {
      goals: 0,
      assists: 0,
      passAccuracy: "91%",
      keyPasses: 0,
      shots: 0,
      shotsOnTarget: 0,
      tackles: 3,
      interceptions: 2,
      dribbles: 0,
      minutesPlayed: 68,
    },
    heatmapZones: [{ x: 22, y: 40, intensity: 0.7 }],
  },
  {
    id: 4,
    name: "Wesley Fofana",
    number: 29,
    position: "CB",
    x: 20,
    y: 60,
    rating: 6.9,
    stats: {
      goals: 0,
      assists: 0,
      passAccuracy: "89%",
      keyPasses: 0,
      shots: 1,
      shotsOnTarget: 0,
      tackles: 2,
      interceptions: 3,
      dribbles: 0,
      minutesPlayed: 68,
    },
    heatmapZones: [{ x: 22, y: 60, intensity: 0.7 }],
  },
  {
    id: 5,
    name: "Marc Cucurella",
    number: 3,
    position: "LB",
    x: 24,
    y: 82,
    rating: 7.3,
    stats: {
      goals: 0,
      assists: 0,
      passAccuracy: "85%",
      keyPasses: 1,
      shots: 0,
      shotsOnTarget: 0,
      tackles: 5,
      interceptions: 2,
      dribbles: 1,
      minutesPlayed: 68,
    },
    heatmapZones: [{ x: 28, y: 80, intensity: 0.8 }],
  },
  {
    id: 6,
    name: "Moisés Caicedo",
    number: 25,
    position: "CM",
    x: 38,
    y: 38,
    rating: 7.6,
    stats: {
      goals: 0,
      assists: 0,
      passAccuracy: "92%",
      keyPasses: 2,
      shots: 1,
      shotsOnTarget: 0,
      tackles: 6,
      interceptions: 4,
      dribbles: 2,
      minutesPlayed: 68,
    },
    heatmapZones: [{ x: 42, y: 45, intensity: 0.9 }],
  },
  {
    id: 7,
    name: "Enzo Fernández",
    number: 8,
    position: "CM",
    x: 38,
    y: 62,
    rating: 8.1,
    stats: {
      goals: 0,
      assists: 1,
      passAccuracy: "94%",
      keyPasses: 4,
      shots: 2,
      shotsOnTarget: 1,
      tackles: 3,
      interceptions: 2,
      dribbles: 3,
      minutesPlayed: 68,
    },
    heatmapZones: [{ x: 48, y: 60, intensity: 0.95 }],
  },
  {
    id: 8,
    name: "Cole Palmer",
    number: 20,
    position: "AM",
    x: 55,
    y: 50,
    rating: 8.9,
    stats: {
      goals: 2,
      assists: 0,
      passAccuracy: "87%",
      keyPasses: 5,
      shots: 4,
      shotsOnTarget: 3,
      tackles: 2,
      interceptions: 1,
      dribbles: 4,
      minutesPlayed: 68,
    },
    heatmapZones: [{ x: 58, y: 50, intensity: 1.0 }],
  },
  {
    id: 9,
    name: "Noni Madueke",
    number: 11,
    position: "RW",
    x: 68,
    y: 20,
    rating: 7.1,
    stats: {
      goals: 0,
      assists: 0,
      passAccuracy: "81%",
      keyPasses: 2,
      shots: 2,
      shotsOnTarget: 1,
      tackles: 1,
      interceptions: 0,
      dribbles: 5,
      minutesPlayed: 68,
    },
    heatmapZones: [{ x: 70, y: 25, intensity: 0.85 }],
  },
  {
    id: 10,
    name: "Nicolas Jackson",
    number: 15,
    position: "ST",
    x: 76,
    y: 50,
    rating: 7.0,
    stats: {
      goals: 0,
      assists: 0,
      passAccuracy: "79%",
      keyPasses: 1,
      shots: 3,
      shotsOnTarget: 1,
      tackles: 1,
      interceptions: 0,
      dribbles: 2,
      minutesPlayed: 68,
    },
    heatmapZones: [{ x: 75, y: 50, intensity: 0.85 }],
  },
  {
    id: 11,
    name: "Pedro Neto",
    number: 7,
    position: "LW",
    x: 68,
    y: 80,
    rating: 7.4,
    stats: {
      goals: 0,
      assists: 0,
      passAccuracy: "83%",
      keyPasses: 3,
      shots: 1,
      shotsOnTarget: 0,
      tackles: 2,
      interceptions: 1,
      dribbles: 4,
      minutesPlayed: 68,
    },
    heatmapZones: [{ x: 72, y: 78, intensity: 0.85 }],
  },
];

export const manCityPlayers: Player[] = [
  {
    id: 12,
    name: "Ederson",
    number: 31,
    position: "GK",
    x: 92,
    y: 50,
    rating: 6.8,
    stats: {
      goals: 0,
      assists: 0,
      passAccuracy: "88%",
      keyPasses: 0,
      shots: 0,
      shotsOnTarget: 0,
      tackles: 0,
      interceptions: 1,
      dribbles: 0,
      minutesPlayed: 68,
    },
    heatmapZones: [{ x: 92, y: 50, intensity: 0.9 }],
  },
  {
    id: 13,
    name: "Erling Haaland",
    number: 9,
    position: "ST",
    x: 25,
    y: 50,
    rating: 7.8,
    stats: {
      goals: 1,
      assists: 0,
      passAccuracy: "71%",
      keyPasses: 1,
      shots: 4,
      shotsOnTarget: 2,
      tackles: 0,
      interceptions: 0,
      dribbles: 1,
      minutesPlayed: 68,
    },
    heatmapZones: [{ x: 26, y: 50, intensity: 0.9 }],
  },
  {
    id: 14,
    name: "Kevin De Bruyne",
    number: 17,
    position: "AM",
    x: 45,
    y: 50,
    rating: 8.2,
    stats: {
      goals: 0,
      assists: 1,
      passAccuracy: "89%",
      keyPasses: 5,
      shots: 2,
      shotsOnTarget: 1,
      tackles: 1,
      interceptions: 1,
      dribbles: 3,
      minutesPlayed: 68,
    },
    heatmapZones: [{ x: 45, y: 52, intensity: 0.95 }],
  },
  {
    id: 15,
    name: "Rodri",
    number: 16,
    position: "DM",
    x: 60,
    y: 50,
    hasYellowCard: true,
    rating: 7.3,
    stats: {
      goals: 0,
      assists: 0,
      passAccuracy: "95%",
      keyPasses: 2,
      shots: 1,
      shotsOnTarget: 0,
      tackles: 4,
      interceptions: 3,
      dribbles: 1,
      minutesPlayed: 68,
    },
    heatmapZones: [{ x: 58, y: 50, intensity: 0.9 }],
  },
];

export const chelsea: Team = {
  name: "Chelsea FC",
  shortName: "CHE",
  color: "#034694",
  formation: "4-2-3-1",
  players: chelseaPlayers,
};

export const manchesterCity: Team = {
  name: "Manchester City",
  shortName: "MCI",
  color: "#6CABDD",
  formation: "4-3-3",
  players: manCityPlayers,
};

export function getPlayerById(id: number): Player | undefined {
  return [...chelseaPlayers, ...manCityPlayers].find((p) => p.id === id);
}

export function getTeamByPlayerId(id: number): Team | undefined {
  if (chelseaPlayers.some((p) => p.id === id)) return chelsea;
  if (manCityPlayers.some((p) => p.id === id)) return manchesterCity;
  return undefined;
}
