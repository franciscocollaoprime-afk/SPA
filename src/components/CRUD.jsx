import { supabase } from "./SupAgenda.jsx";

export async function obtenerContactos() {
    try {
    let { data, error } = await supabase
        .from('contacto')
        .select('id_contacto, nombre, apellido, dato_contacto (id_dato_contacto, tipo, correo, telefono, direccion)')
        .order('nombre', { ascending: true });
    if (error) throw error;
    setContactos(data);
    setErrorGlobal(''); 
    } catch (error) {
    setErrorGlobal('No se pudo conectar con la agenda.');
    } finally {
    setCargando(false);
    }
}

export async function agregarContacto(e) {
    e.preventDefault();
    setErrorContacto(''); 
    if (!nombre.trim() || !apellido.trim()) {
    setErrorContacto('Por favor, ingresa tanto el nombre como el apellido.');
    return;
    }
    try {
    const { error } = await supabase
        .from('contacto')
        .insert([{ nombre, apellido }]);
    if (error) throw error; 
    setNombre('');
    setApellido('');
    obtenerContactos();
    } catch (error) {
    setErrorContacto('Error de base de datos: ' + error.message);
    }
}

export async function eliminarContacto(id_contacto) {
    if (!window.confirm('¿Seguro que deseas eliminar este contacto y todos sus datos asociados?')) return;
    try {
    const { error } = await supabase
        .from('contacto')
        .delete()
        .eq('id_contacto', id_contacto);
    if (error) throw error;
    obtenerContactos();
    } catch (error) {
    alert('Error al eliminar contacto: ' + error.message);
    }
}

export async function agregarDatoContacto(e) {
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
    try {
    const { error } = await supabase
        .from('dato_contacto')
        .insert([
        {
            id_contacto: parseInt(idContactoSeleccionado),
            tipo,
            telefono: telefono.trim() || null,
            correo: correo.trim() || null,
            direccion: direccion.trim() || null
        }
        ]);
    if (error) throw error;
    setTelefono('');
    setCorreo('');
    setDireccion('');
    setErrorDato('');
    obtenerContactos();
    } catch (error) {
    setErrorDato('Error al agregar datos: ' + error.message);
    }
}

export async function eliminarDatoContacto(id_dato_contacto) {
    try {
    const { error } = await supabase
        .from('dato_contacto')
        .delete()
        .eq('id_dato_contacto', id_dato_contacto);
    if (error) throw error;
    obtenerContactos();
    } catch (error) {
    alert('Error al quitar datos: ' + error.message);
    }
}
