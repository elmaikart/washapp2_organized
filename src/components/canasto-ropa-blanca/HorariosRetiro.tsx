"use client";

import React, { useState, useEffect } from "react";
import { CalendarDays, Clock } from "lucide-react";
import { isSunday, esFeriado, getBusinessWindow } from "@/logic/validaciones";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import TimeBlock from "@/components/canasto-ropa-blanca/TimeBlock";

interface Props {
  fechaRetiro: string;
  setFechaRetiro: (v: string) => void;
  horaInicioRetiro: string;
  setHoraInicioRetiro: (v: string) => void;
  horaFinRetiro: string;
  setHoraFinRetiro: (v: string) => void;
}

export default function HorariosRetiro({
  fechaRetiro,
  setFechaRetiro,
  horaInicioRetiro,
  setHoraInicioRetiro,
  horaFinRetiro,
  setHoraFinRetiro,
}: Props) {
  const [ventana, setVentana] = useState<{ apertura: number; cierre: number } | null>(null);

  useEffect(() => {
    if (!fechaRetiro) return;
    const date = new Date(fechaRetiro);
    const win = getBusinessWindow(date);
    setVentana(win);
  }, [fechaRetiro]);

  const diaInhabilitado =
    isSunday(new Date(fechaRetiro)) || esFeriado(new Date(fechaRetiro));

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Clock className="w-5 h-5 text-wash-primary" />
        <h3 className="font-semibold text-gray-700">Retiro Programado</h3>
      </div>

      {ventana && (
        <p className="text-sm text-gray-600">
          El horario de Retiro Programado es de {ventana.apertura}:00 a {ventana.cierre}:00 hs.
        </p>
      )}

      {diaInhabilitado && (
        <p className="text-yellow-600 text-sm">
          ⚠️ No se realizan retiros los domingos ni feriados.
        </p>
      )}

      {/* 📅 Fecha */}
      <div className="flex flex-col gap-1">
        <Label className="text-sm font-medium text-gray-600">Fecha</Label>
        <div className="relative">
          <CalendarDays className="absolute left-3 top-2.5 text-wash-primary w-4 h-4" />
          <Input
            type="date"
            value={fechaRetiro}
            onChange={(e) => setFechaRetiro(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* 🕒 Franja Horaria */}
      <div className="mt-2">
        <TimeBlock
          fecha={fechaRetiro}
          horaInicio={horaInicioRetiro}
          horaFin={horaFinRetiro}
          setHoraInicio={setHoraInicioRetiro}
          setHoraFin={setHoraFinRetiro}
          tipo="Retiro"
        />
      </div>
    </div>
  );
}
