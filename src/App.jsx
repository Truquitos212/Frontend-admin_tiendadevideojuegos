import { useState } from 'react';

const MOCK_INVENTARIO = [
  { id: 1, titulo: 'Elden Ring', precio: 59.99, categoria: 'RPG', stock: 15 },
  { id: 2, titulo: 'Cyberpunk 2077', precio: 49.99, categoria: 'Acción', stock: 8 },
  { id: 3, titulo: 'Zelda: TOTK', precio: 69.99, categoria: 'Aventura', stock: 20 },
  { id: 4, titulo: 'God of War', precio: 59.99, categoria: 'Acción', stock: 5 }
];

export default function App() {
  const [juegos, setJuegos] = useState(MOCK_INVENTARIO);
  const [nuevoJuego, setNuevoJuego] = useState({ titulo: '', precio: '', categoria: '', stock: '' });

  const handleAgregar = (e) => {
    e.preventDefault();
    if (!nuevoJuego.titulo || !nuevoJuego.precio) return;
    
    const juegoCreado = {
      id: Date.now(),
      titulo: nuevoJuego.titulo,
      precio: parseFloat(nuevoJuego.precio),
      categoria: nuevoJuego.categoria || 'General',
      stock: parseInt(nuevoJuego.stock) || 1
    };

    setJuegos([...juegos, juegoCreado]);
    setNuevoJuego({ titulo: '', precio: '', categoria: '', stock: '' });
  };

  const handleEliminar = (id) => {
    setJuegos(juegos.filter(juego => juego.id !== id));
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>🛠️ Panel de Administración</h1>
        <button style={styles.logoutBtn}>Cerrar Sesión</button>
      </header>

      <main style={styles.main}>
        <section style={styles.card}>
          <h3 style={{ margin: '0 0 15px 0' }}>Agregar Nuevo Juego</h3>
          <form onSubmit={handleAgregar} style={styles.form}>
            <input 
              type="text" 
              placeholder="Título" 
              value={nuevoJuego.titulo} 
              onChange={(e) => setNuevoJuego({...nuevoJuego, titulo: e.target.value})}
              style={styles.input}
            />
            <input 
              type="number" 
              placeholder="Precio ($)" 
              value={nuevoJuego.precio} 
              onChange={(e) => setNuevoJuego({...nuevoJuego, precio: e.target.value})}
              style={styles.input}
            />
            <input 
              type="text" 
              placeholder="Categoría" 
              value={nuevoJuego.categoria} 
              onChange={(e) => setNuevoJuego({...nuevoJuego, categoria: e.target.value})}
              style={styles.input}
            />
            <input 
              type="number" 
              placeholder="Stock" 
              value={nuevoJuego.stock} 
              onChange={(e) => setNuevoJuego({...nuevoJuego, stock: e.target.value})}
              style={styles.input}
            />
            <button type="submit" style={styles.addBtn}>Guardar Producto</button>
          </form>
        </section>

        <section style={styles.card}>
          <h3 style={{ margin: '0 0 15px 0' }}>Inventario Actual</h3>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thRow}>
                <th style={styles.td}>ID</th>
                <th style={styles.td}>Título</th>
                <th style={styles.td}>Categoría</th>
                <th style={styles.td}>Precio</th>
                <th style={styles.td}>Stock</th>
                <th style={styles.td}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {juegos.map((j) => (
                <tr key={j.id} style={styles.tr}>
                  <td style={styles.td}>{j.id}</td>
                  <td style={styles.td}><strong>{j.titulo}</strong></td>
                  <td style={styles.td}>{j.categoria}</td>
                  <td style={styles.td}>${j.precio}</td>
                  <td style={styles.td}>{j.stock} u.</td>
                  <td style={styles.td}>
                    <button onClick={() => handleEliminar(j.id)} style={styles.deleteBtn}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}

const styles = {
  container: { padding: '20px', maxWidth: '1000px', margin: '0 auto', color: '#fff' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #333', paddingBottom: '15px' },
  title: { margin: 0, fontSize: '1.8rem', color: '#fff' },
  logoutBtn: { padding: '8px 16px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' },
  main: { marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '20px' },
  card: { border: '1px solid #333', borderRadius: '8px', padding: '20px', backgroundColor: '#1a1a1a' },
  form: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' },
  input: { padding: '10px', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#222', color: '#fff' },
  addBtn: { gridColumn: 'span 2', padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '10px' },
  thRow: { borderBottom: '2px solid #444', textAlign: 'left' },
  tr: { borderBottom: '1px solid #333' },
  td: { padding: '12px 8px' },
  deleteBtn: { padding: '5px 10px', backgroundColor: '#e63946', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }
};