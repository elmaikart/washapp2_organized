"use client";

import React, { useState } from "react";
import HorariosRetiro from "../canasto-ropa-blanca/HorariosRetiro";
import HorariosDevolucion from "../canasto-ropa-blanca/HorariosDevolucion";
import DireccionesInput from "../canasto-ropa-blanca/DireccionesInput";
import ResumenTotal from "../canasto-ropa-blanca/ResumenTotal";

export default function PedidoSection() {
  /* ===========================
       ESTADOS
  ============================ */

  // RETIRO
  const [fechaRetiro, setFechaRetiro] = useState("");
  const [horaInicioRetiro, setHoraInicioRetiro] = useState("");
  const [horaFinRetiro, setHoraFinRetiro] = useState("");
  const [direccionRetiro, setDireccionRetiro] = useState("");

  // DEVOLUCIÓN
  const [fechaDevolucion, setFechaDevolucion] = useState("");
  const [horaInicioDevolucion, setHoraInicioDevolucion] = useState("");
  const [horaFinDevolucion, setHoraFinDevolucion] = useState("");
  const [direccionDevolucion, setDireccionDevolucion] = useState("");

  // NOTA
  const [nota, setNota] = useState("");

  /* ===========================
       TOTAL SIMPLIFICADO
     (Después lo conectamos al carrito)
  ============================ */

  const total = 0; // Por ahora sin carrito

  const confirmarPedido = () => {
    console.log("Pedido confirmado");
    console.log({
      fechaRetiro,
      horaInicioRetiro,
      horaFinRetiro,
      direccionRetiro,
      fechaDevolucion,
      horaInicioDevolucion,
      horaFinDevolucion,
      direccionDevolucion,
      nota,
    });
  };

  return (
    <section className="mt-6 flex flex-col gap-6">

      {/* === RETIRO === */}
      <div className="border border-blue-100 rounded-xl p-3">
        <h3 className="font-semibold text-gray-800 mb-2">Retiro Programado</h3>

        <HorariosRetiro
          fechaRetiro={fechaRetiro}
          setFechaRetiro={setFechaRetiro}
          horaInicioRetiro={horaInicioRetiro}
          setHoraInicioRetiro={setHoraInicioRetiro}
          horaFinRetiro={horaFinRetiro}
          setHoraFinRetiro={setHoraFinRetiro}
        />

        {/* Dirección de Retiro */}
        <DireccionesInput
          tipo="retiro"
          label="Dirección de Retiro"
          value={direccionRetiro}
          onChange={setDireccionRetiro}
        />
      </div>

      {/* === DEVOLUCIÓN === */}
      <div className="border border-blue-100 rounded-xl p-3">
        <h3 className="font-semibold text-gray-800 mb-2">Devolución Programada</h3>

        <HorariosDevolucion
          fechaRetiro={fechaRetiro}
          horaInicioRetiro={horaInicioRetiro}
          fechaDevolucion={fechaDevolucion}
          setFechaDevolucion={setFechaDevolucion}
          horaInicioDevolucion={horaInicioDevolucion}
          setHoraInicioDevolucion={setHoraInicioDevolucion}
          horaFinDevolucion={horaFinDevolucion}
          setHoraFinDevolucion={setHoraFinDevolucion}
        />

        <DireccionesInput
          tipo="devolucion"
          label="Dirección de Devolución"
          value={direccionDevolucion}
          onChange={setDireccionDevolucion}
        />
      </div>

      {/* === NOTA === */}
      <div className="border border-blue-100 rounded-xl p-3">
        <label className="font-medium text-gray-700 text-sm">Notas</label>
        <textarea
          value={nota}
          onChange={(e) => setNota(e.target.value)}
          placeholder="Agregá una aclaración opcional…"
          className="w-full mt-2 h-20 rounded-lg border border-gray-300 p-2 text-sm outline-none focus:ring-2 focus:ring-wash-primary"
        />
      </div>

      {/* === RESUMEN FINAL === */}
      <ResumenTotal
        total={total}
        onConfirmar={confirmarPedido}
      />

    </section>
  );
}
