import * as migration_20261030_062534_initial from './20261030_062534_initial';
import * as migration_20261030_070349_booking from './20261030_070349_booking';

export const migrations = [
  {
    up: migration_20261030_062534_initial.up,
    down: migration_20261030_062534_initial.down,
    name: '20261030_062534_initial',
  },
  {
    up: migration_20261030_070349_booking.up,
    down: migration_20261030_070349_booking.down,
    name: '20261030_070349_booking'
  },
];
