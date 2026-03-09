// Tibia Data - Dados completos dos equipamentos e builds
export const tibiaData = {
  equipment: [
    // ===== ARMAS KNIGHT - SWORDS =====
    { 
      id: 1, 
      name: 'Soulcutter', 
      type: 'sword', 
      rarity: 'legendary', 
      level: 400, 
      classes: ['Knight'],
      stats: { attack: 67, magic: 4, accuracy: 6 },
      description: 'Uma das melhores espadas single-target do Tibia' 
    },
    { 
      id: 2, 
      name: 'Spiritthorn Sword', 
      type: 'sword', 
      rarity: 'epic', 
      level: 150, 
      classes: ['Knight'],
      stats: { attack: 70, magic: 3 },
      description: 'Espada mística com excelente combinação ataque/defesa' 
    },
    { 
      id: 3, 
      name: 'Falcon Longsword', 
      type: 'sword', 
      rarity: 'epic', 
      level: 300, 
      classes: ['Knight'],
      stats: { attack: 63, magic: 3 },
      description: 'Espada dos Falcon Knights, equipamento de elite' 
    },
    { 
      id: 4, 
      name: 'Lion Longsword', 
      type: 'sword', 
      rarity: 'rare', 
      level: 270, 
      classes: ['Knight'],
      stats: { attack: 61, magic: 2 },
      description: 'Espada dos Lion Knights, boa opção mid-level' 
    },
    { 
      id: 5, 
      name: 'Bright Sword', 
      type: 'sword', 
      rarity: 'rare', 
      level: 30, 
      classes: ['Knight'],
      stats: { attack: 39, magic: 1 },
      description: 'Espada brilhante com poder mágico' 
    },
    { 
      id: 6, 
      name: 'Fire Sword', 
      type: 'sword', 
      rarity: 'epic', 
      level: 35, 
      classes: ['Knight'],
      stats: { attack: 42, magic: 2 },
      description: 'Espada flamejante com dano de fogo' 
    },
    // ===== ARMAS KNIGHT - AXES =====
    { 
      id: 7, 
      name: 'Soulbiter', 
      type: 'axe', 
      rarity: 'legendary', 
      level: 400, 
      classes: ['Knight'],
      stats: { attack: 67, magic: 4 },
      description: 'Melhor machado single-target do Tibia' 
    },
    { 
      id: 8, 
      name: 'Falcon Battleaxe', 
      type: 'axe', 
      rarity: 'epic', 
      level: 300, 
      classes: ['Knight'],
      stats: { attack: 63, magic: 3 },
      description: 'Machado dos Falcon Knights' 
    },
    { 
      id: 9, 
      name: 'Lion Axe', 
      type: 'axe', 
      rarity: 'rare', 
      level: 270, 
      classes: ['Knight'],
      stats: { attack: 61, magic: 2 },
      description: 'Machado dos Lion Knights' 
    },
    { 
      id: 10, 
      name: 'Fire Axe', 
      type: 'axe', 
      rarity: 'epic', 
      level: 35, 
      classes: ['Knight'],
      stats: { attack: 45, magic: 2 },
      description: 'Machado flamejante poderoso' 
    },
    // ===== ARMAS KNIGHT - CLUBS =====
    { 
      id: 11, 
      name: 'Soulmaimer', 
      type: 'club', 
      rarity: 'legendary', 
      level: 400, 
      classes: ['Knight'],
      stats: { attack: 67, magic: 4 },
      description: 'Melhor clava do Tibia' 
    },
    { 
      id: 12, 
      name: 'Falcon Mace', 
      type: 'club', 
      rarity: 'epic', 
      level: 300, 
      classes: ['Knight'],
      stats: { attack: 63, magic: 3 },
      description: 'Clava dos Falcon Knights' 
    },
    { 
      id: 13, 
      name: 'Lion Hammer', 
      type: 'club', 
      rarity: 'rare', 
      level: 270, 
      classes: ['Knight'],
      stats: { attack: 61, magic: 2 },
      description: 'Martelo dos Lion Knights' 
    },
    { 
      id: 14, 
      name: 'Skull Staff', 
      type: 'club', 
      rarity: 'epic', 
      level: 30, 
      classes: ['Knight'],
      stats: { attack: 40, magic: 1 },
      description: 'Cajado sinistro com caveira' 
    },
    // ===== ARMAS PALADIN - DISTANCE =====
    { 
      id: 15, 
      name: 'Soulpiercer', 
      type: 'bow', 
      rarity: 'legendary', 
      level: 400, 
      classes: ['Paladin'],
      stats: { attack: 51, accuracy: 4, magic: 5 },
      description: 'Melhor arco do Tibia para paladinos high level' 
    },
    { 
      id: 16, 
      name: 'Falcon Bow', 
      type: 'bow', 
      rarity: 'epic', 
      level: 300, 
      classes: ['Paladin'],
      stats: { attack: 49, accuracy: 3 },
      description: 'Arco dos Falcon Paladins, equipamento de elite' 
    },
    { 
      id: 17, 
      name: 'Lion Longbow', 
      type: 'bow', 
      rarity: 'rare', 
      level: 270, 
      classes: ['Paladin'],
      stats: { attack: 49, accuracy: 2 },
      description: 'Arco dos Lion Paladins, ótimo para hunts' 
    },
    { 
      id: 18, 
      name: 'Elvish Bow', 
      type: 'bow', 
      rarity: 'common', 
      level: 60, 
      classes: ['Paladin'],
      stats: { attack: 38, accuracy: 1 },
      description: 'Arco élfico tradicional para paladins médios' 
    },
    { 
      id: 19, 
      name: 'Composite Hornbow', 
      type: 'bow', 
      rarity: 'epic', 
      level: 50, 
      classes: ['Paladin'],
      stats: { attack: 42, accuracy: 2 },
      description: 'Arco composto de alta qualidade' 
    },
    { 
      id: 20, 
      name: 'Modified Crossbow', 
      type: 'crossbow', 
      rarity: 'rare', 
      level: 45, 
      classes: ['Paladin'],
      stats: { attack: 40, accuracy: 1 },
      description: 'Besta modificada com precisão aprimorada' 
    },
    
    // ===== ARMAS SORCERER - WANDS =====
    { 
      id: 21, 
      name: 'Soulhexer', 
      type: 'wand', 
      rarity: 'legendary', 
      level: 400, 
      classes: ['Sorcerer'],
      stats: { magic: 8, mana: 100 },
      description: 'Melhor wand para sorcerers de alto nível' 
    },
    { 
      id: 16, 
      name: 'Falcon Wand', 
      type: 'wand', 
      rarity: 'epic', 
      level: 300, 
      classes: ['Sorcerer'],
      stats: { magic: 6, mana: 75 },
      description: 'Varinha dos Falcon Sorcerers' 
    },
    { 
      id: 17, 
      name: 'Lion Wand', 
      type: 'wand', 
      rarity: 'rare', 
      level: 270, 
      classes: ['Sorcerer'],
      stats: { magic: 5, mana: 50 },
      description: 'Varinha dos Lion Sorcerers' 
    },
    { 
      id: 18, 
      name: 'Wand of Vortex', 
      type: 'wand', 
      rarity: 'common', 
      level: 22, 
      classes: ['Sorcerer'],
      stats: { magic: 2, mana: 25 },
      description: 'Varinha básica para sorcerers iniciantes' 
    },
    
    // ===== ARMAS DRUID - RODS =====
    { 
      id: 19, 
      name: 'Soulshredder', 
      type: 'rod', 
      rarity: 'legendary', 
      level: 400, 
      classes: ['Druid'],
      stats: { magic: 8, mana: 100 },
      description: 'Melhor rod para druids de alto nível' 
    },
    { 
      id: 20, 
      name: 'Falcon Rod', 
      type: 'rod', 
      rarity: 'epic', 
      level: 300, 
      classes: ['Druid'],
      stats: { magic: 6, mana: 75 },
      description: 'Cajado dos Falcon Druids' 
    },
    { 
      id: 21, 
      name: 'Lion Rod', 
      type: 'rod', 
      rarity: 'rare', 
      level: 270, 
      classes: ['Druid'],
      stats: { magic: 5, mana: 50 },
      description: 'Cajado dos Lion Druids' 
    },
    { 
      id: 22, 
      name: 'Underworld Rod', 
      type: 'rod', 
      rarity: 'rare', 
      level: 80, 
      classes: ['Druid'],
      stats: { magic: 3, mana: 40 },
      description: 'Cajado poderoso para druids avançados' 
    },
    
    // ===== ARMADURAS =====
    { 
      id: 23, 
      name: 'Spiritthorn Armor', 
      type: 'armor', 
      rarity: 'legendary', 
      level: 150, 
      classes: ['Knight', 'Paladin', 'Sorcerer', 'Druid'],
      stats: { defense: 21, magic: 4, health: 200 },
      description: 'Uma das melhores armaduras do Tibia, disponível para todas as vocações' 
    },
    { 
      id: 24, 
      name: 'Falcon Plate', 
      type: 'armor', 
      rarity: 'epic', 
      level: 300, 
      classes: ['Knight'],
      stats: { defense: 20, magic: 3, health: 150 },
      description: 'Armadura dos Falcon Knights de elite' 
    },
    { 
      id: 25, 
      name: 'Lion Plate', 
      type: 'armor', 
      rarity: 'rare', 
      level: 270, 
      classes: ['Knight'],
      stats: { defense: 19, magic: 2, health: 100 },
      description: 'Armadura dos Lion Knights' 
    },
    { 
      id: 26, 
      name: 'Magic Plate Armor', 
      type: 'armor', 
      rarity: 'rare', 
      level: 80, 
      classes: ['Knight'],
      stats: { defense: 17, magic: 3, health: 80 },
      description: 'Armadura mágica clássica para knights médios' 
    },
    { 
      id: 27, 
      name: 'Dragon Scale Mail', 
      type: 'armor', 
      rarity: 'rare', 
      level: 70, 
      classes: ['Knight', 'Paladin', 'Sorcerer', 'Druid'],
      stats: { defense: 15, health: 75 },
      description: 'Armadura versátil feita com escamas de dragão' 
    },
    
    // ===== CAPACETES =====
    { 
      id: 28, 
      name: 'Falcon Coif', 
      type: 'helmet', 
      rarity: 'epic', 
      level: 300, 
      classes: ['Knight', 'Paladin', 'Sorcerer', 'Druid'],
      stats: { defense: 12, magic: 3, mana: 50 },
      description: 'Capacete das Falcon Items para todas as vocações' 
    },
    { 
      id: 29, 
      name: 'Lion Spangenhelm', 
      type: 'helmet', 
      rarity: 'rare', 
      level: 270, 
      classes: ['Knight', 'Paladin', 'Sorcerer', 'Druid'],
      stats: { defense: 11, magic: 2, mana: 40 },
      description: 'Capacete dos Lion Items' 
    },
    { 
      id: 30, 
      name: 'Crown Helmet', 
      type: 'helmet', 
      rarity: 'rare', 
      level: 100, 
      classes: ['Knight', 'Paladin', 'Sorcerer', 'Druid'],
      stats: { defense: 11, mana: 60 },
      description: 'Capacete real com excelente proteção' 
    },
    { 
      id: 31, 
      name: 'Dragon Scale Helmet', 
      type: 'helmet', 
      rarity: 'common', 
      level: 70, 
      classes: ['Knight', 'Paladin', 'Sorcerer', 'Druid'],
      stats: { defense: 8, health: 30 },
      description: 'Capacete de escamas de dragão' 
    },
    
    // ===== ESCUDOS =====
    { 
      id: 32, 
      name: 'Falcon Escutcheon', 
      type: 'shield', 
      rarity: 'epic', 
      level: 300, 
      classes: ['Knight', 'Paladin'],
      stats: { defense: 38, magic: 3 },
      description: 'Escudo das Falcon Items com defesa superior' 
    },
    { 
      id: 33, 
      name: 'Lion Shield', 
      type: 'shield', 
      rarity: 'rare', 
      level: 270, 
      classes: ['Knight', 'Paladin'],
      stats: { defense: 37, magic: 2 },
      description: 'Escudo dos Lion Items' 
    },
    { 
      id: 34, 
      name: 'Crown Shield', 
      type: 'shield', 
      rarity: 'rare', 
      level: 100, 
      classes: ['Knight', 'Paladin'],
      stats: { defense: 36, health: 80 },
      description: 'Escudo real tradicional' 
    },
    { 
      id: 35, 
      name: 'Dragon Scale Shield', 
      type: 'shield', 
      rarity: 'common', 
      level: 70, 
      classes: ['Knight', 'Paladin'],
      stats: { defense: 32, health: 50 },
      description: 'Escudo de escamas de dragão' 
    },
    
    // ===== BOOTS =====
    { 
      id: 36, 
      name: 'Pair of Soulwalkers', 
      type: 'boots', 
      rarity: 'legendary', 
      level: 250, 
      classes: ['Knight', 'Paladin', 'Sorcerer', 'Druid'],
      stats: { defense: 4, magic: 2, mana: 40, health: 50 },
      description: 'Botas lendárias que concedem velocidade excepcional' 
    },
    { 
      id: 37, 
      name: 'Falcon Boots', 
      type: 'boots', 
      rarity: 'epic', 
      level: 300, 
      classes: ['Knight', 'Paladin', 'Sorcerer', 'Druid'],
      stats: { defense: 3, magic: 1, health: 30, mana: 20 },
      description: 'Botas dos Falcon Items' 
    },
    { 
      id: 38, 
      name: 'Golden Boots', 
      type: 'boots', 
      rarity: 'legendary', 
      level: 80, 
      classes: ['Knight', 'Paladin', 'Sorcerer', 'Druid'],
      stats: { defense: 2, health: 100 },
      description: 'Botas douradas que aumentam a velocidade' 
    },
    { 
      id: 39, 
      name: 'Boots of Haste', 
      type: 'boots', 
      rarity: 'rare', 
      level: 1, 
      classes: ['Knight', 'Paladin', 'Sorcerer', 'Druid'],
      stats: { defense: 2, health: 20 },
      description: 'Botas básicas que aumentam velocidade de movimento' 
    },
    
    // ===== RINGS =====
    { 
      id: 40, 
      name: 'Might Ring', 
      type: 'ring', 
      rarity: 'rare', 
      level: 80, 
      classes: ['Knight', 'Paladin', 'Sorcerer', 'Druid'],
      stats: { attack: 5, magic: 1, health: 30 },
      description: 'Anel que aumenta poder de combate' 
    },
    { 
      id: 41, 
      name: 'Ring of Healing', 
      type: 'ring', 
      rarity: 'rare', 
      level: 50, 
      classes: ['Knight', 'Paladin', 'Sorcerer', 'Druid'],
      stats: { health: 50, mana: 25, magic: 1 },
      description: 'Anel que acelera regeneração' 
    },
    { 
      id: 42, 
      name: 'Time Ring', 
      type: 'ring', 
      rarity: 'epic', 
      level: 100, 
      classes: ['Knight', 'Paladin', 'Sorcerer', 'Druid'],
      stats: { health: 100, mana: 50, defense: 2 },
      description: 'Anel que manipula o tempo para proteção extra' 
    },
    { 
      id: 43, 
      name: 'Life Ring', 
      type: 'ring', 
      rarity: 'common', 
      level: 1, 
      classes: ['Knight', 'Paladin', 'Sorcerer', 'Druid'],
      stats: { health: 40 },
      description: 'Anel que regenera vida constantemente' 
    },
    { 
      id: 44, 
      name: 'Energy Ring', 
      type: 'ring', 
      rarity: 'common', 
      level: 1, 
      classes: ['Knight', 'Paladin', 'Sorcerer', 'Druid'],
      stats: { mana: 40 },
      description: 'Anel que cria campo de energia protetor' 
    },
    { 
      id: 45, 
      name: 'Ring of the Sky', 
      type: 'ring', 
      rarity: 'epic', 
      level: 120, 
      classes: ['Knight', 'Paladin', 'Sorcerer', 'Druid'],
      stats: { magic: 3, mana: 80, health: 50 },
      description: 'Anel celestial com poder mágico supremo' 
    },
    
    // ===== NECKLACES =====
    { 
      id: 46, 
      name: 'Amulet of Loss', 
      type: 'necklace', 
      rarity: 'epic', 
      level: 1, 
      classes: ['Knight', 'Paladin', 'Sorcerer', 'Druid'],
      stats: { health: 100, mana: 50, defense: 3 },
      description: 'Amuleto que protege contra perdas na morte' 
    },
    { 
      id: 47, 
      name: 'Stone Skin Amulet', 
      type: 'necklace', 
      rarity: 'rare', 
      level: 60, 
      classes: ['Knight', 'Paladin', 'Sorcerer', 'Druid'],
      stats: { defense: 15, health: 75 },
      description: 'Amuleto que endurece a pele como pedra' 
    },
    { 
      id: 48, 
      name: 'Strange Talisman', 
      type: 'necklace', 
      rarity: 'epic', 
      level: 80, 
      classes: ['Knight', 'Paladin', 'Sorcerer', 'Druid'],
      stats: { magic: 4, mana: 60, health: 40 },
      description: 'Talismã misterioso com poderes arcanos' 
    },
    { 
      id: 49, 
      name: 'Elven Amulet', 
      type: 'necklace', 
      rarity: 'rare', 
      level: 40, 
      classes: ['Paladin', 'Sorcerer', 'Druid'],
      stats: { magic: 3, mana: 50, accuracy: 2 },
      description: 'Amuleto élfico com bênção da natureza' 
    },
    { 
      id: 50, 
      name: 'Dragon Necklace', 
      type: 'necklace', 
      rarity: 'rare', 
      level: 70, 
      classes: ['Knight', 'Paladin', 'Sorcerer', 'Druid'],
      stats: { defense: 8, health: 80, magic: 2 },
      description: 'Colar adornado com presas de dragão' 
    },
    { 
      id: 51, 
      name: 'Protection Amulet', 
      type: 'necklace', 
      rarity: 'common', 
      level: 20, 
      classes: ['Knight', 'Paladin', 'Sorcerer', 'Druid'],
      stats: { defense: 5, health: 30 },
      description: 'Amuleto protetor básico' 
    }
  ],
  
  // ===== BUILDS AUTÊNTICAS DO TIBIA =====
  builds: [
    {
      id: 1,
      name: 'Elite Knight Tank Master',
      class: 'Knight',
      level: 400,
      description: 'Build de tanque supremo para knights de elite. Focada em sobrevivência máxima e controle de área em team hunts.',
      equipment: {
        weapon: { id: 1, name: 'Soulcutter', type: 'sword', rarity: 'legendary', stats: { attack: 67, magic: 4, accuracy: 6 } },
        armor: { id: 23, name: 'Spiritthorn Armor', type: 'armor', rarity: 'legendary', stats: { defense: 21, magic: 4, health: 200 } },
        helmet: { id: 28, name: 'Falcon Coif', type: 'helmet', rarity: 'epic', stats: { defense: 12, magic: 3, mana: 50 } },
        shield: { id: 32, name: 'Falcon Escutcheon', type: 'shield', rarity: 'epic', stats: { defense: 38, magic: 3 } },
        boots: { id: 36, name: 'Pair of Soulwalkers', type: 'boots', rarity: 'legendary', stats: { defense: 4, magic: 2, mana: 40, health: 50 } },
        ring: { id: 40, name: 'Might Ring', type: 'ring', rarity: 'rare', stats: { attack: 5, magic: 1, health: 30 } },
        necklace: { id: 46, name: 'Amulet of Loss', type: 'necklace', rarity: 'epic', stats: { health: 100, mana: 50, defense: 3 } }
      }
    },
    {
      id: 2,
      name: 'Royal Paladin Sniper Elite',
      class: 'Paladin',
      level: 350,
      description: 'Build de dano à distância puro para paladinos de alto nível. Especializada em hunts solo eficientes e DPS em team hunts.',
      equipment: {
        weapon: { id: 15, name: 'Soulpiercer', type: 'bow', rarity: 'legendary', stats: { attack: 51, accuracy: 4, magic: 5 } },
        armor: { id: 23, name: 'Spiritthorn Armor', type: 'armor', rarity: 'legendary', stats: { defense: 21, magic: 4, health: 200 } },
        helmet: { id: 28, name: 'Falcon Coif', type: 'helmet', rarity: 'epic', stats: { defense: 12, magic: 3, mana: 50 } },
        shield: { id: 32, name: 'Falcon Escutcheon', type: 'shield', rarity: 'epic', stats: { defense: 38, magic: 3 } },
        boots: { id: 36, name: 'Pair of Soulwalkers', type: 'boots', rarity: 'legendary', stats: { defense: 4, magic: 2, mana: 40, health: 50 } },
        ring: { id: 40, name: 'Might Ring', type: 'ring', rarity: 'rare', stats: { attack: 5, magic: 1, health: 30 } },
        necklace: { id: 46, name: 'Amulet of Loss', type: 'necklace', rarity: 'epic', stats: { health: 100, mana: 50, defense: 3 } }
      }
    },
    {
      id: 3,
      name: 'Master Sorcerer Devastator',
      class: 'Sorcerer',
      level: 320,
      description: 'Build focada em magic level máximo para sorcerers de elite. Especializado em AoE damage devastador e single target supremo.',
      equipment: {
        weapon: { id: 21, name: 'Soulhexer', type: 'wand', rarity: 'legendary', stats: { magic: 8, mana: 100 } },
        armor: { id: 23, name: 'Spiritthorn Armor', type: 'armor', rarity: 'legendary', stats: { defense: 21, magic: 4, health: 200 } },
        helmet: { id: 28, name: 'Falcon Coif', type: 'helmet', rarity: 'epic', stats: { defense: 12, magic: 3, mana: 50 } },
        boots: { id: 36, name: 'Pair of Soulwalkers', type: 'boots', rarity: 'legendary', stats: { defense: 4, magic: 2, mana: 40, health: 50 } },
        ring: { id: 45, name: 'Ring of the Sky', type: 'ring', rarity: 'epic', stats: { magic: 3, mana: 80, health: 50 } },
        necklace: { id: 48, name: 'Strange Talisman', type: 'necklace', rarity: 'epic', stats: { magic: 4, mana: 60, health: 40 } }
      }
    },
    {
      id: 4,
      name: 'Elder Druid Healing Master',
      class: 'Druid',
      level: 280,
      description: 'Build completa de suporte para team hunts. Focada em cura eficiente, controle de área e sustentação da equipe.',
      equipment: {
        weapon: { id: 20, name: 'Falcon Rod', type: 'rod', rarity: 'epic', stats: { magic: 6, mana: 75 } },
        armor: { id: 23, name: 'Spiritthorn Armor', type: 'armor', rarity: 'legendary', stats: { defense: 21, magic: 4, health: 200 } },
        helmet: { id: 29, name: 'Lion Spangenhelm', type: 'helmet', rarity: 'rare', stats: { defense: 11, magic: 2, mana: 40 } },
        boots: { id: 37, name: 'Falcon Boots', type: 'boots', rarity: 'epic', stats: { defense: 3, magic: 1, health: 30, mana: 20 } },
        ring: { id: 41, name: 'Ring of Healing', type: 'ring', rarity: 'rare', stats: { health: 50, mana: 25, magic: 1 } },
        necklace: { id: 47, name: 'Stone Skin Amulet', type: 'necklace', rarity: 'rare', stats: { defense: 15, health: 75 } }
      }
    }
  ]
}