import type { BaseParameters } from "./BaseParameters";

export type MatchedIngredient = {
  id: string;
  ingredientText: string;
};

export type DetectedAllergy = {
  id: string;
  allergyId: string;
  allergyName: string;
  matchedIngredients: MatchedIngredient[];
};

export type ScanHistoryResponseDTO = {
  id: string;
  userId: string;
  name: string | null;
  scannedAt: string;
  detectedAllergies: DetectedAllergy[];
};

// Query parameters used when requesting scan history data.
export type ScanHistoryParameters = BaseParameters & {
      ContainsAllergies?: boolean;
};