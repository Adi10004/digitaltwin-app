export interface WorkbenchObject {
  id: string;
  type: 'turbine' | 'battery' | 'storage';
  position: { x: number; y: number };
  connections: string[];
}

export interface Connection {
  id: string;
  from: string;
  to: string;
}