const supabaseUrl = 'https://lzqhceasmrifsmfwbxsh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6cWhjZWFzbXJpZnNtZndieHNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY5Mzk1MzIsImV4cCI6MjA2MjUxNTUzMn0.VEYUaSOvvlGXj274AwAlTmzexU77kXmQyiz9rSjk29o';

const supabase = supabase.createClient(supabaseUrl, supabaseKey);

$(document).ready(async function () {
  try {
    // Detectar los campos de ambas tablas
    const { data: productos, error: errorProd } = await supabase.from('productos').select('*');
    if (errorProd) throw errorProd;

    const { data: imagenes, error: errorImg } = await supabase.from('imagenes').select('*');
    if (errorImg) throw errorImg;

    const grid = $('#productosGrid');
    grid.empty();

    productos.forEach(producto => {
      // Buscar imagen correspondiente al producto
      const imagen = imagenes.find(img => img.producto_id === producto.id);
      const imgUrl = imagen ? imagen.url : '';

      const nombreCompleto = `${producto.marca} ${producto.modelo}`;
      const precioFormateado = `$${parseFloat(producto.precio).toFixed(2)}`;

      const card = `
        <div class="col-sm-6 col-md-4 col-lg-3">
          <div class="card h-100 shadow-sm">
            <img src="${imgUrl}" class="card-img-top" alt="${nombreCompleto}" style="object-fit: cover; height: 200px;">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${nombreCompleto}</h5>
              <p class="card-text small">${producto.descripcion}</p>
              <p class="fw-bold text-primary">${precioFormateado}</p>
              <button class="btn btn-dark mt-auto">Ver más</button>
            </div>
          </div>
        </div>
      `;
      grid.append(card);
    });

  } catch (error) {
    console.error('Error al cargar productos e imágenes:', error.message);
  }
});