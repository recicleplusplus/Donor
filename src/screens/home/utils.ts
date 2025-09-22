import { Colors, Theme } from "../../constants/setting";
import { Statistic } from "../../firebase/instances/statistic";

interface BarData {
  height: number;
  value: number;
  color: string;
  label: string;
}

const MATERIAL_MAPPING = [
  { key: 'plasticKg', label: 'Plástico' },
  { key: 'metalKg', label: 'Metal' },
  { key: 'eletronicKg', label: 'Eletrônico' },
  { key: 'paperKg', label: 'Papel' },
  { key: 'oilKg', label: 'Óleo' },
  { key: 'glassKg', label: 'Vidro' },
];

export function buildBarGraphicData(statistics: any): BarData[] {
  // Extrai todos os valores e encontra o máximo
  const values = MATERIAL_MAPPING.map(material => statistics[material.key] as number);
  const maxValue = Math.max(...values);

  // Se todos os valores são zero, evita divisão por zero
  if (maxValue === 0) {
    return MATERIAL_MAPPING.map(material => ({
      height: 0,
      value: 0,
      color: Colors[Theme][2],
      label: material.label,
    }));
  }

  // Gera os dados normalizados
  return MATERIAL_MAPPING.map(material => {
    const value = statistics[material.key] as number;
    return {
      height: (value / maxValue) * 100,
      value,
      color: Colors[Theme][2],
      label: material.label,
    };
  });
}