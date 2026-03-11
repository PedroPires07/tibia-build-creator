import { tibiaData } from '../data/tibiaData.js'
import { getClassIcon, getRarityIcon } from '../tibiaImages.js'

export class ProfileRenderer {
  constructor() {
    this.data = tibiaData
    this.user = null
  }
  
  render() {
    const userData = localStorage.getItem('tibia-user')
    
    if (!userData) {
      this.renderNotLoggedIn()
      return
    }
    
    this.user = JSON.parse(userData)
    
    const profileContent = document.querySelector('#profile-page .content')
    const container = profileContent || document.querySelector('#profile-page')
    
    if (!container) return
    
    container.innerHTML = `
      <div class="profile-container">
        ${this.renderProfileHeader()}
        ${this.renderProfileStats()}
        ${this.renderUserBuilds()}
      </div>
    `
    
    this.addProfileStyles()
    this.addEventListeners()
  }
  
  renderNotLoggedIn() {
    const profileContent = document.querySelector('#profile-page .content')
    const container = profileContent || document.querySelector('#profile-page')
    
    if (!container) return
    
    container.innerHTML = `
      <div class="profile-container">
        <div class="not-logged-in">
          <div class="not-logged-icon">ðŸ”’</div>
          <h2>Ãrea Restrita</h2>
          <p>VocÃª precisa estar logado para acessar seu perfil</p>
          <button class="btn btn-primary btn-large" data-page="login">
            ðŸ”‘ Fazer Login
          </button>
        </div>
      </div>
    `
    
    this.addProfileStyles()
  }
  
  renderProfileHeader() {
    return `
      <section class="profile-header">
        <div class="profile-banner">
          <div class="banner-gradient"></div>
        </div>
        
        <div class="profile-main">
          <div class="profile-avatar">
            <div class="avatar-icon">${getClassIcon(this.user.mainClass)}</div>
            <div class="avatar-level">Lv. ${this.user.level}</div>
          </div>
          
          <div class="profile-info">
            <h1 class="profile-username">${this.user.username}</h1>
            <div class="profile-meta">
              <span class="meta-item">
                ${getClassIcon(this.user.mainClass)} ${this.user.mainClass}
              </span>
            </div>
            <div class="profile-email">
              ðŸ“§ ${this.user.email}
            </div>
          </div>
          
          <div class="profile-actions">
            <button class="btn btn-primary" data-action="edit-profile">
              âœï¸ Editar Perfil
            </button>
            <button class="btn btn-secondary" data-action="logout">
              ðŸšª Sair
            </button>
          </div>
        </div>
      </section>
    `
  }
  
  renderProfileStats() {
    const userBuilds = this.getUserBuilds()
    const favoriteBuild = userBuilds[0] || null
    
    return `
      <section class="profile-stats">
        <h2 class="section-title">ðŸ“Š EstatÃ­sticas</h2>
        
        <div class="stats-grid">
          <div class="stat-box">
            <div class="stat-icon">âš”ï¸</div>
            <div class="stat-details">
              <div class="stat-value">${userBuilds.length}</div>
              <div class="stat-label">Builds Criadas</div>
            </div>
          </div>
          
          <div class="stat-box">
            <div class="stat-icon">ðŸ“ˆ</div>
            <div class="stat-details">
              <div class="stat-value">${this.user.level}</div>
              <div class="stat-label">NÃ­vel do Personagem</div>
            </div>
          </div>
          
          <div class="stat-box">
            <div class="stat-icon">â­</div>
            <div class="stat-details">
              <div class="stat-value">${favoriteBuild ? favoriteBuild.name : 'Nenhuma'}</div>
              <div class="stat-label">Build Favorita</div>
            </div>
          </div>
        </div>
      </section>
    `
  }
  
  renderUserBuilds() {
    const userBuilds = this.getUserBuilds()
    
    return `
      <section class="profile-builds">
        <div class="section-header">
          <h2 class="section-title">ðŸŽ’ Minhas Builds</h2>
          <button class="btn btn-primary" data-action="create-new-build">
            âž• Criar Nova Build
          </button>
        </div>
        
        <div class="builds-grid">
          ${userBuilds.length > 0 
            ? userBuilds.map(build => this.renderBuildCard(build)).join('')
            : this.renderEmptyBuilds()
          }
        </div>
      </section>
    `
  }
  
  renderBuildCard(build) {
    const stats = this.calculateBuildStats(build)
    
    return `
      <article class="build-card">
        <div class="build-card-header">
          <div class="build-class-badge">
            ${getClassIcon(build.class)} ${build.class}
          </div>
          <div class="build-level-badge">Lv. ${build.level}</div>
        </div>
        
        <h3 class="build-card-title">${build.name}</h3>
        <p class="build-card-description">${build.description}</p>
        
        <div class="build-card-stats">
          ${this.renderBuildStatsPreview(build)}
        </div>
        
        <div class="build-card-equipment">
          <div class="equipment-preview-grid">
            ${this.renderEquipmentPreview(build.equipment)}
          </div>
        </div>
        
        <div class="build-card-actions">
          <button class="btn btn-sm btn-primary" data-action="view-build-details" data-build-id="${build.id}">
            ðŸ‘ï¸ Ver
          </button>
          <button class="btn btn-sm btn-secondary" data-action="edit-build" data-build-id="${build.id}">
            âœï¸ Editar
          </button>
          <button class="btn btn-sm btn-danger" data-action="delete-build" data-build-id="${build.id}">
            ðŸ—‘ï¸ Excluir
          </button>
        </div>
      </article>
    `
  }
  
  renderEmptyBuilds() {
    return `
      <div class="empty-builds">
        <div class="empty-icon">ðŸ“¦</div>
        <h3>Nenhuma Build Criada</h3>
        <p>Comece criando sua primeira build Ã©pica!</p>
        <button class="btn btn-primary btn-large" data-action="create-new-build">
          ðŸ”¨ Criar Primeira Build
        </button>
      </div>
    `
  }
  
  renderEquipmentPreview(equipment) {
    const slots = ['weapon', 'armor', 'helmet', 'shield', 'boots', 'ring']
    
    return slots.map(slot => {
      const item = equipment[slot]
      if (!item) {
        return `<div class="equipment-slot empty">${this.getSlotIcon(slot)}</div>`
      }
      
      return `
        <div class="equipment-slot filled" title="${item.name}">
          ${getRarityIcon(item.rarity)}
        </div>
      `
    }).join('')
  }
  
  getSlotIcon(slot) {
    const icons = {
      weapon: 'âš”ï¸',
      armor: 'ðŸ›¡ï¸',
      helmet: 'â›‘ï¸',
      shield: 'ðŸ›¡ï¸',
      boots: 'ðŸ‘¢',
      ring: 'ðŸ’',
      necklace: 'ðŸ“¿'
    }
    return icons[slot] || 'â“'
  }
  
  renderBuildStatsPreview(build) {
    const totalStats = this.calculateBuildStats(build)
    
    const statsToShow = [
      { icon: 'âš”ï¸', name: 'ATK', value: totalStats.attack, show: totalStats.attack > 0 },
      { icon: 'ðŸ›¡ï¸', name: 'DEF', value: totalStats.defense, show: totalStats.defense > 0 },
      { icon: 'â¤ï¸', name: 'HP', value: totalStats.health, show: totalStats.health > 0 },
      { icon: 'ðŸ’™', name: 'MP', value: totalStats.mana, show: totalStats.mana > 0 },
      { icon: 'âœ¨', name: 'MAG', value: totalStats.magic, show: totalStats.magic > 0 },
      { icon: 'ðŸŽ¯', name: 'ACC', value: totalStats.accuracy, show: totalStats.accuracy > 0 }
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
    const stats = { attack: 0, defense: 0, health: 0, mana: 0, magic: 0, accuracy: 0 }
    
    console.log('[PROFILE] Calculating stats for build:', build.name)
    console.log('[PROFILE] Equipment:', build.equipment)
    
    Object.values(build.equipment).forEach(item => {
      if (item && item.stats) {
        console.log(`[PROFILE] Item: ${item.name}, Stats:`, item.stats)
        Object.entries(item.stats).forEach(([stat, value]) => {
          if (stats.hasOwnProperty(stat)) {
            stats[stat] += value
          }
        })
      }
    })
    
    console.log('[PROFILE] Final stats:', stats)
    return stats
  }
  
  getUserBuilds() {
    return this.data.builds.filter((_, index) => index < this.user.buildsCount)
  }
  
  addEventListeners() {
    document.addEventListener('click', (e) => {
      if (e.target.dataset.action === 'edit-profile') {
        this.openEditProfileModal()
      }
      
      if (e.target.dataset.action === 'save-profile') {
        this.saveProfileChanges()
      }
      
      if (e.target.dataset.action === 'close-modal') {
        this.closeEditProfileModal()
      }
      
      if (e.target.dataset.action === 'logout') {
        this.handleLogout()
      }
      
      if (e.target.dataset.action === 'create-new-build') {
        document.dispatchEvent(new CustomEvent('navigate-to-page', {
          detail: { page: 'create-build' }
        }))
      }
      
      if (e.target.dataset.action === 'delete-build') {
        const buildId = e.target.dataset.buildId
        this.handleDeleteBuild(buildId)
      }
    })
  }
  
  openEditProfileModal() {
    const modal = document.createElement('div')
    modal.className = 'profile-edit-modal'
    modal.id = 'edit-profile-modal'
    modal.innerHTML = `
      <div class="modal-backdrop" data-action="close-modal"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h2>âœï¸ Editar Perfil</h2>
          <button class="modal-close" data-action="close-modal">âœ•</button>
        </div>
        
        <form class="edit-profile-form" id="edit-profile-form">
          <div class="form-section">
            <h3>InformaÃ§Ãµes BÃ¡sicas</h3>
            
            <div class="form-group">
              <label for="edit-username">ðŸ‘¤ Username</label>
              <input 
                type="text" 
                id="edit-username" 
                class="form-input"
                value="${this.user.username}"
                required
              />
            </div>
            
            <div class="form-group">
              <label for="edit-email">ðŸ“§ Email</label>
              <input 
                type="email" 
                id="edit-email" 
                class="form-input"
                value="${this.user.email}"
                required
              />
            </div>
          </div>
          
          <div class="form-section">
            <h3>InformaÃ§Ãµes de Personagem</h3>
            
            <div class="form-group">
              <label for="edit-level">ðŸ“ˆ NÃ­vel</label>
              <input 
                type="number" 
                id="edit-level" 
                class="form-input"
                value="${this.user.level}"
                min="1"
                max="9999"
                required
              />
            </div>
            
            <div class="form-group">
              <label for="edit-class">âš”ï¸ Classe Principal</label>
              <select id="edit-class" class="form-input">
                <option value="Knight" ${this.user.mainClass === 'Knight' ? 'selected' : ''}>Knight</option>
                <option value="Paladin" ${this.user.mainClass === 'Paladin' ? 'selected' : ''}>Paladin</option>
                <option value="Sorcerer" ${this.user.mainClass === 'Sorcerer' ? 'selected' : ''}>Sorcerer</option>
                <option value="Druid" ${this.user.mainClass === 'Druid' ? 'selected' : ''}>Druid</option>
              </select>
            </div>
          </div>
          
          <div class="form-section">
            <h3>Foto de Perfil</h3>
            <p class="form-hint">ðŸ’¡ A foto do perfil Ã© baseada na sua classe selecionada</p>
          </div>
          
          <div class="modal-actions">
            <button type="button" class="btn btn-secondary" data-action="close-modal">
              âŒ Cancelar
            </button>
            <button type="submit" class="btn btn-primary" data-action="save-profile">
              ðŸ’¾ Salvar AlteraÃ§Ãµes
            </button>
          </div>
        </form>
      </div>
    `
    
    document.body.appendChild(modal)
    
    const form = document.getElementById('edit-profile-form')
    form.addEventListener('submit', (e) => {
      e.preventDefault()
      this.saveProfileChanges()
    })
    
    this.addModalStyles()
  }
  
  closeEditProfileModal() {
    const modal = document.getElementById('edit-profile-modal')
    if (modal) {
      modal.style.animation = 'fadeOut 0.3s ease'
      setTimeout(() => modal.remove(), 300)
    }
  }
  
  saveProfileChanges() {
    const username = document.getElementById('edit-username').value
    const email = document.getElementById('edit-email').value
    const level = parseInt(document.getElementById('edit-level').value)
    const mainClass = document.getElementById('edit-class').value
    
    if (!username || !email || !level) {
      this.showNotification('âŒ Preencha todos os campos!', 'error')
      return
    }
    
    if (level < 1 || level > 9999) {
      this.showNotification('âŒ NÃ­vel invÃ¡lido! (1-9999)', 'error')
      return
    }
    
    this.user.username = username
    this.user.email = email
    this.user.level = level
    this.user.mainClass = mainClass
    
    localStorage.setItem('tibia-user', JSON.stringify(this.user))
    
    this.closeEditProfileModal()
    this.showNotification('âœ… Perfil atualizado com sucesso!', 'success')
    
    setTimeout(() => {
      this.render()
    }, 500)
  }
  
  handleLogout() {
    if (confirm('Tem certeza que deseja sair?')) {
      localStorage.removeItem('tibia-user')
      this.showNotification('ðŸ‘‹ AtÃ© logo!', 'success')
      
      setTimeout(() => {
        document.dispatchEvent(new CustomEvent('navigate-to-page', {
          detail: { page: 'login' }
        }))
      }, 1000)
    }
  }
  
  handleDeleteBuild(buildId) {
    if (confirm('Tem certeza que deseja excluir esta build?')) {
      this.showNotification('ðŸ—‘ï¸ Build excluÃ­da com sucesso!', 'success')
      setTimeout(() => this.render(), 500)
    }
  }
  
  showNotification(message, type = 'info') {
    const notification = document.createElement('div')
    notification.className = `notification notification-${type}`
    notification.textContent = message
    notification.style.cssText = `
      position: fixed;
      top: 80px;
      right: 20px;
      padding: 16px 24px;
      background: ${type === 'success' ? '#7CB342' : type === 'error' ? '#D32F2F' : '#4A7C8C'};
      color: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      z-index: 9999;
      font-weight: 500;
      animation: slideIn 0.3s ease;
    `
    
    document.body.appendChild(notification)
    
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease'
      setTimeout(() => notification.remove(), 300)
    }, 3000)
  }
  
  addProfileStyles() {
    if (document.querySelector('#profile-styles')) return
    
    const styles = document.createElement('style')
    styles.id = 'profile-styles'
    styles.textContent = `
      /* Profile Container */
      .profile-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 40px 20px;
      }
      
      /* Not Logged In */
      .not-logged-in {
        text-align: center;
        padding: 80px 20px;
      }
      
      .not-logged-icon {
        font-size: 5rem;
        margin-bottom: 24px;
        opacity: 0.8;
      }
      
      .not-logged-in h2 {
        font-family: var(--font-primary);
        font-size: 2rem;
        color: var(--color-secondary);
        margin-bottom: 12px;
      }
      
      .not-logged-in p {
        color: rgba(255, 237, 213, 0.7);
        font-size: 1.1rem;
        margin-bottom: 32px;
      }
      
      /* Profile Header */
      .profile-header {
        background: linear-gradient(135deg, #2A2A2A 0%, #1A1A1A 100%);
        border: 2px solid var(--color-secondary);
        border-radius: 16px;
        overflow: hidden;
        margin-bottom: 40px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
      }
      
      .profile-banner {
        height: 120px;
        background: linear-gradient(135deg, #A0522D 0%, #6B3410 100%);
        position: relative;
        overflow: hidden;
      }
      
      .banner-gradient {
        position: absolute;
        inset: 0;
        background: linear-gradient(90deg, 
          transparent 0%, 
          rgba(255, 215, 0, 0.2) 50%, 
          transparent 100%
        );
        animation: shimmer 3s ease-in-out infinite;
      }
      
      .profile-main {
        padding: 0 32px 32px;
        display: flex;
        gap: 24px;
        align-items: flex-start;
        position: relative;
      }
      
      /* Avatar */
      .profile-avatar {
        position: relative;
        margin-top: -48px;
        flex-shrink: 0;
      }
      
      .avatar-icon {
        width: 120px;
        height: 120px;
        background: linear-gradient(135deg, #2A2A2A 0%, #1A1A1A 100%);
        border: 4px solid var(--color-secondary);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 3rem;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
      }
      
      .avatar-level {
        position: absolute;
        bottom: 0;
        right: 0;
        background: var(--color-secondary);
        color: var(--color-text-dark);
        padding: 6px 12px;
        border-radius: 12px;
        font-weight: bold;
        font-size: 0.9rem;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      }
      
      /* Profile Info */
      .profile-info {
        flex: 1;
        padding-top: 16px;
      }
      
      .profile-username {
        font-family: var(--font-primary);
        font-size: 2rem;
        color: var(--color-secondary);
        margin-bottom: 8px;
      }
      
      .profile-meta {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
        margin-bottom: 8px;
        color: rgba(255, 237, 213, 0.7);
        font-size: 0.95rem;
      }
      
      .meta-separator {
        color: rgba(255, 237, 213, 0.3);
      }
      
      .profile-email {
        color: rgba(255, 237, 213, 0.6);
        font-size: 0.9rem;
      }
      
      /* Profile Actions */
      .profile-actions {
        display: flex;
        gap: 12px;
        padding-top: 16px;
        flex-shrink: 0;
      }
      
      /* Sections */
      .section-title {
        font-family: var(--font-primary);
        font-size: 1.8rem;
        color: var(--color-secondary);
        margin-bottom: 24px;
        display: flex;
        align-items: center;
        gap: 12px;
      }
      
      .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
        flex-wrap: wrap;
        gap: 16px;
      }
      
      /* Profile Stats */
      .profile-stats {
        margin-bottom: 40px;
      }
      
      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 20px;
      }
      
      .stat-box {
        background: linear-gradient(135deg, #2A2A2A 0%, #1A1A1A 100%);
        border: 2px solid rgba(74, 124, 140, 0.3);
        border-radius: 12px;
        padding: 24px;
        display: flex;
        align-items: center;
        gap: 20px;
        transition: all 0.3s ease;
      }
      
      .stat-box:hover {
        border-color: var(--color-secondary);
        transform: translateY(-4px);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
      }
      
      .stat-icon {
        font-size: 2.5rem;
        flex-shrink: 0;
      }
      
      .stat-details {
        flex: 1;
      }
      
      .stat-value {
        font-size: 1.8rem;
        font-weight: bold;
        color: var(--color-secondary);
        margin-bottom: 4px;
      }
      
      .stat-label {
        font-size: 0.9rem;
        color: rgba(255, 237, 213, 0.7);
      }
      
      /* Builds Grid */
      .profile-builds {
        margin-bottom: 40px;
      }
      
      .builds-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        gap: 24px;
      }
      
      .build-card {
        background: linear-gradient(135deg, #2A2A2A 0%, #1A1A1A 100%);
        border: 2px solid rgba(74, 124, 140, 0.3);
        border-radius: 12px;
        padding: 20px;
        transition: all 0.3s ease;
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      
      .build-card:hover {
        border-color: var(--color-secondary);
        transform: translateY(-4px);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
      }
      
      .build-card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .build-class-badge {
        background: rgba(160, 82, 45, 0.3);
        padding: 6px 12px;
        border-radius: 8px;
        font-size: 0.85rem;
        border: 1px solid var(--color-primary);
      }
      
      .build-level-badge {
        background: rgba(255, 215, 0, 0.2);
        padding: 6px 12px;
        border-radius: 8px;
        font-size: 0.85rem;
        color: var(--color-secondary);
        border: 1px solid var(--color-secondary);
        font-weight: bold;
      }
      
      .build-card-title {
        font-family: var(--font-primary);
        font-size: 1.3rem;
        color: var(--color-secondary);
      }
      
      .build-card-description {
        color: rgba(255, 237, 213, 0.7);
        font-size: 0.9rem;
        line-height: 1.5;
      }
      
      .build-card-stats {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 8px;
        padding: 12px;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 8px;
        border: 1px solid rgba(74, 124, 140, 0.3);
        margin-bottom: 12px;
      }
      
      .stat-preview-item {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 0.85rem;
        border: 2px solid red !important;
        padding: 4px;
      }
      
      .stat-preview-item .stat-icon {
        font-size: 1.1rem;
      }
      
      .stat-preview-item .stat-name {
        color: rgba(255, 237, 213, 0.7);
      }
      
      .stat-preview-item .stat-value {
        color: #000 !important;
        font-weight: bold;
        margin-left: auto;
        padding: 2px 6px;
        border-radius: 4px;
      }
      
      .equipment-preview-grid {
        display: grid;
        grid-template-columns: repeat(6, 1fr);
        gap: 8px;
      }
      
      .equipment-slot {
        aspect-ratio: 1;
        background: rgba(0, 0, 0, 0.3);
        border: 2px solid rgba(74, 124, 140, 0.3);
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
      }
      
      .equipment-slot.filled {
        border-color: var(--color-secondary);
        background: rgba(255, 215, 0, 0.1);
      }
      
      .equipment-slot.empty {
        opacity: 0.4;
      }
      
      .build-card-actions {
        display: flex;
        gap: 8px;
        margin-top: auto;
      }
      
      .btn-sm {
        flex: 1;
        padding: 8px 12px;
        font-size: 0.85rem;
      }
      
      .btn-danger {
        background: linear-gradient(135deg, #D32F2F 0%, #B71C1C 100%);
        border: 2px solid #D32F2F;
        color: white;
      }
      
      .btn-danger:hover {
        background: linear-gradient(135deg, #F44336 0%, #D32F2F 100%);
        border-color: #F44336;
      }
      
      /* Empty Builds */
      .empty-builds {
        text-align: center;
        padding: 60px 20px;
        background: linear-gradient(135deg, #2A2A2A 0%, #1A1A1A 100%);
        border: 2px dashed rgba(74, 124, 140, 0.3);
        border-radius: 12px;
      }
      
      .empty-icon {
        font-size: 4rem;
        margin-bottom: 16px;
        opacity: 0.6;
      }
      
      .empty-builds h3 {
        font-family: var(--font-primary);
        color: var(--color-secondary);
        margin-bottom: 8px;
      }
      
      .empty-builds p {
        color: rgba(255, 237, 213, 0.6);
        margin-bottom: 24px;
      }
      
      /* Achievements */
      .profile-achievements {
        margin-bottom: 40px;
      }
      
      .achievements-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 16px;
      }
      
      .achievement-card {
        background: linear-gradient(135deg, #2A2A2A 0%, #1A1A1A 100%);
        border: 2px solid rgba(74, 124, 140, 0.3);
        border-radius: 12px;
        padding: 16px;
        display: flex;
        align-items: center;
        gap: 16px;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
      }
      
      .achievement-card.unlocked {
        border-color: var(--color-secondary);
        background: linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(160, 82, 45, 0.1) 100%);
      }
      
      .achievement-card.locked {
        opacity: 0.5;
      }
      
      .achievement-icon {
        font-size: 2rem;
        flex-shrink: 0;
      }
      
      .achievement-info {
        flex: 1;
      }
      
      .achievement-title {
        font-weight: bold;
        color: var(--color-secondary);
        margin-bottom: 4px;
      }
      
      .achievement-description {
        font-size: 0.85rem;
        color: rgba(255, 237, 213, 0.6);
      }
      
      .achievement-badge {
        position: absolute;
        top: 8px;
        right: 8px;
        background: var(--color-success);
        color: white;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 0.8rem;
      }
      
      .achievement-lock {
        font-size: 1.5rem;
        opacity: 0.3;
      }
      
      /* Animations */
      @keyframes shimmer {
        0% {
          transform: translateX(-100%);
        }
        100% {
          transform: translateX(100%);
        }
      }
      
      /* Responsive */
      @media (max-width: 768px) {
        .profile-main {
          flex-direction: column;
          padding: 0 20px 24px;
        }
        
        .profile-avatar {
          margin-top: -48px;
          align-self: center;
        }
        
        .profile-info {
          text-align: center;
        }
        
        .profile-actions {
          width: 100%;
          flex-direction: column;
        }
        
        .profile-username {
          font-size: 1.5rem;
        }
        
        .stats-grid {
          grid-template-columns: 1fr;
        }
        
        .builds-grid {
          grid-template-columns: 1fr;
        }
        
        .equipment-preview-grid {
          grid-template-columns: repeat(3, 1fr);
        }
      }
    `
    
    document.head.appendChild(styles)
  }
  
  addModalStyles() {
    if (document.querySelector('#profile-modal-styles')) return
    
    const styles = document.createElement('style')
    styles.id = 'profile-modal-styles'
    styles.textContent = `
      /* Modal Styles */
      .profile-edit-modal {
        position: fixed;
        inset: 0;
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.3s ease;
      }
      
      .modal-backdrop {
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(4px);
      }
      
      .modal-content {
        position: relative;
        width: 90%;
        max-width: 600px;
        max-height: 90vh;
        overflow-y: auto;
        background: linear-gradient(135deg, #2A2A2A 0%, #1A1A1A 100%);
        border: 2px solid var(--color-secondary);
        border-radius: 16px;
        padding: 32px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
        animation: slideUp 0.3s ease;
      }
      
      .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
        padding-bottom: 16px;
        border-bottom: 2px solid rgba(74, 124, 140, 0.3);
      }
      
      .modal-header h2 {
        font-family: var(--font-primary);
        font-size: 1.8rem;
        color: var(--color-secondary);
        margin: 0;
      }
      
      .modal-close {
        background: transparent;
        border: none;
        color: var(--color-text-light);
        font-size: 1.5rem;
        cursor: pointer;
        padding: 8px;
        line-height: 1;
        transition: all 0.2s ease;
      }
      
      .modal-close:hover {
        color: var(--color-danger);
        transform: scale(1.2);
      }
      
      .edit-profile-form {
        display: flex;
        flex-direction: column;
        gap: 24px;
      }
      
      .form-section {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      
      .form-section h3 {
        font-family: var(--font-primary);
        color: var(--color-secondary);
        font-size: 1.2rem;
        margin: 0;
      }
      
      .form-hint {
        color: rgba(255, 237, 213, 0.6);
        font-size: 0.9rem;
        font-style: italic;
        margin: 0;
      }
      
      .modal-actions {
        display: flex;
        gap: 12px;
        margin-top: 8px;
      }
      
      .modal-actions .btn {
        flex: 1;
      }
      
      /* Animations */
      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
      
      @keyframes fadeOut {
        from {
          opacity: 1;
        }
        to {
          opacity: 0;
        }
      }
      
      @keyframes slideUp {
        from {
          transform: translateY(50px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }
      
      /* Responsive */
      @media (max-width: 600px) {
        .modal-content {
          width: 95%;
          padding: 20px;
          max-height: 95vh;
        }
        
        .modal-header h2 {
          font-size: 1.4rem;
        }
        
        .modal-actions {
          flex-direction: column;
        }
      }
    `
    
    document.head.appendChild(styles)
  }
}