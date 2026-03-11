import { tibiaData } from '../data/tibiaData.js'
import { getClassIcon, getRarityIcon } from '../tibiaImages.js'

export class ClassesRenderer {
  constructor() {
    this.data = tibiaData
    this.classes = [
      {
        name: 'Knight',
        icon: 'ðŸ›¡ï¸',
        description: 'Tanque robusto com alta defesa e vida. Especializado em combate corpo a corpo.',
        primaryStats: ['defense', 'health'],
        weapons: ['sword', 'axe', 'club'],
        armor: 'heavy',
        playstyle: 'Tanque/DPS Melee',
        difficulty: 'FÃ¡cil',
        pros: [
          'Alta resistÃªncia fÃ­sica',
          'Excelente para PvP',
          'FÃ¡cil de jogar',
          'Boa para iniciantes'
        ],
        cons: [
          'Baixa velocidade de hunt',
          'Dependente de supplies',
          'Limitado Ã  distÃ¢ncia',
          'Caro para upar'
        ],
        builds: this.data.builds.filter(build => build.class === 'Knight')
      },
      {
        name: 'Paladin',
        icon: 'ðŸ¹',
        description: 'VersÃ¡til combatente Ã  distÃ¢ncia com boa mobilidade e utilidade.',
        primaryStats: ['accuracy', 'health'],
        weapons: ['bow', 'crossbow'],
        armor: 'medium',
        playstyle: 'DPS Ranged/UtilitÃ¡rio',
        difficulty: 'MÃ©dio',
        pros: [
          'Versatilidade incomparÃ¡vel',
          'Bom damage Ã  distÃ¢ncia',
          'Healing e support',
          'Mobilidade excelente'
        ],
        cons: [
          'Expensive ammunition',
          'Complexo de jogar',
          'Vulnerable em close combat',
          'Requer micromanagement'
        ],
        builds: this.data.builds.filter(build => build.class === 'Paladin')
      },
      {
        name: 'Druid',
        icon: 'ðŸŒ¿',
        description: 'Mago da natureza com foco em cura e magias de Ã¡rea.',
        primaryStats: ['magic', 'mana'],
        weapons: ['rod'],
        armor: 'light',
        playstyle: 'Healer/Support/AoE',
        difficulty: 'MÃ©dio-Alto',
        pros: [
          'Melhor healer do jogo',
          'Excelente para team hunt',
          'Strong AoE spells',
          'Versatilidade mÃ¡gica'
        ],
        cons: [
          'Baixa defesa fÃ­sica',
          'Dependente de mana',
          'Caro para manter',
          'VulnerÃ¡vel sozinho'
        ],
        builds: this.data.builds.filter(build => build.class === 'Druid')
      },
      {
        name: 'Sorcerer',
        icon: 'ðŸ”®',
        description: 'Mago destruidor com o maior dano mÃ¡gico do jogo.',
        primaryStats: ['magic', 'mana'],
        weapons: ['wand'],
        armor: 'light',
        playstyle: 'DPS MÃ¡gico/Burst',
        difficulty: 'Alto',
        pros: [
          'Highest magical damage',
          'Devastating AoE spells',
          'Excellent for hunting',
          'Fast experience gain'
        ],
        cons: [
          'Extremely fragile',
          'Very expensive',
          'High skill requirement',
          'Mana dependent'
        ],
        builds: this.data.builds.filter(build => build.class === 'Sorcerer')
      }
    ]
  }
  
  render() {
    const classesContent = document.querySelector('#classes-page .content')
    if (!classesContent) {
      const classesPage = document.querySelector('#classes-page')
      if (!classesPage) return
      
      classesPage.innerHTML = `
        <div class="container">
          ${this.renderClassesHeader()}
          ${this.renderClassesGrid()}
          ${this.renderComparisonTable()}
        </div>
      `
    } else {
      classesContent.innerHTML = `
        <div class="classes-container">
          ${this.renderClassesHeader()}
          ${this.renderClassesGrid()}
          ${this.renderComparisonTable()}
        </div>
      `
    }
    
    this.addClassesStyles()
    this.addEventListeners()
  }
  
  renderClassesHeader() {
    return `
      <header class="classes-header">
        <div class="header-content">
          <h1 class="page-title">ðŸ‘¥ Classes de Tibia</h1>
          <p class="page-subtitle">
            Descubra as quatro vocaÃ§Ãµes Ãºnicas de Tibia. Cada classe oferece um estilo de jogo distinto 
            com habilidades, equipamentos e estratÃ©gias especÃ­ficas.
          </p>
        </div>
        <div class="header-stats">
          <div class="stat-item">
            <span class="stat-value">4</span>
            <span class="stat-label">Classes</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">${this.data.builds.length}</span>
            <span class="stat-label">Builds</span>
          </div>
        </div>
      </header>
    `
  }
  
  renderClassesGrid() {
    return `
      <section class="classes-grid-section">
        <div class="classes-grid">
          ${this.classes.map(classInfo => this.renderClassCard(classInfo)).join('')}
        </div>
      </section>
    `
  }
  
  renderClassCard(classInfo) {
    return `
      <article class="class-card" data-class="${classInfo.name.toLowerCase()}">
        <div class="class-card-header">
          <div class="class-icon">${classInfo.icon}</div>
          <div class="class-title">
            <h2 class="class-name">${classInfo.name}</h2>
            <div class="class-difficulty difficulty-${classInfo.difficulty.toLowerCase()}">${classInfo.difficulty}</div>
          </div>
        </div>
        
        <p class="class-description">${classInfo.description}</p>
        
        <div class="class-details">
          <div class="detail-row">
            <span class="detail-label">ðŸŽ¯ Estilo:</span>
            <span class="detail-value">${classInfo.playstyle}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">âš”ï¸ Armas:</span>
            <span class="detail-value">${classInfo.weapons.join(', ')}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">ðŸ›¡ï¸ Armadura:</span>
            <span class="detail-value">${classInfo.armor}</span>
          </div>
        </div>
        
        <div class="class-pros-cons">
          <div class="pros-section">
            <h4 class="pros-title">âœ… Vantagens</h4>
            <ul class="pros-list">
              ${classInfo.pros.map(pro => `<li>${pro}</li>`).join('')}
            </ul>
          </div>
          <div class="cons-section">
            <h4 class="cons-title">âŒ Desvantagens</h4>
            <ul class="cons-list">
              ${classInfo.cons.map(con => `<li>${con}</li>`).join('')}
            </ul>
          </div>
        </div>
        
        <div class="class-builds">
          <h4 class="builds-title">ðŸ”¨ Builds DisponÃ­veis (${classInfo.builds.length})</h4>
          ${classInfo.builds.length > 0 ? `
            <div class="builds-preview">
              ${classInfo.builds.slice(0, 2).map(build => this.renderBuildPreview(build)).join('')}
              ${classInfo.builds.length > 2 ? `
                <div class="more-builds">
                  +${classInfo.builds.length - 2} mais builds
                </div>
              ` : ''}
            </div>
          ` : `
            <p class="no-builds">Nenhuma build disponÃ­vel ainda.</p>
          `}
        </div>
        
        <div class="class-actions">
          <button class="btn btn-primary" data-action="view-class-builds" data-class="${classInfo.name}">
            ðŸ‘ï¸ Ver Builds
          </button>
          <button class="btn btn-secondary" data-action="create-class-build" data-class="${classInfo.name}">
            ðŸ”§ Criar Build
          </button>
        </div>
      </article>
    `
  }
  
  renderBuildPreview(build) {
    return `
      <div class="build-preview" data-build-id="${build.id}">
        <div class="build-preview-header">
          <span class="build-name">${build.name}</span>
          <span class="build-level">Lv.${build.level}</span>
        </div>
        <p class="build-preview-desc">${build.description}</p>
      </div>
    `
  }
  
  renderComparisonTable() {
    return `
      <section class="comparison-section">
        <h2 class="section-title">ðŸ“Š ComparaÃ§Ã£o de Classes</h2>
        <div class="comparison-container">
          <div class="comparison-table">
            <div class="table-header">
              <div class="header-cell">CaracterÃ­stica</div>
              ${this.classes.map(c => `<div class="header-cell class-header">${c.icon} ${c.name}</div>`).join('')}
            </div>
            
            ${this.renderComparisonRow('Dificuldade', this.classes.map(c => c.difficulty))}
            ${this.renderComparisonRow('Estilo de Jogo', this.classes.map(c => c.playstyle))}
            ${this.renderComparisonRow('Tipo de Armadura', this.classes.map(c => c.armor))}
            ${this.renderComparisonRow('Builds DisponÃ­veis', this.classes.map(c => c.builds.length))}
          </div>
        </div>
      </section>
    `
  }
  
  renderComparisonRow(label, values) {
    return `
      <div class="table-row">
        <div class="row-label">${label}</div>
        ${values.map(value => `<div class="row-cell">${value}</div>`).join('')}
      </div>
    `
  }
  
  addEventListeners() {
    if (this.clickHandler) {
      document.removeEventListener('click', this.clickHandler)
    }
    
    this.clickHandler = (e) => {
      const action = e.target.dataset.action
      
      if (action === 'view-class-builds') {
        e.preventDefault()
        const className = e.target.dataset.class
        console.log('View builds for class:', className)
        this.viewClassBuilds(className)
      }
      
      if (action === 'create-class-build') {
        e.preventDefault()
        const className = e.target.dataset.class
        console.log('Create build for class:', className)
        this.createClassBuild(className)
      }
      
      if (e.target.closest('.build-preview')) {
        const buildId = parseInt(e.target.closest('.build-preview').dataset.buildId)
        this.viewBuildDetails(buildId)
      }
    }
    
    document.addEventListener('click', this.clickHandler)
  }
  
  viewClassBuilds(className) {
    const event = new CustomEvent('navigate-to-page', { 
      detail: { page: 'equipment', filter: { class: className } }
    })
    document.dispatchEvent(event)
  }
  
  createClassBuild(className) {
    console.log('Creating build for class:', className)
    const event = new CustomEvent('navigate-to-page', { 
      detail: { page: 'create-build', preselect: { class: className } }
    })
    document.dispatchEvent(event)
  }
  
  viewBuildDetails(buildId) {
    const event = new CustomEvent('show-build-details', { 
      detail: { buildId }
    })
    document.dispatchEvent(event)
  }
  
  addClassesStyles() {
    if (document.querySelector('#classes-responsive-styles')) return
    
    const styles = document.createElement('style')
    styles.id = 'classes-responsive-styles'
    styles.textContent = `
      /* Classes Page Responsive Styles */
      .classes-container {
        max-width: 1400px;
        margin: 0 auto;
        padding: 0 20px;
      }
      
      /* Header */
      .classes-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 50px;
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
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
      }
      
      .stat-value {
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
      
      /* Classes Grid */
      .classes-grid-section {
        margin-bottom: 60px;
      }
      
      .classes-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
        gap: 30px;
      }
      
      .class-card {
        background: var(--color-surface);
        border: 3px solid var(--color-border);
        border-radius: 20px;
        padding: 30px;
        transition: all 0.4s ease;
        position: relative;
        overflow: hidden;
      }
      
      .class-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 6px;
        background: linear-gradient(90deg, var(--color-primary), var(--color-accent));
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      
      .class-card:hover {
        transform: translateY(-8px);
        border-color: var(--color-primary);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
      }
      
      .class-card:hover::before {
        opacity: 1;
      }
      
      .class-card-header {
        display: flex;
        align-items: center;
        gap: 20px;
        margin-bottom: 20px;
      }
      
      .class-icon {
        font-size: 3.5rem;
        filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
      }
      
      .class-title {
        flex: 1;
      }
      
      .class-name {
        font-size: 2rem;
        color: var(--color-primary);
        margin-bottom: 8px;
      }
      
      .class-difficulty {
        padding: 6px 15px;
        border-radius: 20px;
        font-size: 0.9rem;
        font-weight: bold;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      
      .difficulty-fÃ¡cil { background: #10b981; color: white; }
      .difficulty-mÃ©dio { background: #f59e0b; color: white; }
      .difficulty-mÃ©dio-alto { background: #f97316; color: white; }
      .difficulty-alto { background: #ef4444; color: white; }
      
      .class-description {
        font-size: 1.1rem;
        line-height: 1.6;
        color: var(--color-text-secondary);
        margin-bottom: 25px;
      }
      
      .class-details {
        margin-bottom: 25px;
      }
      
      .detail-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 0;
        border-bottom: 1px solid var(--color-border);
      }
      
      .detail-row:last-child {
        border-bottom: none;
      }
      
      .detail-label {
        font-weight: bold;
        color: var(--color-primary);
      }
      
      .detail-value {
        color: var(--color-text);
        text-transform: capitalize;
      }
      
      .class-pros-cons {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
        margin-bottom: 25px;
      }
      
      .pros-section, .cons-section {
        padding: 15px;
        border-radius: 12px;
      }
      
      .pros-section {
        background: rgba(var(--color-success-rgb), 0.05);
        border: 1px solid var(--color-success);
      }
      
      .cons-section {
        background: rgba(var(--color-danger-rgb), 0.05);
        border: 1px solid var(--color-danger);
      }
      
      .pros-title {
        color: var(--color-success);
        margin-bottom: 10px;
        font-size: 1rem;
      }
      
      .cons-title {
        color: var(--color-danger);
        margin-bottom: 10px;
        font-size: 1rem;
      }
      
      .pros-list, .cons-list {
        list-style: none;
        padding: 0;
        margin: 0;
      }
      
      .pros-list li, .cons-list li {
        padding: 4px 0;
        font-size: 0.9rem;
        line-height: 1.4;
      }
      
      .class-builds {
        margin-bottom: 25px;
      }
      
      .builds-title {
        color: var(--color-primary);
        margin-bottom: 15px;
        font-size: 1.1rem;
      }
      
      .builds-preview {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      
      .build-preview {
        background: var(--color-background);
        border: 1px solid var(--color-border);
        border-radius: 8px;
        padding: 12px;
        cursor: pointer;
        transition: all 0.3s ease;
      }
      
      .build-preview:hover {
        border-color: var(--color-primary);
        background: rgba(var(--color-primary-rgb), 0.02);
      }
      
      .build-preview-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 5px;
      }
      
      .build-name {
        font-weight: bold;
        color: var(--color-text);
      }
      
      .build-level {
        background: var(--color-accent);
        color: white;
        padding: 2px 8px;
        border-radius: 10px;
        font-size: 0.8rem;
        font-weight: bold;
      }
      
      .build-preview-desc {
        font-size: 0.9rem;
        color: var(--color-text-secondary);
        line-height: 1.4;
        margin: 0;
      }
      
      .more-builds {
        text-align: center;
        padding: 10px;
        color: var(--color-text-secondary);
        font-style: italic;
        border: 1px dashed var(--color-border);
        border-radius: 8px;
      }
      
      .no-builds {
        color: var(--color-text-secondary);
        font-style: italic;
        text-align: center;
        padding: 15px;
        margin: 0;
      }
      
      .class-actions {
        display: flex;
        gap: 12px;
        justify-content: center;
      }
      
      /* Comparison Section */
      .comparison-section {
        background: var(--color-surface);
        border: 2px solid var(--color-border);
        border-radius: 20px;
        padding: 40px;
      }
      
      .section-title {
        text-align: center;
        font-size: 2rem;
        color: var(--color-primary);
        margin-bottom: 30px;
      }
      
      .comparison-container {
        overflow-x: auto;
      }
      
      .comparison-table {
        min-width: 800px;
        border-radius: 12px;
        overflow: hidden;
        border: 2px solid var(--color-border);
      }
      
      .table-header {
        display: grid;
        grid-template-columns: 200px repeat(4, 1fr);
        background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
      }
      
      .header-cell {
        padding: 20px 15px;
        font-weight: bold;
        color: white;
        text-align: center;
      }
      
      .header-cell:first-child {
        text-align: left;
      }
      
      .class-header {
        font-size: 1.1rem;
      }
      
      .table-row {
        display: grid;
        grid-template-columns: 200px repeat(4, 1fr);
        border-bottom: 1px solid var(--color-border);
      }
      
      .table-row:last-child {
        border-bottom: none;
      }
      
      .table-row:nth-child(even) {
        background: rgba(var(--color-primary-rgb), 0.02);
      }
      
      .row-label {
        padding: 15px;
        font-weight: bold;
        color: var(--color-primary);
        background: var(--color-background);
      }
      
      .row-cell {
        padding: 15px;
        text-align: center;
        color: var(--color-text);
      }
      
      /* Responsive Design */
      @media (max-width: 768px) {
        .classes-container {
          padding: 0 15px;
        }
        
        .classes-header {
          flex-direction: column;
          text-align: center;
          gap: 25px;
          padding-bottom: 20px;
        }
        
        .header-stats {
          gap: 20px;
        }
        
        .classes-grid {
          grid-template-columns: 1fr;
          gap: 25px;
        }
        
        .class-card {
          padding: 25px 20px;
        }
        
        .class-card-header {
          flex-direction: column;
          text-align: center;
          gap: 15px;
        }
        
        .class-icon {
          font-size: 3rem;
        }
        
        .class-pros-cons {
          grid-template-columns: 1fr;
        }
        
        .class-actions {
          flex-direction: column;
        }
        
        .comparison-section {
          padding: 25px 15px;
        }
        
        .comparison-table {
          min-width: 600px;
        }
      }
      
      @media (max-width: 480px) {
        .classes-container {
          padding: 0 10px;
        }
        
        .class-card {
          padding: 20px 15px;
        }
        
        .class-name {
          font-size: 1.6rem;
        }
        
        .comparison-section {
          padding: 20px 10px;
        }
        
        .table-header, .table-row {
          grid-template-columns: 150px repeat(4, 1fr);
        }
        
        .header-cell, .row-label, .row-cell {
          padding: 12px 8px;
          font-size: 0.9rem;
        }
      }
    `
    
    document.head.appendChild(styles)
  }
}