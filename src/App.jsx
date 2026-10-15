import { useEffect, useState } from 'react';
import { Amplify } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { awsConfig } from './config';
import { obtenerCatalogo, crearVideojuego, actualizarVideojuego, eliminarVideojuego } from './api';

Amplify.configure(awsConfig);

const FORM_VACIO = {
  titulo: '', genero: '', desarrollador: '', precio: '', descuento: '',
  stock: '', imagenUrl: '', descripcion: '',
};

// Convierte el formulario (strings) al formato que espera el backend
function aVideojuego(form) {
  return {
    titulo: form.titulo.trim(),
    genero: form.genero.trim(),
    desarrollador: form.desarrollador.trim(),
    precio: parseFloat(form.precio) || 0,
    descuento: parseFloat(form.descuento) || 0,
    stock: parseInt(form.stock, 10) || 0,
    imagenUrl: form.imagenUrl.trim(),
    descripcion: form.descripcion.trim(),
  };
}

function App({ signOut, user }) {
  const [juegos, setJuegos] = useState([]);
  const [form, setForm] = useState(FORM_VACIO);
  const [editandoId, setEditandoId] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(true);

  const cargar = async () => {
    setCargando(true);
    try {
      setJuegos(await obtenerCatalogo());
      setError('');
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  const cambiar = (campo) => (e) => setForm({ ...form, [campo]: e.target.value });

  const guardar = async (e) => {
    e.preventDefault();
    if (!form.titulo.trim() || !form.precio) {
      setError('Titulo y precio son obligatorios');
      return;
    }
    try {
      if (editandoId) {
        await actualizarVideojuego(editandoId, aVideojuego(form));
        setMensaje(`Juego #${editandoId} actualizado`);
      } else {
        const nuevo = await crearVideojuego(aVideojuego(form));
        setMensaje(`Juego "${nuevo.titulo}" creado con id ${nuevo.id}`);
      }
      setForm(FORM_VACIO);
      setEditandoId(null);
      setError('');
      await cargar();
    } catch (e) {
      setError(e.message);
    }
  };

  const editar = (juego) => {
    setEditandoId(juego.id);
    setForm({
      titulo: juego.titulo ?? '', genero: juego.genero ?? '', desarrollador: juego.desarrollador ?? '',
      precio: juego.precio ?? '', descuento: juego.descuento ?? '', stock: juego.stock ?? '',
      imagenUrl: juego.imagenUrl ?? '', descripcion: juego.descripcion ?? '',
    });
    setMensaje('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setForm(FORM_VACIO);
  };

  const eliminar = async (juego) => {
    if (!window.confirm(`¿Eliminar "${juego.titulo}"?`)) return;
    try {
      await eliminarVideojuego(juego.id);
      setMensaje(`Juego "${juego.titulo}" eliminado`);
      setError('');
      await cargar();
    } catch (e) {
      setError(e.message);
    }
  };

  const correo = user?.signInDetails?.loginId ?? user?.username;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>🛠️ Panel de Administración</h1>
        <div style={styles.usuario}>
          <span>{correo}</span>
          <button onClick={signOut} style={styles.logoutBtn}>Cerrar Sesión</button>
        </div>
      </header>

      <main style={styles.main}>
        {mensaje && <p style={styles.ok}>{mensaje}</p>}
        {error && <p style={styles.error}>{error}</p>}

        <section style={styles.card}>
          <h3 style={{ margin: '0 0 15px 0' }}>
            {editandoId ? `Editando juego #${editandoId}` : 'Agregar Nuevo Juego'}
          </h3>
          <form onSubmit={guardar} style={styles.form}>
            <input placeholder="Título *" value={form.titulo} onChange={cambiar('titulo')} style={styles.input} />
            <input placeholder="Género" value={form.genero} onChange={cambiar('genero')} style={styles.input} />
            <input placeholder="Desarrollador" value={form.desarrollador} onChange={cambiar('desarrollador')} style={styles.input} />
            <input type="number" step="0.01" placeholder="Precio *" value={form.precio} onChange={cambiar('precio')} style={styles.input} />
            <input type="number" step="1" placeholder="Descuento (%)" value={form.descuento} onChange={cambiar('descuento')} style={styles.input} />
            <input type="number" step="1" placeholder="Stock" value={form.stock} onChange={cambiar('stock')} style={styles.input} />
            <input placeholder="URL de la portada" value={form.imagenUrl} onChange={cambiar('imagenUrl')} style={{ ...styles.input, gridColumn: 'span 2' }} />
            <textarea placeholder="Descripción" value={form.descripcion} onChange={cambiar('descripcion')} rows={3} style={{ ...styles.input, gridColumn: 'span 2' }} />
            <button type="submit" style={styles.addBtn}>{editandoId ? 'Guardar Cambios' : 'Guardar Producto'}</button>
            {editandoId && (
              <button type="button" onClick={cancelarEdicion} style={styles.cancelBtn}>Cancelar edición</button>
            )}
          </form>
        </section>

        <section style={styles.card}>
          <h3 style={{ margin: '0 0 15px 0' }}>Inventario Actual ({juegos.length})</h3>
          {cargando ? (
            <p>Cargando inventario…</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.thRow}>
                    <th style={styles.td}>ID</th>
                    <th style={styles.td}>Título</th>
                    <th style={styles.td}>Género</th>
                    <th style={styles.td}>Precio</th>
                    <th style={styles.td}>Desc.</th>
                    <th style={styles.td}>Stock</th>
                    <th style={styles.td}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {juegos.map((j) => (
                    <tr key={j.id} style={styles.tr}>
                      <td style={styles.td}>{j.id}</td>
                      <td style={styles.td}><strong>{j.titulo}</strong></td>
                      <td style={styles.td}>{j.genero}</td>
                      <td style={styles.td}>${j.precio}</td>
                      <td style={styles.td}>{j.descuento ? `${j.descuento}%` : '-'}</td>
                      <td style={styles.td}>{j.stock} u.</td>
                      <td style={styles.td}>
                        <button onClick={() => editar(j)} style={styles.editBtn}>Editar</button>
                        <button onClick={() => eliminar(j)} style={styles.deleteBtn}>Eliminar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

const styles = {
  container: { padding: '20px', maxWidth: '1100px', margin: '0 auto', color: '#fff' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #333', paddingBottom: '15px', gap: 12, flexWrap: 'wrap' },
  title: { margin: 0, fontSize: '1.8rem', color: '#fff' },
  usuario: { display: 'flex', alignItems: 'center', gap: 12 },
  logoutBtn: { padding: '8px 16px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' },
  main: { marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '20px' },
  ok: { margin: 0, padding: '10px', borderRadius: 6, backgroundColor: '#1e4620', color: '#b7f5b9' },
  error: { margin: 0, padding: '10px', borderRadius: 6, backgroundColor: '#4a1c1c', color: '#ffb4b4' },
  card: { border: '1px solid #333', borderRadius: '8px', padding: '20px', backgroundColor: '#1a1a1a' },
  form: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' },
  input: { padding: '10px', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#222', color: '#fff', fontFamily: 'inherit' },
  addBtn: { gridColumn: 'span 2', padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
  cancelBtn: { gridColumn: 'span 2', padding: '10px', backgroundColor: '#555', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '10px' },
  thRow: { borderBottom: '2px solid #444', textAlign: 'left' },
  tr: { borderBottom: '1px solid #333' },
  td: { padding: '12px 8px' },
  editBtn: { padding: '5px 10px', backgroundColor: '#1f6feb', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: 6 },
  deleteBtn: { padding: '5px 10px', backgroundColor: '#e63946', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
};

// hideSignUp: el personal NO se registra solo; las cuentas se crean en la consola de Cognito
export default withAuthenticator(App, { hideSignUp: true });