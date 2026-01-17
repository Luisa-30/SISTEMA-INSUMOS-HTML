import Navbar from "../components/navbar";
import SolicitudForm from "../components/solicitudform";

export default function Solicitudes() {
  return (
    <>
      <Navbar />
      <main className="container">
        <SolicitudForm />
      </main>
    </>
  );
}
