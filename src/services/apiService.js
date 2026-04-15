const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:12345/api'

export class ApiService {
  static getToken() {
    return localStorage.getItem('auth-token')
  }

  static setToken(token) {
    localStorage.setItem('auth-token', token)
  }

  static removeToken() {
    localStorage.removeItem('auth-token')
  }

  static getHeaders() {
    const token = this.getToken()
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  }

  static async register(username, email, password, mainClass) {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ username, email, password, mainClass })
    })
    if (!response.ok) throw new Error(await response.text())
    return response.json()
  }

  static async login(emailOrUsername, password) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ emailOrUsername, password })
    })
    if (!response.ok) throw new Error(await response.text())
    return response.json()
  }

  static async getProfile() {
    const response = await fetch(`${API_URL}/user/profile`, {
      headers: this.getHeaders()
    })
    if (!response.ok) throw new Error(await response.text())
    return response.json()
  }

  static async updateProfile(data) {
    const response = await fetch(`${API_URL}/user/profile`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error(await response.text())
    return response.json()
  }

  static async getUserBuilds() {
    const response = await fetch(`${API_URL}/user/builds`, {
      headers: this.getHeaders()
    })
    if (!response.ok) throw new Error(await response.text())
    return response.json()
  }

  static async createBuild(buildData) {
    const response = await fetch(`${API_URL}/user/builds`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(buildData)
    })
    if (!response.ok) throw new Error(await response.text())
    return response.json()
  }

  static async updateBuild(buildId, buildData) {
    const response = await fetch(`${API_URL}/user/builds/${buildId}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(buildData)
    })
    if (!response.ok) throw new Error(await response.text())
    return response.json()
  }

  static async deleteBuild(buildId) {
    const response = await fetch(`${API_URL}/user/builds/${buildId}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    })
    if (!response.ok) throw new Error(await response.text())
    return response.json()
  }

  static async getPublicBuilds() {
    const response = await fetch(`${API_URL}/builds`, {
      headers: this.getHeaders()
    })
    if (!response.ok) throw new Error(await response.text())
    return response.json()
  }

  static async getBuild(buildId) {
    const response = await fetch(`${API_URL}/builds/${buildId}`, {
      headers: this.getHeaders()
    })
    if (!response.ok) throw new Error(await response.text())
    return response.json()
  }

  static async uploadFile(file, description, buildId = null) {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('description', description)
    if (buildId) formData.append('buildId', buildId)

    const token = this.getToken()
    const response = await fetch(`${API_URL}/uploads`, {
      method: 'POST',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: formData
    })
    if (!response.ok) throw new Error(await response.text())
    return response.json()
  }
}

export default ApiService
