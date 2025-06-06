import React, { useState, useEffect } from "react";
import { supabase } from '../supabaseClient';

const Inventario = () => {
  const [productos, setProductos] = useState([]);
  const [nuevoProducto, setNuevoProducto] = useState("");
  const [nuevaCantidad, setNuevaCantidad] = useState("");
  const [modoEdicion, setModoEdicion] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductos = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('productos') // Asegúrate de que este sea el nombre de tu tabla en Supabase
          .select('*')
          .order('id', { ascending: false }); // Ordenar por ID descendente para mostrar los últimos primero

        if (error) {
          setError("Error al cargar los productos.");
          console.error("Error fetching productos:", error);
        } else {
          setProductos(data);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  const agregarProducto = async () => {
    if (nuevoProducto && nuevaCantidad) {
      try {
        const { data, error } = await supabase
          .from('productos')
          .insert([{ nombre: nuevoProducto, cantidad: parseInt(nuevaCantidad) }])
          .select();

        if (error) {
          setError("Error al agregar el producto.");
          console.error("Error adding producto:", error);
        } else if (data && data.length > 0) {
          setProductos([data[0], ...productos]); // Agregar el nuevo producto al inicio de la lista
          limpiarFormulario();
        }
      } catch (error) {
        setError("Error inesperado al agregar el producto.");
        console.error("Unexpected error adding producto:", error);
      }
    }
  };

  const eliminarProducto = async (id) => {
    try {
      const { error } = await supabase
        .from('productos')
        .delete()
        .match({ id });

      if (error) {
        setError("Error al eliminar el producto.");
        console.error("Error deleting producto:", error);
      } else {
        setProductos(productos.filter((p) => p.id !== id));
      }
    } catch (error) {
      setError("Error inesperado al eliminar el producto.");
      console.error("Unexpected error deleting producto:", error);
    }
  };

  const editarProducto = (producto) => {
    setModoEdicion(true);
    setProductoEditando(producto);
    setNuevoProducto(producto.nombre);
    setNuevaCantidad(producto.cantidad);
  };

  const guardarEdicion = async () => {
    if (productoEditando) {
      try {
        const { error } = await supabase
          .from('productos')
          .update({ nombre: nuevoProducto, cantidad: parseInt(nuevaCantidad) })
          .match({ id: productoEditando.id });

        if (error) {
          setError("Error al guardar los cambios.");
          console.error("Error updating producto:", error);
        } else {
          setProductos(
            productos.map((p) =>
              p.id === productoEditando.id
                ? { ...p, nombre: nuevoProducto, cantidad: parseInt(nuevaCantidad) }
                : p
            )
          );
          limpiarFormulario();
          setModoEdicion(false);
          setProductoEditando(null);
        }
      } catch (error) {
        setError("Error inesperado al guardar los cambios.");
        console.error("Unexpected error updating producto:", error);
      }
    }
  };

  const limpiarFormulario = () => {
    setNuevoProducto("");
    setNuevaCantidad("");
  };

  if (loading) {
    return <div className="text-center">Cargando inventario...</div>;
  }

  if (error) {
    return <div className="alert alert-danger text-center">{error}</div>;
  }

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Inventario de Productos</h2>

      <div className="row">
        {productos.map((prod) => (
          <div key={prod.id} className="col-md-4 mb-3">
            <div className="card shadow-sm h-100">
              <div className="card-body d-flex flex-column justify-content-between">
                <h5 className="card-title">{prod.nombre}</h5>
                <p className="card-text">Cantidad: {prod.cantidad} unidades</p>
                <div className="d-flex justify-content-between">
                  <button onClick={() => editarProducto(prod)} className="btn btn-warning btn-sm">
                    Editar
                  </button>
                  <button onClick={() => eliminarProducto(prod.id)} className="btn btn-danger btn-sm">
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card mt-5 p-4 shadow">
        <h4 className="card-title text-center mb-3">
          {modoEdicion ? "Editar Producto" : "Agregar Nuevo Producto"}
        </h4>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Nombre del producto"
            value={nuevoProducto}
            onChange={(e) => setNuevoProducto(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <input
            type="number"
            className="form-control"
            placeholder="Cantidad"
            value={nuevaCantidad}
            onChange={(e) => setNuevaCantidad(e.target.value)}
          />
        </div>
        <button
          onClick={modoEdicion ? guardarEdicion : agregarProducto}
          className={`btn ${modoEdicion ? "btn-success" : "btn-primary"} w-100`}
        >
          {modoEdicion ? "Guardar cambios" : "Agregar producto"}
        </button>
      </div>
    </div>
  );
};

export default Inventario;