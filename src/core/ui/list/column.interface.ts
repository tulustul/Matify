export interface Column<T> {
  displayName?: string,
  size?: string,
  getter: (item: T) => any,
  sortGetter?: (track: T) => any;
}
