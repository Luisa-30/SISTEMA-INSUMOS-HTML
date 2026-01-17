export default function Navbar() {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <div className="brand-left">
          <div className="logo-small">
            <img src="/images/logo/nutrive.png" alt="Nutrive" />
          </div>
        </div>

        <nav className="menu">
          <a href="#">Inicio</a>
          <a href="#">Catálogo</a>
          <a href="#">Solicitudes</a>
          <a href="#">Inventario</a>
          <a href="#">Reportes</a>
          <a href="#">Buscar</a>
        </nav>

        <div className="user-box">
          <div className="user-info-box">
            <div><strong>ID:</strong> -</div>
            <div><strong>Nombre:</strong> -</div>
            <div><strong>Sección:</strong> -</div>
          </div>
          <button className="btn ghost">Cerrar sesión</button>
        </div>
      </div>
    </header>
  );
}
