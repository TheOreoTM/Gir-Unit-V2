import { BasePetStat, PetMoveTypes, PetStatTypes } from '#lib/types';

export const moves = {
  taser: {
    id: '1',
    name: 'Taser',
    damage: 60,
    type: [PetMoveTypes.Damage, PetMoveTypes.Stun],
    stun: {
      chance: 0.2,
      duration: {
        min: 1,
        max: 2,
      },
    },
  },
  missileLauncher: {
    id: '2',
    name: 'Missile Launcher',
    damage: 80,
    type: [PetMoveTypes.Damage],
  },
  catapultLauncher: {
    id: '3',
    name: 'Catapult Launcher',
    damage: 70,
    type: [PetMoveTypes.Damage],
  },
  railRifle: {
    id: '4',
    name: 'Rail Rifle',
    damage: 150,
    type: [PetMoveTypes.Damage],
    recoil: {
      amount: 1 / 3,
    },
    cooldown: {
      after: 1,
      duration: 1,
    },
  },
  freezeRay: {
    id: '5',
    name: 'Freeze-ray',
    damage: 60,
    type: [PetMoveTypes.Damage, PetMoveTypes.Stun],
    stun: {
      chance: 0.3,
      duration: {
        min: 1,
        max: 2,
      },
    },
  },
  plasmaLauncher: {
    id: '6',
    name: 'Plasma Launcher',
    damage: 110,
    type: [PetMoveTypes.Damage],
    cooldown: {
      after: 2,
      duration: 1,
    },
    alwaysHits: true,
  },
  laserRifle: {
    id: '7',
    name: 'Laser Rifle',
    damage: 90,
    type: [PetMoveTypes.Damage],
  },
  gravitationalPulse: {
    id: '8',
    name: 'Gravitational Pulse',
    damage: 40,
    type: [PetMoveTypes.Damage, PetMoveTypes.Posion],
    poison: {
      chance: 0.2,
      duration: {
        min: 1,
        max: 2,
      },
    },
  },
  shockWave: {
    id: '9',
    name: 'Shock Wave',
    damage: 50,
    type: [PetMoveTypes.Damage],
    alwaysHits: true,
  },
  psychoOrb: {
    id: '10',
    name: 'Psycho-Orb',
    damage: 0,
    type: [PetMoveTypes.Buff],
    buff: [
      {
        stat: PetStatTypes.Attack,
        amount: 0.2,
      },
      {
        stat: PetStatTypes.Speed,
        amount: 0.2,
      },
    ],
  },
  telekinesis: {
    id: '11',
    name: 'Telekinesis',
    damage: 40,
    type: [PetMoveTypes.Damage, PetMoveTypes.Confuse],
    confuse: {
      chance: 1,
      amount: 0.2,
      duration: {
        min: 1,
        max: 1,
      },
    },
  },
  timeBlast: {
    id: '12',
    name: 'Time Blast',
    damage: 60,
    type: [PetMoveTypes.Damage],
  },
  pound: {
    id: '13',
    name: 'Pound',
    damage: 50,
    type: [PetMoveTypes.Damage],
  },
  fullSpeedAhead: {
    id: '14',
    name: 'Full-Speed Ahead',
    damage: 60,
    type: [PetMoveTypes.Damage],
    priority: true,
  },
  float: {
    id: '15',
    name: 'Float',
    damage: 70,
    type: [PetMoveTypes.Damage, PetMoveTypes.Recoil],
    recoil: {
      amount: 1 / 4,
    },
  },
};

export const petData: BasePetStat[] = [
  {
    id: '1',
    name: 'gir',
    baseStats: {
      hp: 100,
      atk: 125,
      def: 106,
      spd: 120,
    },
    moves: [
      moves.freezeRay,
      moves.missileLauncher,
      moves.plasmaLauncher,
      moves.laserRifle,
    ],
  },
  {
    id: '2',
    name: 'mimi',
    baseStats: {
      hp: 95,
      atk: 110,
      def: 88,
      spd: 100,
    },
    moves: [
      moves.taser,
      moves.missileLauncher,
      moves.catapultLauncher,
      moves.railRifle,
    ],
  },
  {
    id: '3',
    name: 'pig',
    baseStats: {
      hp: 56,
      atk: 80,
      def: 56,
      spd: 61,
    },
    moves: [moves.timeBlast, moves.pound, moves.fullSpeedAhead, moves.float],
  },
  {
    id: '4',
    name: 'minimoose',
    baseStats: {
      hp: 44,
      atk: 65,
      def: 48,
      spd: 66,
    },
    moves: [
      moves.gravitationalPulse,
      moves.shockWave,
      moves.telekinesis,
      moves.psychoOrb,
    ],
  },
  {
    id: '5',
    name: 'peepi',
    baseStats: {
      hp: 30,
      atk: 45,
      def: 35,
      spd: 60,
    },
    moves: [
      moves.gravitationalPulse,
      moves.shockWave,
      moves.telekinesis,
      moves.psychoOrb,
    ],
    mega: {
      id: '105',
      requirement: '',
    },
  },
  {
    id: '105',
    name: 'ultra peepi',
    baseStats: {
      hp: 110,
      atk: 90,
      def: 100,
      spd: 50,
    },
    moves: [
      moves.gravitationalPulse,
      moves.shockWave,
      moves.telekinesis,
      moves.psychoOrb,
    ],
    isMega: true,
  },
];
