import { useState } from 'react';


function Pedido({ productos, detalles }) {
  const [productoId, setProductoId] = useState('');
  const [talle, setTalle] = useState('');
  const [color, setColor] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [nombre, setNombre] = useState('');
  const [contacto, setContacto] = useState('');
  const [comentarios, setComentarios] = useState('');

  const enviarCotizacion = () => {
  console.log({ productoSeleccionado, talle, color, cantidad, nombre, contacto, comentarios });
  alert('Cotización enviada (por ahora solo se ve en la consola)');
};

  const productoSeleccionado = productos.find((p) => p.id === Number(productoId));

  const variantesDelProducto = detalles.filter(
    (d) => d.producto === productoSeleccionado?.nombre
  );
  const tallesDisponibles = [...new Set(variantesDelProducto.map((v) => v.talle))];
  const coloresDisponibles = [...new Set(variantesDelProducto.map((v) => v.color))];

  return (
    <div>
      <h2>Hacer un pedido</h2>

      <label>
        Producto:
        <select value={productoId} onChange={(e) => {
          setProductoId(e.target.value);
          setTalle('');
          setColor('');
        }}>
          <option value="">Elegí un producto</option>
          {productos.map((p) => (
            <option key={p.id} value={p.id}>{p.nombre}</option>
          ))}
        </select>
      </label>

      {productoSeleccionado && (
        <>
          <label>
            Talle:
            <select value={talle} onChange={(e) => setTalle(e.target.value)}>
              <option value="">Elegí un talle</option>
              {tallesDisponibles.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </label>

          <label>
            Color:
            <select value={color} onChange={(e) => setColor(e.target.value)}>
              <option value="">Elegí un color</option>
              {coloresDisponibles.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>

          <label>
            Cantidad:
            <input
              type="number"
              min="1"
              value={cantidad}
              onChange={(e) => setCantidad(Number(e.target.value))}
            />
          </label>
        </>
      )}

      {productoSeleccionado && talle && color && (
        <div style={{ marginTop: '1rem' }}>
          {cantidad <= 4 ? (
  <div>
    <p>Precio: ${productoSeleccionado.precio * cantidad}</p>
    <p>(Acá va la opción de subir tu diseño — la agregamos después)</p>
  </div>
) : (
  <div>
    <h4>Solicitar cotización para {cantidad} unidades</h4>
    <label>
      Nombre:
      <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />
    </label>
    <label>
      Contacto (mail o WhatsApp):
      <input type="text" value={contacto} onChange={(e) => setContacto(e.target.value)} />
    </label>
    <label>
      Comentarios:
      <textarea value={comentarios} onChange={(e) => setComentarios(e.target.value)} />
    </label>
    <button onClick={enviarCotizacion}>Enviar solicitud</button>
  </div>
)}
        </div>
      )}
    </div>
  );
}

export default Pedido;