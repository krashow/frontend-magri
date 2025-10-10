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
            <section class="user-table-section">
        <h2>Lista de Usuarios</h2>
        <table class="user-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Usuario</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <!-- Ejemplo de filas (se pueden renderizar dinámicamente) -->
            <tr>
              <td>1</td>
              <td>Administrador</td>
              <td>admin</td>
              <td>admin@magriturismo.com</td>
              <td>ADMIN</td>
              <td>
                <button class="btn-edit"><i class="fas fa-edit"></i></button>
                <button class="btn-delete"><i class="fas fa-trash"></i></button>
              </td>
            </tr>
            <tr>
              <td>2</td>
              <td>Juan Pérez</td>
              <td>juanp</td>
              <td>juanp@example.com</td>
              <td>USUARIO</td>
              <td>
                <button class="btn-edit"><i class="fas fa-edit"></i></button>
                <button class="btn-delete"><i class="fas fa-trash"></i></button>
              </td>
            </tr>
          </tbody>
        </table>
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

<style scoped src="./Dashboard.css">
.user-table-section {
  background: #fff;
  margin: 20px auto;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 3px 10px rgba(0,0,0,0.1);
}

.user-table-section h2 {
  margin-bottom: 15px;
  color: #333;
  text-align: center;
  font-size: 1.5rem;
}

.user-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.user-table th, .user-table td {
  padding: 12px 15px;
  border-bottom: 1px solid #ddd;
}

.user-table th {
  background-color: #005f99;
  color: white;
}

.user-table tr:hover {
  background-color: #f4f4f4;
}

.btn-edit, .btn-delete {
  border: none;
  background: none;
  cursor: pointer;
  font-size: 1rem;
}

.btn-edit {
  color: #007bff;
}

.btn-delete {
  color: #dc3545;
}

.btn-edit:hover, .btn-delete:hover {
  opacity: 0.7;
}

</style>
