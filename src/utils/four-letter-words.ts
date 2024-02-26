const FOUR_LETTER_WORDS = [
  "ABLE",
  "ACID",
  "ACRE",
  "AGED",
  "AIDE",
  "AKIN",
  "ALAS",
  "ALLY",
  "ALSO",
  "AMID",
  "ANAL",
  "ANTI",
  "APEX",
  "ARCH",
  "AREA",
  "ARMY",
  "ATOM",
  "ATOP",
  "AUNT",
  "AURA",
  "AUTO",
  "AVID",
  "AWAY",
  "AXIS",
  "BABY",
  "BACH",
  "BACK",
  "BAIT",
  "BAKE",
  "BALD",
  "BALL",
  "BAND",
  "BANG",
  "BANK",
  "BARE",
  "BARK",
  "BARN",
  "BASE",
  "BASS",
  "BATH",
  "BEAM",
  "BEAN",
  "BEAR",
  "BEAT",
  "BECK",
  "BEEF",
  "BEEN",
  "BEER",
  "BELL",
  "BELT",
  "BEND",
  "BENT",
  "BEST",
  "BETA",
  "BETH",
  "BIAS",
  "BIKE",
  "BILL",
  "BIND",
  "BIRD",
  "BITE",
  "BLEW",
  "BLOG",
  "BLOW",
  "BLUE",
  "BLUR",
  "BOAT",
  "BODY",
  "BOIL",
  "BOLD",
  "BOLT",
  "BOMB",
  "BOND",
  "BONE",
  "BOOK",
  "BOOM",
  "BOOT",
  "BORE",
  "BORN",
  "BOSS",
  "BOTH",
  "BOUT",
  "BOWL",
  "BRAD",
  "BRED",
  "BREW",
  "BROW",
  "BUCK",
  "BULB",
  "BULK",
  "BULL",
  "BUMP",
  "BURN",
  "BURY",
  "BUSH",
  "BUST",
  "BUSY",
  "BUTT",
  "BUZZ",
  "CAFE",
  "CAGE",
  "CAKE",
  "CALF",
  "CALL",
  "CALM",
  "CAME",
  "CAMP",
  "CANE",
  "CAPE",
  "CARD",
  "CARE",
  "CARR",
  "CART",
  "CASE",
  "CASH",
  "CAST",
  "CAVE",
  "CELL",
  "CENT",
  "CHAP",
  "CHAT",
  "CHEF",
  "CHIC",
  "CHIN",
  "CHIP",
  "CHOP",
  "CITE",
  "CITY",
  "CLAD",
  "CLAN",
  "CLAY",
  "CLIP",
  "CLUB",
  "CLUE",
  "COAL",
  "COAT",
  "COCA",
  "CODE",
  "COIL",
  "COIN",
  "COKE",
  "COLA",
  "COLD",
  "COME",
  "CONE",
  "COOK",
  "COOL",
  "COPE",
  "COPY",
  "CORD",
  "CORE",
  "CORK",
  "CORN",
  "COST",
  "COUP",
  "COVE",
  "CRAP",
  "CREW",
  "CROP",
  "CROW",
  "CUBE",
  "CULT",
  "CURB",
  "CURE",
  "CUTE",
  "DALE",
  "DAME",
  "DAMN",
  "DAMP",
  "DARE",
  "DARK",
  "DASH",
  "DATA",
  "DATE",
  "DAWN",
  "DAYS",
  "DEAD",
  "DEAF",
  "DEAL",
  "DEAN",
  "DEAR",
  "DEBT",
  "DECK",
  "DEED",
  "DEEP",
  "DEER",
  "DELL",
  "DEMO",
  "DENT",
  "DENY",
  "DESK",
  "DIAL",
  "DICE",
  "DICK",
  "DIET",
  "DIRE",
  "DIRT",
  "DISC",
  "DISH",
  "DISK",
  "DIVE",
  "DOCK",
  "DOES",
  "DOLE",
  "DOLL",
  "DOME",
  "DONE",
  "DOOM",
  "DOOR",
  "DOSE",
  "DOVE",
  "DOWN",
  "DRAG",
  "DRAW",
  "DREW",
  "DROP",
  "DRUG",
  "DRUM",
  "DUAL",
  "DUCK",
  "DUFF",
  "DUKE",
  "DULL",
  "DULY",
  "DUMB",
  "DUMP",
  "DUSK",
  "DUST",
  "DUTY",
  "EACH",
  "EARL",
  "EARN",
  "EASE",
  "EAST",
  "EASY",
  "EATS",
  "ECHO",
  "EDGE",
  "EDIT",
  "ELSE",
  "ENVY",
  "EPIC",
  "EURO",
  "EVEN",
  "EVER",
  "EVIL",
  "EXAM",
  "EXIT",
  "EXPO",
  "EYED",
  "FACE",
  "FACT",
  "FADE",
  "FAIL",
  "FAIR",
  "FAKE",
  "FALL",
  "FAME",
  "FARE",
  "FARM",
  "FAST",
  "FATE",
  "FEAR",
  "FEAT",
  "FEED",
  "FEEL",
  "FEET",
  "FELL",
  "FELT",
  "FILE",
  "FILL",
  "FILM",
  "FIND",
  "FINE",
  "FIRE",
  "FIRM",
  "FISH",
  "FIST",
  "FIVE",
  "FLAG",
  "FLAT",
  "FLED",
  "FLEE",
  "FLEW",
  "FLEX",
  "FLIP",
  "FLOW",
  "FLUX",
  "FOAM",
  "FOIL",
  "FOLD",
  "FOLK",
  "FOND",
  "FONT",
  "FOOD",
  "FOOL",
  "FOOT",
  "FORD",
  "FORE",
  "FORK",
  "FORM",
  "FORT",
  "FOUL",
  "FOUR",
  "FREE",
  "FROG",
  "FROM",
  "FUCK",
  "FUEL",
  "FULL",
  "FUND",
  "FURY",
  "FUSE",
  "FUSS",
  "GAIN",
  "GALA",
  "GALE",
  "GALL",
  "GAME",
  "GANG",
  "GATE",
  "GAVE",
  "GAZE",
  "GEAR",
  "GENE",
  "GIFT",
  "GILL",
  "GIRL",
  "GIVE",
  "GLAD",
  "GLEN",
  "GLOW",
  "GLUE",
  "GOAL",
  "GOAT",
  "GOES",
  "GOLD",
  "GOLF",
  "GONE",
  "GOOD",
  "GORE",
  "GOWN",
  "GRAB",
  "GRAM",
  "GRAY",
  "GREW",
  "GREY",
  "GRID",
  "GRIM",
  "GRIN",
  "GRIP",
  "GROW",
  "GULF",
  "GURU",
  "HAIL",
  "HAIR",
  "HALE",
  "HALF",
  "HALL",
  "HALT",
  "HAND",
  "HANG",
  "HANK",
  "HARD",
  "HARM",
  "HART",
  "HATE",
  "HAUL",
  "HAVE",
  "HAWK",
  "HEAD",
  "HEAL",
  "HEAP",
  "HEAR",
  "HEAT",
  "HEEL",
  "HEIR",
  "HELD",
  "HELL",
  "HELM",
  "HELP",
  "HERB",
  "HERD",
  "HERE",
  "HERO",
  "HERS",
  "HIDE",
  "HIGH",
  "HIKE",
  "HILL",
  "HINT",
  "HIRE",
  "HOLD",
  "HOLE",
  "HOLT",
  "HOLY",
  "HOME",
  "HOOD",
  "HOOK",
  "HOPE",
  "HORN",
  "HOSE",
  "HOST",
  "HOUR",
  "HUGE",
  "HULL",
  "HUNG",
  "HUNT",
  "HURT",
  "HYPE",
  "ICON",
  "IDEA",
  "IDLE",
  "IDOL",
  "INCH",
  "INFO",
  "INTO",
  "IRIS",
  "IRON",
  "ISLE",
  "ITEM",
  "JACK",
  "JAIL",
  "JAKE",
  "JANE",
  "JAVA",
  "JAZZ",
  "JEAN",
  "JEEP",
  "JILL",
  "JOEY",
  "JOHN",
  "JOIN",
  "JOKE",
  "JOSH",
  "JUMP",
  "JUNK",
  "JURY",
  "JUST",
  "KEEN",
  "KEEP",
  "KEMP",
  "KENT",
  "KEPT",
  "KHAN",
  "KICK",
  "KILL",
  "KIND",
  "KING",
  "KIRK",
  "KISS",
  "KITE",
  "KNEE",
  "KNEW",
  "KNIT",
  "KNOT",
  "KNOW",
  "KOHL",
  "KYLE",
  "LACE",
  "LACK",
  "LADY",
  "LAID",
  "LAKE",
  "LAMB",
  "LAMP",
  "LAND",
  "LANE",
  "LANG",
  "LAST",
  "LATE",
  "LAVA",
  "LAWN",
  "LAZY",
  "LEAD",
  "LEAF",
  "LEAK",
  "LEAN",
  "LEAP",
  "LEFT",
  "LEND",
  "LENS",
  "LENT",
  "LESS",
  "LEST",
  "LEVY",
  "LIED",
  "LIEN",
  "LIFE",
  "LIFT",
  "LIKE",
  "LILY",
  "LIMB",
  "LIME",
  "LIMP",
  "LINE",
  "LINK",
  "LION",
  "LIST",
  "LIVE",
  "LOAD",
  "LOAN",
  "LOCK",
  "LOFT",
  "LOGO",
  "LONE",
  "LONG",
  "LOOK",
  "LOOP",
  "LORD",
  "LOSE",
  "LOSS",
  "LOST",
  "LOUD",
  "LOVE",
  "LUCK",
  "LUMP",
  "LUNG",
  "LURE",
  "LUSH",
  "LUST",
  "MADE",
  "MAID",
  "MAIL",
  "MAIN",
  "MAKE",
  "MALE",
  "MALL",
  "MAMA",
  "MANY",
  "MARC",
  "MARK",
  "MART",
  "MASK",
  "MASS",
  "MATE",
  "MATT",
  "MAYO",
  "MAZE",
  "MEAD",
  "MEAL",
  "MEAN",
  "MEAT",
  "MEET",
  "MEGA",
  "MELT",
  "MEMO",
  "MENU",
  "MERE",
  "MESA",
  "MESH",
  "MESS",
  "MICE",
  "MICK",
  "MIKE",
  "MILD",
  "MILE",
  "MILK",
  "MILL",
  "MIND",
  "MINE",
  "MINI",
  "MINT",
  "MISS",
  "MIST",
  "MOCK",
  "MODE",
  "MOLD",
  "MONK",
  "MOOD",
  "MOON",
  "MORE",
  "MOSS",
  "MOST",
  "MOVE",
  "MUCH",
  "MUST",
  "MYTH",
  "NAIL",
  "NAME",
  "NAVY",
  "NEAR",
  "NEAT",
  "NECK",
  "NEED",
  "NEST",
  "NEWS",
  "NEXT",
  "NICE",
  "NICK",
  "NINE",
  "NODE",
  "NONE",
  "NOON",
  "NORM",
  "NOSE",
  "NOTE",
  "NOVA",
  "NUDE",
  "NUTS",
  "OATH",
  "OBEY",
  "ODDS",
  "ODOR",
  "OKAY",
  "ONCE",
  "ONLY",
  "ONTO",
  "OPEN",
  "ORAL",
  "OTTO",
  "OURS",
  "OVAL",
  "OVEN",
  "OVER",
  "PACE",
  "PACK",
  "PACT",
  "PAGE",
  "PAID",
  "PAIN",
  "PAIR",
  "PALE",
  "PALM",
  "PAPA",
  "PARA",
  "PARK",
  "PART",
  "PASS",
  "PAST",
  "PATH",
  "PEAK",
  "PEAT",
  "PECK",
  "PEEL",
  "PEER",
  "PEST",
  "PICK",
  "PIER",
  "PIKE",
  "PILE",
  "PILL",
  "PINE",
  "PINK",
  "PINT",
  "PIPE",
  "PITY",
  "PLAN",
  "PLAY",
  "PLEA",
  "PLOT",
  "PLUG",
  "PLUS",
  "POEM",
  "POET",
  "POLE",
  "POLL",
  "POLO",
  "POLY",
  "POND",
  "PONY",
  "POOL",
  "POOR",
  "POPE",
  "PORK",
  "PORT",
  "POSE",
  "POST",
  "POUR",
  "PRAY",
  "PREP",
  "PREY",
  "PROF",
  "PROP",
  "PULL",
  "PULP",
  "PUMP",
  "PUNK",
  "PURE",
  "PUSH",
  "QUID",
  "QUIT",
  "QUIZ",
  "RACE",
  "RACK",
  "RAGE",
  "RAID",
  "RAIL",
  "RAIN",
  "RAMP",
  "RANG",
  "RANK",
  "RAPE",
  "RARE",
  "RASH",
  "RATE",
  "RAVE",
  "READ",
  "REAL",
  "REAP",
  "REAR",
  "REED",
  "REEF",
  "REEL",
  "RELY",
  "RENT",
  "REST",
  "RICE",
  "RICH",
  "RICK",
  "RIDE",
  "RING",
  "RIOT",
  "RIPE",
  "RISE",
  "RISK",
  "RITE",
  "RITZ",
  "ROAD",
  "ROAR",
  "ROCK",
  "RODE",
  "ROLE",
  "ROLL",
  "ROOF",
  "ROOM",
  "ROOT",
  "ROPE",
  "ROSE",
  "RUBY",
  "RUDE",
  "RUIN",
  "RULE",
  "RUSH",
  "RUST",
  "RUTH",
  "SACK",
  "SAFE",
  "SAGA",
  "SAGE",
  "SAID",
  "SAIL",
  "SAKE",
  "SALE",
  "SALT",
  "SAME",
  "SAND",
  "SANG",
  "SANK",
  "SAVE",
  "SCAN",
  "SCAR",
  "SCOT",
  "SEAL",
  "SEAT",
  "SEED",
  "SEEK",
  "SEEM",
  "SEEN",
  "SELF",
  "SELL",
  "SEMI",
  "SEND",
  "SENT",
  "SEPT",
  "SEXY",
  "SHAH",
  "SHED",
  "SHIP",
  "SHIT",
  "SHOE",
  "SHOP",
  "SHOT",
  "SHOW",
  "SHUT",
  "SICK",
  "SIDE",
  "SIGH",
  "SIGN",
  "SILK",
  "SING",
  "SINK",
  "SITE",
  "SIZE",
  "SKIN",
  "SKIP",
  "SLAB",
  "SLAM",
  "SLAP",
  "SLID",
  "SLIM",
  "SLIP",
  "SLOT",
  "SLOW",
  "SNAP",
  "SNOW",
  "SOAP",
  "SOAR",
  "SODA",
  "SOFA",
  "SOFT",
  "SOIL",
  "SOLD",
  "SOLE",
  "SOLO",
  "SOME",
  "SONG",
  "SOON",
  "SORE",
  "SORT",
  "SOUL",
  "SOUP",
  "SOUR",
  "SPAN",
  "SPIN",
  "SPIT",
  "SPOT",
  "SPUN",
  "SPUR",
  "STAR",
  "STAY",
  "STEM",
  "STEP",
  "STIR",
  "STOP",
  "SUCH",
  "SUCK",
  "SUIT",
  "SUNG",
  "SUNK",
  "SURE",
  "SURF",
  "SWAN",
  "SWAP",
  "SWAY",
  "SWIM",
  "TACK",
  "TAIL",
  "TAKE",
  "TALE",
  "TALK",
  "TALL",
  "TANK",
  "TAPE",
  "TAPS",
  "TASK",
  "TAXI",
  "TEAM",
  "TEAR",
  "TECH",
  "TEEN",
  "TELL",
  "TEND",
  "TENT",
  "TERM",
  "TEST",
  "TEXT",
  "THAN",
  "THAT",
  "THEM",
  "THEN",
  "THEY",
  "THIN",
  "THIS",
  "THOU",
  "THUS",
  "TICK",
  "TIDE",
  "TIDY",
  "TIER",
  "TILE",
  "TILL",
  "TILT",
  "TIME",
  "TINY",
  "TIRE",
  "TOBY",
  "TOLD",
  "TOLL",
  "TOMB",
  "TONE",
  "TONY",
  "TOOK",
  "TOOL",
  "TOPS",
  "TORE",
  "TORN",
  "TORT",
  "TOSS",
  "TOUR",
  "TOWN",
  "TRAP",
  "TRAY",
  "TREE",
  "TREK",
  "TRIM",
  "TRIO",
  "TRIP",
  "TROY",
  "TRUE",
  "TUBE",
  "TUCK",
  "TUNA",
  "TUNE",
  "TURF",
  "TURN",
  "TWIN",
  "TYPE",
  "UGLY",
  "UNIT",
  "UPON",
  "URGE",
  "USED",
  "USER",
  "VAIN",
  "VARY",
  "VAST",
  "VEIL",
  "VEIN",
  "VERB",
  "VERY",
  "VEST",
  "VETO",
  "VICE",
  "VIEW",
  "VINE",
  "VISA",
  "VOID",
  "VOTE",
  "WADE",
  "WAGE",
  "WAIT",
  "WAKE",
  "WALK",
  "WALL",
  "WANT",
  "WARD",
  "WARE",
  "WARM",
  "WARN",
  "WARY",
  "WASH",
  "WATT",
  "WAVE",
  "WAYS",
  "WEAK",
  "WEAR",
  "WEED",
  "WEEK",
  "WELL",
  "WENT",
  "WERE",
  "WEST",
  "WHAT",
  "WHEN",
  "WHIP",
  "WHOM",
  "WIDE",
  "WIFE",
  "WILD",
  "WILL",
  "WIND",
  "WINE",
  "WING",
  "WIPE",
  "WIRE",
  "WISE",
  "WISH",
  "WITH",
  "WOKE",
  "WOLF",
  "WOOD",
  "WOOL",
  "WORD",
  "WORE",
  "WORK",
  "WORM",
  "WORN",
  "WRAP",
  "YANG",
  "YARD",
  "YARN",
  "YEAH",
  "YEAR",
  "YOUR",
  "YUAN",
  "ZERO",
  "ZINC",
  "ZONE",
  "ZOOM",
];

export default FOUR_LETTER_WORDS;
