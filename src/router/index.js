import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import RegistrarIncidencia from '../views/RegistrarIncidencia.vue'
import Incidencias from '../views/Incidencias.vue'
import Notificaciones from '../views/Notificaciones.vue'
import Usuarios from '../views/Usuarios.vue'
import Reportes from '../views/Reportes.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/dashboard', component: Dashboard },
  { path: '/registrar-incidencia',component: RegistrarIncidencia},
  { path: '/incidencias',component: Incidencias},
  { path: '/notificaciones', component: Notificaciones},
  { path: '/usuarios', component: Usuarios},
  {path: '/reportes', component: Reportes}
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
