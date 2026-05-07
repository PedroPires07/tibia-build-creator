import { tibiaData } from '../data/tibiaData.js'
import { getItemImage, getClassIcon, getSlotIconHtml, getStatIconHtml, addTibiaImageStyles } from '../tibiaImages.js'
import ApiService from '../services/apiService.js'

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
 
    if (params && params.preselect && params.preselect.class) {
      setTimeout(() => {
        this.showClassPreselectedNotification(params.preselect.class)
        this.filterEquipment()
        this.updatePreview()
      }, 200)
    }
  }
  
  renderBuildHeader() {
    return `
      <header class="build-header">
        <div class="header-content">
          <h1 class="page-title">Criar Nova Build</h1>
          <p class="page-subtitle">
            Monte a build perfeita para seu personagem. Configure equipamentos e veja as estatísticas em tempo real.
          </p>
        </div>
        <div class="header-actions">
          <button class="btn btn-outline" id="reset-build">
            Resetar Build
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
            <label for="build-name" class="form-label">Nome da Build</label>
            <input 
              type="text" 
              id="build-name" 
              class="form-input" 
              placeholder="Ex: Tank PvP Elite"
              value="${this.currentBuild.name}"
            >
          </div>
          
          <div class="form-group">
            <label for="build-class" class="form-label">Classe</label>
            <select id="build-class" class="form-select">
              <option value="">Selecione uma classe</option>
              <option value="Knight" ${this.currentBuild.class === 'Knight' ? 'selected' : ''}>Knight</option>
              <option value="Paladin" ${this.currentBuild.class === 'Paladin' ? 'selected' : ''}>Paladin</option>
              <option value="Druid" ${this.currentBuild.class === 'Druid' ? 'selected' : ''}>Druid</option>
              <option value="Sorcerer" ${this.currentBuild.class === 'Sorcerer' ? 'selected' : ''}>Sorcerer</option>
            </select>
          </div>

          <div class="form-group">
            <label for="build-level" class="form-label">Level</label>
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
      { id: 'helmet',   name: 'Capacete' },
      { id: 'armor',    name: 'Armadura' },
      { id: 'weapon',   name: 'Arma'     },
      { id: 'shield',   name: 'Escudo'   },
      { id: 'boots',    name: 'Botas'    },
      { id: 'ring',     name: 'Anel'     },
      { id: 'necklace', name: 'Colar'    }
    ]

    return `
      <section class="equipment-section">
        <h2 class="section-title">Equipamentos</h2>
        <div class="equipment-slots-grid">
          ${equipmentSlots.map(slot => this.renderEquipmentSlot(slot)).join('')}
        </div>
        
        <div class="equipment-browser">
          <div class="browser-header">
            <h3 class="browser-title">Navegador de Equipamentos</h3>
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
          <span class="slot-icon">${getSlotIconHtml(slot.id)}</span>
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
        <div class="equipped-item-top">
          <div class="item-thumb">
            ${getItemImage(item.name, item.type)}
          </div>
          <div class="item-name">${item.name}</div>
          <button class="remove-item-btn" title="Remover item">&times;</button>
        </div>
        ${item.stats ? `
          <div class="item-stats">
            ${this.renderItemStats(item.stats)}
          </div>
        ` : ''}
      </div>
    `
  }
  
  renderEmptySlot() {
    return `
      <div class="empty-slot">
        <div class="empty-slot-icon">+</div>
        <div class="empty-slot-text">Clique para equipar</div>
      </div>
    `
  }
  
  renderItemStats(stats) {
    return Object.entries(stats)
      .map(([stat, value]) => `<span class="stat-item">${this.getStatIcon(stat)} +${value}</span>`)
      .join('')
  }
  
  getStatIcon(stat) {
    return getStatIconHtml(stat)
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
      <article class="equipment-card ${isEquipped ? 'equipped' : ''}" data-item-id="${item.id}" title="${item.name}">
        <div class="card-img-box">
          ${getItemImage(item.name, item.type)}
        </div>
        <div class="card-body">
          <span class="rarity-label rarity-${item.rarity}">${item.rarity.toUpperCase()}</span>
          <h4 class="item-name">${item.name}</h4>
          <div class="item-type">${item.type}</div>
          ${item.stats ? `<div class="item-stats">${this.renderItemStats(item.stats)}</div>` : ''}
        </div>
        <div class="card-footer-btn">
          <button class="equip-item-btn ${isEquipped ? 'equip-btn-done' : 'equip-btn-act'}"
                  ${isEquipped ? 'disabled' : ''}>
            ${isEquipped ? 'Equipado' : 'Equipar'}
          </button>
        </div>
      </article>
    `
  }
  
  renderBuildPreview() {
    return `
      <section class="build-preview-section">
        <div class="preview-header">
          <h2 class="section-title">Preview da Build</h2>
          <div class="preview-actions">
            <button class="btn btn-success" id="save-build">
              Salvar Build
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
            <h4 class="stats-title">Estatísticas Totais</h4>
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
      { name: 'Ataque', value: totalStats.attack,  key: 'attack'  },
      { name: 'Defesa', value: totalStats.defense, key: 'defense' },
      { name: 'Vida',   value: totalStats.health,  key: 'health'  },
      { name: 'Mana',   value: totalStats.mana,    key: 'mana'    }
    ].map(stat => `
      <div class="stat-preview">
        <div class="stat-icon">${getStatIconHtml(stat.key)}</div>
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
    document.getElementById('build-name')?.addEventListener('input', (e) => {
      this.currentBuild.name = e.target.value
      this.updatePreview()
    })
    
    document.getElementById('build-class')?.addEventListener('change', (e) => {
      this.currentBuild.class = e.target.value
      this.filterEquipment()
      this.updatePreview()
    })
    
    document.getElementById('build-level')?.addEventListener('input', (e) => {
      this.currentBuild.level = parseInt(e.target.value) || 100
      this.updatePreview()
    })
    
    document.getElementById('equipment-type-filter')?.addEventListener('change', () => {
      this.filterEquipment()
    })
    
    document.getElementById('equipment-rarity-filter')?.addEventListener('change', () => {
      this.filterEquipment()
    })
    
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('equip-item-btn') || e.target.closest('.equip-item-btn')) {
        const btn = e.target.classList.contains('equip-item-btn') ? e.target : e.target.closest('.equip-item-btn')
        const card = btn.closest('.equipment-card')
        const itemId = parseInt(card.dataset.itemId)
        this.equipItem(itemId)
        return
      }
      
      if (e.target.classList.contains('remove-item-btn') || e.target.closest('.remove-item-btn')) {
        const btn = e.target.classList.contains('remove-item-btn') ? e.target : e.target.closest('.remove-item-btn')
        const equippedItem = btn.closest('.equipped-item')
        const itemId = parseInt(equippedItem.dataset.itemId)
        this.unequipItem(itemId)
        return
      }
      
      if (e.target.closest('.empty-slot')) {
        const slot = e.target.closest('.equipment-slot')
        const slotId = slot.dataset.slot
        this.scrollToEquipmentType(slotId)
        return
      }
      
      if (e.target.closest('.equipment-card')) {
        const card = e.target.closest('.equipment-card')
        const itemId = parseInt(card.dataset.itemId)
        this.equipItem(itemId)
        return
      }
    })

    document.getElementById('reset-build')?.addEventListener('click', () => {
      if (confirm('Tem certeza que deseja resetar toda a build? Esta ação não pode ser desfeita.')) {
        this.resetBuild()
      }
    })
    
    document.getElementById('save-build')?.addEventListener('click', () => {
      this.saveBuild()
    })
  }
  
  scrollToEquipmentType(slotId) {
    const typeFilter = document.getElementById('equipment-type-filter')
    if (typeFilter) {
      typeFilter.value = slotId
      this.filterEquipment()
      
      const equipmentBrowser = document.querySelector('.equipment-browser')
      if (equipmentBrowser) {
        equipmentBrowser.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }
  
  equipItem(itemId) {
    const item = this.data.equipment.find(eq => eq.id === itemId)
    if (!item) return
    
    const slot = this.getItemSlot(item.type)
    if (slot) {
      this.currentBuild.equipment[slot] = item
      
      this.showNotification(`${item.name} equipado!`, 'success')
      
      this.render()
    }
  }
  
  unequipItem(itemId) {
    let removedItemName = ''
    Object.keys(this.currentBuild.equipment).forEach(slot => {
      if (this.currentBuild.equipment[slot]?.id === itemId) {
        removedItemName = this.currentBuild.equipment[slot].name
        delete this.currentBuild.equipment[slot]
      }
    })
    
    if (removedItemName) {
      this.showNotification(`${removedItemName} removido!`, 'info')
    }
    
    this.render()
  }
  
  showNotification(message, type = 'info') {
    const notification = document.createElement('div')
    notification.className = `build-notification ${type}`
    notification.textContent = message
    
    const style = document.createElement('style')
    style.textContent = `
      .build-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        font-weight: bold;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      }
      
      .build-notification.success {
        background: #10b981;
        color: white;
      }
      
      .build-notification.info {
        background: #3b82f6;
        color: white;
      }
      
      .build-notification.error {
        background: #ef4444;
        color: white;
      }
      
      @keyframes slideIn {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `
    
    document.head.appendChild(style)
    document.body.appendChild(notification)
    
    setTimeout(() => {
      notification.style.animation = 'slideIn 0.3s ease reverse'
      setTimeout(() => {
        notification.remove()
        style.remove()
      }, 300)
    }, 2000)
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
    const selectedClass = this.currentBuild.class
    
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
    
    if (selectedClass) {
      filteredEquipment = filteredEquipment.filter(item => {
        if (!item.classes || item.classes.length === 0) {
          return true
        }
        return item.classes.includes(selectedClass)
      })
    }
    
    const equipmentGrid = document.querySelector('.equipment-grid')
    if (equipmentGrid) {
      if (filteredEquipment.length === 0) {
        equipmentGrid.innerHTML = `
          <div class="no-equipment-message">
            <p>Nenhum equipamento encontrado com os filtros aplicados.</p>
          </div>
        `
      } else {
        equipmentGrid.innerHTML = filteredEquipment
          .map(item => this.renderEquipmentCard(item))
          .join('')
      }
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
    if (!this.currentBuild.name || this.currentBuild.name.trim() === '') {
      this.showNotification('Por favor, preencha o nome da build.', 'error')
      document.getElementById('build-name')?.focus()
      return
    }
    
    if (!this.currentBuild.class) {
      this.showNotification('Por favor, selecione uma classe.', 'error')
      document.getElementById('build-class')?.focus()
      return
    }
    
    const equipmentCount = Object.keys(this.currentBuild.equipment).length
    if (equipmentCount === 0) {
      if (!confirm('Esta build não tem nenhum equipamento. Deseja salvar mesmo assim?')) {
        return
      }
    }

    this.showNotification('Salvando build...', 'info')

    const buildData = {
      name: this.currentBuild.name,
      class: this.currentBuild.class,
      level: this.currentBuild.level,
      description: `Build criada pelo usuário`,
      equipment: this.currentBuild.equipment,
      stats: this.currentBuild.stats
    }

    ApiService.createBuild(buildData)
      .then(response => {
        this.showNotification('Build salva com sucesso!', 'success')
        
        setTimeout(() => {
          if (confirm('Build salva! Deseja criar outra build?')) {
            this.resetBuild()
          } else {
            document.dispatchEvent(new CustomEvent('navigate-to-page', {
              detail: { page: 'profile' }
            }))
          }
        }, 1500)
      })
      .catch(error => {
        console.error('Erro ao salvar build:', error)
        this.showNotification('Erro ao salvar build. Tente novamente.', 'error')
      })
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
        gap: 8px;
        padding: 8px 12px;
        background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
        color: white;
        font-weight: bold;
        font-size: 0.85rem;
      }

      .slot-icon {
        display: flex;
        align-items: center;
        flex-shrink: 0;
      }

      .slot-icon .tibia-slot-icon {
        width: 22px;
        height: 22px;
      }

      .slot-name {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .slot-content {
        padding: 10px 12px;
        min-height: 80px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .equipped-item {
        display: flex;
        flex-direction: column;
        gap: 6px;
        width: 100%;
      }

      .equipped-item-top {
        display: flex;
        align-items: center;
        gap: 8px;
        width: 100%;
      }

      .item-thumb {
        width: 36px;
        height: 36px;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0,0,0,0.25);
        border-radius: 6px;
        border: 1px solid rgba(160,82,45,0.3);
        overflow: hidden;
      }

      .item-thumb .tibia-item-img {
        width: 32px;
        height: 32px;
        object-fit: contain;
      }

      .item-name {
        flex: 1;
        font-weight: bold;
        font-size: 0.82rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: var(--color-text);
      }

      .item-stats {
        display: flex;
        gap: 5px;
        flex-wrap: wrap;
        padding-left: 2px;
      }

      .stat-item {
        display: inline-flex;
        align-items: center;
        gap: 3px;
        background: rgba(var(--color-primary-rgb), 0.12);
        color: var(--color-primary);
        padding: 2px 6px;
        border-radius: 10px;
        font-size: 0.75rem;
        font-weight: bold;
        line-height: 1;
      }

      .stat-item .tibia-stat-icon {
        width: 14px;
        height: 14px;
        flex-shrink: 0;
      }

      .remove-item-btn {
        background: rgba(255,255,255,0.08);
        border: 1px solid rgba(255,255,255,0.15);
        border-radius: 4px;
        color: rgba(255,255,255,0.6);
        font-size: 0.9rem;
        line-height: 1;
        cursor: pointer;
        padding: 2px 5px;
        flex-shrink: 0;
        transition: all 0.2s;
      }

      .remove-item-btn:hover {
        background: rgba(239,68,68,0.3);
        border-color: rgba(239,68,68,0.5);
        color: #ef4444;
      }

      .empty-slot {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        opacity: 0.5;
        cursor: pointer;
        transition: opacity 0.2s;
      }

      .empty-slot:hover {
        opacity: 0.9;
      }

      .empty-slot-icon {
        font-size: 1.6rem;
        color: var(--color-text-secondary);
      }

      .empty-slot-text {
        font-size: 0.8rem;
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
        grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
        gap: 10px;
      }

      .equipment-card {
        background: var(--color-background);
        border: 2px solid var(--color-border);
        border-radius: 10px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        cursor: pointer;
        transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
      }

      .equipment-card:hover {
        border-color: var(--color-primary);
        transform: translateY(-2px);
        box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);
      }

      .equipment-card .card-img-box {
        width: 100%;
        aspect-ratio: 1 / 1;
        max-height: 100px;
        background: rgba(0,0,0,0.35);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 8px;
        overflow: hidden;
      }

      .equipment-card .card-img-box img {
        max-width: 72px;
        max-height: 72px;
        width: auto;
        height: auto;
        object-fit: contain;
        image-rendering: pixelated;
        image-rendering: crisp-edges;
      }

      .equipment-card .card-body {
        padding: 7px 9px 5px;
        flex: 1;
      }

      .equipment-card .rarity-label {
        display: inline-block;
        font-size: 0.58rem;
        font-weight: 700;
        letter-spacing: 0.5px;
        text-transform: uppercase;
        margin-bottom: 2px;
      }
      .rarity-label.rarity-common    { color: #9ca3af; }
      .rarity-label.rarity-uncommon  { color: #10b981; }
      .rarity-label.rarity-rare      { color: #60a5fa; }
      .rarity-label.rarity-epic      { color: #c084fc; }
      .rarity-label.rarity-legendary { color: #fbbf24; }

      .equipment-card .item-name {
        font-size: 0.78rem;
        font-weight: 600;
        color: var(--color-text);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin: 0 0 3px;
        line-height: 1.2;
      }

      .equipment-card .item-type {
        color: var(--color-text-secondary);
        font-size: 0.68rem;
        text-transform: capitalize;
        margin-bottom: 4px;
      }

      .equipment-card .item-stats {
        display: flex;
        flex-wrap: wrap;
        gap: 3px;
      }

      .equipment-card .card-footer-btn {
        border-top: 1px solid var(--color-border);
      }

      .equip-item-btn {
        width: 100%;
        padding: 6px 4px;
        font-size: 0.72rem;
        font-weight: 600;
        border: none;
        cursor: pointer;
        transition: background 0.15s;
      }

      .equip-btn-act {
        background: rgba(var(--color-primary-rgb), 0.15);
        color: var(--color-primary);
      }
      .equip-btn-act:hover {
        background: rgba(var(--color-primary-rgb), 0.3);
      }

      .equip-btn-done {
        background: rgba(16,185,129,0.15);
        color: #10b981;
        cursor: not-allowed;
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
          grid-template-columns: repeat(3, 1fr);
          gap: 7px;
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
    
    const extraStyles = document.createElement('style')
    extraStyles.id = 'create-build-extra-styles'
    extraStyles.textContent = `
      /* Mensagem de nenhum equipamento */
      .no-equipment-message {
        grid-column: 1 / -1;
        text-align: center;
        padding: 60px 20px;
        color: var(--color-text-secondary);
        font-size: 1.1rem;
      }
      
      /* Melhorar aparência do botão Equipar */
      .equip-item-btn {
        width: 100%;
        padding: 10px;
        font-weight: bold;
        transition: all 0.3s ease;
      }
      
      .equip-item-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        background: #10b981 !important;
      }
      
      .equip-item-btn:not(:disabled):hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(186, 85, 211, 0.4);
      }
      
      /* Item já equipado */
      .equipment-card.equipped {
        border-color: #10b981;
        background: rgba(16, 185, 129, 0.05);
      }
      
      .equipment-card.equipped .item-name {
        color: #10b981;
      }
      
      /* Melhorar aparência dos slots vazios */
      .equipment-slot .empty-slot {
        cursor: pointer;
        transition: all 0.3s ease;
      }
      
      .equipment-slot:hover .empty-slot {
        opacity: 1;
        transform: scale(1.02);
      }
      
      .equipment-slot:hover .empty-slot-icon {
        transform: scale(1.15);
      }
    `
    
    if (!document.getElementById('create-build-extra-styles')) {
      document.head.appendChild(extraStyles)
    }
  }
  
  showClassPreselectedNotification(className) {
    const notification = document.createElement('div')
    notification.className = 'class-preselected-notification'
    notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-text">Classe <strong>${className}</strong> pré-selecionada!</span>
      </div>
    `
    
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
    
    setTimeout(() => {
      notification.classList.add('show')
    }, 100)
    
    setTimeout(() => {
      notification.style.transform = 'translateX(300px)'
      setTimeout(() => {
        notification.remove()
        notificationStyles.remove()
      }, 300)
    }, 3000)
  }
}