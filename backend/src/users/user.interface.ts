export interface HcpRecord {
  date: string;
  hcp: number;
}

export interface UserProfile {
  name: string;
  hcpHistory: HcpRecord[];
  favoriteCourseIds: string[];
  trainingObjective: string;
}
