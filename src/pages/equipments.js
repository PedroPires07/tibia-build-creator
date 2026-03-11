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
          <h1 class="page-title">⚔️ Equipamentos do Tibia</h1>
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
                   placeholder="🔍 Buscar equipamento por nome..."
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
        <option value="weapon" ${this.currentFilter.type === 'weapon' ? 'selected' : ''}>⚔️ Armas</option>
        <option value="armor" ${this.currentFilter.type === 'armor' ? 'selected' : ''}>🛡️ Armaduras</option>
        <option value="shield" ${this.currentFilter.type === 'shield' ? 'selected' : ''}>🛡️ Escudos</option>
        <option value="helmet" ${this.currentFilter.type === 'helmet' ? 'selected' : ''}>⛑️ Capacetes</option>
        <option value="boots" ${this.currentFilter.type === 'boots' ? 'selected' : ''}>👢 Botas</option>
        <option value="ring" ${this.currentFilter.type === 'ring' ? 'selected' : ''}>💍 Anéis</option>
        <option value="necklace" ${this.currentFilter.type === 'necklace' ? 'selected' : ''}>📿 Colares</option>
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
          <h2 class="section-title">⚔️ Equipamentos Disponíveis</h2>
          <div class="results-count">${filteredEquipment.length} itens encontrados</div>
        </div>
        
        <div class="equipment-grid">
          ${filteredEquipment.map(item => this.renderEquipmentCard(item)).join('')}
        </div>
        
        ${filteredEquipment.length === 0 ? `
          <div class="no-results">
            <div class="no-results-icon">⚔️</div>
            <h3>Nenhum equipamento encontrado</h3>
            <p>Tente ajustar os filtros de busca.</p>
          </div>
        ` : ''}
      </section>
    `
  }
  
  renderEquipmentCard(item) {
    return `
      <article class="equipment-card rarity-${item.rarity}" data-item-id="${item.id}">
        <div class="card-header">
          <div class="item-icon">
            ${getItemImage(item.name, item.type)}
          </div>
          <div class="item-rarity">${getRarityIcon(item.rarity)}</div>
        </div>
        
        <h3 class="item-name">${item.name}</h3>
        <div class="item-type">${this.getTypeName(item.type)}</div>
        
        ${item.level ? `
          <div class="item-level">
            <span class="level-label">Lv. Mín:</span>
            <span class="level-value">${item.level}</span>
          </div>
        ` : ''}
        
        ${item.stats ? `
          <div class="item-stats">
            ${Object.entries(item.stats).map(([stat, value]) => `
              <div class="stat-row">
                <span class="stat-name">${this.getStatName(stat)}</span>
                <span class="stat-value">+${value}</span>
              </div>
            `).join('')}
          </div>
        ` : ''}
        
        ${item.compatibleClasses && item.compatibleClasses.length > 0 ? `
          <div class="item-classes">
            <span class="classes-label">Classes:</span>
            ${item.compatibleClasses.map(cls => `<span class="class-badge">${cls}</span>`).join('')}
          </div>
        ` : ''}
        
        <div class="card-actions">
          <button class="btn btn-primary btn-sm" data-action="view-item-details" data-item-id="${item.id}">
            👁️ Detalhes
          </button>
          <button class="btn btn-secondary btn-sm" data-page="create-build" data-item-id="${item.id}">
            ➕ Usar na Build
          </button>
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
      
      /* Equipment Grid */
      .equipment-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(min(300px, 100%), 1fr));
        gap: 25px;
        margin-bottom: 40px;
      }
      
      @media (max-width: 600px) {
        .equipment-grid {
          grid-template-columns: 1fr;
        }
      }
      
      .equipment-card {
        background: var(--color-surface);
        border: 2px solid var(--color-border);
        border-radius: 12px;
        padding: 20px;
        transition: all 0.3s ease;
      }
      
      .equipment-card:hover {
        border-color: var(--color-primary);
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
      }
      
      .equipment-card.rarity-comum { border-left: 4px solid #9ca3af; }
      .equipment-card.rarity-raro { border-left: 4px solid #3b82f6; }
      .equipment-card.rarity-epico { border-left: 4px solid #a855f7; }
      .equipment-card.rarity-lendario { border-left: 4px solid #f59e0b; }
      
      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
      }
      
      .item-icon {
        width: 48px !important;
        height: 48px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        font-size: 2rem;
      }
      
      .item-rarity {
        font-size: 1.5rem;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
      }
      
      .item-name {
        font-size: 1.3rem;
        margin-bottom: 8px;
        color: var(--color-text);
        font-weight: 600;
      }
      
      .item-type {
        color: var(--color-text-secondary);
        font-size: 0.95rem;
        text-transform: capitalize;
        margin-bottom: 12px;
        font-weight: 500;
      }
      
      .item-level {
        display: flex;
        gap: 8px;
        align-items: center;
        margin-bottom: 12px;
        padding: 6px 10px;
        background: rgba(255, 215, 0, 0.1);
        border-radius: 6px;
        border-left: 3px solid var(--color-secondary);
      }
      
      .level-label {
        color: var(--color-secondary);
        font-weight: 600;
        font-size: 0.85rem;
      }
      
      .level-value {
        color: var(--color-text);
        font-weight: 700;
      }
      
      .item-stats {
        margin-bottom: 15px;
        padding: 10px;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 8px;
      }
      
      .stat-row {
        display: flex;
        justify-content: space-between;
        padding: 6px 0;
        border-bottom: 1px solid var(--color-border);
      }
      
      .stat-row:last-child {
        border-bottom: none;
      }
      
      .stat-name {
        color: var(--color-text-secondary);
        font-size: 0.9rem;
      }
      
      .stat-value {
        font-weight: bold;
        color: var(--color-success);
        font-size: 0.95rem;
      }
      
      .item-classes {
        display: flex;
        gap: 6px;
        align-items: center;
        margin-bottom: 15px;
        flex-wrap: wrap;
      }
      
      .classes-label {
        font-size: 0.85rem;
        color: var(--color-text-secondary);
        font-weight: 600;
      }
      
      .class-badge {
        background: var(--color-primary);
        color: white;
        padding: 3px 8px;
        border-radius: 12px;
        font-size: 0.75rem;
        font-weight: 600;
      }
      
      .card-actions {
        display: flex;
        gap: 8px;
        margin-top: 15px;
      }
      
      .btn-sm {
        flex: 1;
        padding: 10px 12px;
        font-size: 0.9rem;
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
      
      /* Responsive Design */
      @media (max-width: 1024px) {
        .equipment-container {
          padding: 0 20px;
        }
        
        .equipment-grid {
          grid-template-columns: repeat(auto-fit, minmax(min(280px, 100%), 1fr));
        }
      }
      
      @media (max-width: 768px) {
        .equipment-container {
          padding: 0 15px;
        }
        
        .equipment-header {
          flex-direction: column;
          text-align: center;
          gap: 25px;
          padding-bottom: 20px;
        }
        
        .header-stats {
          gap: 20px;
          justify-content: center;
        }
        
        .filters-container {
          flex-direction: column;
          align-items: stretch;
          gap: 12px;
        }
        
        .search-box {
          min-width: auto;
          order: -1;
        }
        
        .filter-select {
          min-width: auto;
        }
        
        .section-header {
          flex-direction: column;
          align-items: flex-start;
          gap: 15px;
        }
        
        .equipment-grid {
          grid-template-columns: 1fr;
        }
      }
      
      @media (max-width: 600px) {
        .equipment-container {
          padding: 0 12px;
        }
        
        .equipment-header {
          padding: 20px 15px;
        }
        
        .page-title {
          font-size: clamp(1.5rem, 5vw, 2rem);
        }
        
        .stat-value {
          font-size: 2rem;
        }
        
        .equipment-card {
          padding: 18px 15px;
        }
        
        .item-name {
          font-size: 1.2rem;
        }
      }
      
      @media (max-width: 360px) {
        .equipment-container {
          padding: 0 8px;
        }
        
        .equipment-header {
          padding: 15px 10px;
        }
        
        .page-title {
          font-size: 1.4rem;
        }
        
        .equipment-card {
          padding: 12px 8px;
        }
        
        .item-icon {
          width: 36px !important;
          height: 36px !important;
        }
        
        .item-name {
          font-size: 1rem;
        }
        
        .btn-sm {
          padding: 8px 10px;
          font-size: 0.85rem;
        }
      }
      
      /* Touch improvements */
      @media (hover: none) and (pointer: coarse) {
        .btn, .filter-select, .search-box {
          min-height: 48px;
          touch-action: manipulation;
        }
        
        .equipment-card {
          transition: transform 0.2s ease;
        }
        
        .equipment-card:active {
          transform: scale(0.98);
        }
        
        .btn:active {
          transform: scale(0.95);
        }
      }
    `
    
    document.head.appendChild(styles)
  }
}