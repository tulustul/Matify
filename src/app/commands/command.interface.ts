export interface ICommand {
    name?: string,
    displayName?: string,
    func?: Function,
    isVisibleInPallete?: boolean,
}
