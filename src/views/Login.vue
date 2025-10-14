<template>
  <div class="login-container">
    <div class="form-box">
      <div class="form-header">
        <img src="/logo.png" alt="Logo Empresa" class="logo" />
        <h1 class="title">Bienvenido</h1>
        <p class="subtitle">
          Accede a tu cuenta para continuar con el sistema.
        </p>
      </div>
      <h2 class="form-title">Iniciar Sesión</h2>
      <form @submit.prevent="login">
        <div class="form-group">
          <label>Correo</label>
          <input v-model="email" type="email" placeholder="ejemplo@correo.com" required />
        </div>
        <div class="form-group">
          <label>Contraseña</label>
          <input v-model="password" type="password" placeholder="********" required />
        </div>
        <div class="remember">
          <input type="checkbox" id="remember" />
          <label for="remember">Recordarme</label>
        </div>
        <button type="submit" class="btn-login">
          Ingresar
        </button>
      </form>
      <div class="extra-links">
        <a href="#">¿Olvidaste tu contraseña?</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
import axios from "axios"
import "./Login.css"

const router = useRouter()
const email = ref("")
const password = ref("")

const login = async () => {
  try {
    const response = await axios.post("http://localhost:8081/api/auth/login", {
      email: email.value,
      password: password.value
    })
    if (response.data.success) {
      router.push("/dashboard")
    } else {
      alert(response.data.message)
    }
  } catch (error) {
    alert("Error al conectar con el servidor")
    console.error(error)
  }
}
</script>
