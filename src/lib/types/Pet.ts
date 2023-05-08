export interface BasePetStat {
  id: string;
  name: string;
  baseStats: PetBaseStat;
  moves: PetMove[];
  mega?: {
    id: string;
    requirement: string;
  };
  isMega?: boolean;
  hasMega?: boolean;
}

export interface PetBaseStat {
  hp: number;
  atk: number;
  def: number;
  spd: number;
}

export interface PetMove {
  id: string;
  name: string;
  damage: number;
  type: PetMoveType[];
  stun?: PetMoveStun;
  recoil?: PetMoveRecoil;
  cooldown?: PetMoveCooldown;
  poison?: PetMovePoison;
  buff?: PetMoveBuff[];
  confuse?: PetMoveConfuse;

  priority?: boolean;
  alwaysHits?: boolean;
}

export enum PetMoveTypes {
  Damage = 'damage',
  Stun = 'stun',
  Posion = 'poison',
  Buff = 'buff',
  Confuse = 'confuse',
  Recoil = 'recoil',
}

export enum PetStatTypes {
  Hp = 'hp',
  Attack = 'atk',
  Defense = 'def',
  Speed = 'spd',
}
export interface PetMoveStun {
  chance: number;
  duration: {
    min: number;
    max: number;
  };
}

export interface PetMoveRecoil {
  amount: number;
}

export interface PetMoveCooldown {
  after: number;
  duration: number;
}

export interface PetMovePoison {
  chance: number;
  duration: {
    min: number;
    max: number;
  };
}

export interface PetMoveBuff {
  stat: PetStatType;
  amount: number;
}

export interface PetMoveConfuse {
  chance: number;
  amount: number;
  duration: {
    min: number;
    max: number;
  };
}

export type PetStatType = 'hp' | 'def' | 'atk' | 'spd';
export type PetMoveType =
  | 'damage'
  | 'stun'
  | 'poison'
  | 'buff'
  | 'confuse'
  | 'recoil';
