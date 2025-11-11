export type Row = {
  id: string;         
  name: string;
  email: string;
  age?: number | null;
  role?: string;
  [key: string]: any; 
};

export type Column = {
  key: string;        
  label: string;      
  visible: boolean;
  sortable?: boolean;
};
