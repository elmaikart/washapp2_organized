"use client";

import React from "react";
import {
  WashingMachine,
  Droplet,
  Bed,
  Shirt,
  Layers,
  Package,
  Bath,
  Sparkles,
  Box,
  FoldHorizontal,
  FoldVertical,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Item = { id: string; titulo: string };
type Props = {
  servicios: Item[];
  activo: string;
  onSelect: (id: string) => void;
};

/* === Iconos dinámicos para cada servicio === */
const Icono: React.FC<{ id: string; active?: boolean }> = ({ id, active }) => {
  const cls = cn(
    "w-8 h-8 transition-colors duration-200",
    active ? "text-wash-primary" : "text-wash-primary/70"
  );

  switch (id) {
    case "ropa-blanca":
      return <WashingMachine className={cls} />;
    case "ropa-color":
      return <Droplet className={cls} />;
    case "acolchados":
      return <Bed className={cls} />;
    case "camperas":
      return <Shirt className={cls} />;
    case "sabanas":
      return <Layers className={cls} />;
    case "manteles":
      return <Package className={cls} />;
    case "cortinas":
      return <Bath className={cls} />;

    // 🔧 FIX: "planchado" → ícono Shirt (IroningBoard no existe)
    case "planchado":
      return <Shirt className={cls} />;

    case "tintoreria":
      return <Sparkles className={cls} />;
    case "alfombras":
      return <FoldHorizontal className={cls} />;
    case "tapizados":
      return <FoldVertical className={cls} />;
    default:
      return <Box className={cls} />;
  }
};

/* === Componente principal del scroll === */
const ServiciosScroll: React.FC<Props> = ({ servicios, activo, onSelect }) => {
  return (
    <div className="relative w-full overflow-hidden">
      <div
        id="servicios-scroll"
        className="
          flex gap-4 overflow-x-auto overflow-y-hidden
          px-2 pb-3 scroll-smooth snap-x snap-mandatory
          scrollbar-visible
        "
      >
        {servicios.map((s) => {
          const isActive = s.id === activo;
          return (
            <button
              key={s.id}
              onClick={() => onSelect(s.id)}
              className={cn(
                "shrink-0 w-[160px] snap-start rounded-2xl border bg-white shadow-sm px-4 py-3 text-center transition-all hover:shadow-md hover:scale-[1.03]",
                isActive
                  ? "border-wash-primary/60 ring-1 ring-wash-primary/30 scale-105"
                  : "border-gray-200"
              )}
            >
              <div className="flex items-center justify-center mb-2">
                <Icono id={s.id} active={isActive} />
              </div>
              <div className="text-[13px] leading-tight text-gray-700 font-medium">
                {s.titulo}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ServiciosScroll;
