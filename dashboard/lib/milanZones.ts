// Zone di Milano per il routing intelligente
export const MILAN_ZONES = [
  // Centro
  { id: 'centro', name: 'Centro', color: '#FF6B6B' },
  { id: 'duomo', name: 'Duomo', color: '#FF6B6B' },
  { id: 'brera', name: 'Brera', color: '#FF6B6B' },
  
  // Zona Est
  { id: 'porta-venezia', name: 'Porta Venezia', color: '#4ECDC4' },
  { id: 'lambrate', name: 'Lambrate', color: '#4ECDC4' },
  { id: 'citta-studi', name: 'Città Studi', color: '#4ECDC4' },
  
  // Zona Sud
  { id: 'porta-romana', name: 'Porta Romana', color: '#95E1D3' },
  { id: 'navigli', name: 'Navigli', color: '#95E1D3' },
  { id: 'ticinese', name: 'Ticinese', color: '#95E1D3' },
  
  // Zona Nord
  { id: 'isola', name: 'Isola', color: '#FFA07A' },
  { id: 'garibaldi', name: 'Garibaldi', color: '#FFA07A' },
  { id: 'bicocca', name: 'Bicocca', color: '#FFA07A' },
  
  // Zona Ovest
  { id: 'san-siro', name: 'San Siro', color: '#DDA15E' },
  { id: 'fiera', name: 'Fiera', color: '#DDA15E' },
  { id: 'portello', name: 'Portello', color: '#DDA15E' },
  
  // Semicentro
  { id: 'loreto', name: 'Loreto', color: '#BC6C25' },
  { id: 'buenos-aires', name: 'Buenos Aires', color: '#BC6C25' },
  { id: 'stazione-centrale', name: 'Stazione Centrale', color: '#BC6C25' },
];

export function matchZone(zoneText: string): string | null {
  if (!zoneText) return null;
  
  const normalizedText = zoneText.toLowerCase().trim();
  
  // Try exact match first
  const exactMatch = MILAN_ZONES.find(z => 
    z.name.toLowerCase() === normalizedText ||
    z.id === normalizedText
  );
  
  if (exactMatch) return exactMatch.id;
  
  // Try partial match
  const partialMatch = MILAN_ZONES.find(z => 
    normalizedText.includes(z.name.toLowerCase()) ||
    z.name.toLowerCase().includes(normalizedText)
  );
  
  return partialMatch?.id || null;
}

export function getZoneName(zoneId: string): string {
  const zone = MILAN_ZONES.find(z => z.id === zoneId);
  return zone?.name || zoneId;
}

