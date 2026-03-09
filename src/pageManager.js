// Page Manager - Navegação entre páginas
import { HomeRenderer } from './pages/home.js';
import { CreateBuildRenderer } from './pages/createBuild.js';
import { ClassesRenderer } from './pages/classes.js';
import { EquipmentsRenderer } from './pages/equipments.js';
import { BuildsRenderer } from './pages/builds.js';

export class PageManager {
  constructor() {
    this.currentPage = 'home'
    this.pages = document.querySelectorAll('.page')
    this.navButtons = document.querySelectorAll('.nav-btn')
    this.initialized = false
    
    // Instanciar renderizadores
    this.homeRenderer = new HomeRenderer()
    this.createBuildRenderer = new CreateBuildRenderer()
    this.classesRenderer = new ClassesRenderer()
    this.equipmentsRenderer = new EquipmentsRenderer()
    this.buildsRenderer = new BuildsRenderer()
    
    console.log('PageManager constructor called')
    this.init()
  }
  
  init() {
    // Event listeners para navegação
    this.navButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const page = btn.dataset.page
        this.navigateToPage(page)
      })
    })
    
    // Event listeners para eventos customizados de navegação
    document.addEventListener('navigate-to-page', (e) => {
      console.log('Navigate to:', e.detail.page, 'with params:', e.detail.preselect)
      
      // Verificar se o PageManager está inicializado
      if (!this.initialized) {
        console.warn('PageManager not ready, retrying...')
        setTimeout(() => {
          if (this.initialized) {
            const { page, preselect, filter } = e.detail
            this.navigateToPage(page, { preselect, filter })
          }
        }, 100)
        return
      }
      
      const { page, preselect, filter } = e.detail
      this.navigateToPage(page, { preselect, filter })
    })

    // Event listeners para ações gerais
    document.addEventListener('click', (e) => {
      const action = e.target.dataset.action
      const page = e.target.dataset.page
      
      if (action) {
        this.handleAction(action, e.target)
      }
      
      // Navegação por data-page (para botões fora da navbar)
      if (page && !e.target.classList.contains('nav-btn')) {
        this.navigateToPage(page)
      }
    })
    
    // Renderizar página inicial
    this.renderCurrentPage()
    
    this.initialized = true
    console.log('PageManager fully initialized')
  }
  
  navigateToPage(pageId, params = null) {
    console.log('Navigating to:', pageId, 'params:', params)
    
    // Ocultar todas as páginas
    this.pages.forEach(page => page.classList.remove('active'))
    
    // Remover classe ativa de todos os botões
    this.navButtons.forEach(btn => btn.classList.remove('active'))
    
    // Mostrar página selecionada - ajustar IDs do HTML
    const pageIdWithSuffix = pageId + '-page'
    const targetPage = document.getElementById(pageIdWithSuffix)
    if (targetPage) {
      targetPage.classList.add('active')
      this.currentPage = pageId
    } else {
      console.error('Page not found:', pageIdWithSuffix)
    }
    
    // Ativar botão correspondente
    const activeBtn = document.querySelector(`[data-page="${pageId}"]`)
    if (activeBtn) {
      activeBtn.classList.add('active')
    }
    
    // Renderizar conteúdo da página com parâmetros
    this.renderCurrentPage(params)
  }
  
  renderCurrentPage(params = null) {
    switch(this.currentPage) {
      case 'home':
        this.homeRenderer.render()
        break
      case 'create-build':
        this.createBuildRenderer.render(params)
        break
      case 'classes':
        this.classesRenderer.render()
        break
      case 'builds':
        this.buildsRenderer.render()
        break
      case 'equipment':
        this.equipmentsRenderer.render()
        break
      case 'build-detail':
        this.buildsRenderer.renderBuildDetails()
        break
    }
  }
  
  handleAction(action, element) {
    switch(action) {
      case 'create-new-build':
        this.navigateToPage('create-build')
        break
      case 'view-build':
        this.navigateToPage('build-detail')
        break
      case 'copy-build':
        this.showNotification('Build copiada para rascunhos!')
        break
      case 'save-build':
        this.saveBuild()
        break
      case 'filter-equipment':
        this.equipmentsRenderer.filterEquipment(element.dataset.filter)
        break
      default:
        console.log('Ação não implementada:', action)
    }
  }
  
  showNotification(message) {
    // Criar notificação responsiva
    const notification = document.createElement('div')
    notification.className = 'notification'
    notification.textContent = message
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, var(--color-success) 0%, #4a7c59 100%);
      color: white;
      padding: 15px 25px;
      border-radius: 8px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
      z-index: 10000;
      font-weight: bold;
      max-width: calc(100vw - 40px);
      word-wrap: break-word;
      animation: slideIn 0.3s ease;
    `
    
    document.body.appendChild(notification)
    
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease'
      setTimeout(() => {
        document.body.removeChild(notification)
      }, 300)
    }, 3000)
  }
  
  saveBuild() {
    // Implementar salvamento de build
    this.showNotification('Build salva com sucesso!')
  }
  
  showItemDetails(itemId) {
    this.showNotification(`Visualizando detalhes do item ID: ${itemId}`)
  }
  
  showBuildDetails(buildId) {
    this.showNotification(`Visualizando build ID: ${buildId}`)
  }
  
  copyBuild(buildId) {
    this.showNotification('Build copiada para área de transferência!')
  }
  
  viewBuildDetails(buildId) {
    this.showNotification(`Abrindo detalhes da build ID: ${buildId}`)
  }
}