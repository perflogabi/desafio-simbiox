import type { Card } from "@/types/card";

/** Cartas de exemplo para compor a interface antes da busca no Scryfall. */
export const sampleCards: readonly Card[] = [
  {
    id: "443a4eac-f972-4027-aed4-552d4edc2ce1",
    name: "Syr Konrad, the Grim",
    typeLine: "Legendary Creature — Human Knight",
    oracleText:
      "Whenever another creature dies, or a creature card is put into a graveyard from anywhere other than the battlefield, or a creature card leaves your graveyard, Syr Konrad deals 1 damage to each opponent.\n{1}{B}: Each player mills a card. (They each put the top card of their library into their graveyard.)",
    manaCost: "{3}{B}{B}",
    colors: ["B"],
    rarity: "uncommon",
    setCode: "dsc",
    setName: "Duskmourn: House of Horror Commander",
    releasedAt: "2024-09-27",
    artist: "Anna Steinbauer",
    power: "5",
    toughness: "4",
    images: {
      small:
        "https://cards.scryfall.io/small/front/4/4/443a4eac-f972-4027-aed4-552d4edc2ce1.jpg",
      normal:
        "https://cards.scryfall.io/normal/front/4/4/443a4eac-f972-4027-aed4-552d4edc2ce1.jpg",
    },
  },
  {
    id: "b6af9894-95b5-4c8e-902f-a9ba70f02e4a",
    name: "Etali, Primal Storm",
    typeLine: "Legendary Creature — Elder Dinosaur",
    oracleText:
      "Whenever Etali attacks, exile the top card of each player's library, then you may cast any number of spells from among those cards without paying their mana costs.",
    manaCost: "{4}{R}{R}",
    colors: ["R"],
    rarity: "rare",
    setCode: "fdn",
    setName: "Foundations",
    releasedAt: "2024-11-15",
    artist: "Raymond Swanland",
    power: "6",
    toughness: "6",
    images: {
      small:
        "https://cards.scryfall.io/small/front/b/6/b6af9894-95b5-4c8e-902f-a9ba70f02e4a.jpg",
      normal:
        "https://cards.scryfall.io/normal/front/b/6/b6af9894-95b5-4c8e-902f-a9ba70f02e4a.jpg",
    },
  },
  {
    id: "a9738cda-adb1-47fb-9f4c-ecd930228c4d",
    name: "Ragavan, Nimble Pilferer",
    typeLine: "Legendary Creature — Monkey Pirate",
    oracleText:
      "Whenever Ragavan deals combat damage to a player, create a Treasure token and exile the top card of that player's library. Until end of turn, you may cast that card.\nDash {1}{R} (You may cast this spell for its dash cost. If you do, it gains haste, and it's returned from the battlefield to its owner's hand at the beginning of the next end step.)",
    manaCost: "{R}",
    colors: ["R"],
    rarity: "mythic",
    setCode: "mh2",
    setName: "Modern Horizons 2",
    releasedAt: "2021-06-18",
    artist: "Simon Dominic",
    power: "2",
    toughness: "1",
    images: {
      small:
        "https://cards.scryfall.io/small/front/a/9/a9738cda-adb1-47fb-9f4c-ecd930228c4d.jpg",
      normal:
        "https://cards.scryfall.io/normal/front/a/9/a9738cda-adb1-47fb-9f4c-ecd930228c4d.jpg",
    },
  },
  {
    id: "f96223d0-04c4-40c2-87a9-0c6bc74adddb",
    name: "Braids, Arisen Nightmare",
    typeLine: "Legendary Creature — Nightmare",
    oracleText:
      "At the beginning of your end step, you may sacrifice an artifact, creature, enchantment, land, or planeswalker. If you do, each opponent may sacrifice a permanent of their choice that shares a card type with it. For each opponent who doesn't, you draw a card and you lose 1 life.",
    manaCost: "{1}{B}{B}",
    colors: ["B"],
    rarity: "rare",
    setCode: "eoc",
    setName: "Edge of Eternities Commander",
    releasedAt: "2025-08-01",
    artist: "Heonhwa",
    power: "3",
    toughness: "3",
    images: {
      small:
        "https://cards.scryfall.io/small/front/f/9/f96223d0-04c4-40c2-87a9-0c6bc74adddb.jpg",
      normal:
        "https://cards.scryfall.io/normal/front/f/9/f96223d0-04c4-40c2-87a9-0c6bc74adddb.jpg",
    },
  },
  {
    id: "2fe97fbe-a6d6-4e96-8c26-f81bcdf579a1",
    name: "Azusa, Lost but Seeking",
    typeLine: "Legendary Creature — Human Monk",
    oracleText: "You may play two additional lands on each of your turns.",
    manaCost: "{2}{G}",
    colors: ["G"],
    rarity: "rare",
    setCode: "cmm",
    setName: "Commander Masters",
    releasedAt: "2023-08-04",
    artist: "Winona Nelson",
    power: "1",
    toughness: "2",
    images: {
      small:
        "https://cards.scryfall.io/small/front/2/f/2fe97fbe-a6d6-4e96-8c26-f81bcdf579a1.jpg",
      normal:
        "https://cards.scryfall.io/normal/front/2/f/2fe97fbe-a6d6-4e96-8c26-f81bcdf579a1.jpg",
    },
  },
  {
    id: "9e83a0ef-4fea-45ba-86c0-130d6687f7fe",
    name: "Loran of the Third Path",
    typeLine: "Legendary Creature — Human Artificer",
    oracleText:
      "Vigilance\nWhen Loran enters, destroy up to one target artifact or enchantment.\n{T}: You and target opponent each draw a card.",
    manaCost: "{2}{W}",
    colors: ["W"],
    rarity: "rare",
    setCode: "mkc",
    setName: "Murders at Karlov Manor Commander",
    releasedAt: "2024-02-09",
    artist: "Steven Belledin",
    power: "2",
    toughness: "1",
    images: {
      small:
        "https://cards.scryfall.io/small/front/9/e/9e83a0ef-4fea-45ba-86c0-130d6687f7fe.jpg",
      normal:
        "https://cards.scryfall.io/normal/front/9/e/9e83a0ef-4fea-45ba-86c0-130d6687f7fe.jpg",
    },
  },
  {
    id: "7ea4b5bc-18a4-45db-a56a-ab3f8bd2fb0d",
    name: "Ledger Shredder",
    typeLine: "Creature — Bird Advisor",
    oracleText:
      "Flying\nWhenever a player casts their second spell each turn, this creature connives. (Draw a card, then discard a card. If you discarded a nonland card, put a +1/+1 counter on this creature.)",
    manaCost: "{1}{U}",
    colors: ["U"],
    rarity: "rare",
    setCode: "snc",
    setName: "Streets of New Capenna",
    releasedAt: "2022-04-29",
    artist: "Mila Pesic",
    power: "1",
    toughness: "3",
    images: {
      small:
        "https://cards.scryfall.io/small/front/7/e/7ea4b5bc-18a4-45db-a56a-ab3f8bd2fb0d.jpg",
      normal:
        "https://cards.scryfall.io/normal/front/7/e/7ea4b5bc-18a4-45db-a56a-ab3f8bd2fb0d.jpg",
    },
  },
  {
    id: "5d290747-3b54-4e40-baac-b64cb7ef7787",
    name: "Solemn Simulacrum",
    typeLine: "Artifact Creature — Golem",
    oracleText:
      "When this creature enters, you may search your library for a basic land card, put that card onto the battlefield tapped, then shuffle.\nWhen this creature dies, you may draw a card.",
    manaCost: "{4}",
    colors: [],
    rarity: "rare",
    setCode: "cmm",
    setName: "Commander Masters",
    releasedAt: "2023-08-04",
    artist: "Donato Giancola",
    power: "2",
    toughness: "2",
    images: {
      small:
        "https://cards.scryfall.io/small/front/5/d/5d290747-3b54-4e40-baac-b64cb7ef7787.jpg",
      normal:
        "https://cards.scryfall.io/normal/front/5/d/5d290747-3b54-4e40-baac-b64cb7ef7787.jpg",
    },
  },
];
