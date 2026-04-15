export class LoginRenderer {
  constructor() {
    this.mode = 'login' // 'login' ou 'register'
  }
  
  render() {
    const loginContent = document.querySelector('#login-page .content')
    const container = loginContent || document.querySelector('#login-page')
    
    if (!container) return
    
    container.innerHTML = `
      <div class="login-container">
        ${this.renderLoginCard()}
      </div>
    `
    
    this.addLoginStyles()
    this.addEventListeners()
  }
  
  renderLoginCard() {
    return `
      <div class="login-card">
        <div class="login-header">
          <div class="login-icon">🏰</div>
          <h1 class="login-title">Tibia Build Forge</h1>
          <p class="login-subtitle">Entre para gerenciar suas builds</p>
        </div>
        
        <div class="login-tabs">
          <button class="tab-btn active" data-mode="login">
            🔑 Entrar
          </button>
          <button class="tab-btn" data-mode="register">
            ⚔️ Registrar
          </button>
        </div>
        
        <div class="login-forms">
          ${this.renderLoginForm()}
          ${this.renderRegisterForm()}
        </div>
        
        <div class="login-footer">
          <p>Ao entrar, você concorda com nossos termos de serviço</p>
        </div>
      </div>
    `
  }
  
  renderLoginForm() {
    return `
      <form class="auth-form login-form active" id="login-form">
        <div class="form-group">
          <label for="login-email" class="form-label">
            📧 Email ou Username
          </label>
          <input 
            type="text" 
            id="login-email" 
            class="form-input"
            placeholder="Digite seu email ou username"
            required
          />
        </div>
        
        <div class="form-group">
          <label for="login-password" class="form-label">
            🔐 Senha
          </label>
          <input 
            type="password" 
            id="login-password" 
            class="form-input"
            placeholder="Digite sua senha"
            required
          />
        </div>
        
        <div class="form-options">
          <label class="checkbox-label">
            <input type="checkbox" id="remember-me" />
            <span>Lembrar-me</span>
          </label>
          <a href="#" class="forgot-password">Esqueceu a senha?</a>
        </div>
        
        <button type="submit" class="btn btn-primary btn-large btn-full">
          🔑 Entrar
        </button>
      </form>
    `
  }
  
  renderRegisterForm() {
    return `
      <form class="auth-form register-form" id="register-form">
        <div class="form-group">
          <label for="register-username" class="form-label">
            👤 Username
          </label>
          <input 
            type="text" 
            id="register-username" 
            class="form-input"
            placeholder="Escolha um username único"
            required
          />
        </div>
        
        <div class="form-group">
          <label for="register-email" class="form-label">
            📧 Email
          </label>
          <input 
            type="email" 
            id="register-email" 
            class="form-input"
            placeholder="seu@email.com"
            required
          />
        </div>
        
        <div class="form-group">
          <label for="register-password" class="form-label">
            🔐 Senha
          </label>
          <input 
            type="password" 
            id="register-password" 
            class="form-input"
            placeholder="Mínimo 6 caracteres"
            required
            minlength="6"
          />
        </div>
        
        <div class="form-group">
          <label for="register-confirm" class="form-label">
            ✅ Confirmar Senha
          </label>
          <input 
            type="password" 
            id="register-confirm" 
            class="form-input"
            placeholder="Digite a senha novamente"
            required
          />
        </div>
        
        <div class="form-group">
          <label for="register-class" class="form-label">
            🛡️ Classe Principal
          </label>
          <select id="register-class" class="form-input" required>
            <option value="" disabled selected>Selecione sua classe</option>
            <option value="Knight">⚔️ Knight</option>
            <option value="Paladin">🏹 Paladin</option>
            <option value="Sorcerer">🔮 Sorcerer</option>
            <option value="Druid">🌿 Druid</option>
          </select>
        </div>

        <div class="form-options">
          <label class="checkbox-label">
            <input type="checkbox" id="accept-terms" required />
            <span>Aceito os <a href="#">termos de serviço</a></span>
          </label>
        </div>
        
        <button type="submit" class="btn btn-primary btn-large btn-full">
          ⚔️ Criar Conta
        </button>
      </form>
    `
  }
  
  addEventListeners() {
    const tabButtons = document.querySelectorAll('.tab-btn')
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.dataset.mode
        this.switchMode(mode)
      })
    })
    
    const loginForm = document.getElementById('login-form')
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault()
        this.handleLogin()
      })
    }
    
    const registerForm = document.getElementById('register-form')
    if (registerForm) {
      registerForm.addEventListener('submit', (e) => {
        e.preventDefault()
        this.handleRegister()
      })
    }
  }
  
  switchMode(mode) {
    this.mode = mode
    
    const tabButtons = document.querySelectorAll('.tab-btn')
    tabButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.mode === mode)
    })
    
    const loginForm = document.querySelector('.login-form')
    const registerForm = document.querySelector('.register-form')
    
    if (mode === 'login') {
      loginForm?.classList.add('active')
      registerForm?.classList.remove('active')
    } else {
      loginForm?.classList.remove('active')
      registerForm?.classList.add('active')
    }
  }
  
  handleLogin() {
    const emailOrUsername = document.getElementById('login-email').value
    const password = document.getElementById('login-password').value
    
    if (!emailOrUsername || !password) {
      this.showNotification('❌ Preencha email/username e senha!', 'error')
      return
    }

    this.showNotification('⏳ Entrando...', 'info')

    import('../services/apiService.js').then(module => {
      const ApiService = module.default
      ApiService.login(emailOrUsername, password)
        .then(response => {
          ApiService.setToken(response.token)
          this.showNotification('✅ Login realizado com sucesso!', 'success')
          setTimeout(() => {
            document.dispatchEvent(new CustomEvent('navigate-to-page', {
              detail: { page: 'profile' }
            }))
            window.location.reload()
          }, 1000)
        })
        .catch(error => {
          console.error('Erro ao fazer login:', error)
          let errorMsg = 'Erro ao fazer login. Verifique suas credenciais.'
          try {
            const errorData = JSON.parse(error.message)
            if (errorData.error) {
              errorMsg = '❌ ' + errorData.error
            }
          } catch (e) {
            if (error.message) {
              errorMsg = '❌ ' + error.message
            }
          }
          this.showNotification(errorMsg, 'error')
        })
    })
  }
  
  handleRegister() {
    const username = document.getElementById('register-username').value
    const email = document.getElementById('register-email').value
    const password = document.getElementById('register-password').value
    const confirm = document.getElementById('register-confirm').value
    const acceptTerms = document.getElementById('accept-terms').checked
    const mainClass = document.getElementById('register-class').value

    if (password !== confirm) {
      this.showNotification('❌ As senhas não coincidem!', 'error')
      return
    }
    
    if (!acceptTerms) {
      this.showNotification('❌ Você deve aceitar os termos de serviço!', 'error')
      return
    }

    if (!mainClass) {
      this.showNotification('❌ Selecione sua classe principal!', 'error')
      return
    }

    this.showNotification('⏳ Criando conta...', 'info')

    import('../services/apiService.js').then(module => {
      const ApiService = module.default
      ApiService.register(username, email, password, mainClass)
        .then(response => {
          ApiService.setToken(response.token)
          this.showNotification('✅ Conta criada com sucesso!', 'success')
          setTimeout(() => {
            document.dispatchEvent(new CustomEvent('navigate-to-page', {
              detail: { page: 'profile' }
            }))
            window.location.reload()
          }, 1000)
        })
        .catch(error => {
          console.error('Erro ao registrar:', error)
          let errorMsg = 'Erro ao criar conta. Verifique os dados.'
          try {
            const errorData = JSON.parse(error.message)
            if (errorData.error) {
              errorMsg = '❌ ' + errorData.error
            }
          } catch (e) {
            if (error.message) {
              errorMsg = '❌ ' + error.message
            }
          }
          this.showNotification(errorMsg, 'error')
        })
    })
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
    `
    
    document.body.appendChild(notification)
    
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease'
      setTimeout(() => notification.remove(), 300)
    }, 3000)
  }
  
  addLoginStyles() {
    if (document.querySelector('#login-styles')) return
    
    const styles = document.createElement('style')
    styles.id = 'login-styles'
    styles.textContent = `
      /* Login Container */
      .login-container {
        min-height: calc(100vh - 120px);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 40px 20px;
      }
      
      /* Login Card */
      .login-card {
        width: 100%;
        max-width: 480px;
        background: linear-gradient(135deg, #2A2A2A 0%, #1A1A1A 100%);
        border: 2px solid var(--color-secondary);
        border-radius: 16px;
        padding: 40px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
        position: relative;
        overflow: hidden;
      }
      
      .login-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, 
          var(--color-primary) 0%, 
          var(--color-secondary) 50%, 
          var(--color-primary) 100%
        );
        animation: shimmer 3s ease-in-out infinite;
      }
      
      /* Login Header */
      .login-header {
        text-align: center;
        margin-bottom: 32px;
      }
      
      .login-icon {
        font-size: 4rem;
        margin-bottom: 16px;
        animation: float 3s ease-in-out infinite;
      }
      
      .login-title {
        font-family: var(--font-primary);
        font-size: 2rem;
        color: var(--color-secondary);
        margin-bottom: 8px;
      }
      
      .login-subtitle {
        color: rgba(255, 237, 213, 0.7);
        font-size: 1rem;
      }
      
      /* Tabs */
      .login-tabs {
        display: flex;
        gap: 8px;
        margin-bottom: 24px;
        background: rgba(0, 0, 0, 0.3);
        padding: 4px;
        border-radius: 8px;
      }
      
      .tab-btn {
        flex: 1;
        padding: 12px 16px;
        background: transparent;
        border: none;
        color: rgba(255, 237, 213, 0.6);
        cursor: pointer;
        border-radius: 6px;
        font-weight: 500;
        transition: all 0.3s ease;
        font-family: var(--font-body);
      }
      
      .tab-btn:hover {
        color: var(--color-secondary);
        background: rgba(255, 215, 0, 0.1);
      }
      
      .tab-btn.active {
        background: linear-gradient(135deg, #A0522D 0%, #6B3410 100%);
        color: white;
        box-shadow: 0 2px 8px rgba(160, 82, 45, 0.4);
      }
      
      /* Forms */
      .login-forms {
        position: relative;
        min-height: 380px;
      }
      
      .auth-form {
        display: none;
        flex-direction: column;
        gap: 20px;
      }
      
      .auth-form.active {
        display: flex;
        animation: fadeIn 0.3s ease;
      }
      
      .form-group {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      
      .form-label {
        font-weight: 500;
        color: var(--color-text-light);
        font-size: 0.95rem;
      }
      
      .form-input {
        padding: 12px 16px;
        background: rgba(0, 0, 0, 0.3);
        border: 2px solid rgba(74, 124, 140, 0.3);
        border-radius: 8px;
        color: var(--color-text-light);
        font-size: 1rem;
        font-family: var(--font-body);
        transition: all 0.3s ease;
      }
      
      .form-input:focus {
        outline: none;
        border-color: var(--color-secondary);
        background: rgba(0, 0, 0, 0.5);
        box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.1);
      }
      
      .form-input::placeholder {
        color: rgba(255, 237, 213, 0.4);
      }
      
      .form-options {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 12px;
        font-size: 0.9rem;
      }
      
      .checkbox-label {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        color: rgba(255, 237, 213, 0.8);
      }
      
      .checkbox-label input[type="checkbox"] {
        cursor: pointer;
        width: 18px;
        height: 18px;
      }
      
      .forgot-password {
        color: var(--color-secondary);
        text-decoration: none;
        transition: all 0.2s ease;
      }
      
      .forgot-password:hover {
        color: var(--color-warning);
        text-decoration: underline;
      }
      
      .checkbox-label a {
        color: var(--color-secondary);
        text-decoration: none;
      }
      
      .checkbox-label a:hover {
        text-decoration: underline;
      }
      
      /* Footer */
      .login-footer {
        text-align: center;
        font-size: 0.85rem;
        color: rgba(255, 237, 213, 0.5);
        margin-top: 16px;
      }
      
      /* Animations */
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes float {
        0%, 100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-10px);
        }
      }
      
      @keyframes shimmer {
        0% {
          background-position: -1000px 0;
        }
        100% {
          background-position: 1000px 0;
        }
      }
      
      /* Button Full Width */
      .btn-full {
        width: 100%;
      }
      
      /* Responsive */
      @media (max-width: 600px) {
        .login-card {
          padding: 24px;
        }
        
        .login-title {
          font-size: 1.5rem;
        }
        
        .login-icon {
          font-size: 3rem;
        }
        
        .form-options {
          flex-direction: column;
          align-items: flex-start;
        }
      }
    `
    
    document.head.appendChild(styles)
  }
}