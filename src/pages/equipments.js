import { tibiaData } from '../data/tibiaData.js'
import { getItemImage, getRarityIcon, addTibiaImageStyles } from '../tibiaImages.js'

export class EquipmentsRenderer {
  constructor() {
    this.data = tibiaData
    this.currentFilter = {
      type: '',
      rarity: '',
      class: '',
      search: '',
      level: ''
    }
  }
  
  render() {
    const equipmentContent = document.querySelector('#equipment-page .content')
    if (!equipmentContent) {
      const equipmentPage = document.querySelector('#equipment-page')
      if (!equipmentPage) return
      
      equipmentPage.innerHTML = `
        <div class="container">
          ${this.renderEquipmentHeader()}
          ${this.renderFilters()}
          ${this.renderEquipmentSection()}
        </div>
      `
    } else {
      equipmentContent.innerHTML = `
        <div class="equipment-container">
          ${this.renderEquipmentHeader()}
          ${this.renderFilters()}
          ${this.renderEquipmentSection()}
        </div>
      `
    }
    
    addTibiaImageStyles()
    this.addEquipmentStyles()
    this.addEventListeners()
  }
  
  renderEquipmentHeader() {
    return `
      <header class="equipment-header">
        <div class="header-content">
          <h1 class="page-title">Equipamentos do Tibia</h1>
          <p class="page-subtitle">
            Explore todos os equipamentos disponíveis e descubra os melhores itens para seu personagem.
          </p>
        </div>
        <div class="header-stats">
          <div class="stat-item">
            <span class="stat-value">${this.data.equipment.length}</span>
            <span class="stat-label">Equipamentos</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">7</span>
            <span class="stat-label">Tipos</span>
          </div>
        </div>
      </header>
    `
  }
  
  renderFilters() {
    return `
      <div class="filters-section">
        <div class="filters-container">
          <div class="search-box">
            <input type="text" 
                   id="search-input" 
                   placeholder="Buscar equipamento por nome..."
                   value="${this.currentFilter.search}">
          </div>
          
          ${this.renderEquipmentFilters()}
        </div>
      </div>
    `
  }
  
  renderEquipmentFilters() {
    return `
      <select id="type-filter" class="filter-select">
        <option value="">Todos os tipos</option>
        <option value="weapon" ${this.currentFilter.type === 'weapon' ? 'selected' : ''}>Armas</option>
        <option value="armor" ${this.currentFilter.type === 'armor' ? 'selected' : ''}>Armaduras</option>
        <option value="shield" ${this.currentFilter.type === 'shield' ? 'selected' : ''}>Escudos</option>
        <option value="helmet" ${this.currentFilter.type === 'helmet' ? 'selected' : ''}>Capacetes</option>
        <option value="boots" ${this.currentFilter.type === 'boots' ? 'selected' : ''}>Botas</option>
        <option value="ring" ${this.currentFilter.type === 'ring' ? 'selected' : ''}>Anéis</option>
        <option value="necklace" ${this.currentFilter.type === 'necklace' ? 'selected' : ''}>Colares</option>
      </select>
      
      <select id="rarity-filter" class="filter-select">
        <option value="">Todas as raridades</option>
        <option value="comum" ${this.currentFilter.rarity === 'comum' ? 'selected' : ''}>Comum</option>
        <option value="raro" ${this.currentFilter.rarity === 'raro' ? 'selected' : ''}>Raro</option>
        <option value="epico" ${this.currentFilter.rarity === 'epico' ? 'selected' : ''}>Épico</option>
        <option value="lendario" ${this.currentFilter.rarity === 'lendario' ? 'selected' : ''}>Lendário</option>
      </select>
      
      <select id="level-filter" class="filter-select">
        <option value="">Todos os níveis</option>
        <option value="1-50" ${this.currentFilter.level === '1-50' ? 'selected' : ''}>Lv. 1-50</option>
        <option value="51-100" ${this.currentFilter.level === '51-100' ? 'selected' : ''}>Lv. 51-100</option>
        <option value="101-200" ${this.currentFilter.level === '101-200' ? 'selected' : ''}>Lv. 101-200</option>
        <option value="201+" ${this.currentFilter.level === '201+' ? 'selected' : ''}>Lv. 201+</option>
      </select>
    `
  }
  
  renderEquipmentSection() {
    const filteredEquipment = this.filterEquipment()
    
    return `
      <section class="equipment-section">
        <div class="section-header">
          <h2 class="section-title">Equipamentos Disponíveis</h2>
          <div class="results-count">${filteredEquipment.length} itens encontrados</div>
        </div>
        
        <div class="equipment-grid">
          ${filteredEquipment.map(item => this.renderEquipmentCard(item)).join('')}
        </div>
        
        ${filteredEquipment.length === 0 ? `
          <div class="no-results">
            <div class="no-results-icon"></div>
            <h3>Nenhum equipamento encontrado</h3>
            <p>Tente ajustar os filtros de busca.</p>
          </div>
        ` : ''}
      </section>
    `
  }
  
  renderEquipmentCard(item) {
    const topStats = item.stats
      ? Object.entries(item.stats).slice(0, 2).map(([s, v]) => `+${v} ${this.getStatName(s)}`).join(' · ')
      : ''

    return `
      <article class="equipment-card rarity-${item.rarity}" data-item-id="${item.id}" title="${item.name}">
        <div class="card-img-box">
          ${getItemImage(item.name, item.type)}
        </div>
        <div class="card-body">
          <span class="rarity-label rarity-${item.rarity}">${item.rarity.toUpperCase()}</span>
          <h3 class="item-name">${item.name}</h3>
          <div class="item-meta">
            <span class="item-type-tag">${this.getTypeName(item.type)}</span>
            ${item.level ? `<span class="item-level-tag">Lv.${item.level}</span>` : ''}
          </div>
          ${topStats ? `<div class="item-stats-mini">${topStats}</div>` : ''}
        </div>
        <div class="card-footer">
          <button class="btn-card" data-action="view-item-details" data-item-id="${item.id}">Detalhes</button>
          <button class="btn-card btn-card-sec" data-page="create-build" data-item-id="${item.id}">Usar</button>
        </div>
      </article>
    `
  }
  
  getTypeName(type) {
    const names = {
      sword: 'Espada',
      axe: 'Machado',
      club: 'Clava',
      bow: 'Arco',
      wand: 'Varinha',
      rod: 'Cajado',
      armor: 'Armadura',
      helmet: 'Capacete',
      shield: 'Escudo',
      boots: 'Botas',
      ring: 'Anel',
      necklace: 'Colar'
    }
    return names[type] || type
  }
  
  getStatName(stat) {
    const names = {
      attack: 'Ataque',
      defense: 'Defesa', 
      health: 'Vida',
      mana: 'Mana',
      accuracy: 'Precisão',
      magic: 'Magia',
      armor: 'Armadura',
      speed: 'Velocidade'
    }
    return names[stat] || stat
  }
  
  filterEquipment() {
    let filtered = this.data.equipment
    
    if (this.currentFilter.search) {
      const search = this.currentFilter.search.toLowerCase()
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(search)
      )
    }
    
    if (this.currentFilter.type) {
      filtered = filtered.filter(item => {
        const itemSlot = this.getItemSlot(item.type)
        return itemSlot === this.currentFilter.type
      })
    }
    
    if (this.currentFilter.rarity) {
      filtered = filtered.filter(item => item.rarity === this.currentFilter.rarity)
    }
    
    if (this.currentFilter.level) {
      filtered = filtered.filter(item => {
        if (!item.level) return true
        const level = item.level
        if (this.currentFilter.level === '1-50') return level <= 50
        if (this.currentFilter.level === '51-100') return level > 50 && level <= 100
        if (this.currentFilter.level === '101-200') return level > 100 && level <= 200
        if (this.currentFilter.level === '201+') return level > 200
        return true
      })
    }
    
    return filtered
  }
  
  getItemSlot(itemType) {
    const slotMap = {
      'sword': 'weapon',
      'axe': 'weapon',
      'club': 'weapon', 
      'bow': 'weapon',
      'wand': 'weapon',
      'rod': 'weapon',
      'armor': 'armor',
      'helmet': 'helmet',
      'shield': 'shield', 
      'boots': 'boots',
      'ring': 'ring',
      'necklace': 'necklace'
    }
    return slotMap[itemType] || 'weapon'
  }
  
  addEventListeners() {
    document.getElementById('search-input')?.addEventListener('input', (e) => {
      this.currentFilter.search = e.target.value
      this.applyFilters()
    })
    
    document.getElementById('type-filter')?.addEventListener('change', (e) => {
      this.currentFilter.type = e.target.value
      this.applyFilters()
    })
    
    document.getElementById('rarity-filter')?.addEventListener('change', (e) => {
      this.currentFilter.rarity = e.target.value
      this.applyFilters()
    })
    
    document.getElementById('level-filter')?.addEventListener('change', (e) => {
      this.currentFilter.level = e.target.value
      this.applyFilters()
    })
  }
  
  applyFilters() {
    const section = document.querySelector('.equipment-section')
    if (section) {
      const parent = section.parentElement
      section.remove()
      
      const newSection = this.renderEquipmentSection()
      
      parent.insertAdjacentHTML('beforeend', newSection)
    }
  }
  
  addEquipmentStyles() {
    if (document.querySelector('#equipment-responsive-styles')) return
    
    const styles = document.createElement('style')
    styles.id = 'equipment-responsive-styles'
    styles.textContent = `
      /* Equipment Page Responsive Styles */
      .equipment-container {
        max-width: 1400px;
        margin: 0 auto;
        padding: 0 20px;
      }
      
      /* Header */
      .equipment-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 40px;
        padding-bottom: 20px;
        border-bottom: 2px solid var(--color-border);
      }
      
      .page-title {
        font-size: clamp(2rem, 4vw, 3rem);
        color: var(--color-primary);
        margin-bottom: 15px;
      }
      
      .page-subtitle {
        font-size: 1.2rem;
        line-height: 1.6;
        color: var(--color-text-secondary);
        max-width: 600px;
      }
      
      .header-stats {
        display: flex;
        gap: 30px;
      }
      
      .stat-item {
        text-align: center;
      }
      
      .stat-value {
        display: block;
        font-size: 2.5rem;
        font-weight: bold;
        margin-bottom: 5px;
        color: var(--color-secondary);
        background: none;
        padding: 0;
      }
      
      .stat-label {
        font-size: 1rem;
        color: var(--color-text-secondary);
      }
      
      /* Filters */
      .filters-section {
        margin-bottom: 30px;
      }
      
      .filters-container {
        display: flex;
        gap: 15px;
        flex-wrap: wrap;
        align-items: center;
      }
      
      .search-box {
        flex: 1;
        min-width: 250px;
      }
      
      #search-input {
        width: 100%;
        padding: 12px 20px;
        border: 2px solid var(--color-border);
        border-radius: 25px;
        background: var(--color-surface);
        color: var(--color-text);
        font-size: 1rem;
        transition: all 0.3s ease;
      }
      
      #search-input:focus {
        outline: none;
        border-color: var(--color-primary);
        box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb), 0.1);
      }
      
      .filter-select {
        padding: 12px 16px;
        border: 2px solid var(--color-border);
        border-radius: 8px;
        background: var(--color-surface);
        color: var(--color-text);
        font-size: 1rem;
        min-width: 150px;
        cursor: pointer;
      }
      
      .filter-select:focus {
        outline: none;
        border-color: var(--color-primary);
      }
      
      /* Section Header */
      .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;
        flex-wrap: wrap;
        gap: 15px;
      }
      
      .section-title {
        font-size: 1.8rem;
        color: var(--color-primary);
      }
      
      .results-count {
        background: var(--color-accent);
        color: white;
        padding: 8px 16px;
        border-radius: 20px;
        font-weight: bold;
        font-size: 0.9rem;
      }
      
      /* Equipment Grid — compact */
      .equipment-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 10px;
        margin-bottom: 40px;
      }

      .equipment-card {
        background: var(--color-surface);
        border: 2px solid var(--color-border);
        border-radius: 10px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
        cursor: pointer;
      }

      .equipment-card:hover {
        border-color: var(--color-primary);
        transform: translateY(-2px);
        box-shadow: 0 6px 18px rgba(0,0,0,0.25);
      }

      .equipment-card.rarity-comum  { border-top: 3px solid #9ca3af; }
      .equipment-card.rarity-raro   { border-top: 3px solid #3b82f6; }
      .equipment-card.rarity-epico  { border-top: 3px solid #a855f7; }
      .equipment-card.rarity-lendario { border-top: 3px solid #f59e0b; }

      /* Image box: square, centred */
      .card-img-box {
        width: 100%;
        aspect-ratio: 1 / 1;
        max-height: 110px;
        background: rgba(0,0,0,0.35);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 8px;
        overflow: hidden;
      }

      .card-img-box img {
        max-width: 80px;
        max-height: 80px;
        width: auto;
        height: auto;
        object-fit: contain;
        image-rendering: pixelated;
        image-rendering: crisp-edges;
      }

      /* Info area */
      .card-body {
        padding: 8px 10px 6px;
        flex: 1;
      }

      .rarity-label {
        display: inline-block;
        font-size: 0.6rem;
        font-weight: 700;
        letter-spacing: 0.6px;
        text-transform: uppercase;
        margin-bottom: 3px;
      }
      .rarity-label.rarity-comum    { color: #9ca3af; }
      .rarity-label.rarity-raro     { color: #60a5fa; }
      .rarity-label.rarity-epico    { color: #c084fc; }
      .rarity-label.rarity-lendario { color: #fbbf24; }

      .item-name {
        font-size: 0.82rem;
        font-weight: 600;
        color: var(--color-text);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin: 0 0 4px;
        line-height: 1.2;
      }

      .item-meta {
        display: flex;
        gap: 5px;
        align-items: center;
        flex-wrap: wrap;
        margin-bottom: 4px;
      }

      .item-type-tag {
        font-size: 0.7rem;
        color: var(--color-text-secondary);
        text-transform: capitalize;
      }

      .item-level-tag {
        font-size: 0.65rem;
        font-weight: 700;
        color: var(--color-secondary);
        background: rgba(255,215,0,0.1);
        padding: 1px 5px;
        border-radius: 4px;
      }

      .item-stats-mini {
        font-size: 0.68rem;
        color: #4ade80;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      /* Footer buttons */
      .card-footer {
        display: flex;
        border-top: 1px solid var(--color-border);
      }

      .btn-card {
        flex: 1;
        padding: 6px 4px;
        font-size: 0.72rem;
        font-weight: 600;
        background: transparent;
        border: none;
        color: var(--color-primary);
        cursor: pointer;
        transition: background 0.15s;
      }

      .btn-card:hover {
        background: rgba(var(--color-primary-rgb), 0.12);
      }

      .btn-card + .btn-card {
        border-left: 1px solid var(--color-border);
      }

      .btn-card-sec {
        color: var(--color-accent);
      }

      .btn-card-sec:hover {
        background: rgba(var(--color-accent-rgb), 0.12);
      }
      
      /* No Results */
      .no-results {
        text-align: center;
        padding: 60px 20px;
        color: var(--color-text-secondary);
      }
      
      .no-results-icon {
        font-size: 4rem;
        margin-bottom: 20px;
        opacity: 0.5;
      }
      
      .no-results h3 {
        font-size: 1.5rem;
        margin-bottom: 10px;
        color: var(--color-text);
      }
      
      .no-results p {
        margin-bottom: 25px;
        font-size: 1.1rem;
      }
      
      /* Responsive */
      @media (max-width: 1024px) {
        .equipment-grid { grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); }
      }

      @media (max-width: 768px) {
        .equipment-container { padding: 0 12px; }
        .equipment-header { flex-direction: column; text-align: center; gap: 20px; }
        .header-stats { justify-content: center; gap: 20px; }
        .filters-container { flex-direction: column; align-items: stretch; gap: 10px; }
        .search-box { min-width: auto; }
        .filter-select { min-width: auto; }
        .section-header { flex-direction: column; align-items: flex-start; }
        .equipment-grid { grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 8px; }
        .card-img-box { max-height: 90px; }
        .card-img-box img { max-width: 64px; max-height: 64px; }
      }

      @media (max-width: 480px) {
        .equipment-grid { grid-template-columns: repeat(3, 1fr); gap: 7px; }
        .card-img-box { max-height: 80px; padding: 6px; }
        .card-img-box img { max-width: 56px; max-height: 56px; }
        .card-body { padding: 6px 8px 4px; }
      }

      @media (max-width: 360px) {
        .equipment-grid { grid-template-columns: repeat(2, 1fr); }
      }

      @media (hover: none) and (pointer: coarse) {
        .equipment-card:active { transform: scale(0.97); }
        .btn-card { min-height: 36px; }
      }
    `
    
    document.head.appendChild(styles)
  }
}