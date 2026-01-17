import { useState } from "react";

export default function SolicitudForm() {

  const [numSolicitud, setNumSolicitud] = useState("");
  const [prioridad, setPrioridad] = useState("false");
  const [destino, setDestino] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (destino.trim() === "") {
      alert("El destino o producto es obligatorio");
      return;
    }

    console.log({
      numSolicitud,
      prioridad,
      destino
    });

    alert("Solicitud enviada correctamente");
  };

  return (
    <section className="card">
      <h2>Realizar nueva solicitud</h2>

      <form onSubmit={handleSubmit}>

        <div className="form-row">
          <label>Número de solicitud</label>
          <input
            type="text"
            value={numSolicitud}
            onChange={(e) => setNumSolicitud(e.target.value)}
            readOnly
          />
        </div>

        <div className="form-row">
          <label>Prioridad</label>
          <select
            value={prioridad}
            onChange={(e) => setPrioridad(e.target.value)}
          >
            <option value="false">Normal</option>
            <option value="true">Urgente</option>
          </select>
        </div>

        <div className="form-row">
          <label>Destino / Producto</label>
          <input
            type="text"
            placeholder="Ej: Pastel de chocolate"
            value={destino}
            onChange={(e) => setDestino(e.target.value)}
          />
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
          <button type="submit" className="btn">
            Enviar solicitud
          </button>
        </div>

      </form>
    </section>
  );
}
