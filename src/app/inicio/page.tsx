"use client";

import React, { useMemo, useState } from "react";
import ServiciosScroll from "@/components/inicio/ServiciosScroll";
import ServicioCards from "@/components/inicio/ServicioCards";
import PedidoSection from "@/components/inicio/PedidoSection";

/* =================== DATA =================== */
/** Catálogo de Servicios y Productos (puede crecer libremente) */
const CATALOG = [
  { id: "ropa-blanca", titulo: "Ropa Blanca" },
  { id: "ropa-color", titulo: "Ropa Color" },
  { id: "acolchados", titulo: "Acolchados" },
  { id: "camperas", titulo: "Camperas" },
  { id: "sabanas", titulo: "Sábanas" },
  { id: "manteles", titulo: "Manteles" },
  { id: "cortinas", titulo: "Cortinas" },
  { id: "fundas", titulo: "Fundas" },
  { id: "frazadas", titulo: "Frazadas" },
  { id: "almohadas", titulo: "Almohadas" },
  { id: "toallas", titulo: "Toallas" },
  { id: "zapatillas", titulo: "Zapatillas" },
] as const;

/** Opciones del servicio “Ropa Blanca” (las famosas 3 cards) */
const OPCIONES_ROPA_BLANCA = [
  { id: "blanca-eco", nombre: "Blanca Eco", precio: 10000, desc: "Lavado y Secado. Jabón + Suavizante Genérico. Sin blanqueador." },
  { id: "blanca-confort", nombre: "Blanca Confort", precio: 12000, desc: "Jabón Líquido + Suavizante Premium + Detergente Neutro." },
  { id: "blanca-extra", nombre: "Blanca Extra", precio: 13500, desc: "Incluye Blanqueador + Detergente Neutro + Perfume para ropa." },
];

/** Mapa de opciones por servicio (para ir agregando más) */
const OPTIONS_BY_SERVICE: Record<string, { id: string; nombre: string; precio: number; desc: string }[]> = {
  "ropa-blanca": OPCIONES_ROPA_BLANCA,
  // "ropa-color": [...],
  // etc.
};

/* ============== Tipado de carrito/resumen ============== */
export type ItemPedido = {
  servicioId: string;     // ej. "ropa-blanca"
  opcionId: string;       // ej. "blanca-eco"
  nombre: string;         // ej. "Blanca Eco"
  cantidad: number;
  precioUnit: number;
};

export default function InicioPage() {
  /** BUSCADOR (visual, sin lógica aún) */
  const [query, setQuery] = useState("");

  /** Servicio seleccionado del carrusel */
  const [servicioActivo, setServicioActivo] = useState<string>("ropa-blanca");

  /** Carrito de selecciones (aparece en Pedido > Resumen) */
  const [carrito, setCarrito] = useState<ItemPedido[]>([]);

  /** Opciones del servicio activo */
  const opcionesActivas = useMemo(
    () => OPTIONS_BY_SERVICE[servicioActivo] ?? [],
    [servicioActivo]
  );

  /** Cantidades de las opciones visibles (controlado por Page) */
  const cantidades = useMemo(() => {
    const map: Record<string, number> = {};
    for (const op of opcionesActivas) {
      // buscar si está en carrito
      const found = carrito.find(
        (i) => i.servicioId === servicioActivo && i.opcionId === op.id
      );
      map[op.id] = found?.cantidad ?? 0;
    }
    return map;
  }, [opcionesActivas, carrito, servicioActivo]);

  /** Handler al cambiar cantidad de una opción */
  const handleChangeCantidad = (opcionId: string, nuevaCantidad: number) => {
    const op = opcionesActivas.find((o) => o.id === opcionId);
    if (!op) return;

    setCarrito((prev) => {
      const idx = prev.findIndex(
        (i) => i.servicioId === servicioActivo && i.opcionId === opcionId
      );
      // Eliminar si nuevaCantidad = 0
      if (nuevaCantidad <= 0) {
        if (idx >= 0) {
          const copy = [...prev];
          copy.splice(idx, 1);
          return copy;
        }
        return prev;
      }
      // Agregar / actualizar
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = {
          ...copy[idx],
          cantidad: nuevaCantidad,
        };
        return copy;
      } else {
        return [
          ...prev,
          {
            servicioId: servicioActivo,
            opcionId,
            nombre: op.nombre,
            cantidad: nuevaCantidad,
            precioUnit: op.precio,
          },
        ];
      }
    });
  };

  return (
    <main className="page-inicio pb-28 min-h-screen bg-wash-bg mx-auto w-full max-w-5xl">
      {/* ===== Buscador ===== */}
      <section className="mx-auto max-w-5xl px-4 pt-6">
        <h1 className="sr-only">WashApp</h1>
        <div className="flex w-full gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="¿Qué lavamos hoy?"
            className="flex-1 h-11 rounded-full border border-blue-200 bg-white px-4 text-[15px] shadow-sm outline-none focus:ring-2 focus:ring-wash-primary"
          />
          <button
            className="h-11 rounded-full px-5 text-white bg-wash-primary hover:bg-blue-700 active:scale-[0.98] shadow"
            onClick={() => {/* hook de búsqueda (pendiente) */ }}
          >
            Buscar
          </button>
        </div>
      </section>

      {/* ===== Servicios & Productos (carrusel 6 visibles, monocromo) ===== */}
      <section className="mx-auto max-w-5xl px-4 mt-6">
        <h2 className="text-[15px] font-semibold text-gray-700 mb-2">
          Servicios y Productos
        </h2>
        <ServiciosScroll
          servicios={CATALOG as any}
          activo={servicioActivo}
          onSelect={(id) => setServicioActivo(id)}
        />
      </section>

      {/* ===== Bloque de opciones del servicio elegido ===== */}
      {opcionesActivas.length > 0 && (
        <section className="mx-auto max-w-5xl px-4 mt-6">
          <h3 className="text-[16px] font-semibold text-wash-primary mb-3">
            {CATALOG.find(c => c.id === servicioActivo)?.titulo}
          </h3>
          <ServicioCards
            opciones={opcionesActivas}
            cantidades={cantidades}
            onChangeCantidad={handleChangeCantidad}
          />
        </section>
      )}

      {/* ===== Pedido (usa tus validaciones internas) ===== */}
      <section className="mx-auto max-w-5xl px-4 mt-8">
        <PedidoSection />
      </section>
    </main>
  );
}
