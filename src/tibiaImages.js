// Sistema de Imagens Originais do Tibia - Multiple Sources
// URLs das imagens oficiais dos itens do Tibia de fontes alternativas

// Base URLs para imagens do Tibia (múltiplas fontes)
const TIBIA_FANDOM = 'https://tibia.fandom.com/wiki/Special:Redirect/file';
const ITEM_IMAGES_CDN = 'https://www.tibiawiki.com.br/images';

// Imagens originais dos itens por nome específico
export const TIBIA_ORIGINAL_IMAGES = {
  // ===== ARMAS =====
  // Swords
  'soulcutter': `${TIBIA_FANDOM}/Soulcutter.gif`,
  'spiritthorn-sword': `${TIBIA_FANDOM}/Spiritthorn_Sword.gif`,
  'falcon-longsword': `${TIBIA_FANDOM}/Falcon_Longsword.gif`,
  'lion-longsword': `${TIBIA_FANDOM}/Lion_Longsword.gif`,
  'magic-sword': `${TIBIA_FANDOM}/Magic_Sword.gif`,
  'bright-sword': `${TIBIA_FANDOM}/Bright_Sword.gif`,
  'fire-sword': `${TIBIA_FANDOM}/Fire_Sword.gif`,
  'giant-sword': `${TIBIA_FANDOM}/Giant_Sword.gif`,
  'bloody-edge': `${TIBIA_FANDOM}/Bloody_Edge.gif`,
  
  // Axes
  'soulbiter': `${TIBIA_FANDOM}/Soulbiter.gif`,
  'falcon-battleaxe': `${TIBIA_FANDOM}/Falcon_Battleaxe.gif`,
  'lion-axe': `${TIBIA_FANDOM}/Lion_Axe.gif`,
  'fire-axe': `${TIBIA_FANDOM}/Fire_Axe.gif`,
  'golden-axe': `${TIBIA_FANDOM}/Golden_Axe.gif`,
  'dragon-slayer': `${TIBIA_FANDOM}/Dragon_Slayer.gif`,
  'guardian-axe': `${TIBIA_FANDOM}/Guardian_Axe.gif`,
  
  // Clubs
  'soulmaimer': `${TIBIA_FANDOM}/Soulmaimer.gif`,
  'falcon-mace': `${TIBIA_FANDOM}/Falcon_Mace.gif`,
  'lion-hammer': `${TIBIA_FANDOM}/Lion_Hammer.gif`,
  'skull-staff': `${TIBIA_FANDOM}/Skull_Staff.gif`,
  'war-hammer': `${TIBIA_FANDOM}/War_Hammer.gif`,
  'hammer-of-wrath': `${TIBIA_FANDOM}/Hammer_of_Wrath.gif`,
  
  // Distance Weapons
  'soulpiercer': `${TIBIA_FANDOM}/Soulpiercer.gif`,
  'falcon-bow': `${TIBIA_FANDOM}/Falcon_Bow.gif`,
  'lion-longbow': `${TIBIA_FANDOM}/Lion_Longbow.gif`,
  'elvish-bow': `${TIBIA_FANDOM}/Elvish_Bow.gif`,
  'composite-hornbow': `${TIBIA_FANDOM}/Composite_Hornbow.gif`,
  'crossbow': `${TIBIA_FANDOM}/Crossbow.gif`,
  'modified-crossbow': `${TIBIA_FANDOM}/Modified_Crossbow.gif`,
  
  // Magic Weapons - Wands
  'soulhexer': `${TIBIA_FANDOM}/Soulhexer.gif`,
  'falcon-wand': `${TIBIA_FANDOM}/Falcon_Wand.gif`,
  'lion-wand': `${TIBIA_FANDOM}/Lion_Wand.gif`,
  'wand-of-vortex': `${TIBIA_FANDOM}/Wand_of_Vortex.gif`,
  'magic-light-wand': `${TIBIA_FANDOM}/Magic_Light_Wand.gif`,
  'wand-of-dragonbreath': `${TIBIA_FANDOM}/Wand_of_Dragonbreath.gif`,
  
  // Magic Weapons - Rods
  'soulbasher': `${TIBIA_FANDOM}/Soulbasher.gif`,
  'falcon-rod': `${TIBIA_FANDOM}/Falcon_Rod.gif`,
  'lion-rod': `${TIBIA_FANDOM}/Lion_Rod.gif`,
  'underworld-rod': `${TIBIA_FANDOM}/Underworld_Rod.gif`,
  'moonlight-rod': `${TIBIA_FANDOM}/Moonlight_Rod.gif`,
  'necrotic-rod': `${TIBIA_FANDOM}/Necrotic_Rod.gif`,
  
  // ===== ARMADURAS =====
  'spiritthorn-armor': `${TIBIA_FANDOM}/Spiritthorn_Armor.gif`,
  'falcon-plate': `${TIBIA_FANDOM}/Falcon_Plate.gif`,
  'lion-plate': `${TIBIA_FANDOM}/Lion_Plate.gif`,
  'magic-plate-armor': `${TIBIA_FANDOM}/Magic_Plate_Armor.gif`,
  'golden-armor': `${TIBIA_FANDOM}/Golden_Armor.gif`,
  'dragon-scale-mail': `${TIBIA_FANDOM}/Dragon_Scale_Mail.gif`,
  'blue-robe': `${TIBIA_FANDOM}/Blue_Robe.gif`,
  'magician-robe': `${TIBIA_FANDOM}/Magician_Robe.gif`,
  
  // ===== CAPACETES =====
  'falcon-coif': `${TIBIA_FANDOM}/Falcon_Coif.gif`,
  'lion-spangenhelm': `${TIBIA_FANDOM}/Lion_Spangenhelm.gif`,
  'crown-helmet': `${TIBIA_FANDOM}/Crown_Helmet.gif`,
  'dragon-scale-helmet': `${TIBIA_FANDOM}/Dragon_Scale_Helmet.gif`,
  'royal-helmet': `${TIBIA_FANDOM}/Royal_Helmet.gif`,
  'warrior-helmet': `${TIBIA_FANDOM}/Warrior_Helmet.gif`,
  'mystic-turban': `${TIBIA_FANDOM}/Mystic_Turban.gif`,
  
  // ===== ESCUDOS =====
  'falcon-escutcheon': `${TIBIA_FANDOM}/Falcon_Escutcheon.gif`,
  'lion-shield': `${TIBIA_FANDOM}/Lion_Shield.gif`,
  'crown-shield': `${TIBIA_FANDOM}/Crown_Shield.gif`,
  'dragon-scale-shield': `${TIBIA_FANDOM}/Dragon_Scale_Shield.gif`,
  'dwarven-shield': `${TIBIA_FANDOM}/Dwarven_Shield.gif`,
  'steel-shield': `${TIBIA_FANDOM}/Steel_Shield.gif`,
  'demon-shield': `${TIBIA_FANDOM}/Demon_Shield.gif`,
  
  // ===== BOTAS =====
  'pair-of-soulwalkers': `${TIBIA_FANDOM}/Pair_of_Soulwalkers.gif`,
  'falcon-boots': `${TIBIA_FANDOM}/Falcon_Boots.gif`,
  'golden-boots': `${TIBIA_FANDOM}/Golden_Boots.gif`,
  'boots-of-haste': `${TIBIA_FANDOM}/Boots_of_Haste.gif`,
  
  // ===== ANÉIS =====
  'might-ring': `${TIBIA_FANDOM}/Might_Ring.gif`,
  'ring-of-healing': `${TIBIA_FANDOM}/Ring_of_Healing.gif`,
  'time-ring': `${TIBIA_FANDOM}/Time_Ring.gif`,
  'life-ring': `${TIBIA_FANDOM}/Life_Ring.gif`,
  'energy-ring': `${TIBIA_FANDOM}/Energy_Ring.gif`,
  'ring-of-the-sky': `${TIBIA_FANDOM}/Ring_of_the_Sky.gif`,
  
  // ===== AMULETOS =====
  'amulet-of-loss': `${TIBIA_FANDOM}/Amulet_of_Loss.gif`,
  'stone-skin-amulet': `${TIBIA_FANDOM}/Stone_Skin_Amulet.gif`,
  'strange-talisman': `${TIBIA_FANDOM}/Strange_Talisman.gif`,
  'elven-amulet': `${TIBIA_FANDOM}/Elven_Amulet.gif`,
  'dragon-necklace': `${TIBIA_FANDOM}/Dragon_Necklace.gif`,
  'protection-amulet': `${TIBIA_FANDOM}/Protection_Amulet.gif`
};

// Função para criar slug do nome do item (combinar com keys das imagens)
function createItemSlug(itemName) {
  if (!itemName) return '';
  return itemName.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/'/g, '')
    .replace(/[^\w-]/g, '');
}

// Função principal para obter imagem do item
export function getItemImage(itemName, itemType = 'sword') {
  const slug = createItemSlug(itemName);
  const originalImage = TIBIA_ORIGINAL_IMAGES[slug];
  
  // Debug log
  if (typeof console !== 'undefined') {
    console.log(`[TibiaImages] Item: ${itemName}, Slug: ${slug}, Found: ${!!originalImage}`);
  }
  
  if (originalImage) {
    const fallbackEmoji = getEmojiByType(itemType);
    
    // Criar elemento com múltiplas tentativas de fontes
    return `<img src="${originalImage}" 
                 alt="${itemName}" 
                 class="tibia-item-img" 
                 loading="lazy"
                 referrerpolicy="no-referrer"
                 onerror="this.onerror=null; console.warn('Erro ao carregar: ${itemName}'); this.parentElement.innerHTML='<span class=\\'emoji-fallback\\'>${fallbackEmoji}</span>';" />`;
  }
  
  // Se não encontrar imagem específica, usar fallback emoji
  if (typeof console !== 'undefined') {
    console.warn(`[TibiaImages] Imagem não encontrada para: ${itemName} (${slug})`);
  }
  return `<span class="emoji-fallback">${getEmojiByType(itemType)}</span>`;
}

// Função para obter emoji baseado no tipo
function getEmojiByType(type) {
  const emoiMap = {
    'sword': '⚔️',
    'axe': '🪓', 
    'club': '🔨',
    'bow': '🏹',
    'crossbow': '🏹',
    'wand': '🪄',
    'rod': '🔮',
    'spear': '🗡️',
    'distance': '🏹',
    'armor': '⚔️',
    'helmet': '⛑️',
    'shield': '🛡️',
    'boots': '👢',
    'ring': '💍',
    'necklace': '📿',
    'amulet': '📿',
    'default': '⭐'
  };
  
  return emoiMap[type.toLowerCase()] || emoiMap.default;
}

// Função para obter ícone por raridade
export function getRarityIcon(rarity) {
  const rarityColors = {
    'common': '⚪',
    'uncommon': '🟢', 
    'rare': '🔵',
    'epic': '🟣',
    'legendary': '🟠'
  };
  return rarityColors[rarity?.toLowerCase()] || '⚪';
}

// Função para obter ícone por classe
export function getClassIcon(className) {
  const classIcons = {
    'knight': '🛡️',
    'paladin': '🏹',
    'sorcerer': '⚡',
    'druid': '🌿',
    'elite knight': '⚔️',
    'royal paladin': '🎯',
    'master sorcerer': '🔥',
    'elder druid': '🍃'
  };
  return classIcons[className?.toLowerCase()] || '⭐';
}

// Função para obter ícone por tipo de item (compatibilidade com sistema antigo)
export function getIconForItemType(type) {
  return getEmojiByType(type);
}

// Função para compatibilidade - retorna HTML da imagem do item
export function getItemIcon(itemName, itemType) {
  return getItemImage(itemName, itemType);
}

// Função melhorada para criar elemento de ícone
export function createIconElement(iconData, alt = '', className = 'item-icon') {
  if (typeof iconData === 'string' && iconData.includes('<img')) {
    return iconData; // Já é HTML
  }
  
  if (typeof iconData === 'string') {
    return `<span class="${className}" style="font-size:1.5rem;">${iconData}</span>`;
  }
  
  // Fallback
  return `<span class="${className}" style="font-size:1.5rem;">⭐</span>`;
}

// Estilos CSS para imagens do Tibia
export function addTibiaImageStyles() {
  if (document.getElementById('tibia-images-styles')) return;
  
  const style = document.createElement('style');
  style.id = 'tibia-images-styles';
  style.textContent = `
    /* Estilos para imagens originais do Tibia */
    .tibia-item-img {
      width: 100%;
      height: 100%;
      max-width: 48px;
      max-height: 48px;
      object-fit: contain;
      image-rendering: pixelated;
      image-rendering: -moz-crisp-edges;
      image-rendering: crisp-edges;
      background: transparent;
      border: none;
      transition: transform 0.2s ease;
      display: block;
      margin: 0 auto;
    }
    
    .tibia-item-img:hover {
      transform: scale(1.1);
    }
    
    .item-icon .tibia-item-img {
      width: 100%;
      height: 100%;
      max-width: 100%;
      max-height: 100%;
    }
    
    .equipment-icon .tibia-item-img {
      width: 32px;
      height: 32px;
    }
    
    .emoji-fallback {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      font-size: 1.5rem;
      line-height: 1;
    }
    
    .item-icon .emoji-fallback {
      font-size: 2rem;
    }
    
    /* Responsividade para imagens */
    @media (max-width: 768px) {
      .tibia-item-img {
        max-width: 40px;
        max-height: 40px;
      }
    }
    
    @media (max-width: 480px) {
      .tibia-item-img {
        max-width: 32px;
        max-height: 32px;
      }
    }
  `;
  
  document.head.appendChild(style);
}

// Inicializar estilos quando o módulo for importado
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addTibiaImageStyles);
  } else {
    addTibiaImageStyles();
  }
}

// Export default para compatibilidade
export default {
  getItemImage,
  getRarityIcon,
  getClassIcon,
  getIconForItemType,
  createIconElement,
  TIBIA_ORIGINAL_IMAGES
};