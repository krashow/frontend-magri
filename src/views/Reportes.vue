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
        <h2>Reportes y Analíticas de Incidencias</h2>
        
        <div class="report-controls">
            <div class="report-filters">
              <label for="filter-estado">Estado:</label>
              <select id="filter-estado" v-model="filtro.estado">
                <option value="todas">Todas las Incidencias</option>
                <option value="Abierta">Abiertas</option>
                <option value="En Proceso">En Proceso</option>
                <option value="Cerrada">Cerradas</option>
              </select>
              
              <label for="filter-mes">Mes:</label>
              <input type="month" id="filter-mes" v-model="filtro.mes" />
              
              <button @click="aplicarFiltros" class="btn-filter primary-action">
                <i class="fas fa-filter"></i> Aplicar Filtros
              </button>
            </div>
            
            <div class="stats-summary">
                <div class="stat-card">
                    <h4>Total Incidencias</h4>
                    <p class="stat-number">{{ stats.total }}</p>
                </div>
                <div class="stat-card stat-open">
                    <h4>Pendientes</h4>
                    <p class="stat-number">{{ stats.pendientes }}</p>
                </div>
                <div class="stat-card stat-closed">
                    <h4>Cerradas</h4>
                    <p class="stat-number">{{ stats.cerradas }}</p>
                </div>
            </div>
        </div>
        
        <hr />
        
        <div class="charts-container">
          <div class="chart-card">
            <h3>Estado Actual</h3>
            <div class="chart-placeholder chart-bar">[ Gráfico de barras aquí ]</div>
          </div>

          <div class="chart-card">
            <h3>Distribución por Categoría</h3>
            <div class="chart-placeholder chart-pie">[ Gráfico circular aquí ]</div>
          </div>

          <div class="chart-card chart-full-width">
            <h3>Evolución y Tasa de Resolución</h3>
            <div class="chart-placeholder chart-line">[ Gráfico de línea (Mensual) aquí ]</div>
          </div>
        </div>
        
        <hr />

        <div class="report-actions">
          <h3> Generación y Exportación de Reportes</h3>

          <div class="actions-grid">
            <button @click="generarReporte('General')" class="btn-action primary-action">
              <i class="fas fa-file-alt"></i> Generar Reporte General
            </button>

            <button @click="generarReporte('Tecnico')" class="btn-action">
              <i class="fas fa-users-cog"></i> Reporte por Técnico
            </button>
            
            <button @click="generarReporte('Categoria')" class="btn-action">
              <i class="fas fa-chart-pie"></i> Reporte por Categoría
            </button>
            
            <button @click="exportarReporte('PDF')" class="btn-action export-pdf">
              <i class="fas fa-download"></i> Exportar a PDF
            </button>

            <button @click="exportarReporte('Excel')" class="btn-action export-excel">
              <i class="fas fa-file-excel"></i> Exportar a Excel
            </button>
          </div>

          <div class="report-log">
            <h4>Historial de reportes generados recientemente</h4>
            <ul>
              <li v-for="log in historialReportes" :key="log.fecha">
                <i :class="log.icon"></i> {{ log.descripcion }} - **{{ log.estado }}**
              </li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'; 
import { useRouter, useRoute } from "vue-router";
import "./Dashboard.css";

const router = useRouter();
const route = useRoute();
const currentRoute = route.path;

const userName = "Administrador";

const filtro = ref({
    estado: 'todas',
    mes: new Date().toISOString().substring(0, 7) 
});

const stats = ref({
    total: 25,
    pendientes: 22,
    cerradas: 3,
});

const historialReportes = ref([
    { fecha: '2025-09-01', descripcion: 'Reporte mensual Septiembre 2025', estado: 'Nulo', icon: 'fas fa-check-circle' },
    { fecha: '2025-08-15', descripcion: 'Reporte por soporte Kevin Agrada', estado: 'En proceso', icon: 'fas fa-spinner fa-spin' },
    { fecha: '2025-07-20', descripcion: 'Reporte general Julio 2025', estado: 'Nulo', icon: 'fas fa-check-circle' },
]);
const aplicarFiltros = () => {
    alert(`Aplicando filtro:\nEstado: ${filtro.value.estado}\nMes: ${filtro.value.mes}`);
    
    stats.value.total = 150;
    stats.value.pendientes = 70;
    stats.value.cerradas = 80;
};

const generarReporte = (tipo) => {
    alert(`Solicitando generar reporte: ${tipo}. Se añadirá al historial.`);
    
    const newLog = { 
        fecha: new Date().toISOString(), 
        descripcion: `Generación: ${tipo} (${filtro.value.mes})`, 
        estado: 'En proceso', 
        icon: 'fas fa-spinner fa-spin' 
    };
    historialReportes.value.unshift(newLog); 
    setTimeout(() => {
        const index = historialReportes.value.findIndex(log => log.fecha === newLog.fecha);
        if (index !== -1) {
            historialReportes.value[index].estado = 'Listo';
            historialReportes.value[index].icon = 'fas fa-check-circle';
            alert(`Reporte de ${tipo} ya está listo.`);
        }
    }, 2000); 
};

const exportarReporte = (formato) => {
    alert(`Exportando el reporte filtrado a formato: ${formato}.`);
};

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