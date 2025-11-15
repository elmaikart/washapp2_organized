"use client";

import React from "react";
import { MapPin, Search, Check, Pencil, Loader2, AlertTriangle, Info } from "lucide-react";

type Props = {
  tipo: "retiro" | "devolucion";
  label: string;
  value: string;
  onChange: (v: string) => void;
  onVerifiedChange?: (ok: boolean) => void; // opcional, por si querés saber si quedó verificada
};

// BBox simple para Córdoba (aprox): [minLon, minLat, maxLon, maxLat]
const CBA_BBOX: [number, number, number, number] = [-64.35, -31.52, -64.05, -31.30];

function insideBBox(lat: number, lon: number, [minLon, minLat, maxLon, maxLat]: typeof CBA_BBOX) {
  return lon >= minLon && lon <= maxLon && lat >= minLat && lat <= maxLat;
}

function extractStreetAndNumber(input: string) {
  const trimmed = input.trim();
  // Busca un número al final o antes de una coma
  const m = trimmed.match(/^(.*?)(?:\s+|,)*(\d{1,6})(?:[^0-9].*)?$/);
  if (m) {
    const street = m[1].replace(/,\s*$/, "").trim();
    const num = m[2];
    return { street, number: num };
  }
  // Sin número
  return { street: trimmed.replace(/,\s*$/, "").trim(), number: "" };
}

type GeoPick = {
  lat: number;
  lon: number;
  label: string;        // “calle 1234, barrio, Córdoba”
  exactHouse: boolean;  // true si Nominatim confirmó house_number
};

export default function DireccionesInput({
  tipo,
  label,
  value,
  onChange,
  onVerifiedChange,
}: Props) {
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [suggestion, setSuggestion] = React.useState<GeoPick | null>(null);
  const [verified, setVerified] = React.useState(false);
  const [approxNote, setApproxNote] = React.useState(false); // true si no se confirmó el número exacto
  const [editing, setEditing] = React.useState(true); // cuando verificás pasa a false

  // si el padre pisa el value manualmente, salimos del estado verificado
  React.useEffect(() => {
    setVerified(false);
    setEditing(true);
    setSuggestion(null);
    setApproxNote(false);
    setError(null);
  }, [tipo]); // cambia “retiro/devolución”

  async function handleSearch() {
    setBusy(true);
    setError(null);
    setSuggestion(null);
    setApproxNote(false);

    try {
      const { street, number } = extractStreetAndNumber(value);
      if (!street) {
        setError("Escribe una calle y número, por favor.");
        setBusy(false);
        return;
      }

      // 1) intento estructurado (prioriza coincidencia exacta con número)
      const url1 = new URL("https://nominatim.openstreetmap.org/search");
      url1.searchParams.set("format", "jsonv2");
      url1.searchParams.set("addressdetails", "1");
      url1.searchParams.set("limit", "5");
      url1.searchParams.set("accept-language", "es");
      url1.searchParams.set("countrycodes", "ar");
      url1.searchParams.set("city", "Córdoba");
      url1.searchParams.set("street", number ? `${street} ${number}` : street);

      const r1 = await fetch(url1.toString(), {
        headers: {
          // Nominatim pide un identificador; desde frontend no podemos setear User-Agent,
          // pero sí un ‘Referer’/‘Accept-Language’. Deja así para MVP.
        },
      });
      const results: any[] = await r1.json();

      if (!Array.isArray(results) || results.length === 0) {
        // 2) fallback: consulta libre
        const url2 = new URL("https://nominatim.openstreetmap.org/search");
        const q = number
          ? `${street} ${number}, Córdoba, Argentina`
          : `${street}, Córdoba, Argentina`;
        url2.searchParams.set("format", "jsonv2");
        url2.searchParams.set("addressdetails", "1");
        url2.searchParams.set("limit", "5");
        url2.searchParams.set("accept-language", "es");
        url2.searchParams.set("q", q);
        const r2 = await fetch(url2.toString());
        const results2: any[] = await r2.json();
        await pickBest(results2, street, number);
      } else {
        await pickBest(results, street, number);
      }
    } catch (e) {
      setError("No se pudo verificar la dirección. Intenta de nuevo.");
    } finally {
      setBusy(false);
    }
  }

  async function pickBest(results: any[], street: string, number: string) {
    // Filtro Córdoba y dentro de bbox
    const within = results
      .map((x) => ({
        ...x,
        lat: Number(x.lat),
        lon: Number(x.lon),
      }))
      .filter(
        (x) =>
          (x.address?.city === "Córdoba" ||
            x.address?.town === "Córdoba" ||
            x.display_name?.toLowerCase().includes("córdoba")) &&
          insideBBox(x.lat, x.lon, CBA_BBOX)
      );

    if (within.length === 0) {
      setError("Dirección fuera del área de cobertura de Córdoba.");
      return;
    }

    // 1) preferimos coincidencia exacta de número
    const exact = within.find(
      (x) =>
        (x.address?.house_number && number && x.address.house_number === number) ||
        x.type === "house"
    );

    let pick = exact ?? within[0];

    // construyo etiqueta normalizada
    const addr = pick.address || {};
    const road = addr.road || addr.pedestrian || addr.footway || addr.residential || street;
    const barrio =
      addr.suburb ||
      addr.neighbourhood ||
      addr.city_district ||
      addr.quarter ||
      "";

    const confirmedNumber = addr.house_number ?? "";
    const useNumber = confirmedNumber || number; // si OSM no trae número, uso el tipeado por el usuario

    const label = `${road}${useNumber ? " " + useNumber : ""}${barrio ? ", " + barrio : ""
      }, Córdoba`;

    setSuggestion({
      lat: pick.lat,
      lon: pick.lon,
      label,
      exactHouse: Boolean(confirmedNumber),
    });

    // marca “aproximado” si no se confirmó número
    setApproxNote(!confirmedNumber && !!number);
  }

  function confirmSuggestion() {
    if (!suggestion) return;
    onChange(suggestion.label);
    setVerified(true);
    setEditing(false);
    setError(null);
    if (onVerifiedChange) onVerifiedChange(true);
  }

  function toggleEdit() {
    setEditing(true);
    setVerified(false);
    setSuggestion(null);
    setApproxNote(false);
    if (onVerifiedChange) onVerifiedChange(false);
  }

  return (
    <div className="mb-3">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        <span className="flex items-center gap-1">
          <MapPin className="w-4 h-4 text-wash-primary" />
          {label}
        </span>
      </label>

      <div className="flex items-center gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={
            tipo === "retiro"
              ? "Ej: Av. Patria 1480"
              : "Ej: Misma u otra dirección (para devolución)"
          }
          className={`w-full border rounded-md px-4 py-2 text-sm outline-none
            ${verified ? "border-green-400 bg-green-50" : "border-gray-300"}
          `}
          disabled={!editing}
        />

        {editing ? (
          <button
            type="button"
            onClick={handleSearch}
            className="p-2 rounded text-gray-500 hover:bg-gray-100 disabled:opacity-50"
            disabled={busy || !value.trim()}
            title="Verificar dirección"
          >
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          </button>
        ) : (
          <button
            type="button"
            onClick={toggleEdit}
            className="p-2 rounded text-gray-500 hover:bg-gray-100"
            title="Editar dirección"
          >
            <Pencil className="w-4 h-4" />
          </button>
        )}

        {!editing && verified && (
          <Check className="w-4 h-4 text-green-600" aria-label="Dirección verificada" />
        )}
      </div>

      {/* Sugerencia única para confirmar */}
      {suggestion && editing && (
        <div className="mt-2 flex items-center justify-between border rounded-md px-3 py-2 bg-white">
          <div className="text-sm font-semibold text-gray-800">{suggestion.label}</div>
          <button
            type="button"
            onClick={confirmSuggestion}
            className="p-1 rounded text-gray-500 hover:text-green-600 hover:bg-green-50"
            title="Confirmar dirección"
          >
            <Check className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Mensajes */}
      {error && (
        <div className="mt-2 flex gap-2 items-start text-amber-700 bg-amber-50 border border-amber-200 rounded px-3 py-2 text-sm">
          <AlertTriangle className="w-4 h-4 mt-[2px]" />
          <span>{error}</span>
        </div>
      )}

      {verified && (
        <div className="mt-2 flex gap-2 items-start text-green-700 bg-green-50 border border-green-200 rounded px-3 py-2 text-sm">
          <Check className="w-4 h-4 mt-[2px]" />
          <span>Dirección verificada correctamente dentro de Córdoba.</span>
        </div>
      )}

      {approxNote && !verified && (
        <div className="mt-2 flex gap-2 items-start text-sky-700 bg-sky-50 border border-sky-200 rounded px-3 py-2 text-sm">
          <Info className="w-4 h-4 mt-[2px]" />
          <span>
            No pudimos confirmar el <strong>número exacto</strong> con el mapa. Usaremos la cuadra
            indicada (<em>tu número se mantiene en la dirección</em>). Podrás ajustar más adelante.
          </span>
        </div>
      )}
    </div>
  );
}
