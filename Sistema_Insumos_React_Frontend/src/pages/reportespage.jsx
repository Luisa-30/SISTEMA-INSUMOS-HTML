import Navbar from "../components/navbar";

export default function ReportesPage() {
  return (
    <>
      <Navbar />
      <main className="container">
        <section className="card">
          <h2>Reportes</h2>
          <p className="small">Selecciona un rango de fechas para generar el reporte.</p>

          <div className="form-row">
            <label>Fecha inicio</label>
            <input type="date" />
          </div>

          <div className="form-row">
            <label>Fecha fin</label>
            <input type="date" />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button className="btn">Generar Reporte</button>
          </div>
        </section>
      </main>
    </>
  );
}
