export interface Column {
  displayName?: string,
  size?: string,
  getter: (item: any) => any,
}
