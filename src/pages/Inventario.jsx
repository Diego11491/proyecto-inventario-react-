import React, { useState, useEffect } from "react";
import { supabase } from '../supabaseClient';

const Inventario = () => {
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [nuevoProducto, setNuevoProducto] = useState("");
  const [nuevaCantidad, setNuevaCantidad] = useState("");
  const [modoEdicion, setModoEdicion] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Nuevos estados para búsqueda y filtros
  const [busqueda, setBusqueda] = useState("");
  const [filtroStock, setFiltroStock] = useState("todos");
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [productoAEliminar, setProductoAEliminar] = useState(null);

  useEffect(() => {
    const fetchProductos = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('productos')
          .select('*')
          .order('id', { ascending: false });

        if (error) {
          setError("Error al cargar los productos.");
          console.error("Error fetching productos:", error);
        } else {
          setProductos(data);
          setProductosFiltrados(data);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  // Efecto para filtrar productos
  useEffect(() => {
    let productosFiltradosTemp = productos;

    // Filtro por búsqueda
    if (busqueda) {
      productosFiltradosTemp = productosFiltradosTemp.filter(producto =>
        producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
      );
    }

    // Filtro por stock
    if (filtroStock === "bajo") {
      productosFiltradosTemp = productosFiltradosTemp.filter(producto => producto.cantidad < 10);
    } else if (filtroStock === "sin_stock") {
      productosFiltradosTemp = productosFiltradosTemp.filter(producto => producto.cantidad === 0);
    }

    setProductosFiltrados(productosFiltradosTemp);
  }, [productos, busqueda, filtroStock]);

  // Función para mostrar mensajes temporales
  const mostrarMensaje = (mensaje, tipo = 'success') => {
    if (tipo === 'success') {
      setSuccess(mensaje);
      setTimeout(() => setSuccess(null), 3000);
    } else {
      setError(mensaje);
      setTimeout(() => setError(null), 3000);
    }
  };

  const agregarProducto = async () => {
    if (!nuevoProducto.trim() || !nuevaCantidad || nuevaCantidad < 0) {
      mostrarMensaje("Por favor, completa todos los campos correctamente.", 'error');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('productos')
        .insert([{ nombre: nuevoProducto.trim(), cantidad: parseInt(nuevaCantidad) }])
        .select();

      if (error) {
        mostrarMensaje("Error al agregar el producto.", 'error');
        console.error("Error adding producto:", error);
      } else if (data && data.length > 0) {
        setProductos([data[0], ...productos]);
        limpiarFormulario();
        mostrarMensaje("Producto agregado exitosamente.");
      }
    } catch (error) {
      mostrarMensaje("Error inesperado al agregar el producto.", 'error');
      console.error("Unexpected error adding producto:", error);
    }
  };

  const confirmarEliminacion = (producto) => {
    setProductoAEliminar(producto);
    setMostrarConfirmacion(true);
  };

  const eliminarProducto = async () => {
    if (!productoAEliminar) return;

    try {
      const { error } = await supabase
        .from('productos')
        .delete()
        .match({ id: productoAEliminar.id });

      if (error) {
        mostrarMensaje("Error al eliminar el producto.", 'error');
        console.error("Error deleting producto:", error);
      } else {
        setProductos(productos.filter((p) => p.id !== productoAEliminar.id));
        mostrarMensaje("Producto eliminado exitosamente.");
      }
    } catch (error) {
      mostrarMensaje("Error inesperado al eliminar el producto.", 'error');
      console.error("Unexpected error deleting producto:", error);
    } finally {
      setMostrarConfirmacion(false);
      setProductoAEliminar(null);
    }
  };

  const editarProducto = (producto) => {
    setModoEdicion(true);
    setProductoEditando(producto);
    setNuevoProducto(producto.nombre);
    setNuevaCantidad(producto.cantidad);
  };

  const guardarEdicion = async () => {
    if (!productoEditando || !nuevoProducto.trim() || !nuevaCantidad || nuevaCantidad < 0) {
      mostrarMensaje("Por favor, completa todos los campos correctamente.", 'error');
      return;
    }

    try {
      const { error } = await supabase
        .from('productos')
        .update({ nombre: nuevoProducto.trim(), cantidad: parseInt(nuevaCantidad) })
        .match({ id: productoEditando.id });

      if (error) {
        mostrarMensaje("Error al guardar los cambios.", 'error');
        console.error("Error updating producto:", error);
      } else {
        setProductos(
          productos.map((p) =>
            p.id === productoEditando.id
              ? { ...p, nombre: nuevoProducto.trim(), cantidad: parseInt(nuevaCantidad) }
              : p
          )
        );
        limpiarFormulario();
        setModoEdicion(false);
        setProductoEditando(null);
        mostrarMensaje("Producto actualizado exitosamente.");
      }
    } catch (error) {
      mostrarMensaje("Error inesperado al guardar los cambios.", 'error');
      console.error("Unexpected error updating producto:", error);
    }
  };

  const cancelarEdicion = () => {
    setModoEdicion(false);
    setProductoEditando(null);
    limpiarFormulario();
  };

  const limpiarFormulario = () => {
    setNuevoProducto("");
    setNuevaCantidad("");
  };

  const getStockClass = (cantidad) => {
    if (cantidad === 0) return "text-danger";
    if (cantidad < 10) return "text-warning";
    return "text-success";
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Inventario de Productos</h2>

      {/* Mensajes de éxito y error */}
      {success && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          {success}
        </div>
      )}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
        </div>
      )}

      {/* Barra de búsqueda y filtros */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="input-group">
            <span className="input-group-text">🔍</span>
            <input
              type="text"
              className="form-control"
              placeholder="Buscar productos..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-6">
          <select
            className="form-select"
            value={filtroStock}
            onChange={(e) => setFiltroStock(e.target.value)}
          >
            <option value="todos">Todos los productos</option>
            <option value="bajo">Stock bajo (&lt; 10)</option>
            <option value="sin_stock">Sin stock</option>
          </select>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card text-center bg-primary text-white">
            <div className="card-body">
              <h5 className="card-title">{productos.length}</h5>
              <p className="card-text">Total Productos</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center bg-success text-white">
            <div className="card-body">
              <h5 className="card-title">{productos.filter(p => p.cantidad > 10).length}</h5>
              <p className="card-text">Stock Regular</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center bg-warning text-white">
            <div className="card-body">
              <h5 className="card-title">{productos.filter(p => p.cantidad > 0 && p.cantidad < 10).length}</h5>
              <p className="card-text">Stock Bajo</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center bg-danger text-white">
            <div className="card-body">
              <h5 className="card-title">{productos.filter(p => p.cantidad === 0).length}</h5>
              <p className="card-text">Sin Stock</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de productos */}
      <div className="row">
        {productosFiltrados.length === 0 ? (
          <div className="col-12">
            <div className="alert alert-info text-center">
              {productos.length === 0 ? 
                "No hay productos en el inventario." : 
                "No se encontraron productos con los filtros aplicados."
              }
            </div>
          </div>
        ) : (
          productosFiltrados.map((prod) => (
            <div key={prod.id} className="col-md-4 mb-3">
              <div className="card shadow-sm h-100">
                <div className="card-body d-flex flex-column justify-content-between">
                  <div>
                    <h5 className="card-title">{prod.nombre}</h5>
                    <p className={`card-text ${getStockClass(prod.cantidad)}`}>
                      <strong>Cantidad: {prod.cantidad} unidades</strong>
                    </p>
                    {prod.cantidad === 0 && (
                      <span className="badge bg-danger">Sin Stock</span>
                    )}
                    {prod.cantidad > 0 && prod.cantidad < 10 && (
                      <span className="badge bg-warning">Stock Bajo</span>
                    )}
                  </div>
                  <div className="d-flex justify-content-between mt-3">
                    <button 
                      onClick={() => editarProducto(prod)} 
                      className="btn btn-warning btn-sm"
                    >
                      ✏️ Editar
                    </button>
                    <button 
                      onClick={() => confirmarEliminacion(prod)} 
                      className="btn btn-danger btn-sm"
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Formulario de agregar/editar producto */}
      <div className="card mt-5 p-4 shadow">
        <h4 className="card-title text-center mb-3">
          {modoEdicion ? "Editar Producto" : "Agregar Nuevo Producto"}
        </h4>
        <div className="mb-3">
          <label htmlFor="nombreProducto" className="form-label">Nombre del producto</label>
          <input
            id="nombreProducto"
            type="text"
            className="form-control"
            placeholder="Ingresa el nombre del producto"
            value={nuevoProducto}
            onChange={(e) => setNuevoProducto(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="cantidadProducto" className="form-label">Cantidad</label>
          <input
            id="cantidadProducto"
            type="number"
            className="form-control"
            placeholder="Ingresa la cantidad"
            value={nuevaCantidad}
            onChange={(e) => setNuevaCantidad(e.target.value)}
            min="0"
          />
        </div>
        <div className="d-flex gap-2">
          <button
            onClick={modoEdicion ? guardarEdicion : agregarProducto}
            className={`btn ${modoEdicion ? "btn-success" : "btn-primary"} flex-grow-1`}
          >
            {modoEdicion ? "💾 Guardar cambios" : "➕ Agregar producto"}
          </button>
          {modoEdicion && (
            <button
              onClick={cancelarEdicion}
              className="btn btn-secondary"
            >
              ❌ Cancelar
            </button>
          )}
        </div>
      </div>

      {/* Modal de confirmación de eliminación */}
      {mostrarConfirmacion && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirmar Eliminación</h5>
              </div>
              <div className="modal-body">
                <p>¿Estás seguro de que deseas eliminar el producto <strong>"{productoAEliminar?.nombre}"</strong>?</p>
                <p className="text-muted">Esta acción no se puede deshacer.</p>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setMostrarConfirmacion(false)}
                >
                  Cancelar
                </button>
                <button 
                  type="button" 
                  className="btn btn-danger" 
                  onClick={eliminarProducto}
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventario;