// Builds Page Renderer - Página dedicada a builds da comunidade
import { tibiaData } from '../data/tibiaData.js'
import { getItemImage, getRarityIcon, getClassIcon, addTibiaImageStyles } from '../tibiaImages.js'

export class BuildsRenderer {
  constructor() {
    this.data = tibiaData
    this.currentFilter = {
      class: '',
      level: '',
      search: ''
    }
    this.selectedBuild = null
  }
  
  render() {
    const buildsContent = document.querySelector('#builds-page .content')
    if (!buildsContent) {
      const buildsPage = document.querySelector('#builds-page')
      if (!buildsPage) return
      
      buildsPage.innerHTML = `
        <div class="container">
          ${this.renderBuildsHeader()}
          ${this.renderFilters()}
          ${this.renderBuildsSection()}
        </div>
      `
    } else {
      buildsContent.innerHTML = `
        <div class="builds-container">
          ${this.renderBuildsHeader()}
          ${this.renderFilters()}
          ${this.renderBuildsSection()}
        </div>
      `
    }
    
    addTibiaImageStyles()
    this.addBuildsStyles()
    this.addEventListeners()
  }
  
  renderBuildDetails() {
    const buildsContent = document.querySelector('#builds-page .content')
    if (!buildsContent) {
      const buildsPage = document.querySelector('#builds-page')
      if (!buildsPage || !this.selectedBuild) return
      
      const build = this.data.builds.find(b => b.id === this.selectedBuild)
      if (!build) return
      
      buildsPage.innerHTML = `
        <div class="container">
          ${this.renderBuildDetailHeader(build)}
          ${this.renderBuildOverview(build)}
          ${this.renderBuildEquipment(build)}
          ${this.renderBuildStats(build)}
        </div>
      `
    } else {
      if (!this.selectedBuild) return
      
      const build = this.data.builds.find(b => b.id === this.selectedBuild)
      if (!build) return
      
      buildsContent.innerHTML = `
        <div class="build-detail-container">
          ${this.renderBuildDetailHeader(build)}
          ${this.renderBuildOverview(build)}
          ${this.renderBuildEquipment(build)}
          ${this.renderBuildStats(build)}
        </div>
      `
    }
    
    this.addBuildDetailStyles()
    this.addBuildDetailEventListeners()
  }
  
  renderBuildsHeader() {
    return `
      <header class="builds-header">
        <div class="header-content">
          <h1 class="page-title">🔨 Builds da Comunidade</h1>
          <p class="page-subtitle">
            Explore e copie as melhores builds criadas pela comunidade. Encontre estratégias vencedoras para seu estilo de jogo!
          </p>
        </div>
        <div class="header-stats">
          <div class="stat-item">
            <span class="stat-value">${this.data.builds.length}</span>
            <span class="stat-label">Builds Disponíveis</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">4</span>
            <span class="stat-label">Classes</span>
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
                   placeholder="🔍 Buscar builds por nome..."
                   value="${this.currentFilter.search}">
          </div>
          
          <select id="class-filter" class="filter-select">
            <option value="">Todas as classes</option>
            <option value="Knight" ${this.currentFilter.class === 'Knight' ? 'selected' : ''}>🛡️ Knight</option>
            <option value="Paladin" ${this.currentFilter.class === 'Paladin' ? 'selected' : ''}>🏹 Paladin</option>
            <option value="Druid" ${this.currentFilter.class === 'Druid' ? 'selected' : ''}>🌿 Druid</option>
            <option value="Sorcerer" ${this.currentFilter.class === 'Sorcerer' ? 'selected' : ''}>🔮 Sorcerer</option>
          </select>
          
          <select id="level-filter" class="filter-select">
            <option value="">Todos os níveis</option>
            <option value="1-100">Lv. 1-100</option>
            <option value="101-200">Lv. 101-200</option>
            <option value="201-300">Lv. 201-300</option>
            <option value="300+">Lv. 300+</option>
          </select>
        </div>
      </div>
    `
  }
  
  renderBuildsSection() {
    const filteredBuilds = this.filterBuilds()
    
    return `
      <section class="builds-section">
        <div class="section-header">
          <h2 class="section-title">⚔️ Builds Populares</h2>
          <div class="results-count">${filteredBuilds.length} builds encontradas</div>
        </div>
        
        <div class="builds-grid">
          ${filteredBuilds.map(build => this.renderBuildCard(build)).join('')}
        </div>
        
        ${filteredBuilds.length === 0 ? `
          <div class="no-results">
            <div class="no-results-icon">🔍</div>
            <h3>Nenhuma build encontrada</h3>
            <p>Tente ajustar os filtros ou criar uma nova build.</p>
            <button class="btn btn-primary" data-page="create-build">
              🔧 Criar Nova Build
            </button>
          </div>
        ` : ''}
      </section>
    `
  }
  
  renderBuildCard(build) {
    return `
      <article class="build-card" data-build-id="${build.id}">
        <div class="build-card-header">
          <div class="build-class">
            ${getClassIcon(build.class)} ${build.class}
          </div>
          <div class="build-level">Lv. ${build.level}</div>
        </div>
        
        <h3 class="build-name">${build.name}</h3>
        <p class="build-description">${build.description}</p>
        
        <div class="build-equipment-summary">
          <h4 class="summary-title">🎒 Equipamentos Principais:</h4>
          <div class="equipment-icons">
            ${this.renderBuildEquipmentIcons(build.equipment)}
          </div>
        </div>
        
        <div class="build-stats-preview">
          ${this.renderBuildStatsPreview(build)}
        </div>
        
        <div class="build-actions">
          <button class="btn btn-primary" data-action="view-build-details" data-build-id="${build.id}">
            👁️ Ver Detalhes
          </button>
          <button class="btn btn-outline" data-action="edit-build" data-build-id="${build.id}">
            ✏️ Editar
          </button>
        </div>
      </article>
    `
  }
  
  renderBuildEquipmentIcons(equipment) {
    const slots = ['weapon', 'armor', 'helmet', 'shield', 'boots']
    
    return slots.map(slot => {
      const item = equipment[slot]
      return `
        <div class="equipment-icon ${item ? 'equipped' : 'empty'}" 
             title="${item ? item.name : `${slot} vazio`}">
          ${item ? getItemImage(item.name, item.type) : this.getSlotIcon(slot)}
        </div>
      `
    }).join('')
  }
  
  getSlotIcon(slot) {
    const icons = {
      weapon: '⚔️',
      armor: '🛡️', 
      helmet: '⛑️',
      shield: '🛡️',
      boots: '👢'
    }
    return icons[slot] || '❓'
  }
  
  renderBuildStatsPreview(build) {
    const totalStats = this.calculateBuildStats(build)
    
    const statsToShow = [
      { icon: '⚔️', name: 'ATK', value: totalStats.attack, show: totalStats.attack > 0 },
      { icon: '🛡️', name: 'DEF', value: totalStats.defense, show: totalStats.defense > 0 },
      { icon: '❤️', name: 'HP', value: totalStats.health, show: totalStats.health > 0 },
      { icon: '💙', name: 'MP', value: totalStats.mana, show: totalStats.mana > 0 },
      { icon: '✨', name: 'MAG', value: totalStats.magic, show: totalStats.magic > 0 },
      { icon: '🎯', name: 'ACC', value: totalStats.accuracy, show: totalStats.accuracy > 0 }
    ].filter(stat => stat.show)
    
    return statsToShow.map(stat => `
      <div class="stat-preview-item">
        <span class="stat-icon">${stat.icon}</span>
        <span class="stat-name">${stat.name}</span>
        <span class="stat-value">${stat.value}</span>
      </div>
    `).join('')
  }
  
  calculateBuildStats(build) {
    const stats = { 
      attack: 0, 
      defense: 0, 
      health: 0, 
      mana: 0, 
      magic: 0, 
      accuracy: 0 
    }
    
    Object.values(build.equipment).forEach(item => {
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
  
  renderBuildDetailHeader(build) {
    return `
      <header class="build-detail-header">
        <div class="header-navigation">
          <button class="btn btn-outline back-btn" data-action="back-to-builds">
            ← Voltar para Builds
          </button>
        </div>
        
        <div class="build-title-section">
          <div class="build-main-info">
            <h1 class="build-title">${build.name}</h1>
            <div class="build-meta">
              <span class="build-class">
                ${getClassIcon(build.class)} ${build.class}
              </span>
              <span class="build-level">Level ${build.level}</span>
            </div>
          </div>
          
          <div class="build-actions-header">
            <button class="btn btn-primary" data-action="edit-build" data-build-id="${build.id}">
              ✏️ Editar
            </button>
          </div>
        </div>
        
        <p class="build-description">${build.description}</p>
      </header>
    `
  }
  
  renderBuildOverview(build) {
    const totalStats = this.calculateBuildStats(build)
    
    const allStats = [
      { icon: '⚔️', name: 'Ataque', value: totalStats.attack, key: 'attack' },
      { icon: '🛡️', name: 'Defesa', value: totalStats.defense, key: 'defense' },
      { icon: '❤️', name: 'Vida', value: totalStats.health, key: 'health' },
      { icon: '💙', name: 'Mana', value: totalStats.mana, key: 'mana' },
      { icon: '✨', name: 'Magia', value: totalStats.magic, key: 'magic' },
      { icon: '🎯', name: 'Precisão', value: totalStats.accuracy, key: 'accuracy' }
    ].filter(stat => stat.value > 0)
    
    return `
      <section class="build-overview">
        <div class="overview-grid">
          <div class="stats-card">
            <h3 class="card-title">📊 Estatísticas Totais</h3>
            <div class="stats-grid">
              ${allStats.map(stat => `
                <div class="stat-item">
                  <div class="stat-icon">${stat.icon}</div>
                  <div class="stat-info">
                    <div class="stat-value">${stat.value}</div>
                    <div class="stat-name">${stat.name}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
          
          <div class="build-info-card">
            <h3 class="card-title">ℹ️ Informações da Build</h3>
            <div class="info-list">
              <div class="info-item">
                <span class="info-label">👥 Classe:</span>
                <span class="info-value">${getClassIcon(build.class)} ${build.class}</span>
              </div>
              <div class="info-item">
                <span class="info-label">⏫ Level:</span>
                <span class="info-value">${build.level}</span>
              </div>
              <div class="info-item">
                <span class="info-label">⚔️ Itens Equipados:</span>
                <span class="info-value">${Object.keys(build.equipment).length}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    `
  }
  
  renderBuildEquipment(build) {
    const equipmentSlots = [
      { id: 'helmet', name: 'Capacete', icon: '⛑️' },
      { id: 'armor', name: 'Armadura', icon: '🛡️' },
      { id: 'weapon', name: 'Arma Principal', icon: '⚔️' },
      { id: 'shield', name: 'Escudo', icon: '🛡️' },
      { id: 'boots', name: 'Botas', icon: '👢' },
      { id: 'ring', name: 'Anel', icon: '💍' },
      { id: 'necklace', name: 'Colar', icon: '📿' }
    ]
    
    return `
      <section class="build-equipment-section">
        <h2 class="section-title">⚔️ Equipamentos da Build</h2>
        <div class="equipment-slots">
          ${equipmentSlots.map(slot => this.renderEquipmentSlotDetail(slot, build.equipment[slot.id])).join('')}
        </div>
      </section>
    `
  }
  
  renderEquipmentSlotDetail(slot, item) {
    return `
      <div class="equipment-slot-detail ${item ? 'equipped' : 'empty'}">
        <div class="slot-header">
          <div class="slot-icon">${slot.icon}</div>
          <div class="slot-name">${slot.name}</div>
        </div>
        
        <div class="slot-content">
          ${item ? `
            <div class="equipped-item-detail">
              <div class="item-main-info">
                <div class="item-icon-large">
                  ${getItemImage(item.name, item.type)}
                  ${getRarityIcon(item.rarity)}
                </div>
                <div class="item-details">
                  <h4 class="item-name">${item.name}</h4>
                  <div class="item-type">${item.type}</div>
                  <div class="item-rarity rarity-${item.rarity}">${item.rarity}</div>
                </div>
              </div>
              
              ${item.stats ? `
                <div class="item-stats-detail">
                  <h5 class="stats-title">Estatísticas:</h5>
                  <div class="stats-list">
                    ${Object.entries(item.stats).map(([stat, value]) => `
                      <div class="stat-detail">
                        <span class="stat-name">${this.getStatName(stat)}</span>
                        <span class="stat-value">+${value}</span>
                      </div>
                    `).join('')}
                  </div>
                </div>
              ` : ''}
            </div>
          ` : `
            <div class="empty-slot-detail">
              <div class="empty-icon">❌</div>
              <div class="empty-text">Slot vazio</div>
            </div>
          `}
        </div>
      </div>
    `
  }
  
  getStatName(stat) {
    const names = {
      attack: 'Ataque',
      defense: 'Defesa', 
      health: 'Vida',
      mana: 'Mana',
      accuracy: 'Precisão',
      magic: 'Magia'
    }
    return names[stat] || stat
  }
  
  renderBuildStats(build) {
    return `
      <section class="build-stats-section">
        <h2 class="section-title">📈 Análise Detalhada</h2>
        <div class="analysis-grid">
          <div class="power-rating">
            <h3 class="analysis-title">🔥 Classificação de Poder</h3>
            <div class="power-bars">
              ${this.renderPowerBars(build)}
            </div>
          </div>
          
          <div class="build-recommendations">
            <h3 class="analysis-title">💡 Recomendações</h3>
            <div class="recommendations-list">
              ${this.generateRecommendations(build).map(rec => `
                <div class="recommendation-item">
                  <div class="rec-icon">${rec.icon}</div>
                  <div class="rec-text">${rec.text}</div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </section>
    `
  }
  
  renderPowerBars(build) {
    const stats = this.calculateBuildStats(build)
    const maxStatValue = Math.max(stats.attack, stats.defense, stats.health, stats.mana, 100)
    
    return [
      { name: 'Ataque', value: stats.attack, icon: '⚔️', color: '#ef4444' },
      { name: 'Defesa', value: stats.defense, icon: '🛡️', color: '#3b82f6' },
      { name: 'Vida', value: stats.health, icon: '❤️', color: '#10b981' },
      { name: 'Mana', value: stats.mana, icon: '💙', color: '#8b5cf6' }
    ].map(stat => {
      const percentage = (stat.value / maxStatValue) * 100
      return `
        <div class="power-bar">
          <div class="power-bar-header">
            <span class="power-stat-icon">${stat.icon}</span>
            <span class="power-stat-name">${stat.name}</span>
            <span class="power-stat-value">${stat.value}</span>
          </div>
          <div class="power-bar-track">
            <div class="power-bar-fill" 
                 style="width: ${percentage}%; background-color: ${stat.color}">
            </div>
          </div>
        </div>
      `
    }).join('')
  }
  
  generateRecommendations(build) {
    const recommendations = []
    const stats = this.calculateBuildStats(build)
    
    if (stats.attack > stats.defense) {
      recommendations.push({
        icon: '⚔️',
        text: 'Build focada em dano - ideal para hunt rápida'
      })
    }
    
    if (stats.defense > stats.attack) {
      recommendations.push({
        icon: '🛡️', 
        text: 'Build defensiva - excelente para PvP e tanking'
      })
    }
    
    if (build.class === 'Knight') {
      recommendations.push({
        icon: '🏰',
        text: 'Considere aumentar life leech para sustain'
      })
    }
    
    if (Object.keys(build.equipment).length < 5) {
      recommendations.push({
        icon: '⚠️',
        text: 'Build incompleta - adicione mais equipamentos'
      })
    }
    
    return recommendations
  }
  
  filterBuilds() {
    let filtered = this.data.builds
    
    if (this.currentFilter.search) {
      const search = this.currentFilter.search.toLowerCase()
      filtered = filtered.filter(build => 
        build.name.toLowerCase().includes(search) ||
        build.description.toLowerCase().includes(search)
      )
    }
    
    if (this.currentFilter.class) {
      filtered = filtered.filter(build => build.class === this.currentFilter.class)
    }
    
    if (this.currentFilter.level) {
      filtered = filtered.filter(build => {
        const level = build.level
        if (this.currentFilter.level === '1-100') return level <= 100
        if (this.currentFilter.level === '101-200') return level > 100 && level <= 200
        if (this.currentFilter.level === '201-300') return level > 200 && level <= 300
        if (this.currentFilter.level === '300+') return level > 300
        return true
      })
    }
    
    return filtered
  }
  
  addEventListeners() {
    // Build actions
    document.addEventListener('click', (e) => {
      const action = e.target.dataset.action
      if (action === 'view-build-details') {
        this.selectedBuild = parseInt(e.target.dataset.buildId)
        this.renderBuildDetails()
      }
    })
    
    // Filters
    document.getElementById('search-input')?.addEventListener('input', (e) => {
      this.currentFilter.search = e.target.value
      this.applyFilters()
    })
    
    document.getElementById('class-filter')?.addEventListener('change', (e) => {
      this.currentFilter.class = e.target.value
      this.applyFilters()
    })
    
    document.getElementById('level-filter')?.addEventListener('change', (e) => {
      this.currentFilter.level = e.target.value
      this.applyFilters()
    })
  }
  
  addBuildDetailEventListeners() {
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('back-btn')) {
        this.selectedBuild = null
        this.render()
      }
    })
  }
  
  applyFilters() {
    // Re-render apenas a seção de conteúdo
    const section = document.querySelector('.builds-section')
    if (section) {
      const parent = section.parentElement
      section.remove()
      
      const newSection = this.renderBuildsSection()
      
      parent.insertAdjacentHTML('beforeend', newSection)
    }
  }
  
  addBuildsStyles() {
    if (document.querySelector('#builds-responsive-styles')) return
    
    const styles = document.createElement('style')
    styles.id = 'builds-responsive-styles'
    styles.textContent = `
      /* Builds Page Styles - Modern & Responsive */
      .builds-container {
        max-width: 1400px;
        margin: 0 auto;
        padding: 0 20px;
      }
      
      /* Header */
      .builds-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 40px;
        padding: 30px;
        background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%);
        border-radius: 20px;
        color: white;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
      }
      
      .builds-header .page-title {
        font-size: clamp(1.8rem, 4vw, 2.5rem);
        margin-bottom: 8px;
      }
      
      .builds-header .page-subtitle {
        font-size: clamp(0.9rem, 2vw, 1.1rem);
        opacity: 0.95;
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
        font-size: clamp(1.8rem, 3vw, 2.5rem);
        font-weight: bold;
        color: var(--color-secondary);
        line-height: 1.2;
      }
      
      .stat-label {
        display: block;
        font-size: clamp(0.75rem, 1.5vw, 0.9rem);
        opacity: 0.9;
        margin-top: 4px;
      }
      
      /* Grid de Builds */
      .builds-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        gap: 25px;
        margin-top: 30px;
      }
      
      /* Build Card - Melhorado */
      .build-card {
        background: linear-gradient(145deg, #1F1F1F 0%, #141414 100%);
        border: 2px solid var(--color-primary);
        border-radius: 16px;
        padding: 24px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        gap: 16px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      }
      
      .build-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, 
          var(--color-primary) 0%, 
          var(--color-secondary) 50%, 
          var(--color-primary) 100%);
        opacity: 0.8;
      }
      
      .build-card:hover {
        transform: translateY(-8px) scale(1.02);
        border-color: var(--color-secondary);
        box-shadow: 0 12px 32px rgba(255, 215, 0, 0.25),
                    0 0 40px rgba(255, 215, 0, 0.15);
      }
      
      .build-card:hover::before {
        opacity: 1;
        animation: shimmer 2s infinite;
      }
      
      @keyframes shimmer {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.6; }
      }
      
      /* Card Header */
      .build-card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 4px;
      }
      
      .build-class {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 6px 12px;
        background: rgba(160, 82, 45, 0.2);
        border: 1px solid var(--color-primary);
        border-radius: 8px;
        font-size: 0.9rem;
        font-weight: 600;
        color: var(--color-secondary);
      }
      
      .build-level {
        padding: 6px 14px;
        background: linear-gradient(135deg, #2A2A2A, #1A1A1A);
        border: 1px solid var(--color-accent);
        border-radius: 20px;
        font-size: 0.85rem;
        font-weight: bold;
        color: var(--color-accent);
        letter-spacing: 0.5px;
      }
      
      /* Build Name & Description */
      .build-name {
        font-family: var(--font-primary);
        font-size: 1.4rem;
        color: var(--color-text-light);
        margin: 0;
        line-height: 1.3;
        word-wrap: break-word;
      }
      
      .build-description {
        font-size: 0.95rem;
        color: rgba(255, 237, 213, 0.85);
        line-height: 1.5;
        margin: 0;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        min-height: 42px;
      }
      
      /* Equipment Summary */
      .build-equipment-summary {
        background: rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(160, 82, 45, 0.3);
        border-radius: 12px;
        padding: 14px;
      }
      
      .summary-title {
        font-size: 0.85rem;
        color: var(--color-secondary);
        margin-bottom: 10px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      
      .equipment-icons {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        justify-content: center;
      }
      
      .equipment-icon {
        width: 44px;
        height: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(26, 26, 26, 0.8);
        border: 2px solid var(--color-primary);
        border-radius: 8px;
        font-size: 1.3rem;
        transition: all 0.2s ease;
        position: relative;
      }
      
      .equipment-icon.equipped {
        border-color: var(--color-secondary);
        background: rgba(255, 215, 0, 0.1);
      }
      
      .equipment-icon.empty {
        opacity: 0.3;
        border-style: dashed;
      }
      
      .equipment-icon:hover {
        transform: scale(1.15);
        border-color: var(--color-secondary);
        box-shadow: 0 0 12px rgba(255, 215, 0, 0.4);
      }
      
      /* Stats Preview */
      .build-stats-preview {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 8px;
        padding: 12px;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 8px;
        border: 1px solid rgba(74, 124, 140, 0.3);
      }
      
      .stat-preview-item {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 0.85rem;
      }
      
      .stat-preview-item .stat-icon {
        font-size: 1.1rem;
      }
      
      .stat-preview-item .stat-name {
        color: rgba(255, 237, 213, 0.7);
      }
      
      .stat-preview-item .stat-value {
        color: var(--color-secondary);
        font-weight: bold;
        margin-left: auto;
      }
      
      /* Build Actions */
      .build-actions {
        display: flex;
        gap: 8px;
        margin-top: auto;
      }
      
      .build-actions .btn {
        flex: 1;
        padding: 10px 16px;
        font-size: 0.85rem;
        border-radius: 8px;
        transition: all 0.2s ease;
      }
      
      .build-actions .btn-primary {
        background: linear-gradient(135deg, var(--color-primary), #8B4513);
        border: none;
        color: white;
        font-weight: 600;
      }
      
      .build-actions .btn-primary:hover {
        background: linear-gradient(135deg, #8B4513, var(--color-primary));
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(160, 82, 45, 0.4);
      }
      
      .build-actions .btn-secondary {
        background: rgba(74, 124, 140, 0.2);
        border: 1px solid var(--color-accent);
        color: var(--color-accent);
        font-weight: 600;
      }
      
      .build-actions .btn-secondary:hover {
        background: rgba(74, 124, 140, 0.4);
        transform: translateY(-2px);
      }
      
      .build-actions .btn-outline {
        background: transparent;
        border: 1px solid rgba(255, 237, 213, 0.3);
        color: var(--color-text-light);
        font-weight: 500;
      }
      
      .build-actions .btn-outline:hover {
        background: rgba(255, 237, 213, 0.1);
        border-color: var(--color-text-light);
        transform: translateY(-2px);
      }
      
      /* No Results */
      .no-results {
        text-align: center;
        padding: 60px 20px;
        max-width: 500px;
        margin: 0 auto;
      }
      
      .no-results-icon {
        font-size: 4rem;
        margin-bottom: 20px;
        opacity: 0.5;
      }
      
      .no-results h3 {
        font-family: var(--font-primary);
        font-size: 1.5rem;
        margin-bottom: 12px;
        color: var(--color-text-light);
      }
      
      .no-results p {
        color: rgba(255, 237, 213, 0.7);
        margin-bottom: 24px;
      }
      
      /* Responsive Design */
      @media (max-width: 1024px) {
        .builds-grid {
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }
      }
      
      @media (max-width: 768px) {
        .builds-container {
          padding: 0 15px;
        }
        
        .builds-header {
          flex-direction: column;
          text-align: center;
          gap: 25px;
          padding: 25px 20px;
        }
        
        .header-stats {
          gap: 20px;
          justify-content: center;
          flex-wrap: wrap;
        }
        
        .builds-grid {
          grid-template-columns: 1fr;
          gap: 20px;
        }
        
        .build-card {
          padding: 20px;
        }
        
        .build-actions {
          flex-wrap: wrap;
        }
        
        .build-actions .btn {
          flex: 1 1 calc(50% - 4px);
          min-width: 120px;
        }
      }
      
      @media (max-width: 600px) {
        .builds-container {
          padding: 0 12px;
        }
        
        .builds-header {
          padding: 20px 15px;
        }
        
        .build-card {
          padding: 16px;
          gap: 12px;
        }
        
        .build-name {
          font-size: 1.2rem;
        }
        
        .build-description {
          font-size: 0.9rem;
        }
        
        .equipment-icons {
          gap: 6px;
        }
        
        .equipment-icon {
          width: 38px;
          height: 38px;
          font-size: 1.1rem;
        }
        
        .build-stats-preview {
          grid-template-columns: 1fr;
          gap: 6px;
          padding: 10px;
        }
        
        .build-actions .btn {
          flex: 1 1 100%;
          font-size: 0.9rem;
        }
      }
      
      @media (max-width: 400px) {
        .builds-container {
          padding: 0 10px;
        }
        
        .build-card {
          padding: 14px;
        }
        
        .equipment-icon {
          width: 34px;
          height: 34px;
          font-size: 1rem;
        }
      }
    `
    
    document.head.appendChild(styles)
  }
  
  addBuildDetailStyles() {
    // Reuse the same styles from equipment page for build details
    if (document.querySelector('#build-detail-responsive-styles')) return
    
    const styles = document.createElement('style')
    styles.id = 'build-detail-responsive-styles'
    styles.textContent = `
      /* Build Detail Page Styles shared */
      .build-detail-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 20px;
      }
      
      /* Stats Grid Override - para mostrar 6 stats */
      .stats-card .stats-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
      }
      
      .stats-card .stat-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 16px;
        background: rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(160, 82, 45, 0.3);
        border-radius: 12px;
        transition: all 0.2s ease;
      }
      
      .stats-card .stat-item:hover {
        border-color: var(--color-secondary);
        background: rgba(255, 215, 0, 0.1);
        transform: translateY(-2px);
      }
      
      .stats-card .stat-icon {
        font-size: 2rem;
        min-width: auto;
      }
      
      .stats-card .stat-info {
        flex: 1;
      }
      
      .stats-card .stat-value {
        font-size: 1.8rem;
        font-weight: bold;
        color: var(--color-secondary);
        line-height: 1;
        margin-bottom: 4px;
      }
      
      .stats-card .stat-name {
        font-size: 0.9rem;
        color: rgba(255, 237, 213, 0.7);
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      
      @media (max-width: 1024px) {
        .stats-card .stats-grid {
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }
      }
      
      @media (max-width: 768px) {
        .build-detail-container {
          padding: 0 15px;
        }
        
        .stats-card .stats-grid {
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }
        
        .stats-card .stat-item {
          padding: 12px;
          gap: 10px;
        }
        
        .stats-card .stat-icon {
          font-size: 1.5rem;
        }
        
        .stats-card .stat-value {
          font-size: 1.4rem;
        }
        
        .stats-card .stat-name {
          font-size: 0.8rem;
        }
      }
      
      @media (max-width: 480px) {
        .build-detail-container {
          padding: 0 10px;
        }
        
        .stats-card .stats-grid {
          grid-template-columns: 1fr;
          gap: 10px;
        }
        
        .stats-card .stat-item {
          padding: 10px;
        }
      }
    `
    
    document.head.appendChild(styles)
  }
}
