import { useState, useEffect } from 'react';

const API_URL = 'https://proyecto-final-api-nz5i.onrender.com';
import Pedido from './Pedido';


function App() {
  const [productos, setProductos] = useState([]);
  const [detalles, setDetalles] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/productos`).then((res) => res.json()),
      fetch(`${API_URL}/producto-detalle`).then((res) => res.json()),
    ])
      .then(([productosData, detallesData]) => {
        setProductos(productosData);
        setDetalles(detallesData);
        setCargando(false);
      })
      .catch((err) => {
        setError(err.message);
        setCargando(false);
      });
  }, []);

  if (cargando) return <p>Cargando productos...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>638 Store</h1>
      {productos.map((producto) => {
        const variantes = detalles.filter((d) => d.producto === producto.nombre);
        const talles = [...new Set(variantes.map((v) => v.talle))];
        const colores = [...new Set(variantes.map((v) => v.color))];

        return (
          <div key={producto.id} style={{ marginBottom: '1.5rem' }}>
            <h3>{producto.nombre} — ${producto.precio}</h3>
            <p>Categoría: {producto.categoria}</p>
            <p>Talles: {talles.join(', ')}</p>
            <p>Colores: {colores.join(', ')}</p>
          </div>
        );
      })}
      <Pedido productos={productos} detalles={detalles} />
    </div>
  );
}

export default App;