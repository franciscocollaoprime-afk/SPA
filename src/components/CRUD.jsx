import { supabase } from './SupAgenda.jsx'; 

export async function dbObtenerContactos() {
    try {
        const { data, error } = await supabase
        .from('contacto')
        .select(`
        id_contacto, 
        nombre, 
        apellido, 
        dato_contacto (
            id_dato_contacto, 
            tipo, 
            correo, 
            telefono, 
            direccion
        )`)
        .order('nombre', { ascending: true });
    return { data, error };
    } catch (error) {
    return { data: null, error };
    }
}

export async function dbAgregarContacto(nombre, apellido) {
    try {
        const { data, error } = await supabase
        .from('contacto')
        .insert([{ nombre, apellido }]);
        return { data, error };
    } catch (error) {
        return { data: null, error };
    }
}

export async function dbEliminarContacto(id_contacto) {
    try {
        const { data, error } = await supabase
        .from('contacto')
        .delete()
        .eq('id_contacto', id_contacto);
        return { data, error };
    } catch (error) {
        return { data: null, error };
    }
}

export async function dbAgregarDatoContacto(id_contacto, tipo, telefono, correo, direccion) {
    try {
        const { data, error } = await supabase
        .from('dato_contacto')
        .insert([
            {
            id_contacto: parseInt(id_contacto),
            tipo,
            telefono: telefono || null,
            correo: correo || null,
            direccion: direccion || null
            }
        ]);
        return { data, error };
    } catch (error) {
        return { data: null, error };
    }
}

export async function dbEliminarDatoContacto(id_dato_contacto) {
    try {
        const { data, error } = await supabase
        .from('dato_contacto')
        .delete()
        .eq('id_dato_contacto', id_dato_contacto);
        return { data, error };
    } catch (error) {
    return { data: null, error };
    }
}