// Configuración del cliente de Supabase
const supabaseUrl = 'https://lzqhceasmrifsmfwbxsh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6cWhjZWFzbXJpZnNtZndieHNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY5Mzk1MzIsImV4cCI6MjA2MjUxNTUzMn0.VEYUaSOvvlGXj274AwAlTmzexU77kXmQyiz9rSjk29o';

const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Función para cargar productos visibles
async function cargarProductos() {
  const { data, error } = await supabase
    .from('productos')
    .select('*')
    .eq('visible', 1);

  if (error) {
    console.error('Error al obtener productos:', error);
  } else {
    console.log('Productos obtenidos:', data);
    // Aquí podrías renderizar los datos en una tabla luego
  }
}
