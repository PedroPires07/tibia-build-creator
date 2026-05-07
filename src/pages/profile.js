import { tibiaData } from '../data/tibiaData.js'
import { getClassIcon, getRarityIcon, getSlotIconHtml, getStatIconHtml } from '../tibiaImages.js'
import ApiService from '../services/apiService.js'

export class ProfileRenderer {
  constructor() {
    this.data = tibiaData
    this.user = null
    this.builds = []
    this.pendingPhoto = undefined
  }

  getUserPhotoKey() {
    return `tibia-profile-photo-${this.user?.id || this.user?.email || 'default'}`
  }

  getStoredPhoto() {
    try {
      return localStorage.getItem(this.getUserPhotoKey())
    } catch {
      return null
    }
  }
  
  render() {
    this.showNotification('⏳ Carregando perfil...', 'info')

    ApiService.getProfile()
      .then(response => {
        this.user = response.user
        return ApiService.getUserBuilds()
      })
      .then(response => {
        this.builds = response.builds || []
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
      })
      .catch(error => {
        console.error('Erro ao carregar perfil:', error)
        this.renderNotLoggedIn()
      })
  }
  
  renderNotLoggedIn() {
    ApiService.removeToken()
    const profileContent = document.querySelector('#profile-page .content')
    const container = profileContent || document.querySelector('#profile-page')

    if (!container) return

    const CDN = 'https://static.wikia.nocookie.net/tibia/images'

    container.innerHTML = `
      <div class="auth-gate">
        <div class="auth-gate-hero">
          <img src="${CDN}/e/e4/Outfit_Citizen_Male.gif/revision/latest?cb=20060828193959&path-prefix=en"
               alt="Tibia" class="auth-gate-char"
               onerror="this.src='${CDN}/d/d6/Outfit_Knight_Male.gif/revision/latest?cb=20170925202328&path-prefix=en'" />
          <h1 class="auth-gate-title">Tibia Build Forge</h1>
          <p class="auth-gate-sub">Faça login ou crie sua conta para acessar seu perfil e builds</p>
        </div>

        <div class="auth-gate-card">
          <div class="auth-gate-tabs">
            <button class="agtab active" data-tab="login">Entrar</button>
            <button class="agtab" data-tab="register">Criar Conta</button>
          </div>

          <!-- Login Form -->
          <form class="ag-form ag-form-login active" id="ag-login-form">
            <div class="ag-group">
              <label>Email ou Username</label>
              <input type="text" id="ag-email" class="ag-input" placeholder="seu@email.com" required />
            </div>
            <div class="ag-group">
              <label>Senha</label>
              <input type="password" id="ag-password" class="ag-input" placeholder="Sua senha" required />
            </div>
            <button type="submit" class="btn btn-primary btn-full">Entrar</button>
          </form>

          <!-- Register Form -->
          <form class="ag-form ag-form-register" id="ag-register-form">
            <div class="ag-group">
              <label>Username</label>
              <input type="text" id="ag-username" class="ag-input" placeholder="SeuNome" required />
            </div>
            <div class="ag-group">
              <label>Email</label>
              <input type="email" id="ag-reg-email" class="ag-input" placeholder="seu@email.com" required />
            </div>
            <div class="ag-group">
              <label>Senha</label>
              <input type="password" id="ag-reg-password" class="ag-input" placeholder="Mínimo 6 caracteres" minlength="6" required />
            </div>
            <div class="ag-group">
              <label>Classe Principal</label>
              <select id="ag-class" class="ag-input" required>
                <option value="" disabled selected>Selecione</option>
                <option value="Knight">Knight</option>
                <option value="Paladin">Paladin</option>
                <option value="Sorcerer">Sorcerer</option>
                <option value="Druid">Druid</option>
              </select>
            </div>
            <button type="submit" class="btn btn-primary btn-full">Criar Conta</button>
          </form>

          <div id="ag-msg" class="ag-msg" style="display:none"></div>
        </div>
      </div>
    `

    this.addProfileStyles()
    this._bindAuthGate()
  }

  _bindAuthGate() {
    // Tab switching
    document.querySelectorAll('.agtab').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.agtab').forEach(b => b.classList.remove('active'))
        document.querySelectorAll('.ag-form').forEach(f => f.classList.remove('active'))
        btn.classList.add('active')
        document.querySelector(`.ag-form-${btn.dataset.tab}`)?.classList.add('active')
      })
    })

    const showMsg = (text, type = 'error') => {
      const el = document.getElementById('ag-msg')
      if (!el) return
      el.textContent = text
      el.className = `ag-msg ag-msg-${type}`
      el.style.display = 'block'
      setTimeout(() => { el.style.display = 'none' }, 4000)
    }

    // Login submit
    document.getElementById('ag-login-form')?.addEventListener('submit', async (e) => {
      e.preventDefault()
      const email = document.getElementById('ag-email').value
      const password = document.getElementById('ag-password').value
      showMsg('Entrando...', 'info')
      try {
        const res = await ApiService.login(email, password)
        ApiService.setToken(res.token)
        this.user = res.user
        this.builds = []
        showMsg('Login realizado!', 'success')
        setTimeout(() => this.render(), 800)
      } catch (err) {
        let msg = 'Credenciais inválidas'
        try { const d = JSON.parse(err.message); msg = d.error || msg } catch {}
        showMsg(msg, 'error')
      }
    })

    // Register submit
    document.getElementById('ag-register-form')?.addEventListener('submit', async (e) => {
      e.preventDefault()
      const username = document.getElementById('ag-username').value
      const email    = document.getElementById('ag-reg-email').value
      const password = document.getElementById('ag-reg-password').value
      const mainClass = document.getElementById('ag-class').value
      if (!mainClass) { showMsg('Selecione uma classe', 'error'); return }
      showMsg('Criando conta...', 'info')
      try {
        const res = await ApiService.register(username, email, password, mainClass)
        ApiService.setToken(res.token)
        this.user = res.user
        this.builds = []
        showMsg('Conta criada!', 'success')
        setTimeout(() => this.render(), 800)
      } catch (err) {
        let msg = 'Erro ao criar conta'
        try { const d = JSON.parse(err.message); msg = d.error || msg } catch {}
        showMsg(msg, 'error')
      }
    })
  }
  
  renderProfileHeader() {
    const storedPhoto = this.getStoredPhoto()
    const avatarContent = storedPhoto
      ? `<img src="${storedPhoto}" alt="Foto de perfil" class="avatar-photo" />`
      : `<span class="avatar-emoji">${getClassIcon(this.user.main_class)}</span>`

    return `
      <section class="profile-header">
        <div class="profile-banner">
          <div class="banner-gradient"></div>
        </div>

        <div class="profile-main">
          <div class="profile-avatar">
            <div class="avatar-icon" id="profile-avatar-icon">
              ${avatarContent}
            </div>
            <div class="avatar-level">Lv. ${this.user.level}</div>
          </div>
          
          <div class="profile-info">
            <h1 class="profile-username">${this.user.username}</h1>
            <div class="profile-meta">
              <span class="meta-item">
                ${getClassIcon(this.user.main_class)} ${this.user.main_class}
              </span>
            </div>
            <div class="profile-email">
              ${this.user.email}
            </div>
          </div>
          
          <div class="profile-actions">
            <button class="btn btn-primary" data-action="edit-profile">
              Editar Perfil
            </button>
            <button class="btn btn-secondary" data-action="logout">
              Sair
            </button>
          </div>
        </div>
      </section>
    `
  }
  
  renderProfileStats() {
    const favoriteBuild = this.builds[0] || null
    
    return `
      <section class="profile-stats">
        <h2 class="section-title">Estatísticas</h2>

        <div class="stats-grid">
          <div class="stat-box">
            <div class="stat-icon">${getStatIconHtml('attack')}</div>
            <div class="stat-details">
              <div class="stat-value">${this.builds.length}</div>
              <div class="stat-label">Builds Criadas</div>
            </div>
          </div>
          
          <div class="stat-box">
            <div class="stat-icon">${getStatIconHtml('mana')}</div>
            <div class="stat-details">
              <div class="stat-value">${this.user.level}</div>
              <div class="stat-label">Nível do Personagem</div>
            </div>
          </div>

          <div class="stat-box">
            <div class="stat-icon">${getSlotIconHtml('shield')}</div>
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
    return `
      <section class="profile-builds">
        <div class="section-header">
          <h2 class="section-title">Minhas Builds</h2>
          <button class="btn btn-primary" data-action="create-new-build">
            Criar Nova Build
          </button>
        </div>
        
        <div class="builds-grid">
          ${this.builds.length > 0 
            ? this.builds.map(build => this.renderBuildCard(build)).join('')
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
            Ver
          </button>
          <button class="btn btn-sm btn-secondary" data-action="edit-build" data-build-id="${build.id}">
            Editar
          </button>
          <button class="btn btn-sm btn-danger" data-action="delete-build" data-build-id="${build.id}">
            Excluir
          </button>
        </div>
      </article>
    `
  }
  
  renderEmptyBuilds() {
    return `
      <div class="empty-builds">
        <div class="empty-icon"></div>
        <h3>Nenhuma Build Criada</h3>
        <p>Comece criando sua primeira build épica!</p>
        <button class="btn btn-primary btn-large" data-action="create-new-build">
          Criar Primeira Build
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
    return getSlotIconHtml(slot)
  }
  
  renderBuildStatsPreview(build) {
    const totalStats = this.calculateBuildStats(build)
    
    const statsToShow = [
      { key: 'attack',   name: 'ATK', value: totalStats.attack,   show: totalStats.attack   > 0 },
      { key: 'defense',  name: 'DEF', value: totalStats.defense,  show: totalStats.defense  > 0 },
      { key: 'health',   name: 'HP',  value: totalStats.health,   show: totalStats.health   > 0 },
      { key: 'mana',     name: 'MP',  value: totalStats.mana,     show: totalStats.mana     > 0 },
      { key: 'magic',    name: 'MAG', value: totalStats.magic,    show: totalStats.magic    > 0 },
      { key: 'accuracy', name: 'ACC', value: totalStats.accuracy, show: totalStats.accuracy > 0 }
    ].filter(stat => stat.show)

    return statsToShow.map(stat => `
      <div class="stat-preview-item">
        <span class="stat-icon">${getStatIconHtml(stat.key)}</span>
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
    this.pendingPhoto = undefined
    const storedPhoto = this.getStoredPhoto()
    const previewContent = storedPhoto
      ? `<img src="${storedPhoto}" alt="Foto atual" class="preview-image" />`
      : `<div class="no-photo">${getClassIcon(this.user.main_class)}</div>`

    const modal = document.createElement('div')
    modal.className = 'profile-edit-modal'
    modal.id = 'edit-profile-modal'
    modal.innerHTML = `
      <div class="modal-backdrop" data-action="close-modal"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h2>Editar Perfil</h2>
          <button class="modal-close" data-action="close-modal">&times;</button>
        </div>

        <form class="edit-profile-form" id="edit-profile-form">
          <div class="form-section">
            <h3>Informações Básicas</h3>

            <div class="form-group">
              <label for="edit-username">Username</label>
              <input
                type="text"
                id="edit-username"
                class="form-input"
                value="${this.user.username}"
                required
              />
            </div>

            <div class="form-group">
              <label for="edit-email">Email</label>
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
            <h3>Informações de Personagem</h3>

            <div class="form-group">
              <label for="edit-level">Nível</label>
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
              <label for="edit-class">Classe Principal</label>
              <select id="edit-class" class="form-input">
                <option value="Knight" ${this.user.main_class === 'Knight' ? 'selected' : ''}>Knight</option>
                <option value="Paladin" ${this.user.main_class === 'Paladin' ? 'selected' : ''}>Paladin</option>
                <option value="Sorcerer" ${this.user.main_class === 'Sorcerer' ? 'selected' : ''}>Sorcerer</option>
                <option value="Druid" ${this.user.main_class === 'Druid' ? 'selected' : ''}>Druid</option>
              </select>
            </div>
          </div>

          <div class="form-section">
            <h3>Foto de Perfil</h3>
            <div class="photo-upload-section">
              <div class="photo-preview-circle" id="photo-preview">
                ${previewContent}
              </div>
              <div class="photo-upload-controls">
                <label for="photo-file-input" class="btn btn-outline btn-sm photo-btn">
                  Escolher Foto
                </label>
                <input
                  type="file"
                  id="photo-file-input"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  style="display: none"
                />
                ${storedPhoto ? `
                  <button type="button" class="btn btn-danger btn-sm" id="remove-photo-btn" data-action="remove-photo">
                    Remover Foto
                  </button>
                ` : ''}
                <p class="form-hint">JPG, PNG, GIF ou WebP • Máx. 2MB</p>
              </div>
            </div>
          </div>

          <div class="modal-actions">
            <button type="button" class="btn btn-secondary" data-action="close-modal">
              Cancelar
            </button>
            <button type="submit" class="btn btn-primary" data-action="save-profile">
              Salvar Alterações
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

    const photoInput = document.getElementById('photo-file-input')
    if (photoInput) {
      photoInput.addEventListener('change', (e) => {
        const file = e.target.files[0]
        if (!file) return

        if (file.size > 2 * 1024 * 1024) {
          this.showNotification('Imagem muito grande! Máximo 2MB.', 'error')
          return
        }

        const reader = new FileReader()
        reader.onload = (ev) => {
          this.pendingPhoto = ev.target.result
          const preview = document.getElementById('photo-preview')
          if (preview) {
            preview.innerHTML = `<img src="${this.pendingPhoto}" alt="Preview" class="preview-image" />`
          }
          const removeBtn = document.getElementById('remove-photo-btn')
          if (!removeBtn) {
            const controls = document.querySelector('.photo-upload-controls')
            if (controls) {
              const hint = controls.querySelector('.form-hint')
              const btn = document.createElement('button')
              btn.type = 'button'
              btn.className = 'btn btn-danger btn-sm'
              btn.id = 'remove-photo-btn'
              btn.dataset.action = 'remove-photo'
              btn.textContent = 'Remover Foto'
              controls.insertBefore(btn, hint)
            }
          }
        }
        reader.readAsDataURL(file)
      })
    }

    const removeBtn = document.getElementById('remove-photo-btn')
    if (removeBtn) {
      removeBtn.addEventListener('click', () => {
        this.pendingPhoto = null
        const preview = document.getElementById('photo-preview')
        if (preview) {
          preview.innerHTML = `<div class="no-photo">${getClassIcon(this.user.main_class)}</div>`
        }
        removeBtn.style.display = 'none'
      })
    }

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
      this.showNotification('Preencha todos os campos!', 'error')
      return
    }
    
    if (level < 1 || level > 9999) {
      this.showNotification('Nível inválido! (1-9999)', 'error')
      return
    }

    this.showNotification('⏳ Atualizando perfil...', 'info')

    import('../services/apiService.js').then(module => {
      const ApiService = module.default
      ApiService.updateProfile({
        username,
        email,
        mainClass,
        level
      })
        .then(() => {
          if (this.pendingPhoto !== undefined) {
            if (this.pendingPhoto === null) {
              localStorage.removeItem(this.getUserPhotoKey())
            } else {
              localStorage.setItem(this.getUserPhotoKey(), this.pendingPhoto)
            }
            this.pendingPhoto = undefined
          }
          this.closeEditProfileModal()
          this.showNotification('Perfil atualizado com sucesso!', 'success')
          setTimeout(() => {
            this.render()
          }, 500)
        })
        .catch(error => {
          console.error('Erro ao atualizar perfil:', error)
          this.showNotification('Erro ao atualizar perfil.', 'error')
        })
    })
  }
  
  handleLogout() {
    if (confirm('Tem certeza que deseja sair?')) {
      import('../services/apiService.js').then(module => {
        const ApiService = module.default
        ApiService.removeToken()
        this.showNotification('Até logo!', 'success')
        
        setTimeout(() => {
          document.dispatchEvent(new CustomEvent('navigate-to-page', {
            detail: { page: 'login' }
          }))
          window.location.reload()
        }, 1000)
      })
    }
  }
  
  handleDeleteBuild(buildId) {
    if (confirm('Tem certeza que deseja excluir esta build?')) {
      this.showNotification('⏳ Excluindo build...', 'info')

      import('../services/apiService.js').then(module => {
        const ApiService = module.default
        ApiService.deleteBuild(buildId)
          .then(() => {
            this.showNotification('Build excluída com sucesso!', 'success')
            setTimeout(() => this.render(), 500)
          })
          .catch(error => {
            console.error('Erro ao excluir build:', error)
            this.showNotification('Erro ao excluir build.', 'error')
          })
      })
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
      /* Auth Gate */
      .auth-gate {
        min-height: calc(100vh - 120px);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 32px;
        padding: 40px 20px;
      }
      .auth-gate-hero {
        text-align: center;
      }
      .auth-gate-char {
        height: 80px;
        width: auto;
        image-rendering: pixelated;
        image-rendering: crisp-edges;
        margin-bottom: 12px;
        filter: drop-shadow(0 0 10px rgba(255,215,0,0.4));
      }
      .auth-gate-title {
        font-family: var(--font-primary);
        font-size: clamp(1.8rem, 4vw, 2.6rem);
        color: var(--color-secondary);
        margin-bottom: 8px;
      }
      .auth-gate-sub {
        color: var(--color-text-secondary);
        font-size: 1rem;
        max-width: 360px;
        margin: 0 auto;
      }
      .auth-gate-card {
        width: 100%;
        max-width: 420px;
        background: linear-gradient(135deg, #2A2A2A, #1A1A1A);
        border: 2px solid var(--color-secondary);
        border-radius: 16px;
        padding: 32px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.6);
      }
      .auth-gate-tabs {
        display: flex;
        gap: 6px;
        background: rgba(0,0,0,0.3);
        padding: 4px;
        border-radius: 8px;
        margin-bottom: 24px;
      }
      .agtab {
        flex: 1;
        padding: 10px;
        background: transparent;
        border: none;
        color: rgba(255,237,213,0.5);
        font-weight: 600;
        font-family: var(--font-body);
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s;
      }
      .agtab.active {
        background: linear-gradient(135deg, #A0522D, #6B3410);
        color: white;
        box-shadow: 0 2px 8px rgba(160,82,45,0.4);
      }
      .ag-form { display: none; flex-direction: column; gap: 16px; }
      .ag-form.active { display: flex; animation: fadeIn 0.3s ease; }
      .ag-group { display: flex; flex-direction: column; gap: 6px; }
      .ag-group label { font-size: 0.9rem; color: var(--color-text-light); font-weight: 500; }
      .ag-input {
        padding: 11px 14px;
        background: rgba(0,0,0,0.3);
        border: 2px solid rgba(74,124,140,0.3);
        border-radius: 8px;
        color: var(--color-text-light);
        font-size: 0.95rem;
        font-family: var(--font-body);
        transition: border-color 0.2s;
      }
      .ag-input:focus { outline: none; border-color: var(--color-secondary); }
      .ag-input::placeholder { color: rgba(255,237,213,0.35); }
      .btn-full { width: 100%; padding: 12px; font-size: 1rem; }
      .ag-msg {
        margin-top: 12px;
        padding: 10px 14px;
        border-radius: 8px;
        font-size: 0.9rem;
        text-align: center;
      }
      .ag-msg-error   { background: rgba(239,68,68,0.2);  color: #f87171; border: 1px solid #ef4444; }
      .ag-msg-success { background: rgba(16,185,129,0.2); color: #34d399; border: 1px solid #10b981; }
      .ag-msg-info    { background: rgba(74,124,140,0.2); color: #93c5fd; border: 1px solid #4a7c8c; }

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
        height: 140px;
        background:
          linear-gradient(135deg, rgba(100, 40, 10, 0.75) 0%, rgba(26, 10, 2, 0.85) 100%),
          url('https://www.tibiafanart.com/wp-content/uploads/photo-gallery/Header_Artwork_Summer_Update_2021.jpg') center 30% / cover no-repeat;
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
        cursor: pointer;
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
        overflow: hidden;
        transition: border-color 0.3s ease, box-shadow 0.3s ease;
      }

      .avatar-icon:hover {
        border-color: #FFA726;
        box-shadow: 0 4px 24px rgba(255, 215, 0, 0.5);
      }

      .avatar-photo {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 50%;
        display: block;
      }

      .avatar-emoji {
        font-size: 3rem;
        display: flex;
        align-items: center;
        justify-content: center;
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
        padding: 4px;
      }

      .stat-preview-item .stat-icon {
        font-size: 1.1rem;
      }

      .stat-preview-item .stat-name {
        color: rgba(255, 237, 213, 0.7);
      }

      .stat-preview-item .stat-value {
        background: var(--color-secondary);
        color: var(--color-text-dark) !important;
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
        .profile-container {
          padding: 24px 16px;
        }

        .profile-main {
          flex-direction: column;
          padding: 0 16px 24px;
          align-items: center;
        }

        .profile-avatar {
          margin-top: -48px;
          align-self: center;
        }

        .profile-info {
          text-align: center;
          width: 100%;
        }

        .profile-meta {
          justify-content: center;
        }

        .profile-actions {
          width: 100%;
          flex-direction: column;
        }

        .profile-username {
          font-size: 1.4rem;
        }

        .stats-grid {
          grid-template-columns: 1fr;
        }

        .stat-box {
          padding: 16px;
        }

        .builds-grid {
          grid-template-columns: 1fr;
        }

        .equipment-preview-grid {
          grid-template-columns: repeat(3, 1fr);
        }

        .build-card-stats {
          grid-template-columns: repeat(3, 1fr);
        }
      }

      @media (max-width: 480px) {
        .profile-container {
          padding: 20px 12px;
        }

        .profile-banner {
          height: 80px;
        }

        .avatar-icon {
          width: 90px;
          height: 90px;
          font-size: 2.2rem;
        }

        .avatar-level {
          font-size: 0.8rem;
          padding: 4px 8px;
        }

        .profile-username {
          font-size: 1.2rem;
        }

        .section-title {
          font-size: 1.4rem;
        }

        .equipment-preview-grid {
          grid-template-columns: repeat(3, 1fr);
          gap: 4px;
        }

        .build-card-stats {
          grid-template-columns: repeat(2, 1fr);
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

      /* Photo Upload */
      .photo-upload-section {
        display: flex;
        align-items: center;
        gap: 20px;
        flex-wrap: wrap;
      }

      .photo-preview-circle {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        background: linear-gradient(135deg, #2A2A2A 0%, #1A1A1A 100%);
        border: 3px solid var(--color-secondary);
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        flex-shrink: 0;
      }

      .photo-preview-circle .preview-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 50%;
        display: block;
      }

      .photo-preview-circle .no-photo {
        font-size: 2.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .photo-upload-controls {
        display: flex;
        flex-direction: column;
        gap: 10px;
        align-items: flex-start;
      }

      .photo-btn {
        cursor: pointer;
        display: inline-block;
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