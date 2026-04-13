window.__armyBuilderAdviceData = {
  "factionNotes": [
    {
      "factionName": "Kerrigan's Swarm",
      "title": "Tournament package guidance",
      "notes": [
        "Bring this if you want the highest ceiling and expect slower or more static armies.",
        "Wild Mutation plus Omega Network is still the nastiest Zerg tempo engine in the current pool."
      ],
      "factionId": "zerg-kerrigans-swarm",
      "factionKey": "zerg"
    },
    {
      "factionName": "Zerg Swarm",
      "title": "Tournament package guidance",
      "notes": [
        "Bring this if you expect mirrors, marker-heavy games, or fields built to blunt alpha turns.",
        "Brood Instinct and Rapid Burrowing make this the cleaner denial-and-scoring Zerg shell."
      ],
      "factionId": "zerg-zerg-swarm",
      "factionKey": "zerg"
    },
    {
      "factionName": "Khalai",
      "title": "Tournament package guidance",
      "notes": [
        "This is the default Protoss tournament package.",
        "Forward Pylon plus Bound by the Khala is the most generally powerful Protoss framework right now."
      ],
      "factionId": "protoss-khalai",
      "factionKey": "protoss"
    },
    {
      "factionName": "Daelaam",
      "title": "Tournament package guidance",
      "notes": [
        "Use this as the anti-spike Protoss package when you expect bursty pressure.",
        "Daelaam is less proactive than Khalai, but much better at absorbing and resetting explosive turns."
      ],
      "factionId": "protoss-daelaam",
      "factionKey": "protoss"
    },
    {
      "factionName": "Terran Armed Forces",
      "title": "Tournament package guidance",
      "notes": [
        "This is the safest blind Terran package and the best Terran mirror package.",
        "Tactical Retreat and Terran Tenacity make it the most stable scoring and attrition shell."
      ],
      "factionId": "terran-armed-forces",
      "factionKey": "terran"
    },
    {
      "factionName": "Raynor's Raiders",
      "title": "Tournament package guidance",
      "notes": [
        "Use this as the punish package when you expect weak screening or overcommitted opponents.",
        "It is still dangerous, but it is a meta call rather than the safest blind pick."
      ],
      "factionId": "terran-raynors-raiders",
      "factionKey": "terran"
    }
  ],
  "packages": [
    {
      "id": "terran-armed-forces-standard-combined-arms",
      "scaleId": "standard",
      "factionName": "Terran Armed Forces",
      "title": "Combined-Arms Attrition",
      "minerals": 2000,
      "gas": 200,
      "tacticalCards": [
        "Factory",
        "Armory",
        "Engineering Bay",
        "Barracks (Tech Lab)",
        "Academy",
        "Orbital Command"
      ],
      "units": [
        {
          "name": "Goliath",
          "unitId": "terran-goliath",
          "upgradeIds": []
        },
        {
          "name": "Goliath",
          "unitId": "terran-goliath",
          "upgradeIds": []
        },
        {
          "name": "Marauder",
          "models": 4,
          "upgrades": [
            "Kinetic Foam",
            "Laser Targeting Systems"
          ],
          "unitId": "terran-marauder",
          "upgradeIds": [
            "terran-marauder-kinetic-foam",
            "terran-marauder-laser-targeting-systems"
          ]
        },
        {
          "name": "Marine",
          "models": 9,
          "upgrades": [
            "Bayonet",
            "Combat Shield",
            "Rocket Launcher",
            "Slugthrower"
          ],
          "unitId": "terran-marine",
          "upgradeIds": [
            "terran-marine-bayonet",
            "terran-marine-combat-shield",
            "terran-marine-rocket-launcher",
            "terran-marine-slugthrower"
          ]
        },
        {
          "name": "Marine",
          "models": 6,
          "upgrades": [
            "AGG-12",
            "Bayonet",
            "Combat Shield",
            "Grenades - Frag",
            "Rocket Launcher",
            "Slugthrower"
          ],
          "unitId": "terran-marine",
          "upgradeIds": [
            "terran-marine-agg-12",
            "terran-marine-bayonet",
            "terran-marine-combat-shield",
            "terran-marine-grenades-frag",
            "terran-marine-rocket-launcher",
            "terran-marine-slugthrower"
          ]
        },
        {
          "name": "Medic",
          "models": 3,
          "upgrades": [
            "A-13 Flash Grenade Launcher",
            "Advanced Medic Facilities",
            "Stabilizer Medpacks"
          ],
          "unitId": "terran-medic",
          "upgradeIds": [
            "terran-medic-a-13-flash-grenade-launcher",
            "terran-medic-advanced-medic-facilities",
            "terran-medic-stabilizer-medpacks"
          ]
        },
        {
          "name": "Medic",
          "models": 3,
          "upgrades": [
            "A-13 Flash Grenade Launcher",
            "Advanced Medic Facilities",
            "Stabilizer Medpacks"
          ],
          "unitId": "terran-medic",
          "upgradeIds": [
            "terran-medic-a-13-flash-grenade-launcher",
            "terran-medic-advanced-medic-facilities",
            "terran-medic-stabilizer-medpacks"
          ]
        },
        {
          "name": "Medic",
          "models": 3,
          "upgrades": [
            "A-13 Flash Grenade Launcher",
            "Advanced Medic Facilities",
            "Stabilizer Medpacks"
          ],
          "unitId": "terran-medic",
          "upgradeIds": [
            "terran-medic-a-13-flash-grenade-launcher",
            "terran-medic-advanced-medic-facilities",
            "terran-medic-stabilizer-medpacks"
          ]
        }
      ],
      "summary": "The cleanest real Terran list in the pool: mech quality, upgraded infantry, and triple Medic sustain in one steady package.",
      "pilotNotes": "Deploy bodies first, keep the Goliaths safe until their firing lanes matter, and let the Medics turn even trades into favorable ones.",
      "factionId": "terran-armed-forces",
      "factionKey": "terran",
      "tacticalCardIds": [
        "factory",
        "armory",
        "engineering-bay",
        "barracks-tech-lab",
        "academy",
        "orbital-command"
      ]
    },
    {
      "id": "raynors-raiders-standard-pressure",
      "scaleId": "standard",
      "factionName": "Raynor's Raiders",
      "title": "Pressure and Reserve Abuse",
      "minerals": 2000,
      "gas": 190,
      "tacticalCards": [
        "Barracks (Proxy)",
        "Dropship",
        "Barracks (Tech Lab)",
        "Engineering Bay",
        "Academy"
      ],
      "units": [
        {
          "name": "Jim Raynor",
          "unitId": "terran-jim-raynor",
          "upgradeIds": []
        },
        {
          "name": "Raynor's Raider (Marine)",
          "models": 6,
          "unitId": "terran-raynor-s-raider-marine",
          "upgradeIds": []
        },
        {
          "name": "Marine",
          "models": 9,
          "upgrades": [
            "AGG-12",
            "Bayonet",
            "Combat Shield",
            "Grenades - Frag",
            "Rocket Launcher",
            "Slugthrower"
          ],
          "unitId": "terran-marine",
          "upgradeIds": [
            "terran-marine-agg-12",
            "terran-marine-bayonet",
            "terran-marine-combat-shield",
            "terran-marine-grenades-frag",
            "terran-marine-rocket-launcher",
            "terran-marine-slugthrower"
          ]
        },
        {
          "name": "Marine",
          "models": 9,
          "upgrades": [
            "AGG-12",
            "Bayonet",
            "Combat Shield",
            "Grenades - Frag",
            "Rocket Launcher",
            "Slugthrower"
          ],
          "unitId": "terran-marine",
          "upgradeIds": [
            "terran-marine-agg-12",
            "terran-marine-bayonet",
            "terran-marine-combat-shield",
            "terran-marine-grenades-frag",
            "terran-marine-rocket-launcher",
            "terran-marine-slugthrower"
          ]
        },
        {
          "name": "Marauder",
          "models": 4,
          "upgrades": [
            "Kinetic Foam",
            "Laser Targeting Systems",
            "Veteran of Tarsonis"
          ],
          "unitId": "terran-marauder",
          "upgradeIds": [
            "terran-marauder-kinetic-foam",
            "terran-marauder-laser-targeting-systems",
            "terran-marauder-veteran-of-tarsonis"
          ]
        },
        {
          "name": "Medic",
          "models": 3,
          "upgrades": [
            "A-13 Flash Grenade Launcher",
            "Advanced Medic Facilities",
            "Stabilizer Medpacks"
          ],
          "unitId": "terran-medic",
          "upgradeIds": [
            "terran-medic-a-13-flash-grenade-launcher",
            "terran-medic-advanced-medic-facilities",
            "terran-medic-stabilizer-medpacks"
          ]
        },
        {
          "name": "Medic",
          "models": 3,
          "upgrades": [
            "A-13 Flash Grenade Launcher",
            "Advanced Medic Facilities",
            "Stabilizer Medpacks"
          ],
          "unitId": "terran-medic",
          "upgradeIds": [
            "terran-medic-a-13-flash-grenade-launcher",
            "terran-medic-advanced-medic-facilities",
            "terran-medic-stabilizer-medpacks"
          ]
        }
      ],
      "summary": "The best Terran tempo shell: reserve geometry, deployment pressure, and biological pressure stacked together.",
      "pilotNotes": "Use the threat of off-angle deployment before you actually commit. Make the opponent screen awkwardly, then hit where the line is thin.",
      "factionId": "terran-raynors-raiders",
      "factionKey": "terran",
      "tacticalCardIds": [
        "barracks-proxy",
        "dropship",
        "barracks-tech-lab",
        "engineering-bay",
        "academy"
      ]
    },
    {
      "id": "khalai-standard-tempo",
      "scaleId": "standard",
      "factionName": "Khalai",
      "title": "Tempo Control Package",
      "minerals": 2000,
      "gas": 200,
      "tacticalCards": [
        "Power Field",
        "Warp Gate",
        "Twilight Council",
        "Observer",
        "Forge",
        "Gateway"
      ],
      "units": [
        {
          "name": "Artanis",
          "unitId": "protoss-artanis",
          "upgradeIds": []
        },
        {
          "name": "Stalker",
          "models": 2,
          "upgrades": [
            "Fury of the Nerazim"
          ],
          "unitId": "protoss-stalker",
          "upgradeIds": [
            "protoss-stalker-fury-of-the-nerazim"
          ]
        },
        {
          "name": "Stalker",
          "models": 1,
          "upgrades": [
            "Fury of the Nerazim"
          ],
          "unitId": "protoss-stalker",
          "upgradeIds": [
            "protoss-stalker-fury-of-the-nerazim"
          ]
        },
        {
          "name": "Praetor Guard (Zealot)",
          "models": 3,
          "unitId": "protoss-praetor-guard-zealot",
          "upgradeIds": []
        },
        {
          "name": "Zealot",
          "models": 3,
          "upgrades": [
            "Leg Enhancements",
            "My Life for Aiur",
            "We Stand as One",
            "Zealous Round"
          ],
          "unitId": "protoss-zealot",
          "upgradeIds": [
            "protoss-zealot-leg-enhancements",
            "protoss-zealot-my-life-for-aiur",
            "protoss-zealot-we-stand-as-one",
            "protoss-zealot-zealous-round"
          ]
        },
        {
          "name": "Zealot",
          "models": 3,
          "upgrades": [
            "Leg Enhancements",
            "My Life for Aiur",
            "We Stand as One",
            "Zealous Round"
          ],
          "unitId": "protoss-zealot",
          "upgradeIds": [
            "protoss-zealot-leg-enhancements",
            "protoss-zealot-my-life-for-aiur",
            "protoss-zealot-we-stand-as-one",
            "protoss-zealot-zealous-round"
          ]
        },
        {
          "name": "Adept",
          "models": 4,
          "upgrades": [
            "Glaive Strike",
            "Guidance",
            "Resonating Glaives"
          ],
          "unitId": "protoss-adept",
          "upgradeIds": [
            "protoss-adept-glaive-strike",
            "protoss-adept-guidance",
            "protoss-adept-resonating-glaives"
          ]
        },
        {
          "name": "Sentry",
          "models": 2,
          "upgrades": [
            "Hallucination",
            "Solid-Field Projectors"
          ],
          "unitId": "protoss-sentry",
          "upgradeIds": [
            "protoss-sentry-hallucination",
            "protoss-sentry-solid-field-projectors"
          ]
        },
        {
          "name": "Sentry",
          "models": 2,
          "upgrades": [
            "Hallucination",
            "Solid-Field Projectors"
          ],
          "unitId": "protoss-sentry",
          "upgradeIds": [
            "protoss-sentry-hallucination",
            "protoss-sentry-solid-field-projectors"
          ]
        }
      ],
      "summary": "The strongest Protoss all-comers list: free infrastructure, extra activation leverage, and threats in every zone.",
      "pilotNotes": "Build the turn around Bound by the Khala. Think of it as choosing where the phase breaks, not as a bonus activation.",
      "factionId": "protoss-khalai",
      "factionKey": "protoss",
      "tacticalCardIds": [
        "power-field",
        "warp-gate",
        "twilight-council",
        "observer",
        "forge",
        "gateway"
      ]
    },
    {
      "id": "daelaam-standard-control",
      "scaleId": "standard",
      "factionName": "Daelaam",
      "title": "Control and Attrition",
      "minerals": 2000,
      "gas": 190,
      "tacticalCards": [
        "Power Field",
        "Twilight Council",
        "Forge",
        "Gate Chronoboosted",
        "Warp Gate"
      ],
      "units": [
        {
          "name": "Stalker",
          "models": 2,
          "upgrades": [
            "Fury of the Nerazim",
            "Path of Shadows"
          ],
          "unitId": "protoss-stalker",
          "upgradeIds": [
            "protoss-stalker-fury-of-the-nerazim",
            "protoss-stalker-path-of-shadows"
          ]
        },
        {
          "name": "Stalker",
          "models": 1,
          "upgrades": [
            "Fury of the Nerazim",
            "Path of Shadows"
          ],
          "unitId": "protoss-stalker",
          "upgradeIds": [
            "protoss-stalker-fury-of-the-nerazim",
            "protoss-stalker-path-of-shadows"
          ]
        },
        {
          "name": "Praetor Guard (Zealot)",
          "models": 3,
          "unitId": "protoss-praetor-guard-zealot",
          "upgradeIds": []
        },
        {
          "name": "Zealot",
          "models": 3,
          "upgrades": [
            "Leg Enhancements",
            "My Life for Aiur",
            "We Stand as One",
            "Zealous Round"
          ],
          "unitId": "protoss-zealot",
          "upgradeIds": [
            "protoss-zealot-leg-enhancements",
            "protoss-zealot-my-life-for-aiur",
            "protoss-zealot-we-stand-as-one",
            "protoss-zealot-zealous-round"
          ]
        },
        {
          "name": "Zealot",
          "models": 3,
          "upgrades": [
            "Leg Enhancements",
            "My Life for Aiur",
            "We Stand as One",
            "Zealous Round"
          ],
          "unitId": "protoss-zealot",
          "upgradeIds": [
            "protoss-zealot-leg-enhancements",
            "protoss-zealot-my-life-for-aiur",
            "protoss-zealot-we-stand-as-one",
            "protoss-zealot-zealous-round"
          ]
        },
        {
          "name": "Adept",
          "models": 4,
          "upgrades": [
            "Glaive Strike",
            "Resonating Glaives"
          ],
          "unitId": "protoss-adept",
          "upgradeIds": [
            "protoss-adept-glaive-strike",
            "protoss-adept-resonating-glaives"
          ]
        },
        {
          "name": "Adept",
          "models": 4,
          "upgrades": [
            "Glaive Strike",
            "Guidance",
            "Resonating Glaives"
          ],
          "unitId": "protoss-adept",
          "upgradeIds": [
            "protoss-adept-glaive-strike",
            "protoss-adept-guidance",
            "protoss-adept-resonating-glaives"
          ]
        },
        {
          "name": "Sentry",
          "models": 2,
          "upgrades": [
            "Hallucination",
            "Solid-Field Projectors"
          ],
          "unitId": "protoss-sentry",
          "upgradeIds": [
            "protoss-sentry-hallucination",
            "protoss-sentry-solid-field-projectors"
          ]
        },
        {
          "name": "Sentry",
          "models": 2,
          "upgrades": [
            "Hallucination",
            "Solid-Field Projectors"
          ],
          "unitId": "protoss-sentry",
          "upgradeIds": [
            "protoss-sentry-hallucination",
            "protoss-sentry-solid-field-projectors"
          ]
        }
      ],
      "summary": "The better anti-spike Protoss shell: flatter damage intake, cleaner resets, and more forgiving long-event play.",
      "pilotNotes": "Play the middle game patiently. Make the opponent overcommit, then use Daelaam durability and recall pressure to unwind their good turn.",
      "factionId": "protoss-daelaam",
      "factionKey": "protoss",
      "tacticalCardIds": [
        "power-field",
        "twilight-council",
        "forge",
        "gate-chronoboosted",
        "warp-gate"
      ]
    },
    {
      "id": "kerrigans-swarm-standard-all-comers",
      "scaleId": "standard",
      "factionName": "Kerrigan's Swarm",
      "title": "All-Comers Swarm",
      "minerals": 2000,
      "gas": 200,
      "tacticalCards": [
        "Malignant Creep",
        "Hydralisk Den",
        "Hatchery",
        "Overlord",
        "Overseer",
        "Evolution Chamber",
        "Roach Warren"
      ],
      "units": [
        {
          "name": "Kerrigan",
          "unitId": "zerg-kerrigan",
          "upgradeIds": []
        },
        {
          "name": "Kerrigan Swarm Raptor (Zergling)",
          "models": 6,
          "unitId": "zerg-kerrigan-swarm-raptor-zergling",
          "upgradeIds": []
        },
        {
          "name": "Hydralisk",
          "models": 4,
          "upgrades": [
            "Ancillary Carapace",
            "Burrow Ambush",
            "Grooved Spines",
            "Lurking"
          ],
          "unitId": "zerg-hydralisk",
          "upgradeIds": [
            "zerg-hydralisk-ancillary-carapace",
            "zerg-hydralisk-burrow-ambush",
            "zerg-hydralisk-grooved-spines",
            "zerg-hydralisk-lurking"
          ]
        },
        {
          "name": "Queen",
          "upgrades": [
            "Creep Speed"
          ],
          "unitId": "zerg-queen",
          "upgradeIds": [
            "zerg-queen-creep-speed"
          ]
        },
        {
          "name": "Corpser (Roach)",
          "models": 3,
          "upgrades": [
            "Glial Reconstitution",
            "Tunneling Claws"
          ],
          "unitId": "zerg-corpser-roach",
          "upgradeIds": [
            "zerg-corpser-roach-glial-reconstitution",
            "zerg-corpser-roach-tunneling-claws"
          ]
        },
        {
          "name": "Vile (Roach)",
          "models": 3,
          "upgrades": [
            "Hydriodic Bile",
            "Tunneling Claws"
          ],
          "unitId": "zerg-vile-roach",
          "upgradeIds": [
            "zerg-vile-roach-hydriodic-bile",
            "zerg-vile-roach-tunneling-claws"
          ]
        },
        {
          "name": "Roach",
          "models": 3,
          "upgrades": [
            "Glial Reconstitution"
          ],
          "unitId": "zerg-roach",
          "upgradeIds": [
            "zerg-roach-glial-reconstitution"
          ]
        },
        {
          "name": "Zergling",
          "models": 18,
          "upgrades": [
            "Adrenal Glands"
          ],
          "unitId": "zerg-zergling",
          "upgradeIds": [
            "zerg-zergling-adrenal-glands"
          ]
        }
      ],
      "summary": "The best Zerg all-phase list: Kerrigan, Hydras, Roach variants, and creep support in one layered shell.",
      "pilotNotes": "Do not treat this like a pure rush list. Build creep, threaten burrow and arrival vectors, then spike the turn where Kerrigan and the Hydras both connect.",
      "factionId": "zerg-kerrigans-swarm",
      "factionKey": "zerg",
      "tacticalCardIds": [
        "malignant-creep",
        "hydralisk-den",
        "hatchery",
        "overlord",
        "overseer",
        "evolution-chamber",
        "roach-warren"
      ]
    },
    {
      "id": "zerg-swarm-standard-board-flood",
      "scaleId": "standard",
      "factionName": "Zerg Swarm",
      "title": "Board Flood with Teeth",
      "minerals": 2000,
      "gas": 200,
      "tacticalCards": [
        "Malignant Creep",
        "Hydralisk Den",
        "Hatchery",
        "Evolution Chamber",
        "Spawning Pool",
        "Overseer",
        "Overlord"
      ],
      "units": [
        {
          "name": "Hydralisk",
          "models": 2,
          "unitId": "zerg-hydralisk",
          "upgradeIds": []
        },
        {
          "name": "Raptor (Zergling)",
          "models": 18,
          "unitId": "zerg-raptor-zergling",
          "upgradeIds": []
        },
        {
          "name": "Swarmling (Zergling)",
          "models": 18,
          "unitId": "zerg-swarmling-zergling",
          "upgradeIds": []
        },
        {
          "name": "Corpser (Roach)",
          "models": 3,
          "upgrades": [
            "Burrow Ambush",
            "Glial Reconstitution",
            "Hydriodic Bile"
          ],
          "unitId": "zerg-corpser-roach",
          "upgradeIds": [
            "zerg-corpser-roach-burrow-ambush",
            "zerg-corpser-roach-glial-reconstitution",
            "zerg-corpser-roach-hydriodic-bile"
          ]
        },
        {
          "name": "Vile (Roach)",
          "models": 3,
          "upgrades": [
            "Burrow Ambush",
            "Glial Reconstitution",
            "Hydriodic Bile",
            "Tunneling Claws"
          ],
          "unitId": "zerg-vile-roach",
          "upgradeIds": [
            "zerg-vile-roach-burrow-ambush",
            "zerg-vile-roach-glial-reconstitution",
            "zerg-vile-roach-hydriodic-bile",
            "zerg-vile-roach-tunneling-claws"
          ]
        },
        {
          "name": "Roach",
          "models": 3,
          "upgrades": [
            "Burrow Ambush",
            "Glial Reconstitution",
            "Hydriodic Bile",
            "Tunneling Claws"
          ],
          "unitId": "zerg-roach",
          "upgradeIds": [
            "zerg-roach-burrow-ambush",
            "zerg-roach-glial-reconstitution",
            "zerg-roach-hydriodic-bile",
            "zerg-roach-tunneling-claws"
          ]
        },
        {
          "name": "Queen",
          "upgrades": [
            "Creep Speed",
            "Domineering Presence"
          ],
          "unitId": "zerg-queen",
          "upgradeIds": [
            "zerg-queen-creep-speed",
            "zerg-queen-domineering-presence"
          ]
        },
        {
          "name": "Zergling",
          "models": 18,
          "upgrades": [
            "Adrenal Glands",
            "Burrow Ambush",
            "Shredding Claws"
          ],
          "unitId": "zerg-zergling",
          "upgradeIds": [
            "zerg-zergling-adrenal-glands",
            "zerg-zergling-burrow-ambush",
            "zerg-zergling-shredding-claws"
          ]
        }
      ],
      "summary": "The classic swarm shell, but with enough quality pieces that it does not collapse into just a pile of bodies.",
      "pilotNotes": "Flood space early, force the opponent to waste activations on cleanup, and let the Roach block plus Queen own the real center.",
      "factionId": "zerg-zerg-swarm",
      "factionKey": "zerg",
      "tacticalCardIds": [
        "malignant-creep",
        "hydralisk-den",
        "hatchery",
        "evolution-chamber",
        "spawning-pool",
        "overseer",
        "overlord"
      ]
    },
    {
      "id": "terran-armed-forces-skirmish-brick",
      "scaleId": "skirmish",
      "factionName": "Terran Armed Forces",
      "title": "Skirmish Combined-Arms Brick",
      "minerals": 1000,
      "gas": 65,
      "tacticalCards": [
        "Factory",
        "Engineering Bay"
      ],
      "units": [
        {
          "name": "Goliath",
          "upgrades": [
            "Ares-Class Targeting System",
            "Scatter Missiles"
          ],
          "unitId": "terran-goliath",
          "upgradeIds": [
            "terran-goliath-ares-class-targeting-system",
            "terran-goliath-scatter-missiles"
          ]
        },
        {
          "name": "Marine",
          "models": 9,
          "upgrades": [
            "AGG-12",
            "Bayonet",
            "Combat Shield",
            "Grenades - Frag",
            "Slugthrower"
          ],
          "unitId": "terran-marine",
          "upgradeIds": [
            "terran-marine-agg-12",
            "terran-marine-bayonet",
            "terran-marine-combat-shield",
            "terran-marine-grenades-frag",
            "terran-marine-slugthrower"
          ]
        },
        {
          "name": "Marine",
          "models": 6,
          "upgrades": [
            "AGG-12",
            "Bayonet",
            "Combat Shield",
            "Grenades - Frag",
            "Slugthrower"
          ],
          "unitId": "terran-marine",
          "upgradeIds": [
            "terran-marine-agg-12",
            "terran-marine-bayonet",
            "terran-marine-combat-shield",
            "terran-marine-grenades-frag",
            "terran-marine-slugthrower"
          ]
        },
        {
          "name": "Medic",
          "models": 3,
          "upgrades": [
            "Advanced Medic Facilities",
            "A-13 Flash Grenade Launcher",
            "Stabilizer Medpacks"
          ],
          "unitId": "terran-medic",
          "upgradeIds": [
            "terran-medic-advanced-medic-facilities",
            "terran-medic-a-13-flash-grenade-launcher",
            "terran-medic-stabilizer-medpacks"
          ]
        }
      ],
      "summary": "A small-board Terran shell with one hard elite anchor, two efficient infantry bodies, and one overperforming support piece.",
      "pilotNotes": "Let the upgraded Goliath project threat while Engineering Bay keeps the Marines trading above rate.",
      "factionId": "terran-armed-forces",
      "factionKey": "terran",
      "tacticalCardIds": [
        "factory",
        "engineering-bay"
      ]
    },
    {
      "id": "raynors-raiders-skirmish-tempo",
      "scaleId": "skirmish",
      "factionName": "Raynor's Raiders",
      "title": "Skirmish Tempo Hit",
      "minerals": 1000,
      "gas": 80,
      "tacticalCards": [
        "Barracks (Proxy)",
        "Dropship"
      ],
      "units": [
        {
          "name": "Jim Raynor",
          "unitId": "terran-jim-raynor",
          "upgradeIds": []
        },
        {
          "name": "Raynor's Raider (Marine)",
          "models": 6,
          "unitId": "terran-raynor-s-raider-marine",
          "upgradeIds": []
        },
        {
          "name": "Marine",
          "models": 9,
          "upgrades": [
            "Rocket Launcher",
            "Bayonet",
            "Combat Shield",
            "Grenades - Frag"
          ],
          "unitId": "terran-marine",
          "upgradeIds": [
            "terran-marine-rocket-launcher",
            "terran-marine-bayonet",
            "terran-marine-combat-shield",
            "terran-marine-grenades-frag"
          ]
        },
        {
          "name": "Medic",
          "models": 3,
          "upgrades": [
            "Advanced Medic Facilities",
            "A-13 Flash Grenade Launcher",
            "Stabilizer Medpacks"
          ],
          "unitId": "terran-medic",
          "upgradeIds": [
            "terran-medic-advanced-medic-facilities",
            "terran-medic-a-13-flash-grenade-launcher",
            "terran-medic-stabilizer-medpacks"
          ]
        }
      ],
      "summary": "The strongest Terran skirmish pressure package if you want to win on position, reserve timing, and awkward entry angles.",
      "pilotNotes": "Use the threat of proxy and dropship geometry to distort deployment before you commit your best hit.",
      "factionId": "terran-raynors-raiders",
      "factionKey": "terran",
      "tacticalCardIds": [
        "barracks-proxy",
        "dropship"
      ]
    },
    {
      "id": "khalai-skirmish-tempo",
      "scaleId": "skirmish",
      "factionName": "Khalai",
      "title": "Skirmish Tempo Control",
      "minerals": 1000,
      "gas": 55,
      "tacticalCards": [
        "Forge",
        "Gateway"
      ],
      "units": [
        {
          "name": "Artanis",
          "unitId": "protoss-artanis",
          "upgradeIds": []
        },
        {
          "name": "Stalker",
          "models": 2,
          "upgrades": [
            "Fury of the Nerazim",
            "Path of Shadows"
          ],
          "unitId": "protoss-stalker",
          "upgradeIds": [
            "protoss-stalker-fury-of-the-nerazim",
            "protoss-stalker-path-of-shadows"
          ]
        },
        {
          "name": "Zealot",
          "models": 3,
          "upgrades": [
            "Leg Enhancements",
            "My Life for Aiur",
            "We Stand as One",
            "Zealous Round"
          ],
          "unitId": "protoss-zealot",
          "upgradeIds": [
            "protoss-zealot-leg-enhancements",
            "protoss-zealot-my-life-for-aiur",
            "protoss-zealot-we-stand-as-one",
            "protoss-zealot-zealous-round"
          ]
        },
        {
          "name": "Adept",
          "models": 4,
          "upgrades": [
            "Glaive Strike",
            "Guidance",
            "Resonating Glaives"
          ],
          "unitId": "protoss-adept",
          "upgradeIds": [
            "protoss-adept-glaive-strike",
            "protoss-adept-guidance",
            "protoss-adept-resonating-glaives"
          ]
        }
      ],
      "summary": "A no-waste Protoss skirmish list with a bully hero, elite scalpel, reliable charge body, and ranged manipulation piece.",
      "pilotNotes": "On the small table, every activation matters more. Khalai is about turning that tighter action economy into a decisive local fight.",
      "factionId": "protoss-khalai",
      "factionKey": "protoss",
      "tacticalCardIds": [
        "forge",
        "gateway"
      ]
    },
    {
      "id": "daelaam-skirmish-control",
      "scaleId": "skirmish",
      "factionName": "Daelaam",
      "title": "Skirmish Control Shell",
      "minerals": 1000,
      "gas": 80,
      "tacticalCards": [
        "Gate Chronoboosted",
        "Twilight Council"
      ],
      "units": [
        {
          "name": "Stalker",
          "models": 1,
          "upgrades": [
            "Fury of the Nerazim",
            "Path of Shadows"
          ],
          "unitId": "protoss-stalker",
          "upgradeIds": [
            "protoss-stalker-fury-of-the-nerazim",
            "protoss-stalker-path-of-shadows"
          ]
        },
        {
          "name": "Stalker",
          "models": 1,
          "upgrades": [
            "Fury of the Nerazim",
            "Path of Shadows"
          ],
          "unitId": "protoss-stalker",
          "upgradeIds": [
            "protoss-stalker-fury-of-the-nerazim",
            "protoss-stalker-path-of-shadows"
          ]
        },
        {
          "name": "Zealot",
          "models": 3,
          "upgrades": [
            "Leg Enhancements",
            "My Life for Aiur",
            "We Stand as One",
            "Zealous Round"
          ],
          "unitId": "protoss-zealot",
          "upgradeIds": [
            "protoss-zealot-leg-enhancements",
            "protoss-zealot-my-life-for-aiur",
            "protoss-zealot-we-stand-as-one",
            "protoss-zealot-zealous-round"
          ]
        },
        {
          "name": "Adept",
          "models": 4,
          "upgrades": [
            "Glaive Strike",
            "Guidance",
            "Resonating Glaives"
          ],
          "unitId": "protoss-adept",
          "upgradeIds": [
            "protoss-adept-glaive-strike",
            "protoss-adept-guidance",
            "protoss-adept-resonating-glaives"
          ]
        },
        {
          "name": "Sentry",
          "models": 2,
          "upgrades": [
            "Hallucination",
            "Solid-Field Projectors"
          ],
          "unitId": "protoss-sentry",
          "upgradeIds": [
            "protoss-sentry-hallucination",
            "protoss-sentry-solid-field-projectors"
          ]
        }
      ],
      "summary": "The more technical Protoss skirmish list: less blunt than Khalai, but much better at space control and anti-spike play.",
      "pilotNotes": "Use the double solo Stalkers and Sentry to create angle pressure, then let Daelaam durability make the opponent's bad trades stick.",
      "factionId": "protoss-daelaam",
      "factionKey": "protoss",
      "tacticalCardIds": [
        "gate-chronoboosted",
        "twilight-council"
      ]
    },
    {
      "id": "kerrigans-swarm-skirmish-alpha",
      "scaleId": "skirmish",
      "factionName": "Kerrigan's Swarm",
      "title": "Skirmish Alpha Pressure",
      "minerals": 1000,
      "gas": 60,
      "tacticalCards": [
        "Malignant Creep",
        "Spawning Pool",
        "Roach Warren"
      ],
      "units": [
        {
          "name": "Kerrigan",
          "unitId": "zerg-kerrigan",
          "upgradeIds": []
        },
        {
          "name": "Kerrigan Swarm Raptor (Zergling)",
          "models": 6,
          "unitId": "zerg-kerrigan-swarm-raptor-zergling",
          "upgradeIds": []
        },
        {
          "name": "Raptor (Zergling)",
          "models": 12,
          "upgrades": [
            "Adrenal Glands",
            "Burrow Ambush",
            "Shredding Claws"
          ],
          "unitId": "zerg-raptor-zergling",
          "upgradeIds": [
            "zerg-raptor-zergling-adrenal-glands",
            "zerg-raptor-zergling-burrow-ambush",
            "zerg-raptor-zergling-shredding-claws"
          ]
        },
        {
          "name": "Roach",
          "models": 3,
          "upgrades": [
            "Hydriodic Bile",
            "Tunneling Claws"
          ],
          "unitId": "zerg-roach",
          "upgradeIds": [
            "zerg-roach-hydriodic-bile",
            "zerg-roach-tunneling-claws"
          ]
        }
      ],
      "summary": "The most explosive skirmish list in the bunch: tempo, angle pressure, and immediate melee threat on a 36 by 36 table.",
      "pilotNotes": "Do not waste the spike. Set up creep and angles first, then hit the turn where Kerrigan and both Raptor threats become impossible to screen.",
      "factionId": "zerg-kerrigans-swarm",
      "factionKey": "zerg",
      "tacticalCardIds": [
        "malignant-creep",
        "spawning-pool",
        "roach-warren"
      ]
    },
    {
      "id": "zerg-swarm-skirmish-board-control",
      "scaleId": "skirmish",
      "factionName": "Zerg Swarm",
      "title": "Skirmish Board-Control Swarm",
      "minerals": 1000,
      "gas": 65,
      "tacticalCards": [
        "Accelerating Creep",
        "Hydralisk Den",
        "Evolution Chamber"
      ],
      "units": [
        {
          "name": "Hydralisk",
          "models": 2,
          "upgrades": [
            "Ancillary Carapace",
            "Grooved Spines"
          ],
          "unitId": "zerg-hydralisk",
          "upgradeIds": [
            "zerg-hydralisk-ancillary-carapace",
            "zerg-hydralisk-grooved-spines"
          ]
        },
        {
          "name": "Queen",
          "upgrades": [
            "Creep Speed"
          ],
          "unitId": "zerg-queen",
          "upgradeIds": [
            "zerg-queen-creep-speed"
          ]
        },
        {
          "name": "Zergling",
          "models": 12,
          "upgrades": [
            "Adrenal Glands",
            "Burrow Ambush",
            "Shredding Claws"
          ],
          "unitId": "zerg-zergling",
          "upgradeIds": [
            "zerg-zergling-adrenal-glands",
            "zerg-zergling-burrow-ambush",
            "zerg-zergling-shredding-claws"
          ]
        },
        {
          "name": "Roach",
          "models": 3,
          "upgrades": [
            "Glial Reconstitution",
            "Hydriodic Bile",
            "Tunneling Claws"
          ],
          "unitId": "zerg-roach",
          "upgradeIds": [
            "zerg-roach-glial-reconstitution",
            "zerg-roach-hydriodic-bile",
            "zerg-roach-tunneling-claws"
          ]
        },
        {
          "name": "Vile (Roach)",
          "models": 3,
          "unitId": "zerg-vile-roach",
          "upgradeIds": []
        }
      ],
      "summary": "The stronger scoring-oriented Zerg skirmish shell: creep speed, Queen utility, ranged support, and sturdy midfield bodies.",
      "pilotNotes": "Own space first. This list wins when the opponent spends activations cleaning pressure while your tougher pieces sit on the important ground.",
      "factionId": "zerg-zerg-swarm",
      "factionKey": "zerg",
      "tacticalCardIds": [
        "accelerating-creep",
        "hydralisk-den",
        "evolution-chamber"
      ]
    }
  ]
};
