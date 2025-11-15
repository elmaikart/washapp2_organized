"use client";

import React, { useEffect } from "react";
import { CalendarDays, Clock } from "lucide-react";
import { calcularFranjaDevolucion, esFeriado, isSunday } from "@/logic/validaciones";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import TimeBlock from "@/components/canasto-ropa-blanca/TimeBlock";

interface Props {
  fechaRetiro: string;
  horaInicioRetiro: string;
  fechaDevolucion: string;
  setFechaDevolucion: (v: string) => void;
  horaInicioDevolucion: string;
  setHoraInicioDevolucion: (v: string) => void;
  horaFinDevolucion: string;
  setHoraFinDevolucion: (v: string) => void;
}

export default function HorariosDevolucion({
  fechaRetiro,
  horaInicioRetiro,
  fechaDevolucion,
  setFechaDevolucion,
  horaInicioDevolucion,
  setHoraInicioDevolucion,
  horaFinDevolucion,
  setHoraFinDevolucion,
}: Props) {
  useEffect(() => {
    if (fechaRetiro && horaInicioRetiro) {
      const base = new Date(`${fechaRetiro}T${horaInicioRetiro}:00`);
      const estimada = calcularFranjaDevolucion(base);
      setFechaDevolucion(estimada.toISOString().split("T")[0]);
    }
  }, [fechaRetiro, horaInicioRetiro]);

  const diaInhabilitado =
    isSunday(new Date(fechaDevolucion)) || esFeriado(new Date(fechaDevolucion));

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Clock className="w-5 h-5 text-wash-primary" />
        <h3 className="font-semibold text-gray-700">Devolución Programada</h3>
      </div>

      {diaInhabilitado && (
        <p className="text-yellow-600 text-sm">
          ⚠️ No se realizan devoluciones los domingos ni feriados.
        </p>
      )}

      {/* 📅 Fecha */}
      <div className="flex flex-col gap-1">
        <Label className="text-sm font-medium text-gray-600">Fecha</Label>
        <div className="relative">
          <CalendarDays className="absolute left-3 top-2.5 text-wash-primary w-4 h-4" />
          <Input
            type="date"
            value={fechaDevolucion}
            onChange={(e) => setFechaDevolucion(e.target.value)}
            className="pl-9"
            disabled={diaInhabilitado}
          />
        </div>
      </div>

      {/* 🕒 Franja Horaria */}
      <div className="mt-2">
        <TimeBlock
          fecha={fechaDevolucion}
          horaInicio={horaInicioDevolucion}
          horaFin={horaFinDevolucion}
          setHoraInicio={setHoraInicioDevolucion}
          setHoraFin={setHoraFinDevolucion}
          tipo="Devolución"
          disabled={diaInhabilitado}
        />
      </div>
    </div>
  );
}
