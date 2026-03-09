// Home Page Renderer - Página inicial responsiva
import { tibiaData } from '../data/tibiaData.js'
import { getRarityIcon, getClassIcon } from '../tibiaImages.js'

export class HomeRenderer {
  constructor() {
    this.data = tibiaData
  }
  
  render() {
    const homeContent = document.querySelector('#home-page .content')
    if (!homeContent) {
      // Se não há .content div, renderizar direto na página
      const homePage = document.querySelector('#home-page')
      if (!homePage) return
      
      homePage.innerHTML = `
        <div class="container">
          ${this.renderHeroSection()}
          ${this.renderStatsSection()}
          ${this.renderFeaturedBuilds()}
        </div>
      `
    } else {
      homeContent.innerHTML = `
        <div class="home-container">
          ${this.renderHeroSection()}
          ${this.renderStatsSection()}
          ${this.renderFeaturedBuilds()}
        </div>
      `
    }
    
    this.addHomeStyles()
  }
  
  renderHeroSection() {
    return `
      <section class="hero-section">
        <div class="hero-content">
          <h1 class="hero-title">⚔️ Tibia Build Forge</h1>
          <p class="hero-description">
            Crie e compartilhe builds épicas para o mundo de Tibia. 
            Otimize seu personagem com as melhores combinações de equipamentos.
          </p>
          <div class="hero-actions">
            <button class="btn btn-primary btn-large" data-action="create-new-build">
              🔨 Criar Nova Build
            </button>
            <button class="btn btn-secondary btn-large" data-page="classes">
              👥 Ver Classes
            </button>
          </div>
        </div>
        <div class="hero-image">
          <div class="tibia-logo">🏰</div>
        </div>
      </section>
    `
  }
  
  renderStatsSection() {
    const totalBuilds = this.data.builds.length
    const totalEquipments = this.data.equipment.length
    const totalClasses = 4 // Knight, Paladin, Druid, Sorcerer
    
    return `
      <section class="stats-section">
        <h2 class="stats-title">📊 Estatísticas da Forja</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">⚔️</div>
            <div class="stat-info">
              <div class="stat-number">${totalBuilds}</div>
              <div class="stat-label">Builds Disponíveis</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">🛡️</div>
            <div class="stat-info">
              <div class="stat-number">${totalEquipments}</div>
              <div class="stat-label">Equipamentos</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">👥</div>
            <div class="stat-info">
              <div class="stat-number">${totalClasses}</div>
              <div class="stat-label">Classes</div>
            </div>
          </div>
        </div>
      </section>
    `
  }
  
  renderFeaturedBuilds() {
    const featuredBuilds = this.data.builds.slice(0, 3) // Mostrar apenas 3 builds em destaque
    
    return `
      <section class="featured-section">
        <div class="section-header">
          <h2 class="section-title">🌟 Builds em Destaque</h2>
          <p class="section-subtitle">Builds mais populares da comunidade</p>
        </div>
        <div class="builds-grid">
          ${featuredBuilds.map(build => this.renderBuildCard(build)).join('')}
        </div>
        <div class="featured-actions">
          <button class="btn btn-outline" data-page="builds">
            Ver Todas as Builds
          </button>
        </div>
      </section>
    `
  }
  
  renderBuildCard(build) {
    return `
      <article class="build-card featured-build">
        <div class="build-header">
          <div class="build-class">
            ${getClassIcon(build.class)} ${build.class}
          </div>
          <div class="build-level">Lv. ${build.level}</div>
        </div>
        <h3 class="build-name">${build.name}</h3>
        <p class="build-description">${build.description}</p>
        <div class="build-equipment-preview">
          ${this.renderEquipmentPreview(build.equipment)}
        </div>
        <div class="build-actions">
          <button class="btn btn-primary btn-sm" data-action="view-build" data-build-id="${build.id}">
            👁️ Ver Detalhes
          </button>
        </div>
      </article>
    `
  }
  
  renderEquipmentPreview(equipment) {
    const previewSlots = ['weapon', 'armor', 'shield', 'helmet']
    
    return `
      <div class="equipment-preview">
        ${previewSlots.map(slot => {
          const item = equipment[slot]
          if (!item) return `<div class="preview-slot empty">${this.getSlotIcon(slot)}</div>`
          
          return `
            <div class="preview-slot filled" title="${item.name}">
              ${getRarityIcon(item.rarity)} 
            </div>
          `
        }).join('')}
      </div>
    `
  }
  
  getSlotIcon(slot) {
    const icons = {
      weapon: '⚔️',
      armor: '🛡️',
      shield: '🛡️',
      helmet: '⛑️'
    }
    return icons[slot] || '❓'
  }
  
  addHomeStyles() {
    // Verificar se os estilos já foram adicionados
    if (document.querySelector('#home-responsive-styles')) return
    
    const styles = document.createElement('style')
    styles.id = 'home-responsive-styles'
    styles.textContent = `
      /* Home Page Responsive Styles */
      .home-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 20px;
      }
      
      /* Hero Section */
      .hero-section {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 40px;
        margin: 40px 0 80px 0;
        min-height: 400px;
      }
      
      .hero-content {
        flex: 1;
        max-width: 600px;
      }
      
      .hero-title {
        font-size: clamp(2.5rem, 5vw, 4rem);
        margin-bottom: 20px;
        background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        line-height: 1.2;
      }
      
      .hero-description {
        font-size: clamp(1.1rem, 2vw, 1.3rem);
        color: var(--color-text-secondary);
        line-height: 1.6;
        margin-bottom: 30px;
      }
      
      .hero-actions {
        display: flex;
        gap: 15px;
        flex-wrap: wrap;
      }
      
      .hero-image {
        flex: 0 0 300px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .tibia-logo {
        font-size: 200px;
        filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.3));
        animation: float 6s ease-in-out infinite;
      }
      
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-20px); }
      }
      
      /* Stats Section */
      .stats-section {
        margin: 60px 0;
        text-align: center;
      }
      
      .stats-title {
        font-size: clamp(1.8rem, 4vw, 2.5rem);
        margin-bottom: 40px;
        color: var(--color-primary);
      }
      
      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 30px;
        margin-top: 40px;
      }
      
      .stat-card {
        background: linear-gradient(135deg, var(--color-surface) 0%, rgba(255, 255, 255, 0.05) 100%);
        border: 2px solid var(--color-border);
        border-radius: 15px;
        padding: 30px 20px;
        text-align: center;
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
      }
      
      .stat-card:hover {
        transform: translateY(-5px);
        border-color: var(--color-primary);
        box-shadow: 0 10px 30px rgba(var(--color-primary-rgb), 0.2);
      }
      
      .stat-icon {
        font-size: 3rem;
        margin-bottom: 15px;
      }
      
      .stat-number {
        font-size: 2.5rem;
        font-weight: bold;
        color: var(--color-primary);
        margin-bottom: 5px;
      }
      
      .stat-label {
        font-size: 1.1rem;
        color: var(--color-text-secondary);
      }
      
      /* Featured Section */
      .featured-section {
        margin: 60px 0;
      }
      
      .section-header {
        text-align: center;
        margin-bottom: 40px;
      }
      
      .section-title {
        font-size: clamp(1.8rem, 4vw, 2.5rem);
        margin-bottom: 10px;
        color: var(--color-primary);
      }
      
      .section-subtitle {
        font-size: 1.2rem;
        color: var(--color-text-secondary);
      }
      
      .builds-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        gap: 25px;
        margin-bottom: 40px;
      }
      
      .featured-build {
        background: linear-gradient(135deg, var(--color-surface) 0%, rgba(255, 255, 255, 0.02) 100%);
        border: 2px solid var(--color-border);
        border-radius: 15px;
        padding: 25px;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
      }
      
      .featured-build::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, var(--color-primary), var(--color-accent));
      }
      
      .featured-build:hover {
        transform: translateY(-5px);
        border-color: var(--color-primary);
        box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
      }
      
      .build-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
      }
      
      .build-class {
        font-weight: bold;
        color: var(--color-primary);
        font-size: 1.1rem;
      }
      
      .build-level {
        background: var(--color-accent);
        color: white;
        padding: 4px 12px;
        border-radius: 15px;
        font-size: 0.9rem;
        font-weight: bold;
      }
      
      .build-name {
        font-size: 1.4rem;
        margin-bottom: 10px;
        color: var(--color-text);
      }
      
      .build-description {
        color: var(--color-text-secondary);
        line-height: 1.5;
        margin-bottom: 20px;
      }
      
      .equipment-preview {
        display: flex;
        gap: 8px;
        margin-bottom: 20px;
        justify-content: center;
      }
      
      .preview-slot {
        width: 40px;
        height: 40px;
        border: 2px solid var(--color-border);
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        transition: all 0.3s ease;
      }
      
      .preview-slot.filled {
        border-color: var(--color-primary);
        background: rgba(var(--color-primary-rgb), 0.1);
      }
      
      .preview-slot.empty {
        opacity: 0.4;
      }
      
      .build-actions {
        display: flex;
        gap: 10px;
        justify-content: center;
      }
      
      .featured-actions {
        text-align: center;
      }
      
      /* Button Sizes */
      .btn-large {
        padding: 15px 30px;
        font-size: 1.1rem;
      }
      
      .btn-sm {
        padding: 8px 16px;
        font-size: 0.9rem;
      }
      
      /* Responsive Design */
      @media (max-width: 768px) {
        .home-container {
          padding: 0 15px;
        }
        
        .hero-section {
          flex-direction: column;
          text-align: center;
          gap: 30px;
          margin: 20px 0 40px 0;
          min-height: auto;
        }
        
        .hero-image {
          flex: none;
          order: -1;
        }
        
        .tibia-logo {
          font-size: 120px;
        }
        
        .hero-actions {
          justify-content: center;
        }
        
        .stats-grid {
          grid-template-columns: 1fr;
          gap: 20px;
        }
        
        .builds-grid {
          grid-template-columns: 1fr;
          gap: 20px;
        }
        
        .build-actions {
          flex-direction: column;
        }
      }
      
      @media (max-width: 480px) {
        .home-container {
          padding: 0 10px;
        }
        
        .hero-actions {
          flex-direction: column;
        }
        
        .btn-large {
          width: 100%;
          padding: 12px 20px;
        }
        
        .stat-card {
          padding: 20px 15px;
        }
        
        .featured-build {
          padding: 20px;
        }
        
        .equipment-preview {
          overflow-x: auto;
          justify-content: flex-start;
          padding-bottom: 5px;
        }
        
        .preview-slot {
          flex-shrink: 0;
        }
      }
    `
    
    document.head.appendChild(styles)
  }
}