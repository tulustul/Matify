import { Injectable } from '@angular/core';

import * as childProcess from 'child_process';
import * as process from 'process';


import { PLUGGINS_DATA } from 'core/plugging';
import { Settings } from 'core/settings.service';

@Injectable()
export class ProxyServerService {

  proxyServerProcess: childProcess.ChildProcess;

  constructor(private settings: Settings) {}

  runProxyServer() {
    let port = this.settings['proxyServerPort'];

    PLUGGINS_DATA.proxyServerParams.push(`--port=${port}`);

    this.proxyServerProcess = childProcess.spawn(
      'proxy_server/server.py', PLUGGINS_DATA.proxyServerParams,
    );

    process.on('exit', () => this.proxyServerProcess.kill());
  }

}
