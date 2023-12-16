export const mockedWaterSuccessResponse = {
  code: 0,
  message: '',
  data: {
    result: 0,
    user_id: 696969,
    boost_time: 69,
    credit_value: 1,
    current_timestamp: 1702504202
  }
};

export const mockedWaterFailResponse = {
  name: 'OK',
  message: 'Server error',
  code: -46003,
  status: 200
};

export const mockedSeedResponse = {
  code: 0,
  message: '',
  data: {
    result: 0,
    user_id: 696969,
    seed: {
      seed_id: 696969696969,
      seed_level: 11,
      comm_affect_type: 1,
      comm_affect_value: 0,
      expired_at: 1703389196,
      aged_at: 1703130500,
      hold_at: 1702384436,
      is_expired: false,
      mature_at: 1702526876,
      is_mature: 0,
      exp_mature: 2,
      exp_grab: 4,
      exp_use: 2,
      exp_expire: 4,
      create_at: 1702384436,
      water_boost_time_total: 278,
      fert_boost_time_total: 24,
      fert_done_num: 1,
      is_fert_limited: false,
      water_limit_num: 3,
      water_done_num: 2,
      frozen_to_timestamp: 3747,
      nick: '',
      currency: ''
    },
    medal: {
      level_flag: 1,
      level: 11,
      level_up_exps: 79,
      level_exps: 2
    },
    accounts: [],
    storage_room_mark: false,
    seed_package: {
      key: 'some_key',
      seconds_left: 0,
      seeds_left: 0
    },
    money_in_status: 1,
    package_popup: false,
    has_reward_entrance: 0,
    nation: 2,
    current_timestamp: 1702425217
  }
};
