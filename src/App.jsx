import { useEffect, useMemo, useState } from 'react';
import './App.css';

const API_URL = 'https://proyecto-final-api-nz5i.onrender.com';

const productImages = [
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=85',
];

function ArrowIcon({ diagonal = false }) {
  return diagonal ? (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
      <path d="M5 15 15 5M6 5h9v9" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ) : (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
      <path d="M3 10h13m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function App() {
  const [productos, setProductos] = useState([]);
  const [categoriaActiva, setCategoriaActiva] = useState('Todos');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    fetch(`${API_URL}/productos`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`No se pudo cargar el catálogo (${response.status}).`);
        }
        return response.json();
      })
      .then((data) => {
        if (!Array.isArray(data)) {
          throw new Error('La respuesta del catálogo no tiene el formato esperado.');
        }
        setProductos(data);
      })
      .catch((fetchError) => {
        if (fetchError.name !== 'AbortError') {
          setError(fetchError.message || 'Ocurrió un error al cargar el catálogo.');
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setCargando(false);
      });

    return () => controller.abort();
  }, []);

  const categorias = useMemo(
    () => ['Todos', ...new Set(productos.map((producto) => producto.categoria).filter(Boolean))],
    [productos],
  );

  const productosVisibles = productos.filter(
    (producto) => categoriaActiva === 'Todos' || producto.categoria === categoriaActiva,
  );

  const formatoPrecio = (precio) =>
    new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    }).format(Number(precio));

  return (
    <div className="storefront">
      <div className="announcement">
        <span>Hecho para vos, pensado para durar</span>
        <span className="announcement-divider" aria-hidden="true">✳</span>
        <span>Personalizamos cada detalle</span>
      </div>

      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="638, inicio">
          <span className="brand-mark">638</span>
          <span className="brand-caption">OBJETOS CON IDENTIDAD</span>
        </a>
        <nav className="main-nav" aria-label="Navegación principal">
          <a href="#productos">Tienda</a>
          <a href="#proceso">Cómo funciona</a>
          <a href="#nosotros">Nosotros</a>
        </nav>
        <a className="header-cta" href="#productos">
          Explorar productos <ArrowIcon diagonal />
        </a>
      </header>

      <main>
        <section className="hero-section" id="inicio">
          <div className="hero-copy">
            <p className="eyebrow"><span className="eyebrow-line" /> DISEÑOS PERSONALIZADOS </p>
            <h1>Lo que imaginás,<br />lo hacemos <em>real.</em></h1>
            <p className="hero-description">
              Prendas y objetos con tu logo. Diseñados con cuidado y pensados para acompañarte.
            </p>
            <div className="hero-actions">
              <a className="button button-dark" href="#productos">
                Encontrá tu próximo favorito <ArrowIcon />
              </a>
              <a className="text-link" href="#proceso">Conocé cómo trabajamos</a>
            </div>
            <div className="hero-note">
              <span className="note-star">✳</span>
              <span>Una idea tuya.<br /><strong>Un diseño único.</strong></span>
            </div>
          </div>
          <div className="hero-image-wrap">
            <div className="hero-image" role="img" aria-label="Prenda de diseño minimalista" />
            <div className="hero-image-label">
              <span>01 / PIEZAS CON IDENTIDAD</span>
              <span>638®</span>
            </div>
            <div className="hero-side-note">PERSONALIZÁ<br />A TU MANERA</div>
          </div>
          <span className="hero-index" aria-hidden="true">638 — 2026</span>
        </section>

        <section className="values-strip" aria-label="Nuestra propuesta">
          <span>DISEÑADO CON INTENCIÓN</span>
          <span className="values-star">✳</span>
          <span>HECHO PARA VOS</span>
          <span className="values-star">✳</span>
          <span>DETALLES QUE IMPORTAN</span>
        </section>

        <section className="products-section section-shell" id="productos">
          <div className="section-heading">
            <div>
              <p className="eyebrow"><span className="eyebrow-line" /> NUESTRA SELECCIÓN</p>
              <h2>Ideas que se<br /><em>vuelven piezas.</em></h2>
            </div>
            <p className="section-intro">
              Elegí una base, sumale tu idea y la hacemos parte de algo que vas a querer usar una y otra vez.
            </p>
          </div>

          <div className="catalog-toolbar">
            <div className="category-filters" aria-label="Filtrar por categoría">
              {categorias.map((categoria) => (
                <button
                  className={categoriaActiva === categoria ? 'filter-chip active' : 'filter-chip'}
                  key={categoria}
                  onClick={() => setCategoriaActiva(categoria)}
                  type="button"
                >
                  {categoria}
                </button>
              ))}
            </div>
            <span className="catalog-count">
              {cargando ? 'Cargando selección…' : `${productosVisibles.length} ${productosVisibles.length === 1 ? 'pieza' : 'piezas'}`}
            </span>
          </div>

          {error && (
            <div className="catalog-message" role="status">
              <span>Por ahora no pudimos conectar con el catálogo.</span>
              <span>{error}</span>
            </div>
          )}

          {cargando ? (
            <div className="product-grid" aria-label="Cargando productos">
              {productImages.slice(0, 3).map((image) => (
                <div className="product-skeleton" key={image} />
              ))}
            </div>
          ) : productosVisibles.length > 0 ? (
            <div className="product-grid">
              {productosVisibles.map((producto, index) => (
                <article className="product-card" key={producto.id}>
                  <a className={`product-image product-image-${index % productImages.length}`} href="#proceso">
                    <img
                      alt={producto.nombre}
                      loading="lazy"
                      src={productImages[index % productImages.length]}
                    />
                    <span className="product-image-tag">638 / PERSONALIZABLE</span>
                    <span className="product-open"><ArrowIcon diagonal /></span>
                  </a>
                  <div className="product-info">
                    <div>
                      <p className="product-category">{producto.categoria || 'DISEÑO 638'}</p>
                      <h3>{producto.nombre}</h3>
                    </div>
                    <span className="product-price">{formatoPrecio(producto.precio)}</span>
                  </div>
                  <a className="product-customize" href="#proceso">
                    Personalizar esta pieza <ArrowIcon />
                  </a>
                </article>
              ))}
            </div>
          ) : (
            !error && (
              <div className="empty-catalog">
                <span className="empty-mark">638</span>
                <p>Estamos preparando nuevas piezas para vos.</p>
              </div>
            )
          )}
          <a className="button button-outline catalog-more" href="#proceso">
            ¿Tenés una idea propia? Hablemos <ArrowIcon />
          </a>
        </section>

        <section className="process-section" id="proceso">
          <div className="process-image" role="img" aria-label="Detalle de una prenda hecha con dedicación" />
          <div className="process-content">
            <p className="eyebrow eyebrow-light"><span className="eyebrow-line" /> SIMPLE, COMO DEBERÍA SER</p>
            <h2>De tu idea<br />a tu <em>pieza favorita.</em></h2>
            <p className="process-intro">
              No hace falta tener todo resuelto. Te acompañamos desde la primera idea hasta el último detalle.
            </p>
            <ol className="process-steps">
              <li><span>01</span><div><strong>Nos contás tu idea</strong><p>Elegimos juntos la prenda y el estilo que tenés en mente.</p></div></li>
              <li><span>02</span><div><strong>La diseñamos en equipo</strong><p>Definimos colores, gráfica y todos esos detalles que la hacen tuya.</p></div></li>
              <li><span>03</span><div><strong>La hacemos realidad</strong><p>Preparamos tu pedido con dedicación y te lo hacemos llegar.</p></div></li>
            </ol>
            <a className="button button-light" href="#productos">
              Empezar con una idea <ArrowIcon />
            </a>
          </div>
        </section>

        <section className="about-section section-shell" id="nosotros">
          <p className="eyebrow"><span className="eyebrow-line" /> SOMOS 638</p>
          <div className="about-content">
            <h2>Creemos en las cosas<br />que <em>dicen algo de vos.</em></h2>
            <div>
              <p>
                638 nace de una idea simple: lo cotidiano también puede tener identidad. Creamos piezas personalizadas con una mirada cuidada, materiales elegidos y mucho lugar para tu creatividad.
              </p>
              <a className="text-link" href="#productos">Descubrí la selección <ArrowIcon /></a>
            </div>
          </div>
          <div className="about-signature"><span>638</span><span>DISEÑO CON IDENTIDAD · DESDE 2026</span></div>
        </section>
      </main>

      <footer className="site-footer">
        <a className="brand footer-brand" href="#inicio">
          <span className="brand-mark">638</span>
          <span className="brand-caption">OBJETOS CON IDENTIDAD</span>
        </a>
        <p>Hecho con intención. Hecho para vos.</p>
        <a href="#inicio">Volver arriba ↑</a>
        <span className="footer-copy">© 638 — 2026</span>
      </footer>
    </div>
  );
}

export default App;
