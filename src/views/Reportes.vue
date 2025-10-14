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
      <section class="reports-section">
        <h2>Reportes y Seguimiento de Incidencias</h2>

        <div class="report-filters">
          <label for="filter">Filtrar por:</label>
          <select id="filter">
            <option value="todas">Todas las incidencias</option>
            <option value="abiertas">Abiertas</option>
            <option value="cerradas">Cerradas</option>
            <option value="pendientes">Pendientes</option>
          </select>
          <button class="btn-filter">
            <i class="fas fa-filter"></i> Aplicar
          </button>
        </div>
        <div class="charts-container">
          <div class="chart-card">
            <h3>Incidencias por Estado</h3>
            <div class="chart-placeholder">[ Gráfico de barras aquí ]</div>
          </div>

          <div class="chart-card">
            <h3>Incidencias por Categoría</h3>
            <div class="chart-placeholder">[ Gráfico circular aquí ]</div>
          </div>

          <div class="chart-card">
            <h3>Evolución de Incidencias</h3>
            <div class="chart-placeholder">[ Gráfico de línea aquí ]</div>
          </div>
        </div>
        <div class="report-actions">
          <h3>Acciones y Generación de Reportes</h3>

          <div class="actions-grid">
            <button class="btn-action">
              <i class="fas fa-file-alt"></i> Generar Reporte General
            </button>

            <button class="btn-action">
              <i class="fas fa-calendar-alt"></i> Listar Incidencias por Mes
            </button>

            <button class="btn-action">
              <i class="fas fa-chart-pie"></i> Reporte por Categoría
            </button>

            <button class="btn-action">
              <i class="fas fa-users-cog"></i> Reporte por Técnico
            </button>

            <button class="btn-action">
              <i class="fas fa-download"></i> Exportar a PDF
            </button>

            <button class="btn-action">
              <i class="fas fa-file-excel"></i> Exportar a Excel
            </button>
          </div>

          <div class="report-log">
            <h4>Historial de reportes generados</h4>
            <ul>
              <li>
                <i class="fas fa-check-circle"></i> Reporte mensual - Septiembre
                2025
              </li>
              <li>
                <i class="fas fa-check-circle"></i> Reporte general - Agosto
                2025
              </li>
              <li>
                <i class="fas fa-check-circle"></i> Reporte por categoría -
                Julio 2025
              </li>
            </ul>
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
