import { Injectable } from '@angular/core';

import * as childProcess from 'child_process';
import * as process from 'process';


import { PROXY_SERVER_PARAMS } from 'core/plugging';
import { Settings } from 'core/settings.service';

@Injectable()
export class ProxyServerService {

  proxyServerProcess: childProcess.ChildProcess;

  constructor(private settings: Settings) {}

  runProxyServer() {
    let port = this.settings['proxyServerPort'];

    PROXY_SERVER_PARAMS.push(`--port=${port}`);

    this.proxyServerProcess = childProcess.spawn(
      'proxy_server/server.py', PROXY_SERVER_PARAMS,
    );

    process.on('exit', () => this.proxyServerProcess.kill());
  }

}
