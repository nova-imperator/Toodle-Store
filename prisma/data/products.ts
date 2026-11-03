// Demo catalogue used by prisma/seed.ts and scripts/generate-images.mjs.
// Prices are in rupees here and converted to paise by the seed.
// `art` drives the locally generated product illustration until real photos are uploaded.

export type ToyKind =
  | "car" | "rcCar" | "truck" | "train" | "plane"
  | "teddy" | "bunny" | "dino"
  | "doll" | "dollhouse" | "robot" | "hero"
  | "board" | "top" | "ball" | "rocket"
  | "stacker" | "puzzle" | "cube" | "abacus" | "blocks"
  | "xylophone" | "guitar" | "drum" | "keyboard"
  | "blaster" | "dart" | "gift" | "balloons";

export interface ProductSeed {
  name: string;
  sku: string;
  brand: string;
  categories: string[];
  ages: string[];
  mrp: number;
  price: number;
  stock: number;
  flags?: ("best" | "new" | "deal")[];
  material: string;
  dimensions: string;
  description: string;
  highlights: string[];
  art: { kind: ToyKind; colors: [string, string, string] };
}

const R = "#E8382D", B = "#1F7FE0", Y = "#FFC72C", G = "#3FA34D", O = "#FF8A1E";
const PINK = "#F06EA9", BROWN = "#B07A4F", TAN = "#F4D9B0", TEAL = "#22B3A6";

export const SAFETY_SMALL_PARTS = "Contains small parts. Not for children under 3 years.";
export const SAFETY_BABY = "No small parts. Tested for children from birth. Always supervise play.";

export const PRODUCTS: ProductSeed[] = [
  // ── Action Figures ──
  {
    name: "Rocket Ranger Robot Figure", sku: "TS-AF-001", brand: "zoomies",
    categories: ["action-figures"], ages: ["5-7-years", "7-10-years"],
    mrp: 549, price: 399, stock: 40, flags: ["best"],
    material: "ABS plastic", dimensions: "18 × 9 × 6 cm",
    description: "A chunky robot with jointed arms and legs, light-up chest buttons and a swivel head. Big enough to hold in one hand and tough enough to survive a fall from the sofa.",
    highlights: ["Moving arms, legs and head", "Light-up chest panel (2 × AG13 included)", "Stands on its own"],
    art: { kind: "robot", colors: [B, Y, R] },
  },
  {
    name: "Captain Comet Superhero Figure", sku: "TS-AF-002", brand: "zoomies",
    categories: ["action-figures"], ages: ["5-7-years", "7-10-years"],
    mrp: 449, price: 299, stock: 55,
    material: "PVC with fabric cape", dimensions: "16 × 8 × 5 cm",
    description: "Our own caped hero with a real fabric cape, posable arms and a star emblem. Ready to save the day from the top of the bookshelf.",
    highlights: ["Fabric cape", "Posable arms", "Original Toodle character"],
    art: { kind: "hero", colors: [B, R, Y] },
  },
  {
    name: "Mighty Dino Rex Figure", sku: "TS-AF-003", brand: "playnest",
    categories: ["action-figures"], ages: ["3-5-years", "5-7-years"],
    mrp: 349, price: 249, stock: 60, flags: ["deal"],
    material: "Soft-touch vinyl", dimensions: "20 × 8 × 12 cm",
    description: "A friendly T-rex with an opening jaw and a long swishing tail. Soft vinyl means no sharp edges, even for younger dinosaur fans.",
    highlights: ["Opening jaw", "Soft vinyl, no sharp edges", "Bath safe"],
    art: { kind: "dino", colors: [G, Y, TAN] },
  },
  {
    name: "Space Explorer Robot Duo", sku: "TS-AF-004", brand: "zoomies",
    categories: ["action-figures"], ages: ["7-10-years", "11-plus-years"],
    mrp: 999, price: 699, stock: 25, flags: ["new"],
    material: "ABS plastic", dimensions: "Each figure 15 × 8 × 6 cm",
    description: "Two space robots with swappable arm tools: a claw, a drill and a blaster each. Mix and match to build a different crew every day.",
    highlights: ["2 figures, 6 swappable tools", "Click-fit joints", "Storage box included"],
    art: { kind: "robot", colors: [G, O, B] },
  },

  // ── Fun Games ──
  {
    name: "Ludo and Snakes & Ladders 2-in-1 Board", sku: "TS-FG-001", brand: "toodle-originals",
    categories: ["fun-games"], ages: ["5-7-years", "7-10-years", "11-plus-years"],
    mrp: 249, price: 149, stock: 120, flags: ["best"],
    material: "Laminated board, plastic pieces", dimensions: "Board 30 × 30 cm",
    description: "The two games every family knows, printed on one fold-out board. Comes with 16 tokens and 2 dice, so it is ready to play out of the box.",
    highlights: ["2 games on one board", "16 tokens + 2 dice", "Fold-out board"],
    art: { kind: "board", colors: [R, Y, G] },
  },
  {
    name: "Spin & Play Spinning Tops (Pack of 4)", sku: "TS-FG-002", brand: "playnest",
    categories: ["fun-games"], ages: ["3-5-years", "5-7-years"],
    mrp: 99, price: 49, stock: 300, flags: ["deal", "best"],
    material: "Plastic", dimensions: "Each top 6 cm",
    description: "Four colourful tops that spin for ages with a quick twist. Perfect for tabletop battles, party favours and return gifts.",
    highlights: ["Pack of 4 colours", "Long spin time", "Great as return gifts"],
    art: { kind: "top", colors: [R, Y, B] },
  },
  {
    name: "Dice Race Family Board Game", sku: "TS-FG-003", brand: "toodle-originals",
    categories: ["fun-games"], ages: ["7-10-years", "11-plus-years"],
    mrp: 499, price: 349, stock: 45, flags: ["new"],
    material: "Board and card", dimensions: "Box 27 × 27 × 5 cm",
    description: "Roll, race and use bonus cards to jump ahead. A quick 20-minute game for 2 to 4 players that grown-ups enjoy as much as kids.",
    highlights: ["2–4 players", "20-minute games", "Bonus cards for strategy"],
    art: { kind: "board", colors: [B, O, Y] },
  },
  {
    name: "Bounce & Catch Beach Ball", sku: "TS-FG-004", brand: "playnest",
    categories: ["fun-games"], ages: ["3-5-years", "5-7-years"],
    mrp: 149, price: 99, stock: 90,
    material: "Soft PVC", dimensions: "40 cm when inflated",
    description: "A light, bright beach ball that floats slowly enough for little ones to catch. Great for the park, the pool and the living room.",
    highlights: ["Easy to catch", "Floats in water", "Repair patch included"],
    art: { kind: "ball", colors: [O, B, G] },
  },

  // ── Cars & Vehicles ──
  {
    name: "Zoom Racer Pull-Back Car", sku: "TS-CV-001", brand: "zoomies",
    categories: ["cars-and-vehicles"], ages: ["3-5-years", "5-7-years"],
    mrp: 149, price: 99, stock: 200, flags: ["best"],
    material: "Die-cast metal and plastic", dimensions: "12 × 5 × 4 cm",
    description: "Pull it back, let go and watch it race across the room. A die-cast body with rubber tyres that keeps going on tiles and carpet.",
    highlights: ["Pull-back motor, no batteries", "Die-cast body", "Rubber tyres"],
    art: { kind: "car", colors: [R, Y, B] },
  },
  {
    name: "Mega Dump Truck", sku: "TS-CV-002", brand: "zoomies",
    categories: ["cars-and-vehicles"], ages: ["3-5-years", "5-7-years"],
    mrp: 699, price: 449, stock: 35,
    material: "Thick plastic", dimensions: "32 × 14 × 16 cm",
    description: "A big construction truck with a tipping bed that holds sand, blocks or a teddy bear. Thick plastic that can take a child sitting on it.",
    highlights: ["Tipping dump bed", "Free-rolling wheels", "Indoor and sandpit play"],
    art: { kind: "truck", colors: [Y, O, B] },
  },
  {
    name: "Choo-Choo Train Set", sku: "TS-CV-003", brand: "playnest",
    categories: ["cars-and-vehicles"], ages: ["3-5-years"],
    mrp: 899, price: 599, stock: 30, flags: ["new"],
    material: "Wood and plastic", dimensions: "Track 90 × 60 cm",
    description: "An engine, a cargo wagon and an oval track that snaps together in minutes. Magnetic couplers make it easy for small hands to join the wagons.",
    highlights: ["Engine, wagon and 12 track pieces", "Magnetic couplers", "Wooden blocks cargo"],
    art: { kind: "train", colors: [R, B, G] },
  },
  {
    name: "Sky Flyer Friction Aeroplane", sku: "TS-CV-004", brand: "zoomies",
    categories: ["cars-and-vehicles"], ages: ["3-5-years", "5-7-years"],
    mrp: 299, price: 199, stock: 70,
    material: "Plastic", dimensions: "22 × 20 × 8 cm",
    description: "Push it along the floor and the propeller spins. A friction motor means no batteries, and the wide wings make it easy to hold.",
    highlights: ["Friction motor", "Spinning propeller", "No batteries needed"],
    art: { kind: "plane", colors: [B, R, Y] },
  },
  {
    name: "City Cars (Pack of 4)", sku: "TS-CV-005", brand: "zoomies",
    categories: ["cars-and-vehicles"], ages: ["3-5-years", "5-7-years"],
    mrp: 399, price: 249, stock: 85, flags: ["deal"],
    material: "Die-cast metal", dimensions: "Each car 7 cm",
    description: "Four pocket-sized city cars in different colours. Small enough to carry anywhere and heavy enough to feel like the real thing.",
    highlights: ["4 cars", "Die-cast metal", "Fits in a pocket"],
    art: { kind: "car", colors: [G, O, B] },
  },

  // ── Dolls & Dollhouses ──
  {
    name: "Dream Cottage Dollhouse with Furniture", sku: "TS-DD-001", brand: "playnest",
    categories: ["dolls-and-dollhouses", "birthday-gifts"], ages: ["3-5-years", "5-7-years"],
    mrp: 2199, price: 1499, stock: 15, flags: ["best"],
    material: "Plastic", dimensions: "45 × 22 × 50 cm",
    description: "A two-storey cottage with four rooms, a staircase and 15 pieces of furniture. Opens wide for two children to play at once.",
    highlights: ["4 rooms, 2 floors", "15 furniture pieces", "Fits 15 cm dolls"],
    art: { kind: "dollhouse", colors: [PINK, R, Y] },
  },
  {
    name: "Little Meera Fashion Doll", sku: "TS-DD-002", brand: "playnest",
    categories: ["dolls-and-dollhouses"], ages: ["3-5-years", "5-7-years"],
    mrp: 499, price: 349, stock: 50,
    material: "Vinyl, fabric clothes", dimensions: "30 cm tall",
    description: "A 30 cm doll with brushable hair, a dress and a spare outfit to change into. Arms and legs bend for sitting and waving.",
    highlights: ["Brushable hair", "2 outfits", "Bendable arms and legs"],
    art: { kind: "doll", colors: [PINK, "#4A2C20", Y] },
  },
  {
    name: "Twin Sisters Doll Set", sku: "TS-DD-003", brand: "playnest",
    categories: ["dolls-and-dollhouses"], ages: ["5-7-years", "7-10-years"],
    mrp: 799, price: 599, stock: 28, flags: ["new"],
    material: "Vinyl, fabric clothes", dimensions: "Each doll 25 cm",
    description: "Two sister dolls with matching hair clips and different outfits, ready for tea parties and dollhouse stories.",
    highlights: ["2 dolls", "Hair clips and comb", "Outfits can be swapped"],
    art: { kind: "doll", colors: [B, "#7A4A2A", O] },
  },
  {
    name: "Mini Picnic Dollhouse", sku: "TS-DD-004", brand: "playnest",
    categories: ["dolls-and-dollhouses"], ages: ["3-5-years"],
    mrp: 1299, price: 899, stock: 20,
    material: "Plastic", dimensions: "30 × 15 × 32 cm",
    description: "A carry-along house with a handle on the roof. Folds shut with all the furniture stored inside, so it travels to grandma's house.",
    highlights: ["Folds shut with handle", "8 furniture pieces", "2 mini dolls"],
    art: { kind: "dollhouse", colors: [Y, G, R] },
  },

  // ── Educational Toys ──
  {
    name: "Rainbow Counting Abacus", sku: "TS-ED-001", brand: "brightminds",
    categories: ["educational-toys"], ages: ["3-5-years", "5-7-years"],
    mrp: 349, price: 249, stock: 75, flags: ["best"],
    material: "Wood", dimensions: "28 × 10 × 25 cm",
    description: "Fifty colourful beads on five wires that make counting, adding and taking away something you can touch. Smooth wooden frame with rounded corners.",
    highlights: ["50 beads, 5 colours", "Wooden frame", "Counting activity card"],
    art: { kind: "abacus", colors: [G, Y, R] },
  },
  {
    name: "Shape Learning Blocks", sku: "TS-ED-002", brand: "brightminds",
    categories: ["educational-toys"], ages: ["0-24-months", "3-5-years"],
    mrp: 449, price: 299, stock: 60,
    material: "Wood, water-based paint", dimensions: "Each block 4 cm",
    description: "Twenty chunky wooden blocks with shapes, colours and pictures on every side. Stack them, sort them and name them together.",
    highlights: ["20 wooden blocks", "Child-safe paint", "Storage bag"],
    art: { kind: "blocks", colors: [R, B, G] },
  },
  {
    name: "Junior Rocket Science Kit", sku: "TS-ED-003", brand: "brightminds",
    categories: ["educational-toys"], ages: ["7-10-years", "11-plus-years"],
    mrp: 1099, price: 799, stock: 22, flags: ["new"],
    material: "Plastic and card", dimensions: "Box 30 × 20 × 8 cm",
    description: "Build a rocket, decorate it and launch it with a foot pump. The guide explains thrust and air pressure in simple words.",
    highlights: ["Foot-pump launcher", "Illustrated guide", "Reusable rocket"],
    art: { kind: "rocket", colors: [B, R, O] },
  },
  {
    name: "Stack & Learn Ring Stacker", sku: "TS-ED-004", brand: "brightminds",
    categories: ["educational-toys"], ages: ["0-24-months"],
    mrp: 299, price: 199, stock: 80, flags: ["deal"],
    material: "BPA-free plastic", dimensions: "22 cm tall",
    description: "Five rings to stack in order of size, a classic first toy for hand-eye coordination. Rings are wide enough that they cannot be swallowed.",
    highlights: ["5 large rings", "BPA-free", "Rocking base"],
    art: { kind: "stacker", colors: [B, R, Y] },
  },

  // ── Kids Puzzles ──
  {
    name: "Jungle Friends Jigsaw (48 pieces)", sku: "TS-PZ-001", brand: "brightminds",
    categories: ["kids-puzzles"], ages: ["3-5-years", "5-7-years"],
    mrp: 299, price: 199, stock: 65,
    material: "Thick card", dimensions: "Finished 45 × 30 cm",
    description: "Forty-eight thick pieces that build a jungle full of animals to spot and name. Big pieces for small fingers, with a poster to follow.",
    highlights: ["48 thick pieces", "Reference poster", "Animal spotting game"],
    art: { kind: "puzzle", colors: [O, G, Y] },
  },
  {
    name: "Speed Cube 3×3", sku: "TS-PZ-002", brand: "brightminds",
    categories: ["kids-puzzles", "educational-toys"], ages: ["7-10-years", "11-plus-years"],
    mrp: 249, price: 149, stock: 150, flags: ["best"],
    material: "ABS plastic", dimensions: "5.6 cm",
    description: "A smooth-turning 3×3 cube with rounded corners for fast solving. Includes a beginner's guide to the layer-by-layer method.",
    highlights: ["Smooth turning", "Stickerless colours", "Beginner's guide"],
    art: { kind: "cube", colors: [R, B, Y] },
  },
  {
    name: "Map of India Floor Puzzle", sku: "TS-PZ-003", brand: "brightminds",
    categories: ["kids-puzzles", "educational-toys"], ages: ["5-7-years", "7-10-years"],
    mrp: 499, price: 349, stock: 40, flags: ["new"],
    material: "Thick card", dimensions: "Finished 60 × 60 cm",
    description: "A big floor puzzle of India with every state as its own piece. Learn the states, capitals and famous places as you build.",
    highlights: ["State-shaped pieces", "Capitals and landmarks", "Floor size"],
    art: { kind: "puzzle", colors: [B, G, O] },
  },
  {
    name: "First Shapes Puzzle Board", sku: "TS-PZ-004", brand: "brightminds",
    categories: ["kids-puzzles"], ages: ["0-24-months", "3-5-years"],
    mrp: 199, price: 149, stock: 70,
    material: "Wood", dimensions: "30 × 22 cm",
    description: "Six chunky shapes with big knobs to lift and fit back in place. A first puzzle that teaches shapes and colours.",
    highlights: ["6 shapes with knobs", "Wooden board", "Child-safe paint"],
    art: { kind: "puzzle", colors: [R, Y, B] },
  },

  // ── Musical Toys ──
  {
    name: "Rainbow Xylophone (8 notes)", sku: "TS-MU-001", brand: "tinytune",
    categories: ["musical-toys"], ages: ["0-24-months", "3-5-years"],
    mrp: 399, price: 249, stock: 60, flags: ["best"],
    material: "Metal keys, wooden frame", dimensions: "30 × 13 cm",
    description: "Eight tuned metal keys in rainbow colours with two wooden mallets. Colour-coded song cards help little musicians play their first tunes.",
    highlights: ["8 tuned notes", "2 mallets", "Colour song cards"],
    art: { kind: "xylophone", colors: [R, BROWN, Y] },
  },
  {
    name: "Junior Strummer Guitar", sku: "TS-MU-002", brand: "tinytune",
    categories: ["musical-toys"], ages: ["3-5-years", "5-7-years"],
    mrp: 699, price: 499, stock: 30,
    material: "Wood and nylon strings", dimensions: "53 cm",
    description: "A child-size guitar with four nylon strings that are kind to small fingers. Comes with a strap and a spare string.",
    highlights: ["4 nylon strings", "Strap included", "Child size"],
    art: { kind: "guitar", colors: [O, BROWN, Y] },
  },
  {
    name: "Beat Buddy Drum Set", sku: "TS-MU-003", brand: "tinytune",
    categories: ["musical-toys"], ages: ["3-5-years", "5-7-years"],
    mrp: 999, price: 699, stock: 18, flags: ["deal"],
    material: "Plastic, drum skin", dimensions: "Drum 25 cm",
    description: "A proper drum with two sticks and a neck strap, so it can march around the house. Loud enough to be fun, not loud enough to scare.",
    highlights: ["2 drumsticks", "Neck strap", "Adjustable tension"],
    art: { kind: "drum", colors: [R, B, Y] },
  },
  {
    name: "Melody Maker Keyboard (32 keys)", sku: "TS-MU-004", brand: "tinytune",
    categories: ["musical-toys"], ages: ["5-7-years", "7-10-years"],
    mrp: 1299, price: 899, stock: 20, flags: ["new"],
    material: "Plastic", dimensions: "48 × 16 × 5 cm",
    description: "Thirty-two keys, eight instrument sounds, a record button and a microphone for singing along. Runs on batteries or USB.",
    highlights: ["32 keys, 8 sounds", "Record and play back", "Microphone included"],
    art: { kind: "keyboard", colors: [B, Y, R] },
  },

  // ── Remote Control Toys ──
  {
    name: "Turbo Thunder RC Car", sku: "TS-RC-001", brand: "zoomies",
    categories: ["remote-control-toys", "cars-and-vehicles"], ages: ["5-7-years", "7-10-years"],
    mrp: 1199, price: 799, stock: 35, flags: ["best"],
    material: "Plastic, rubber tyres", dimensions: "25 × 13 × 9 cm",
    description: "A rechargeable remote control car with full-function steering and two speed modes. The 2.4 GHz remote lets two cars race without interference.",
    highlights: ["Rechargeable battery", "2.4 GHz remote", "2 speed modes"],
    art: { kind: "rcCar", colors: [R, Y, B] },
  },
  {
    name: "Rock Crawler 4×4 RC Truck", sku: "TS-RC-002", brand: "zoomies",
    categories: ["remote-control-toys", "cars-and-vehicles"], ages: ["7-10-years", "11-plus-years"],
    mrp: 1899, price: 1299, stock: 18,
    material: "Plastic, rubber tyres", dimensions: "32 × 18 × 16 cm",
    description: "Big rubber tyres and spring suspension that climb over cushions, grass and gravel. Four-wheel drive and a rechargeable battery for long runs.",
    highlights: ["4-wheel drive", "Spring suspension", "Climbs 45° slopes"],
    art: { kind: "rcCar", colors: [G, O, B] },
  },
  {
    name: "Stunt Flip RC Car", sku: "TS-RC-003", brand: "zoomies",
    categories: ["remote-control-toys"], ages: ["7-10-years", "11-plus-years"],
    mrp: 1499, price: 999, stock: 24, flags: ["deal"],
    material: "Plastic, foam tyres", dimensions: "22 × 18 × 10 cm",
    description: "A double-sided stunt car that flips, spins 360° and keeps driving upside down. Foam tyres protect your furniture.",
    highlights: ["360° spins and flips", "Drives both sides", "Rechargeable"],
    art: { kind: "rcCar", colors: [B, Y, R] },
  },
  {
    name: "RC Excavator Builder", sku: "TS-RC-004", brand: "zoomies",
    categories: ["remote-control-toys", "cars-and-vehicles"], ages: ["5-7-years", "7-10-years"],
    mrp: 2199, price: 1499, stock: 12, flags: ["new"],
    material: "Plastic", dimensions: "35 × 12 × 20 cm",
    description: "A remote control construction truck with a moving bucket and lights and sounds. Dig, lift and dump with one simple remote.",
    highlights: ["Moving bucket", "Lights and sounds", "Rechargeable"],
    art: { kind: "truck", colors: [Y, O, B] },
  },

  // ── Soft Toys ──
  {
    name: "Cuddle Bear Teddy (30 cm)", sku: "TS-ST-001", brand: "cuddleco",
    categories: ["soft-toys", "birthday-gifts"], ages: ["0-24-months", "3-5-years"],
    mrp: 499, price: 349, stock: 90, flags: ["best"],
    material: "Plush polyester, hypoallergenic filling", dimensions: "30 cm",
    description: "A soft, squishy teddy with stitched eyes and a satin bow. Machine washable and safe for babies from birth.",
    highlights: ["Stitched eyes, safe from birth", "Machine washable", "Satin bow"],
    art: { kind: "teddy", colors: [BROWN, TAN, R] },
  },
  {
    name: "Hop Hop Bunny Plush", sku: "TS-ST-002", brand: "cuddleco",
    categories: ["soft-toys"], ages: ["0-24-months", "3-5-years"],
    mrp: 399, price: 299, stock: 70,
    material: "Plush polyester", dimensions: "28 cm",
    description: "A floppy-eared bunny with extra-soft fur and a little bow, just right for bedtime cuddles and car journeys.",
    highlights: ["Extra-soft fur", "Floppy ears", "Machine washable"],
    art: { kind: "bunny", colors: ["#F7B8CF", "#FFF1F5", B] },
  },
  {
    name: "Dino Buddy Plush", sku: "TS-ST-003", brand: "cuddleco",
    categories: ["soft-toys"], ages: ["3-5-years", "5-7-years"],
    mrp: 549, price: 399, stock: 45, flags: ["new"],
    material: "Plush polyester", dimensions: "35 cm long",
    description: "A smiley green dinosaur with soft spikes down its back. Huggable from nose to tail.",
    highlights: ["Soft spikes", "35 cm long", "Machine washable"],
    art: { kind: "dino", colors: [TEAL, O, "#C9F2E9"] },
  },
  {
    name: "Jumbo Teddy (60 cm)", sku: "TS-ST-004", brand: "cuddleco",
    categories: ["soft-toys", "birthday-gifts"], ages: ["3-5-years", "5-7-years", "7-10-years"],
    mrp: 1299, price: 899, stock: 16,
    material: "Plush polyester", dimensions: "60 cm",
    description: "A big, huggable teddy that sits on the bed and keeps watch. A favourite birthday surprise.",
    highlights: ["60 cm tall", "Extra-thick fur", "Gift ready"],
    art: { kind: "teddy", colors: ["#E2A86C", "#FBE3C4", B] },
  },

  // ── Toy Guns & Blasters ──
  {
    name: "Splash Blaster Water Gun", sku: "TS-TG-001", brand: "playnest",
    categories: ["toy-guns-and-blasters"], ages: ["5-7-years", "7-10-years"],
    mrp: 249, price: 149, stock: 110, flags: ["best", "deal"],
    material: "Plastic", dimensions: "28 cm",
    description: "A pump-action water gun with a see-through tank that sprays up to 6 metres. Summer's favourite toy.",
    highlights: ["Sprays up to 6 m", "400 ml tank", "Easy pump action"],
    art: { kind: "blaster", colors: [O, Y, "#7CC8FF"] },
  },
  {
    name: "Soft Dart Blaster with 10 Darts", sku: "TS-TG-002", brand: "playnest",
    categories: ["toy-guns-and-blasters"], ages: ["7-10-years", "11-plus-years"],
    mrp: 599, price: 399, stock: 50,
    material: "Plastic, foam darts", dimensions: "32 cm",
    description: "A rotating-drum blaster that fires soft foam darts. Includes 10 darts and a target for indoor practice.",
    highlights: ["Rotating drum", "10 foam darts", "Target included"],
    art: { kind: "dart", colors: [B, O, Y] },
  },
  {
    name: "Mega Soaker Water Gun", sku: "TS-TG-003", brand: "playnest",
    categories: ["toy-guns-and-blasters"], ages: ["7-10-years", "11-plus-years"],
    mrp: 499, price: 349, stock: 40, flags: ["new"],
    material: "Plastic", dimensions: "42 cm",
    description: "A long-range water gun with a big 900 ml tank and an adjustable nozzle for a jet or a shower.",
    highlights: ["900 ml tank", "Adjustable nozzle", "Sprays up to 9 m"],
    art: { kind: "blaster", colors: [B, G, "#7CC8FF"] },
  },

  // ── Birthday Gifts ──
  {
    name: "Surprise Toy Gift Box", sku: "TS-BG-001", brand: "toodle-originals",
    categories: ["birthday-gifts"], ages: ["3-5-years", "5-7-years"],
    mrp: 699, price: 499, stock: 60, flags: ["best"],
    material: "Assorted", dimensions: "Box 25 × 20 × 12 cm",
    description: "A ready-wrapped box of five age-matched toys chosen by our team. Pick the age when you order and we pack it for that child.",
    highlights: ["5 toys, matched to age", "Gift wrapped", "Message card"],
    art: { kind: "gift", colors: [R, Y, B] },
  },
  {
    name: "Return Gift Pack (Set of 6)", sku: "TS-BG-002", brand: "toodle-originals",
    categories: ["birthday-gifts"], ages: ["3-5-years", "5-7-years", "7-10-years"],
    mrp: 449, price: 299, stock: 100, flags: ["deal"],
    material: "Assorted", dimensions: "6 bags, each 15 × 10 cm",
    description: "Six little goodie bags, each with a small toy and a sticker sheet. Return gifts sorted in one click.",
    highlights: ["6 goodie bags", "Toy + stickers in each", "Mixed colours"],
    art: { kind: "gift", colors: [B, O, G] },
  },
  {
    name: "Party Balloons & Toys Kit", sku: "TS-BG-003", brand: "toodle-originals",
    categories: ["birthday-gifts"], ages: ["3-5-years", "5-7-years"],
    mrp: 299, price: 199, stock: 80,
    material: "Latex balloons, paper, plastic", dimensions: "Box 22 × 15 × 5 cm",
    description: "Thirty balloons, a birthday banner, party hats and whistles. Everything you need to turn the living room into a party.",
    highlights: ["30 balloons", "Banner and 8 hats", "8 party whistles"],
    art: { kind: "balloons", colors: [R, Y, B] },
  },
  {
    name: "Birthday Gift Hamper", sku: "TS-BG-004", brand: "toodle-originals",
    categories: ["birthday-gifts"], ages: ["0-24-months", "3-5-years", "5-7-years"],
    mrp: 899, price: 649, stock: 25, flags: ["new"],
    material: "Assorted", dimensions: "Box 30 × 25 × 15 cm",
    description: "A gift box with a soft toy, a puzzle and a musical toy, wrapped and ready to hand over at the party.",
    highlights: ["3 toys inside", "Gift wrapped", "Free message card"],
    art: { kind: "gift", colors: [Y, R, G] },
  },
];
