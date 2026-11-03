// Shared by the app, prisma/seed.ts and scripts/generate-images.mjs.
// Keep this file free of imports so Node can load it directly.

export type BrickColor = "red" | "blue" | "yellow" | "green" | "orange";

export interface CategoryDef {
  name: string;
  slug: string;
  color: BrickColor;
  /** File in My Sample Images/ that holds the owner's tile; null when the tile is generated. */
  source: string | null;
  intro: string;
}

export interface AgeGroupDef {
  name: string;
  short: string;
  slug: string;
  minAgeMonths: number;
  maxAgeMonths: number | null;
  color: BrickColor;
  intro: string;
}

export const CATEGORIES: CategoryDef[] = [
  {
    name: "Action Figures",
    slug: "action-figures",
    color: "blue",
    source: "WhatsApp Image 2026-11-02 at 7.15.43 PM.jpeg",
    intro:
      "Superheroes, robots and dinosaurs with moving arms and legs, ready for big adventures and bedtime battles. Sturdy enough for small hands and detailed enough for young collectors.",
  },
  {
    name: "Fun Games",
    slug: "fun-games",
    color: "orange",
    source: null,
    intro:
      "Board games, spinning tops and ball games that bring the whole family to the floor. Easy rules for little ones, real strategy for older kids, and lots of laughing for everyone.",
  },
  {
    name: "Cars & Vehicles",
    slug: "cars-and-vehicles",
    color: "red",
    source: "WhatsApp Image 2026-11-02 at 7.15.43 PM (2).jpeg",
    intro:
      "Pull-back racers, dump trucks, trains and aeroplanes for children who love anything with wheels or wings. Built to be pushed, crashed and raced across every floor in the house.",
  },
  {
    name: "Dolls & Dollhouses",
    slug: "dolls-and-dollhouses",
    color: "yellow",
    source: "WhatsApp Image 2026-11-02 at 7.15.44 PM.jpeg",
    intro:
      "Dolls with outfits to change and dollhouses with furniture to arrange, made for storytelling and pretend play that keeps going for hours.",
  },
  {
    name: "Educational Toys",
    slug: "educational-toys",
    color: "green",
    source: "WhatsApp Image 2026-11-02 at 7.15.44 PM (1).jpeg",
    intro:
      "Counting, letters, shapes and early science through play. Abacus sets, learning blocks and science kits that make practising new skills feel like a game.",
  },
  {
    name: "Kids Puzzles",
    slug: "kids-puzzles",
    color: "blue",
    source: "WhatsApp Image 2026-11-02 at 7.15.45 PM (2).jpeg",
    intro:
      "Jigsaws, shape sorters and puzzle cubes that build patience, memory and problem solving, from chunky first puzzles to brain-teasers for older kids.",
  },
  {
    name: "Musical Toys",
    slug: "musical-toys",
    color: "orange",
    source: "WhatsApp Image 2026-11-02 at 7.15.45 PM (1).jpeg",
    intro:
      "Xylophones, drums, guitars and keyboards sized for small musicians. A happy first step into rhythm and melody, and a great way to burn off energy.",
  },
  {
    name: "Remote Control Toys",
    slug: "remote-control-toys",
    color: "red",
    source: "WhatsApp Image 2026-11-02 at 7.15.45 PM.jpeg",
    intro:
      "Remote control cars, rock crawlers and stunt cars with easy two-stick controls. Rechargeable, fast and tough enough for living-room race tracks and park trails.",
  },
  {
    name: "Soft Toys",
    slug: "soft-toys",
    color: "yellow",
    source: "WhatsApp Image 2026-11-02 at 7.15.44 PM (3).jpeg",
    intro:
      "Teddies, bunnies and dinosaurs soft enough to hug to sleep. Gentle fabrics and stitched details make them safe companions from the very first birthday.",
  },
  {
    name: "Toy Guns & Blasters",
    slug: "toy-guns-and-blasters",
    color: "green",
    source: "WhatsApp Image 2026-11-02 at 7.15.44 PM (2).jpeg",
    intro:
      "Water guns for summer splash fights and soft-dart blasters for indoor target practice. Bright colours and soft ammunition keep the fun safe.",
  },
  {
    name: "Birthday Gifts",
    slug: "birthday-gifts",
    color: "red",
    source: "WhatsApp Image 2026-11-02 at 7.15.43 PM (1).jpeg",
    intro:
      "Ready-to-give gift boxes, return gift packs and party kits. Pick by age and budget and the birthday child gets something they will actually play with.",
  },
];

export const AGE_GROUPS: AgeGroupDef[] = [
  {
    name: "0–24 months",
    short: "0–2",
    slug: "0-24-months",
    minAgeMonths: 0,
    maxAgeMonths: 24,
    color: "yellow",
    intro:
      "First toys for babies and toddlers: stackers, rattling musical toys, chunky blocks and soft friends with no small parts.",
  },
  {
    name: "3–5 years",
    short: "3–5",
    slug: "3-5-years",
    minAgeMonths: 36,
    maxAgeMonths: 60,
    color: "orange",
    intro:
      "Pretend play, first puzzles, pull-back cars and dollhouses for preschoolers who want to do everything themselves.",
  },
  {
    name: "5–7 years",
    short: "5–7",
    slug: "5-7-years",
    minAgeMonths: 60,
    maxAgeMonths: 84,
    color: "green",
    intro:
      "Action figures, board games, musical instruments and their first remote control cars for curious early schoolers.",
  },
  {
    name: "7–10 years",
    short: "7–10",
    slug: "7-10-years",
    minAgeMonths: 84,
    maxAgeMonths: 120,
    color: "blue",
    intro:
      "Faster RC cars, strategy games, science kits and puzzle cubes for kids who like a real challenge.",
  },
  {
    name: "11+ years",
    short: "11+",
    slug: "11-plus-years",
    minAgeMonths: 132,
    maxAgeMonths: null,
    color: "red",
    intro:
      "Stunt RC cars, speed cubes, blasters and build-it-yourself kits for pre-teens and teens.",
  },
];

/** Placeholder house brands until the owner provides the real brand list. */
export const BRANDS = [
  { name: "Toodle Originals", slug: "toodle-originals" },
  { name: "PlayNest", slug: "playnest" },
  { name: "Zoomies", slug: "zoomies" },
  { name: "TinyTune", slug: "tinytune" },
  { name: "BrightMinds", slug: "brightminds" },
  { name: "CuddleCo", slug: "cuddleco" },
];

export const BUDGETS = [
  { label: "Under ₹499", max: 499 },
  { label: "Under ₹999", max: 999 },
  { label: "Under ₹1,999", max: 1999 },
];
