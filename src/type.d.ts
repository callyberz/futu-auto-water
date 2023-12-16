export interface Seed {
  seed_id: number;
  seed_level: number;
  comm_affect_type: number;
  comm_affect_value: number;
  expired_at: number;
  aged_at: number;
  hold_at: number;
  is_expired: boolean;
  mature_at: number;
  is_mature: number;
  exp_mature: number;
  exp_grab: number;
  exp_use: number;
  exp_expire: number;
  create_at: number;
  water_boost_time_total: number;
  fert_boost_time_total: number;
  fert_done_num: number;
  is_fert_limited: boolean;
  water_limit_num: number;
  water_done_num: number;
  frozen_to_timestamp: number;
  nick: string;
  currency: string;
}

export interface SeedResponse {
  data: {
    seed: Seed;
  };
}
