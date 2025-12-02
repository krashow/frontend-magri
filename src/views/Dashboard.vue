<template>
  <div class="dashboard">
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

    <main class="main-content">
      <header class="header">
        <div class="user-info">
          <i class="fas fa-user-circle"></i>
          <span>{{ userName }}</span>
        </div>
      </header>




      <section class="kpi-cards">
        <div class="card kpi action-required">
          <i class="fas fa-exclamation-triangle"></i>
          <h3>Pendientes de Atención</h3>
          <p class="kpi-value">**12**</p>
          <span class="kpi-detail">Incidencias sin asignar o abiertas.</span>
        </div>

        <div class="card kpi high-priority">
          <i class="fas fa-fire-alt"></i>
          <h3>Alta Prioridad</h3>
          <p class="kpi-value">**3**</p>
          <span class="kpi-detail">Requieren acción inmediata.</span>
        </div>

        <div class="card kpi avg-time">
          <i class="fas fa-hourglass-half"></i>
          <h3>T. Promedio Res.</h3>
          <p class="kpi-value">**4.2 h**</p>
          <span class="kpi-detail">Objetivo: Menos de 4h.</span>
        </div>

        <div class="card kpi closed-month">
          <i class="fas fa-check-double"></i>
          <h3>Cerradas (Mes)</h3>
          <p class="kpi-value">**25**</p>
          <span class="kpi-detail">Productividad total del mes.</span>
        </div>
      </section>

      <section class="dashboard-widgets">
        <div class="widget table-container half-width">
          <h3>Mis Asignaciones Pendientes</h3>
          <table class="quick-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Título</th>
                <th>Prioridad</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>1002</td><td>Error en módulo de Reportes</td><td><span class="priority-tag high">Alta</span></td><td>En Progreso</td></tr>
              <tr><td>0998</td><td>Problema con VPN de usuario</td><td><span class="priority-tag medium">Media</span></td><td>Abierta</td></tr>
              <tr><td>0980</td><td>Solicitud de nuevo hardware</td><td><span class="priority-tag low">Baja</span></td><td>Asignada</td></tr>
              </tbody>
          </table>
          <div class="widget-footer">
            <a href="#" @click.prevent="navigateTo('/incidencias')">Ver todas las asignaciones →</a>
          </div>
        </div>
        
        <div class="widget chart-container half-width">
          <h3>📈 Distribución por Categoría</h3>
          <div class="placeholder chart-placeholder">
            <p>(Ej: Software, Hardware, Redes)</p>
          </div>
          <div class="widget-footer">
            <a href="#" @click.prevent="navigateTo('/reportes')">Ver Detalle en Reportes →</a>
          </div>
        </div>
      </section>


      
    </main>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";
import "./Dashboard.css";

const router = useRouter();
const route = useRoute();
const currentRoute = route.path;

const userName = "Administrador";

const logout = () => {
  if (window.confirm("¿Seguro que deseas cerrar sesión?")) {
    localStorage.removeItem("token");
    router.push("/login");
  }
};

const navigateTo = (path) => {
  router.push(path);
};
</script>

<style scoped src="./Dashboard.css"></style>
