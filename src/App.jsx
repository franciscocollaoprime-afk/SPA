import { useEffect, useState } from 'react';
import './App.css';
import { dbObtenerContactos, dbAgregarContacto, dbEliminarContacto, dbAgregarDatoContacto, dbEliminarDatoContacto } from './components/CRUD.jsx';

function App() {
  const [contactos, setContactos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');
  const [direccion, setDireccion] = useState('');
  const [idContactoSeleccionado, setIdContactoSeleccionado] = useState('');
  const [tipo, setTipo] = useState('Personal');
  const [errorContacto, setErrorContacto] = useState('');
  const [errorDato, setErrorDato] = useState('');
  const [errorGlobal, setErrorGlobal] = useState('');

  useEffect(() => {
    cargarAgenda();
  }, []);

  // Función auxiliar para refrescar la lista
  async function cargarAgenda() {
    const { data, error } = await dbObtenerContactos();
    if (error) {
      setErrorGlobal('No se pudo conectar con la agenda.');
    } else {
      setContactos(data);
      setErrorGlobal('');
    }
    setCargando(false);
  }

  async function handleAgregarContacto(e) {
    e.preventDefault();
    setErrorContacto(''); 

    if (!nombre.trim() || !apellido.trim()) {
      setErrorContacto('Por favor, ingresa tanto el nombre como el apellido.');
      return;
    }

    // Llamada al CRUD
    const { error } = await dbAgregarContacto(nombre.trim(), apellido.trim());
    
    if (error) {
      setErrorContacto('Error de base de datos: ' + error.message);
    } else {
      setNombre('');
      setApellido('');
      cargarAgenda(); // Recarga la lista
    }
  }

  async function handleEliminarContacto(id_contacto) {
    if (!window.confirm('¿Seguro que deseas eliminar este contacto y todos sus datos asociados?')) return;
    
    const { error } = await dbEliminarContacto(id_contacto);
    if (error) {
      alert('Error al eliminar contacto: ' + error.message);
    } else {
      cargarAgenda();
    }
  }

  async function handleAgregarDatoContacto(e) {
    e.preventDefault();
    setErrorDato('');

    if (!idContactoSeleccionado || isNaN(parseInt(idContactoSeleccionado))) {
      setErrorDato('Debes seleccionar un contacto válido de la lista.');
      return;
    }
    if (!telefono.trim() && !correo.trim() && !direccion.trim()) {
      setErrorDato('Debes rellenar al menos un campo (Teléfono, Correo o Dirección).');
      return;
    }

    // Llamada al CRUD enviando los strings limpios
    const { error } = await dbAgregarDatoContacto(
      idContactoSeleccionado,
      tipo,
      telefono.trim(),
      correo.trim(),
      direccion.trim()
    );

    if (error) {
      setErrorDato('Error al agregar datos: ' + error.message);
    } else {
      setTelefono('');
      setCorreo('');
      setDireccion('');
      setIdContactoSeleccionado('');
      setTipo('Personal');
      cargarAgenda();
    }
  }

  async function handleEliminarDatoContacto(id_dato_contacto) {
    const { error } = await dbEliminarDatoContacto(id_dato_contacto);
    if (error) {
      alert('Error al quitar datos: ' + error.message);
    } else {
      cargarAgenda();
    }
  }

  if (cargando) return <p className="loading-text">Cargando agenda...</p>;

  return (
    <div className="app-container">
      <h1>Agenda de Contactos</h1>
      {errorGlobal && <div className="error-global">💥 {errorGlobal}</div>}
      <div className="forms-grid">
        <form onSubmit={handleAgregarContacto} className="form-card">
          <h3>Nuevo Contacto</h3>
          <input type="text" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} className="input-field"/>
          <input type="text" placeholder="Apellido" value={apellido} onChange={(e) => setApellido(e.target.value)} className="input-field"/>
          {errorContacto && <div className="error-box">⚠️ {errorContacto}</div>}
          <button type="submit" className="btn btn-primary">Guardar Contacto</button>
        </form>
        <form onSubmit={handleAgregarDatoContacto} className="form-card">
          <h3>Agregar datos</h3>
          <select value={idContactoSeleccionado} onChange={(e) => setIdContactoSeleccionado(e.target.value)} className="input-field">
            <option value=""> Selecciona un Contacto </option>
            {contactos.map(c => (
              <option key={c.id_contacto} value={c.id_contacto}>{c.nombre} {c.apellido}</option>
            ))}
          </select>
          <select value={tipo} onChange={(e) => setTipo(e.target.value)} className="input-field">
            <option value="Personal">Personal</option>
            <option value="Trabajo">Trabajo</option>
            <option value="Casa">Casa</option>
          </select>
          <input type="text" placeholder="Teléfono" value={telefono} onChange={(e) => setTelefono(e.target.value)} className="input-field" />
          <input type="email" placeholder="Correo" value={correo} onChange={(e) => setCorreo(e.target.value)} className="input-field"/>
          <input type="text" placeholder="Dirección" value={direccion} onChange={(e) => setDireccion(e.target.value)} className="input-field"/>
          {errorDato && <div className="error-box">⚠️ {errorDato}</div>}
          <button type="submit" className="btn btn-success">Asignar Datos</button>
        </form>
      </div>
      <hr />
      <h2>Contactos Guardados</h2>
      {contactos.length === 0 ? (
        <p>No hay contactos en la agenda.</p>
      ) : (
        <div className="contacts-grid">
          {contactos.map((contacto) => (
            <div key={contacto.id_contacto} className="contact-card">
              <div className="contact-card-header">
                <h3 className="contact-card-title">{contacto.nombre} {contacto.apellido}</h3>
                <button onClick={() => handleEliminarContacto(contacto.id_contacto)} className="btn-danger">Eliminar</button>
              </div>
              <h4 className="subtitle-datos">Sets de datos:</h4>
              {contacto.dato_contacto && contacto.dato_contacto.length > 0 ? (
                <ul className="lista-datos">
                  {contacto.dato_contacto.map((dato) => (
                    <li key={dato.id_dato_contacto} className="item-dato">
                      <strong>{dato.tipo}:</strong>
                      <div className="detalle-dato">
                        {dato.telefono && <div>📞 {dato.telefono}</div>}
                        {dato.correo && <div>✉️ {dato.correo}</div>}
                        {dato.direccion && <div>📍 {dato.direccion}</div>}
                      </div>
                      <button onClick={() => handleEliminarDatoContacto(dato.id_dato_contacto)} className="btn-link-danger"> (Quitar este set)</button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="no-data-text">Sin información registrada.</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;