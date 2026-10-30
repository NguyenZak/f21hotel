import * as migration_20261030_062534_initial from './20261030_062534_initial';

export const migrations = [
  {
    up: migration_20261030_062534_initial.up,
    down: migration_20261030_062534_initial.down,
    name: '20261030_062534_initial'
  },
];
