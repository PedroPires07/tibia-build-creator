import './style.css'
import { PageManager } from './pageManager.js'

window.pageManager = null

document.addEventListener('DOMContentLoaded', () => {
  window.pageManager = new PageManager()
  console.log('PageManager initialized:', window.pageManager)
  
  const animationStyles = document.createElement('style')
  animationStyles.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }
    
    .notification {
      animation: slideIn 0.3s ease !important;
    }
  `
  
  document.head.appendChild(animationStyles)
  
  console.log('ðŸ”¥ Tibia Build Forge inicializado com sucesso!')
  console.log('ðŸ“± AplicaÃ§Ã£o responsiva ativa')
  console.log('ðŸ—ï¸ Arquitetura modular carregada')
})