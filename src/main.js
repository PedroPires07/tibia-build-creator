// Tibia Build Forge - Aplicação Principal Modular
import './style.css'
import { PageManager } from './pageManager.js'

// Variável global para o PageManager
window.pageManager = null

// Inicializar aplicação
document.addEventListener('DOMContentLoaded', () => {
  // Inicializar gerenciador de páginas
  window.pageManager = new PageManager()
  console.log('PageManager initialized:', window.pageManager)
  
  // Adicionar estilos de animação CSS
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
  
  console.log('🔥 Tibia Build Forge inicializado com sucesso!')
  console.log('📱 Aplicação responsiva ativa')
  console.log('🏗️ Arquitetura modular carregada')
})