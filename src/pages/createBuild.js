// Create Build Page Renderer - Página de criação de builds responsiva
import { tibiaData } from '../data/tibiaData.js'
import { getItemImage, getRarityIcon, getClassIcon, addTibiaImageStyles } from '../tibiaImages.js'

export class CreateBuildRenderer {
  constructor() {
    this.data = tibiaData
    this.currentBuild = {
      name: '',
      class: '',
      level: 100,
      equipment: {},
      stats: {
        attack: 0,
        defense: 0,
        health: 0,
        mana: 0
      }
    }
  }
  
  render(params = null) {
    if (params && params.preselect && params.preselect.class) {
      console.log('Preselecting class:', params.preselect.class)
      this.currentBuild.class = params.preselect.class
      // Reset other properties when changing class
      this.currentBuild.equipment = {}
      this.currentBuild.stats = {
        attack: 0,
        defense: 0, 
        health: 0,
        mana: 0
      }
    }
    
    const createBuildContent = document.querySelector('#create-build-page .content')
    if (!createBuildContent) {
      // Se não há .content div, renderizar direto na página
      const createBuildPage = document.querySelector('#create-build-page')
      if (!createBuildPage) return
      
      createBuildPage.innerHTML = `
        <div class="container">
          ${this.renderBuildHeader()}
          ${this.renderBuildForm()}
          ${this.renderEquipmentSelector()}
          ${this.renderBuildPreview()}
        </div>
      `
    } else {
      createBuildContent.innerHTML = `
        <div class="create-build-container">
          ${this.renderBuildHeader()}
          ${this.renderBuildForm()}
          ${this.renderEquipmentSelector()}
          ${this.renderBuildPreview()}
        </div>
      `
    }
    
    this.addCreateBuildStyles()
    addTibiaImageStyles()
    this.addEventListeners()
    
    // Se classe foi pré-selecionada, mostrar notificação e atualizar filtros
    if (params && params.preselect && params.preselect.class) {
      // Pequeno delay para garantir que a página foi renderizada
      setTimeout(() => {
        this.showClassPreselectedNotification(params.preselect.class)
        // Filtrar equipamentos automaticamente pela classe pré-selecionada
        this.filterEquipment()
        this.updatePreview()
      }, 200)
    }
  }
  
  renderBuildHeader() {
    return `
      <header class="build-header">
        <div class="header-content">
          <h1 class="page-title">🔨 Criar Nova Build</h1>
          <p class="page-subtitle">
            Monte a build perfeita para seu personagem. Configure equipamentos e veja as estatísticas em tempo real.
          </p>
        </div>
        <div class="header-actions">
          <button class="btn btn-outline" id="reset-build">
            🔄 Resetar Build
          </button>
        </div>
      </header>
    `
  }
  
  renderBuildForm() {
    return `
      <section class="build-form-section">
        <div class="form-grid">
          <div class="form-group">
            <label for="build-name" class="form-label">📝 Nome da Build</label>
            <input 
              type="text" 
              id="build-name" 
              class="form-input" 
              placeholder="Ex: Tank PvP Elite"
              value="${this.currentBuild.name}"
            >
          </div>
          
          <div class="form-group">
            <label for="build-class" class="form-label">👥 Classe</label>
            <select id="build-class" class="form-select">
              <option value="">Selecione uma classe</option>
              <option value="Knight" ${this.currentBuild.class === 'Knight' ? 'selected' : ''}>
                🛡️ Knight
              </option>
              <option value="Paladin" ${this.currentBuild.class === 'Paladin' ? 'selected' : ''}>
                🏹 Paladin
              </option>
              <option value="Druid" ${this.currentBuild.class === 'Druid' ? 'selected' : ''}>
                🌿 Druid
              </option>
              <option value="Sorcerer" ${this.currentBuild.class === 'Sorcerer' ? 'selected' : ''}>
                🔮 Sorcerer
              </option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="build-level" class="form-label">⏫ Level</label>
            <input 
              type="number" 
              id="build-level" 
              class="form-input" 
              min="1" 
              max="1000"
              value="${this.currentBuild.level}"
            >
          </div>
        </div>
      </section>
    `
  }
  
  renderEquipmentSelector() {
    const equipmentSlots = [
      { id: 'helmet', name: 'Capacete', icon: '⛑️' },
      { id: 'armor', name: 'Armadura', icon: '🛡️' },
      { id: 'weapon', name: 'Arma', icon: '⚔️' },
      { id: 'shield', name: 'Escudo', icon: '🛡️' },
      { id: 'boots', name: 'Botas', icon: '👢' },
      { id: 'ring', name: 'Anel', icon: '💍' },
      { id: 'necklace', name: 'Colar', icon: '📿' }
    ]
    
    return `
      <section class="equipment-section">
        <h2 class="section-title">⚔️ Equipamentos</h2>
        <div class="equipment-slots-grid">
          ${equipmentSlots.map(slot => this.renderEquipmentSlot(slot)).join('')}
        </div>
        
        <div class="equipment-browser">
          <div class="browser-header">
            <h3 class="browser-title">🎒 Navegador de Equipamentos</h3>
            <div class="browser-filters">
              <select id="equipment-type-filter" class="filter-select">
                <option value="">Todos os tipos</option>
                <option value="weapon">Armas</option>
                <option value="armor">Armaduras</option>
                <option value="shield">Escudos</option>
                <option value="helmet">Capacetes</option>
                <option value="boots">Botas</option>
                <option value="ring">Anéis</option>
                <option value="necklace">Colares</option>
              </select>
              
              <select id="equipment-rarity-filter" class="filter-select">
                <option value="">Todas as raridades</option>
                <option value="common">Comum</option>
                <option value="rare">Raro</option>
                <option value="epic">Épico</option>
                <option value="legendary">Lendário</option>
              </select>
            </div>
          </div>
          
          <div class="equipment-list" id="equipment-list">
            ${this.renderEquipmentList()}
          </div>
        </div>
      </section>
    `
  }
  
  renderEquipmentSlot(slot) {
    const currentItem = this.currentBuild.equipment[slot.id]
    
    return `
      <div class="equipment-slot" data-slot="${slot.id}">
        <div class="slot-header">
          <span class="slot-icon">${slot.icon}</span>
          <span class="slot-name">${slot.name}</span>
        </div>
        <div class="slot-content ${currentItem ? 'equipped' : 'empty'}">
          ${currentItem ? this.renderEquippedItem(currentItem) : this.renderEmptySlot()}
        </div>
      </div>
    `
  }
  
  renderEquippedItem(item) {
    return `
      <div class="equipped-item" data-item-id="${item.id}">
        <div class="item-icon-container">
          ${getItemImage(item.name, item.type)}
          ${getRarityIcon(item.rarity)}
        </div>
        <div class="item-info">
          <div class="item-name">${item.name}</div>
          <div class="item-stats">
            ${item.stats ? this.renderItemStats(item.stats) : ''}
          </div>
        </div>
        <button class="remove-item-btn" title="Remover item">❌</button>
      </div>
    `
  }
  
  renderEmptySlot() {
    return `
      <div class="empty-slot">
        <div class="empty-slot-icon">➕</div>
        <div class="empty-slot-text">Clique para equipar</div>
      </div>
    `
  }
  
  renderItemStats(stats) {
    return Object.entries(stats)
      .map(([stat, value]) => `
        <span class="stat-item">
          ${this.getStatIcon(stat)} +${value}
        </span>
      `).join(' ')
  }
  
  getStatIcon(stat) {
    const icons = {
      attack: '⚔️',
      defense: '🛡️',
      health: '❤️',
      mana: '💙',
      accuracy: '🎯',
      magic: '✨'
    }
    return icons[stat] || '📊'
  }
  
  renderEquipmentList() {
    return `
      <div class="equipment-grid">
        ${this.data.equipment.map(item => this.renderEquipmentCard(item)).join('')}
      </div>
    `
  }
  
  renderEquipmentCard(item) {
    const isEquipped = Object.values(this.currentBuild.equipment).some(equipped => equipped?.id === item.id)
    
    return `
      <article class="equipment-card ${isEquipped ? 'equipped' : ''}" data-item-id="${item.id}">
        <div class="card-header">
          <div class="item-icon">
            ${getItemImage(item.name, item.type)}
            ${getRarityIcon(item.rarity)}
          </div>
          <div class="item-rarity rarity-${item.rarity}">
            ${item.rarity}
          </div>
        </div>
        
        <h4 class="item-name">${item.name}</h4>
        
        <div class="item-type">${item.type}</div>
        
        ${item.stats ? `
          <div class="item-stats">
            ${this.renderItemStats(item.stats)}
          </div>
        ` : ''}
        
        <div class="card-actions">
          <button class="btn btn-primary btn-sm equip-item-btn" 
                  ${isEquipped ? 'disabled' : ''}>
            ${isEquipped ? '✅ Equipado' : '⚡ Equipar'}
          </button>
        </div>
      </article>
    `
  }
  
  renderBuildPreview() {
    return `
      <section class="build-preview-section">
        <div class="preview-header">
          <h2 class="section-title">👁️ Preview da Build</h2>
          <div class="preview-actions">
            <button class="btn btn-success" id="save-build">
              💾 Salvar Build
            </button>
          </div>
        </div>
        
        <div class="preview-content">
          <div class="build-summary">
            <div class="summary-info">
              <h3 class="build-title">${this.currentBuild.name || 'Nova Build'}</h3>
              <div class="build-meta">
                ${this.currentBuild.class ? `
                  <span class="build-class">
                    ${getClassIcon(this.currentBuild.class)} ${this.currentBuild.class}
                  </span>
                ` : ''}
                <span class="build-level">Lv. ${this.currentBuild.level}</span>
              </div>
            </div>
          </div>
          
          <div class="stats-preview">
            <h4 class="stats-title">📊 Estatísticas Totais</h4>
            <div class="stats-grid">
              ${this.renderStatsPreview()}
            </div>
          </div>
        </div>
      </section>
    `
  }
  
  renderStatsPreview() {
    const totalStats = this.calculateTotalStats()
    
    return [
      { name: 'Ataque', value: totalStats.attack, icon: '⚔️' },
      { name: 'Defesa', value: totalStats.defense, icon: '🛡️' },
      { name: 'Vida', value: totalStats.health, icon: '❤️' },
      { name: 'Mana', value: totalStats.mana, icon: '💙' }
    ].map(stat => `
      <div class="stat-preview">
        <div class="stat-icon">${stat.icon}</div>
        <div class="stat-info">
          <div class="stat-value">${stat.value}</div>
          <div class="stat-name">${stat.name}</div>
        </div>
      </div>
    `).join('')
  }
  
  calculateTotalStats() {
    const stats = { attack: 0, defense: 0, health: 0, mana: 0 }
    
    Object.values(this.currentBuild.equipment).forEach(item => {
      if (item && item.stats) {
        Object.entries(item.stats).forEach(([stat, value]) => {
          if (stats.hasOwnProperty(stat)) {
            stats[stat] += value
          }
        })
      }
    })
    
    return stats
  }
  
  addEventListeners() {
    // Form inputs
    document.getElementById('build-name')?.addEventListener('input', (e) => {
      this.currentBuild.name = e.target.value
      this.updatePreview()
    })
    
    document.getElementById('build-class')?.addEventListener('change', (e) => {
      this.currentBuild.class = e.target.value
      this.updatePreview()
    })
    
    document.getElementById('build-level')?.addEventListener('input', (e) => {
      this.currentBuild.level = parseInt(e.target.value) || 100
      this.updatePreview()
    })
    
    // Equipment filters
    document.getElementById('equipment-type-filter')?.addEventListener('change', () => {
      this.filterEquipment()
    })
    
    document.getElementById('equipment-rarity-filter')?.addEventListener('change', () => {
      this.filterEquipment()
    })
    
    // Equipment cards
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('equip-item-btn')) {
        const card = e.target.closest('.equipment-card')
        const itemId = parseInt(card.dataset.itemId)
        this.equipItem(itemId)
      }
      
      if (e.target.classList.contains('remove-item-btn')) {
        const equippedItem = e.target.closest('.equipped-item')
        const itemId = parseInt(equippedItem.dataset.itemId)
        this.unequipItem(itemId)
      }
    })
    
    // Reset and save
    document.getElementById('reset-build')?.addEventListener('click', () => {
      this.resetBuild()
    })
    
    document.getElementById('save-build')?.addEventListener('click', () => {
      this.saveBuild()
    })
  }
  
  equipItem(itemId) {
    const item = this.data.equipment.find(eq => eq.id === itemId)
    if (!item) return
    
    // Determinar slot do item
    const slot = this.getItemSlot(item.type)
    if (slot) {
      this.currentBuild.equipment[slot] = item
      this.render() // Re-render para atualizar UI
    }
  }
  
  unequipItem(itemId) {
    Object.keys(this.currentBuild.equipment).forEach(slot => {
      if (this.currentBuild.equipment[slot]?.id === itemId) {
        delete this.currentBuild.equipment[slot]
      }
    })
    this.render()
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
    return slotMap[itemType]
  }
  
  filterEquipment() {
    const typeFilter = document.getElementById('equipment-type-filter')?.value
    const rarityFilter = document.getElementById('equipment-rarity-filter')?.value
    
    let filteredEquipment = this.data.equipment
    
    if (typeFilter) {
      filteredEquipment = filteredEquipment.filter(item => 
        this.getItemSlot(item.type) === typeFilter
      )
    }
    
    if (rarityFilter) {
      filteredEquipment = filteredEquipment.filter(item => 
        item.rarity === rarityFilter
      )
    }
    
    const equipmentGrid = document.querySelector('.equipment-grid')
    if (equipmentGrid) {
      equipmentGrid.innerHTML = filteredEquipment
        .map(item => this.renderEquipmentCard(item))
        .join('')
    }
  }
  
  updatePreview() {
    const buildTitle = document.querySelector('.build-title')
    const buildMeta = document.querySelector('.build-meta')
    const statsGrid = document.querySelector('.stats-grid')
    
    if (buildTitle) {
      buildTitle.textContent = this.currentBuild.name || 'Nova Build'
    }
    
    if (buildMeta) {
      buildMeta.innerHTML = `
        ${this.currentBuild.class ? `
          <span class="build-class">
            ${getClassIcon(this.currentBuild.class)} ${this.currentBuild.class}
          </span>
        ` : ''}
        <span class="build-level">Lv. ${this.currentBuild.level}</span>
      `
    }
    
    if (statsGrid) {
      statsGrid.innerHTML = this.renderStatsPreview()
    }
  }
  
  resetBuild() {
    this.currentBuild = {
      name: '',
      class: '',
      level: 100,
      equipment: {},
      stats: { attack: 0, defense: 0, health: 0, mana: 0 }
    }
    this.render()
  }
  
  saveBuild() {
    if (!this.currentBuild.name || !this.currentBuild.class) {
      alert('Por favor, preencha o nome e a classe da build.')
      return
    }
    
    // Aqui você implementaria o salvamento
    console.log('Salvando build:', this.currentBuild)
    alert('Build salva com sucesso!')
  }
  
  addCreateBuildStyles() {
    if (document.querySelector('#create-build-responsive-styles')) return
    
    const styles = document.createElement('style')
    styles.id = 'create-build-responsive-styles'
    styles.textContent = `
      /* Create Build Page Responsive Styles */
      .create-build-container {
        max-width: 1400px;
        margin: 0 auto;
        padding: 0 20px;
      }
      
      /* Header */
      .build-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 40px;
        padding-bottom: 20px;
        border-bottom: 2px solid var(--color-border);
      }
      
      .page-title {
        font-size: clamp(1.8rem, 4vw, 2.5rem);
        color: var(--color-primary);
        margin-bottom: 10px;
      }
      
      .page-subtitle {
        color: var(--color-text-secondary);
        font-size: 1.1rem;
        line-height: 1.5;
      }
      
      /* Form Section */
      .build-form-section {
        background: var(--color-surface);
        border: 2px solid var(--color-border);
        border-radius: 15px;
        padding: 30px;
        margin-bottom: 40px;
      }
      
      .form-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 25px;
      }
      
      .form-group {
        display: flex;
        flex-direction: column;
      }
      
      .form-label {
        font-weight: bold;
        margin-bottom: 8px;
        color: var(--color-primary);
        font-size: 1.1rem;
      }
      
      .form-input, .form-select {
        padding: 12px 16px;
        border: 2px solid var(--color-border);
        border-radius: 8px;
        background: var(--color-background);
        color: var(--color-text);
        font-size: 1rem;
        transition: all 0.3s ease;
      }
      
      .form-input:focus, .form-select:focus {
        outline: none;
        border-color: var(--color-primary);
        box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb), 0.1);
      }
      
      /* Equipment Section */
      .equipment-section {
        margin-bottom: 40px;
      }
      
      .section-title {
        font-size: 1.8rem;
        color: var(--color-primary);
        margin-bottom: 30px;
        text-align: center;
      }
      
      .equipment-slots-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
        margin-bottom: 40px;
      }
      
      .equipment-slot {
        background: var(--color-surface);
        border: 2px solid var(--color-border);
        border-radius: 12px;
        overflow: hidden;
        transition: all 0.3s ease;
      }
      
      .equipment-slot:hover {
        border-color: var(--color-primary);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
      }
      
      .slot-header {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 15px;
        background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
        color: white;
        font-weight: bold;
      }
      
      .slot-icon {
        font-size: 1.2rem;
      }
      
      .slot-content {
        padding: 15px;
        min-height: 100px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .equipped-item {
        display: flex;
        align-items: center;
        gap: 10px;
        width: 100%;
        position: relative;
      }
      
      .item-icon-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: 1.5rem;
      }
      
      .item-info {
        flex: 1;
      }
      
      .item-name {
        font-weight: bold;
        margin-bottom: 5px;
      }
      
      .item-stats {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }
      
      .stat-item {
        background: rgba(var(--color-primary-rgb), 0.1);
        color: var(--color-primary);
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 0.8rem;
        font-weight: bold;
      }
      
      .remove-item-btn {
        background: none;
        border: none;
        font-size: 1rem;
        cursor: pointer;
        padding: 5px;
        opacity: 0.7;
        transition: opacity 0.3s;
      }
      
      .remove-item-btn:hover {
        opacity: 1;
      }
      
      .empty-slot {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        opacity: 0.6;
        cursor: pointer;
        transition: opacity 0.3s;
      }
      
      .empty-slot:hover {
        opacity: 1;
      }
      
      .empty-slot-icon {
        font-size: 2rem;
      }
      
      .empty-slot-text {
        font-size: 0.9rem;
        color: var(--color-text-secondary);
      }
      
      /* Equipment Browser */
      .equipment-browser {
        background: var(--color-surface);
        border: 2px solid var(--color-border);
        border-radius: 15px;
        padding: 25px;
      }
      
      .browser-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 25px;
        flex-wrap: wrap;
        gap: 15px;
      }
      
      .browser-title {
        font-size: 1.4rem;
        color: var(--color-primary);
      }
      
      .browser-filters {
        display: flex;
        gap: 15px;
        flex-wrap: wrap;
      }
      
      .filter-select {
        padding: 8px 12px;
        border: 2px solid var(--color-border);
        border-radius: 6px;
        background: var(--color-background);
        color: var(--color-text);
        min-width: 150px;
      }
      
      .equipment-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 20px;
      }
      
      .equipment-card {
        background: var(--color-background);
        border: 2px solid var(--color-border);
        border-radius: 12px;
        padding: 20px;
        transition: all 0.3s ease;
        cursor: pointer;
      }
      
      .equipment-card:hover {
        border-color: var(--color-primary);
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
      }
      
      .equipment-card.equipped {
        border-color: var(--color-success);
        background: rgba(var(--color-success-rgb), 0.05);
      }
      
      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
      }
      
      .item-icon {
        font-size: 1.5rem;
        display: flex;
        gap: 5px;
      }
      
      .item-rarity {
        padding: 4px 10px;
        border-radius: 12px;
        font-size: 0.8rem;
        font-weight: bold;
        text-transform: uppsecase;
      }
      
      .rarity-common { background: #9ca3af; color: white; }
      .rarity-rare { background: #3b82f6; color: white; }
      .rarity-epic { background: #a855f7; color: white; }
      .rarity-legendary { background: #f59e0b; color: white; }
      
      .item-type {
        color: var(--color-text-secondary);
        font-size: 0.9rem;
        margin-bottom: 10px;
        text-transform: capitalize;
      }
      
      .card-actions {
        margin-top: 15px;
      }
      
      /* Build Preview */
      .build-preview-section {
        background: var(--color-surface);
        border: 2px solid var(--color-border);
        border-radius: 15px;
        padding: 30px;
      }
      
      .preview-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 25px;
        flex-wrap: wrap;
        gap: 15px;
      }
      
      .build-summary {
        margin-bottom: 30px;
        padding: 20px;
        background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
        border-radius: 12px;
        color: white;
      }
      
      .build-title {
        font-size: 1.5rem;
        margin-bottom: 10px;
      }
      
      .build-meta {
        display: flex;
        gap: 15px;
        align-items: center;
        flex-wrap: wrap;
      }
      
      .build-class, .build-level {
        background: rgba(255, 255, 255, 0.2);
        padding: 5px 12px;
        border-radius: 15px;
        font-size: 0.9rem;
        font-weight: bold;
      }
      
      .stats-preview {
        padding: 20px;
        background: var(--color-background);
        border-radius: 12px;
      }
      
      .stats-title {
        text-align: center;
        margin-bottom: 20px;
        color: var(--color-primary);
      }
      
      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        gap: 15px;
      }
      
      .stat-preview {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        padding: 15px;
        background: var(--color-surface);
        border-radius: 10px;
        border: 1px solid var(--color-border);
      }
      
      .stat-icon {
        font-size: 1.5rem;
      }
      
      .stat-value {
        font-size: 1.4rem;
        font-weight: bold;
        color: var(--color-primary);
      }
      
      .stat-name {
        font-size: 0.9rem;
        color: var(--color-text-secondary);
      }
      
      /* Responsive Design */
      @media (max-width: 768px) {
        .create-build-container {
          padding: 0 15px;
        }
        
        .build-header {
          flex-direction: column;
          align-items: flex-start;
          gap: 20px;
        }
        
        .form-grid {
          grid-template-columns: 1fr;
        }
        
        .equipment-slots-grid {
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        }
        
        .browser-header {
          flex-direction: column;
          align-items: flex-start;
        }
        
        .browser-filters {
          width: 100%;
          justify-content: stretch;
        }
        
        .filter-select {
          flex: 1;
          min-width: auto;
        }
        
        .equipment-grid {
          grid-template-columns: 1fr;
        }
        
        .preview-header {
          flex-direction: column;
          align-items: flex-start;
        }
        
        .stats-grid {
          grid-template-columns: repeat(2, 1fr);
        }
      }
      
      @media (max-width: 480px) {
        .create-build-container {
          padding: 0 10px;
        }
        
        .build-form-section, .equipment-browser, .build-preview-section {
          padding: 20px 15px;
        }
        
        .equipment-slots-grid {
          grid-template-columns: 1fr;
        }
        
        .browser-filters {
          flex-direction: column;
        }
        
        .stats-grid {
          grid-template-columns: 1fr;
        }
        
        .build-meta {
          flex-direction: column;
          align-items: flex-start;
        }
      }
    `
    
    document.head.appendChild(styles)
  }
  
  showClassPreselectedNotification(className) {
    // Criar notificação temporária
    const notification = document.createElement('div')
    notification.className = 'class-preselected-notification'
    notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-icon">✅</span>
        <span class="notification-text">Classe <strong>${className}</strong> pré-selecionada!</span>
      </div>
    `
    
    // Adicionar estilos da notificação
    const notificationStyles = document.createElement('style')
    notificationStyles.textContent = `
      .class-preselected-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #4CAF50, #45a049);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        transform: translateX(300px);
        transition: transform 0.3s ease;
        font-family: var(--font-body);
      }
      
      .class-preselected-notification.show {
        transform: translateX(0);
      }
      
      .notification-content {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      
      .notification-icon {
        font-size: 1.2em;
      }
      
      .notification-text {
        font-size: 0.9em;
      }
    `
    
    document.head.appendChild(notificationStyles)
    document.body.appendChild(notification)
    
    // Mostrar notificação com animação
    setTimeout(() => {
      notification.classList.add('show')
    }, 100)
    
    // Remover notificação após 3 segundos
    setTimeout(() => {
      notification.style.transform = 'translateX(300px)'
      setTimeout(() => {
        notification.remove()
        notificationStyles.remove()
      }, 300)
    }, 3000)
  }
}