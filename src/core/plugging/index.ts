import { Visualization } from 'core/ui/visualization';

export interface MenuItem {
  icon: string;
  name: string;
  component: Function;
}

export interface IPluginData {
  modules?: any[];
  menuItems?: MenuItem[];
  barComponents?: any[];
  trackStores?: any[];
  proxyServerParams?: string[];
  visualizations?: Visualization[];
}

export interface IPlugin extends IPluginData {
  name?: string;
}

export const PLUGGINS_DATA: IPluginData = {
  modules: [],
  menuItems: [],
  barComponents: [],
  trackStores: [],
  proxyServerParams: [],
  visualizations: [],
};

export const PLUGINS: IPlugin[] = [];

export function Plugin(pluginDef: IPlugin = {}) {
  return function(ngModule: Function) {
    pluginDef.modules = [ngModule];
    PLUGINS.push(pluginDef);
    for (let key of Object.keys(PLUGGINS_DATA)) {
      if (pluginDef[key]) {
        PLUGGINS_DATA[key] = PLUGGINS_DATA[key].concat(pluginDef[key]);
      }
    }
  };
}
