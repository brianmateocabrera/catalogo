const supabaseUrl = 'https://lzqhceasmrifsmfwbxsh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6cWhjZWFzbXJpZnNtZndieHNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY5Mzk1MzIsImV4cCI6MjA2MjUxNTUzMn0.VEYUaSOvvlGXj274AwAlTmzexU77kXmQyiz9rSjk29o';

const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Función principal para cargar productos visibles
async function cargarProductos() {
  const { data: productos, error } = await supabase
    .from('productos')
    .select(`
      id,
      marca,
      modelo,
      precio,
      genero,
      descripcion,
      visible,
      imagenes_productos (
        url,
        orden
      )
    `)
    .eq('visible', true)
    .order('id', { ascending: false });

  if (error) {
    console.error('Error al obtener productos:', error.message);
    return;
  }

  const contenedor = document.getElementById('productos');
  contenedor.innerHTML = '';

  productos.forEach(producto => {
    const imagenPrincipal = producto.imagenes_productos?.sort((a, b) => a.orden - b.orden)[0]?.url 
                            || 'https://via.placeholder.com/400x300?text=Sin+imagen';

    const card = `
      <div class="col-md-4">
        <div class="card h-100 shadow-sm">
          <img src="${imagenPrincipal}" class="card-img-top" alt="${producto.modelo}">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${producto.marca} - ${producto.modelo}</h5>
            <p class="card-text">${producto.descripcion}</p>
            <p class="mt-auto fw-bold">$${producto.precio}</p>
            <a href="/producto/${producto.id}" class="btn btn-primary mt-2">Ver más</a>
          </div>
        </div>
      </div>
    `;
    contenedor.innerHTML += card;
  });
}

document.addEventListener('DOMContentLoaded', cargarProductos);
