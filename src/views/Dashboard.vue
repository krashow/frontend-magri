<template>
  <div class="dashboard">
    <!-- Barra lateral -->
    <aside class="sidebar">
      <div class="sidebar-logo">
        <img src="/logo.png" alt="Logo" />
      </div>
      <nav class="menu">
        <ul>
          <li 
            :class="{ active: currentRoute === '/dashboard' }"
            @click="navigateTo('/dashboard')"
          >
            <i class="fas fa-tachometer-alt"></i>
            <span>Inicio</span>
          </li>
          <li 
            :class="{ active: currentRoute === '/registrar-incidencia' }"
            @click="navigateTo('/registrar-incidencia')"
          >
            <i class="fas fa-plus-circle"></i>
            <span>Registrar Incidencia</span>
          </li>
          <li 
            :class="{ active: currentRoute === '/incidencias' }"
            @click="navigateTo('/incidencias')"
          >
            <i class="fas fa-exclamation-triangle"></i>
            <span>Incidencias</span>
          </li>
          <li 
            :class="{ active: currentRoute === '/usuarios' }"
            @click="navigateTo('/usuarios')"
          >
            <i class="fas fa-users"></i>
            <span>Usuarios</span>
          </li>
          <li 
            :class="{ active: currentRoute === '/notificaciones' }"
            @click="navigateTo('/notificaciones')"
          >
            <i class="fas fa-bell"></i>
            <span>Asignaciones</span>
          </li>
          <li 
            :class="{ active: currentRoute === '/reportes' }"
            @click="navigateTo('/reportes')"
          >
            <i class="fas fa-chart-bar"></i>
            <span>Reportes</span>
          </li>
        </ul>
      </nav>

      <div class="sidebar-bottom">
        <button class="icon-btn"><i class="fas fa-cog"></i></button>
        <button @click="logout" class="icon-btn logout">
          <i class="fas fa-sign-out-alt"></i>
        </button>
      </div>
    </aside>

    <!-- Contenido principal -->
    <main class="main-content">
      <header class="header">
        <!-- Usuario arriba a la derecha -->
        <div class="user-info">
          <i class="fas fa-user-circle"></i>
          <span>{{ userName }}</span>
        </div>
      </header>

      <section class="stats">
        <div class="card">
          <h3>Incidencias Abiertas</h3>
          <p>12</p>
        </div>
        <div class="card">
          <h3>En Progreso</h3>
          <p>8</p>
        </div>
        <div class="card">
          <h3>Cerradas</h3>
          <p>25</p>
        </div>
        <div class="card">
          <h3>Usuarios Activos</h3>
          <p>5</p>
        </div>
      </section>

      <section class="summary">
        <h3>Resumen</h3>
        <p>
          Desde este panel podrás gestionar las incidencias, asignarlas al personal adecuado, 
          generar reportes y administrar usuarios.
        </p>
      </section>
    </main>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router"
import "./Dashboard.css"

const router = useRouter()
const route = useRoute()
const currentRoute = route.path

const userName = "Administrador"

const logout = () => {
  if (window.confirm("¿Seguro que deseas cerrar sesión?")) {
    localStorage.removeItem("token")
    router.push("/login")
  }
}

const navigateTo = (path) => {
  router.push(path)
}
</script>

<style scoped src="./Dashboard.css"></style>
