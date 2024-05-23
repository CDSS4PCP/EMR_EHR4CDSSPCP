type CdssRecommendation = {
  recommendation: string;
  priority: number;
};

type CdssUsage = {
  ruleId: string;
  patientId: string;
  vaccine: string;
  timestamp: Date;
  recommendations: CdssRecommendation[];
  status: string;
};

export { CdssRecommendation, CdssUsage };
