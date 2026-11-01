import React from 'react';
import { Link, Navigate, Route, Routes } from 'react-router-dom';
import { useSession } from './session';
import LoginScreen from './LoginScreen';
import UsersScreen from './UsersScreen';
import VistaDeDetalleDePlatillo from './pages/vista-de-detalle-de-platillo';
import FormularioDeReservaDeMesaOSilla from './pages/formulario-de-reserva-de-mesa-o-silla';
import VistaDeCodigoQrGenerado from './pages/vista-de-codigo-qr-generado';
import VistaDeCompraDePaquetesSemanales from './pages/vista-de-compra-de-paquetes-semanales';
import VistaDeSaldoDePuntos from './pages/vista-de-saldo-de-puntos';
import VistaDeGestionDePlatosAgotados from './pages/vista-de-gestion-de-platos-agotados';
import FormularioDeRegistroDePedidos from './pages/formulario-de-registro-de-pedidos';
import PantallaDeValidacionDeReserva from './pages/pantalla-de-validacion-de-reserva';
import FormularioDeProcesamientoDeCobro from './pages/formulario-de-procesamiento-de-cobro';
import VistaDeValidacionDePlanPrepagado from './pages/vista-de-validacion-de-plan-prepagado';
import VistaDeReportesDeVentas from './pages/vista-de-reportes-de-ventas';
import FormularioDeGestionDePreciosDelMenu from './pages/formulario-de-gestion-de-precios-del-menu';

const views = [{"route":"/GourmetFlow / Flujo de Cliente / Pantalla de Inicio y Menú Digital / Vista de Detalle de Platillo","name":"Vista de Detalle de Platillo","operations":["rf-01","rf-04","rf-05","rf-06","rf-07","rf-08","rf-10"]},{"route":"/GourmetFlow / Flujo de Cliente / Módulo de Reservas / Formulario de Reserva de Mesa o Silla","name":"Formulario de Reserva de Mesa o Silla","operations":["rf-02","rf-04","rf-07","rf-08"]},{"route":"/GourmetFlow / Flujo de Cliente / Módulo de Reservas / Vista de Código QR Generado","name":"Vista de Código QR Generado","operations":["rf-02","rf-04","rf-08"]},{"route":"/GourmetFlow / Flujo de Cliente / Módulo de Paquetes / Vista de Compra de Paquetes Semanales","name":"Vista de Compra de Paquetes Semanales","operations":["rf-03","rf-04","rf-08"]},{"route":"/GourmetFlow / Flujo de Cliente / Módulo de Fidelización / Vista de Saldo de Puntos","name":"Vista de Saldo de Puntos","operations":["rf-04","rf-08"]},{"route":"/GourmetFlow / Flujo de Personal de Cocina / Panel de Cocina en Tiempo Real / Vista de Gestión de Platos Agotados","name":"Vista de Gestión de Platos Agotados","operations":["rf-01","rf-05","rf-06"]},{"route":"/GourmetFlow / Flujo de Mesero / Panel de Mesas Asignadas / Formulario de Registro de Pedidos","name":"Formulario de Registro de Pedidos","operations":["rf-02","rf-05","rf-07","rf-08"]},{"route":"/GourmetFlow / Flujo de Mesero / Vista de Escaneo QR / Pantalla de Validación de Reserva","name":"Pantalla de Validación de Reserva","operations":["rf-02","rf-05","rf-07","rf-08","rf-09"]},{"route":"/GourmetFlow / Flujo de Caja / Panel de Cobros y Planes / Formulario de Procesamiento de Cobro","name":"Formulario de Procesamiento de Cobro","operations":["rf-09"]},{"route":"/GourmetFlow / Flujo de Caja / Panel de Cobros y Planes / Vista de Validación de Plan Prepagado","name":"Vista de Validación de Plan Prepagado","operations":["rf-03","rf-08","rf-09"]},{"route":"/GourmetFlow / Flujo de Administrador / Panel de Administración / Vista de Reportes de Ventas","name":"Vista de Reportes de Ventas","operations":["rf-10"]},{"route":"/GourmetFlow / Flujo de Administrador / Panel de Administración / Formulario de Gestión de Precios del Menú","name":"Formulario de Gestión de Precios del Menú","operations":["rf-01","rf-04","rf-08","rf-10"]}];

export default function App() {
  const { user, loading, can, logout } = useSession();
  if (loading) return <main className="screen"><p role="status">Cargando…</p></main>;
  if (!user) return <LoginScreen />;
  const visible = views.filter((view) => !view.operations.length || view.operations.some((operation) => can(operation, 'GET')));
  const home = visible[0]?.route || (user.administrador ? '/usuarios' : '/');
  return <>
    <nav className="nav">
      <strong>GourmetFlow</strong>
      {visible.map((view) => <Link key={view.route} to={view.route}>{view.name}</Link>)}
      {user.administrador && <Link to="/usuarios">Usuarios</Link>}
      <span>{user.nombre || user.email} · {user.nombre_rol}</span>
      <button className="button" onClick={logout}>Cerrar sesión</button>
    </nav>
    <Routes>
      <Route path="/GourmetFlow / Flujo de Cliente / Pantalla de Inicio y Menú Digital / Vista de Detalle de Platillo" element={<VistaDeDetalleDePlatillo/>}/>
      <Route path="/GourmetFlow / Flujo de Cliente / Módulo de Reservas / Formulario de Reserva de Mesa o Silla" element={<FormularioDeReservaDeMesaOSilla/>}/>
      <Route path="/GourmetFlow / Flujo de Cliente / Módulo de Reservas / Vista de Código QR Generado" element={<VistaDeCodigoQrGenerado/>}/>
      <Route path="/GourmetFlow / Flujo de Cliente / Módulo de Paquetes / Vista de Compra de Paquetes Semanales" element={<VistaDeCompraDePaquetesSemanales/>}/>
      <Route path="/GourmetFlow / Flujo de Cliente / Módulo de Fidelización / Vista de Saldo de Puntos" element={<VistaDeSaldoDePuntos/>}/>
      <Route path="/GourmetFlow / Flujo de Personal de Cocina / Panel de Cocina en Tiempo Real / Vista de Gestión de Platos Agotados" element={<VistaDeGestionDePlatosAgotados/>}/>
      <Route path="/GourmetFlow / Flujo de Mesero / Panel de Mesas Asignadas / Formulario de Registro de Pedidos" element={<FormularioDeRegistroDePedidos/>}/>
      <Route path="/GourmetFlow / Flujo de Mesero / Vista de Escaneo QR / Pantalla de Validación de Reserva" element={<PantallaDeValidacionDeReserva/>}/>
      <Route path="/GourmetFlow / Flujo de Caja / Panel de Cobros y Planes / Formulario de Procesamiento de Cobro" element={<FormularioDeProcesamientoDeCobro/>}/>
      <Route path="/GourmetFlow / Flujo de Caja / Panel de Cobros y Planes / Vista de Validación de Plan Prepagado" element={<VistaDeValidacionDePlanPrepagado/>}/>
      <Route path="/GourmetFlow / Flujo de Administrador / Panel de Administración / Vista de Reportes de Ventas" element={<VistaDeReportesDeVentas/>}/>
      <Route path="/GourmetFlow / Flujo de Administrador / Panel de Administración / Formulario de Gestión de Precios del Menú" element={<FormularioDeGestionDePreciosDelMenu/>}/>
      {user.administrador && <Route path="/usuarios" element={<UsersScreen />} />}
      <Route path="*" element={<Navigate to={home} replace />} />
    </Routes>
  </>;
}
