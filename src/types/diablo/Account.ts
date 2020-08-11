interface HeroKills {
    elites: number;
}

interface Hero {
    "id": bigint;
    "name": string;
    "class": string;
    "classSlug": string;
    "gender": number; // 0 = male; 1 = female
    "level": number;
    "kills": HeroKills;
    "paragonLevel": number;
    "hardcore": boolean;
    "seasonal": boolean;
    "dead": boolean;
    "last-updated": bigint;
}

interface Kills {
    monsters: bigint;
    elites: bigint;
    hardcoreMonsters: bigint;
}

interface TimePlayed {
    "demon-hunter": number;
    "barbarian": number;
    "witch-doctor": number;
    "necromancer": number;
    "wizard": number;
    "monk": number;
    "crusader": number;
}

interface Progression {
    act1: boolean;
    act2: boolean;
    act3: boolean;
    act4: boolean;
    act5: boolean;
}

interface Account {
    battleTag: string;
    paragonLevel: number;
    paragonLevelHardcore: number;
    paragonLevelSeason: number;
    paragonLevelSeasonHardcore: number;
    guildName: string; // Empty if not in a guild
    heroes: Array<Hero>;
    lastHeroPlayed: bigint;
    lastUpdated: number;
    kills: Kills;
    highestHardcoreLevel: number;
    timePlayed: TimePlayed;
    progression: Progression;
}

export default Account;

/* Season 21
    "timePlayed": {
        "demon-hunter": 0.036,
        "barbarian": 0,
        "witch-doctor": 0,
        "necromancer": 0,
        "wizard": 0,
        "monk": 0,
        "crusader": 0
    },
*/

/* Season 20
    "timePlayed": {
        "demon-hunter": 0.054,
        "barbarian": 0.098,
        "witch-doctor": 0,
        "necromancer": 0,
        "wizard": 0,
        "monk": 0.363,
        "crusader": 0.012
    }
 */
