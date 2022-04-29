interface Kills {
    elites: number;
}

interface Skill {
    slug: string;
    name: string;
    icon: string;
    level: number;
    tooltipUrl: string;
    description: string;
    descriptionHtml: string;
    flavorText: string;
}

interface Rune {
    slug: string;
    type: string;
    name: string;
    level: number;
    description: string;
    descriptionHtml: string;
}

interface Active {
    skill: Skill;
    rune: Rune;
}

interface Passive {
    skill: Skill;
}

interface Skills {
    active: Array<Active>;
    passive: Array<Passive>;
}

interface Item {
    id: string;
    name: string;
    icon: string;
    displayColor: string;
    tooltipParams: string;
}

interface Items {
    head: Item;
    neck: Item;
    torso: Item;
    shoulders: Item;
    legs: Item;
    waist: Item;
    hands: Item;
    bracers: Item;
    feet: Item;
    leftFinger: Item;
    rightFinger: Item;
    mainHand: Item;
    offHand: Item;
}

// interface FollowerItems {
//     neck: Item;
//     leftFinger: Item;
//     rightFinger: Item;
//     mainHand: Item;
//     offHand: Item;
// }

// interface FollowerStats {
//     placeholder: any;
// }

// interface Follower {
//     slug: string;
//     level: number;
//     items: FollowerItems;
//     stats: FollowerStats;
//     skills: Array<any>;
// }

// interface Followers {
//     templar: Follower;
//     scoundrel: Follower;
//     enchantress: Follower;
// }

interface Stats {
    life: number;
    damage: number;
    toughness: number;
    healing: number;
    attackSpeed: number;
    armor: number;
    strength: number;
    dexterity: number;
    vitality: number;
    intelligence: number;
    physicalResist: number;
    fireResist: number;
    coldResist: number;
    lightningResist: number;
    poisonResist: number;
    arcaneResist: number;
    blockChance: number;
    blockAmountMin: number;
    blockAmountMax: number;
    goldFind: number;
    critChance: number;
    thorns: number;
    lifeSteal: number;
    lifePerKill: number;
    lifeOnHit: number;
    primaryResource: number;
    secondaryResource: number;
}

interface Hero {
    id: bigint;
    name: string;
    class: string;
    gender: number; // 1 = female; 0 = male
    level: number;
    paragonLevel: number;
    kills: Kills;
    hardcore: boolean;
    seasonal: boolean;
    seasonCreated: number;
    skills: Skills;
    items: Items;
    // followers: Followers;
    alive: boolean;
    lastUpdated: bigint;
    highestSoloRiftCompleted: number;
    stats: Stats;
}

export default Hero;
