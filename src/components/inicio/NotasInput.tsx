import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PenLine } from "lucide-react";

interface Props {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function NotasInput({ value, onChange }: Props) {
    return (
        <div className="flex flex-col gap-1 mt-2">
            <Label className="text-sm font-medium text-gray-600">
                Notas Adicionales
            </Label>
            <div className="relative">
                <PenLine className="absolute left-3 top-2.5 text-wash-primary w-4 h-4" />
                <Input
                    type="text"
                    placeholder="Instrucciones extra, datos del timbre, piso o preferencias..."
                    value={value}
                    onChange={onChange}
                    className="pl-9"
                />
            </div>
        </div>
    );
}
