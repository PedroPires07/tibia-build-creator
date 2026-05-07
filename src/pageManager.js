import { HomeRenderer } from './pages/home.js';
import { CreateBuildRenderer } from './pages/createBuild.js';
import { ClassesRenderer } from './pages/classes.js';
import { EquipmentsRenderer } from './pages/equipments.js';
import { BuildsRenderer } from './pages/builds.js';
import { LoginRenderer } from './pages/login.js';
import { ProfileRenderer } from './pages/profile.js';
import ApiService from './services/apiService.js';

export class PageManager {
  constructor() {
    this.currentPage = 'profile'
    this.pages = document.querySelectorAll('.page')
    this.navButtons = document.querySelectorAll('.nav-btn')
    this.initialized = false
    
    this.homeRenderer = new HomeRenderer()
    this.createBuildRenderer = new CreateBuildRenderer()
    this.classesRenderer = new ClassesRenderer()
    this.equipmentsRenderer = new EquipmentsRenderer()
    this.buildsRenderer = new BuildsRenderer()
    this.loginRenderer = new LoginRenderer()
    this.profileRenderer = new ProfileRenderer()
    
    console.log('PageManager constructor called')
    this.init()
  }
  
  init() {
    this.navButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const page = btn.dataset.page
        this.navigateToPage(page)
      })
    })
    
    document.addEventListener('navigate-to-page', (e) => {
      console.log('Navigate to:', e.detail.page, 'with params:', e.detail.preselect)
      
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

    document.addEventListener('click', (e) => {
      const action = e.target.dataset.action
      const page = e.target.dataset.page
      
      if (action) {
        this.handleAction(action, e.target)
      }
      
      if (page && !e.target.classList.contains('nav-btn')) {
        this.navigateToPage(page)
      }
    })
    
    this.setupSearchFunctionality()
    
    this.renderCurrentPage()
    
    this.initialized = true
    console.log('PageManager fully initialized')
  }
  
  navigateToPage(pageId, params = null) {
    console.log('Navigating to:', pageId, 'params:', params)
    
    const protectedPages = ['create-build']
    const isLoggedIn = ApiService.getToken()

    if (protectedPages.includes(pageId) && !isLoggedIn) {
      this.showNotification('Você precisa estar logado para acessar esta página!')
      pageId = 'profile'
    }
    
    this.pages.forEach(page => page.classList.remove('active'))
    
    this.navButtons.forEach(btn => btn.classList.remove('active'))
    
    const pageIdWithSuffix = pageId + '-page'
    const targetPage = document.getElementById(pageIdWithSuffix)
    if (targetPage) {
      targetPage.classList.add('active')
      this.currentPage = pageId
    } else {
      console.error('Page not found:', pageIdWithSuffix)
    }
    
    const activeBtn = document.querySelector(`[data-page="${pageId}"]`)
    if (activeBtn) {
      activeBtn.classList.add('active')
    }
    
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
      case 'login':
        this.loginRenderer.render()
        break
      case 'profile':
        this.profileRenderer.render()
        break
    }
  }
  
  setupSearchFunctionality() {
    const searchInput = document.getElementById('search-input')
    const searchBtn = document.getElementById('search-btn')
    
    if (!searchInput || !searchBtn) {
      console.warn('Search elements not found')
      return
    }
    
    searchBtn.addEventListener('click', () => {
      this.performSearch(searchInput.value)
    })
    
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.performSearch(searchInput.value)
      }
    })
  }
  
  performSearch(query) {
    if (!query || query.trim() === '') {
      this.showNotification('Digite algo para buscar!')
      return
    }
    
    const searchTerm = query.toLowerCase().trim()
    
    import('./data/tibiaData.js').then(module => {
      const { tibiaData } = module
      
      const buildResults = tibiaData.builds.filter(build => {
        return build.name.toLowerCase().includes(searchTerm) ||
               build.description.toLowerCase().includes(searchTerm) ||
               build.class.toLowerCase().includes(searchTerm)
      })
      
      const equipmentResults = tibiaData.equipment.filter(item => {
        return item.name.toLowerCase().includes(searchTerm) ||
               item.type.toLowerCase().includes(searchTerm) ||
               item.rarity.toLowerCase().includes(searchTerm)
      })
      
      if (buildResults.length === 0 && equipmentResults.length === 0) {
        this.showNotification(`Nenhum resultado encontrado para "${query}"`)
      } else {
        this.showSearchResults(query, buildResults, equipmentResults)
      }
    })
  }
  
  showSearchResults(query, builds, equipment) {
    this.navigateToPage('builds')
    
    setTimeout(() => {
      this.buildsRenderer.filterBySearch(query, builds)
      
      const totalResults = builds.length + equipment.length
      this.showNotification(`${totalResults} resultado(s) encontrado(s) para "${query}"`)
    }, 100)
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