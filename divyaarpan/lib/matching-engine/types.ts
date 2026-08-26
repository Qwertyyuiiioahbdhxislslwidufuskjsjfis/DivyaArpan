export interface MatchingRequest {
  bookingId: number;
  city: string;
  service: string;
  language: string;
  bookingDate: string;
  bookingTime: string;
}

export interface MatchingCandidate {
  panditId: number;
  panditCode: string;
  name: string;

  city: string;

  rating: number;

  totalBookings: number;

  isVerified: boolean;
  isOnline: boolean;
  isActive: boolean;

  languages: string[];

  services: string[];

  score: number;
}

export interface MatchingResult {
  bookingId: number;

  candidates: MatchingCandidate[];

  totalCandidates: number;

  executionTimeMs: number;
}