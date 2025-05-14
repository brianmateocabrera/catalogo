// Configuración Supabase
const supabaseUrl = 'https://lzqhceasmrifsmfwbxsh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6cWhjZWFzbXJpZnNtZndieHNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY5Mzk1MzIsImV4cCI6MjA2MjUxNTUzMn0.VEYUaSOvvlGXj274AwAlTmzexU77kXmQyiz9rSjk29o';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Columnas visibles en tabla
const columnasMostrar = ['id', 'marca', 'modelo', 'precio', 'genero', 'en_stock', 'visible', 'destacado'];

// Cargar productos y construir tabla
async function cargarProductos() {
  const { data, error } = await supabase
    .from('productos')
    .select('*');

  if (error) {
    console.error('Error al obtener productos:', error.message);
    return;
  }

  // Encabezado dinámico
  const encabezado = document.getElementById('encabezadoTabla');
  encabezado.innerHTML = '';
  columnasMostrar.forEach(col => {
    const th = document.createElement('th');
    th.textContent = col.toUpperCase();
    encabezado.appendChild(th);
  });
  const thAcciones = document.createElement('th');
  thAcciones.textContent = 'ACCIONES';
  encabezado.appendChild(thAcciones);

  // Cuerpo
  const cuerpo = document.getElementById('cuerpoTabla');
  cuerpo.innerHTML = '';

  data.forEach(producto => {
    const tr = document.createElement('tr');
    columnasMostrar.forEach(col => {
      const td = document.createElement('td');
      td.textContent = producto[col];
      tr.appendChild(td);
    });

    // Acciones
    const tdAcciones = document.createElement('td');
    tdAcciones.innerHTML = `
      <button class="btn btn-sm btn-warning me-1" onclick="editarProducto(${producto.id})">
        <i class="fas fa-edit"></i>
      </button>
      <button class="btn btn-sm btn-danger" onclick="eliminarProducto(${producto.id})">
        <i class="fas fa-trash-alt"></i>
      </button>
    `;
    tr.appendChild(tdAcciones);
    cuerpo.appendChild(tr);
  });

  // Inicializar DataTable si no existe
  if (!$.fn.DataTable.isDataTable('#tablaProductos')) {
    $('#tablaProductos').DataTable({
      language: {
        url: "//cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json"
      }
    });
  } else {
    $('#tablaProductos').DataTable().clear().destroy();
    $('#tablaProductos').DataTable({
      language: {
        url: "//cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json"
      }
    });
  }
}

// Crear producto vacío
async function nuevoProducto() {
  const { data, error } = await supabase
    .from('productos')
    .insert([{
      marca: 'Nueva Marca',
      modelo: 'Nuevo Modelo',
      precio: 0,
      genero: 'unisex',
      descripcion: '',
      materiales: '',
      uso: '',
      talles: '',
      colores: '',
      en_stock: 0,
      visible: 0,
      destacado: 0,
      badges: '',
      slug: '',
      sku: ''
    }]);

  if (error) {
    alert('Error al crear producto: ' + error.message);
    return;
  }

  alert('Producto creado con ID: ' + data[0].id);
  cargarProductos();
}

// Editar campo básico por prompt
async function editarProducto(id) {
  const { data, error } = await supabase
    .from('productos')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    alert('Error al obtener producto: ' + error.message);
    return;
  }

  const nuevoModelo = prompt('Editar modelo:', data.modelo);
  if (nuevoModelo === null) return;

  const { error: updateError } = await supabase
    .from('productos')
    .update({ modelo: nuevoModelo })
    .eq('id', id);

  if (updateError) {
    alert('Error al editar: ' + updateError.message);
  } else {
    alert('Producto actualizado.');
    cargarProductos();
  }
}

// Eliminar producto
async function eliminarProducto(id) {
  if (!confirm('¿Seguro que querés eliminar este producto?')) return;

  const { error } = await supabase
    .from('productos')
    .delete()
    .eq('id', id);

  if (error) {
    alert('Error al eliminar: ' + error.message);
  } else {
    alert('Producto eliminado.');
    cargarProductos();
  }
}

// Carga inicial
document.addEventListener('DOMContentLoaded', cargarProductos);
