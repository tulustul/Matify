export interface ContextMenuItem {
  name: string;
  command: string;
  commandArgs?: any[];
  icon?: string;
};

export interface ContextMenu {
  title?: string;
  items: ContextMenuItem[];
};
