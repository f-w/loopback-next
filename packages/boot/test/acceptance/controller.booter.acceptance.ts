// Copyright IBM Corp. 2013,2018. All Rights Reserved.
// Node module: @loopback/boot
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {
  createRestAppClient,
  givenHttpServerConfig,
  TestSandbox,
  expect,
} from '@loopback/testlab';
import {resolve} from 'path';
import {BooterApp} from '../fixtures/application';
import {CoreBindings} from '@loopback/core';

describe('controller booter acceptance tests', () => {
  let app: BooterApp;
  const SANDBOX_PATH = resolve(__dirname, '../../.sandbox');
  const sandbox = new TestSandbox(SANDBOX_PATH);

  beforeEach('reset sandbox', () => sandbox.reset());
  beforeEach(getApp);

  afterEach(stopApp);

  it('binds package.json', async () => {
    const pkg = await app.get(CoreBindings.APPLICATION_PACKAGE_JSON);
    expect(pkg).containEql({
      name: 'boot-test-app',
      version: '1.0.0',
      description: 'boot-test-app',
    });
  });

  it('binds controllers using ControllerDefaults and REST endpoints work', async () => {
    await app.boot();
    await app.start();

    const client = createRestAppClient(app);

    // Default Controllers = /controllers with .controller.js ending (nested = true);
    await client.get('/one').expect(200, 'ControllerOne.one()');
    await client.get('/two').expect(200, 'ControllerTwo.two()');
  });

  async function getApp() {
    await sandbox.copyFile(resolve(__dirname, '../fixtures/package.json'));
    await sandbox.copyFile(resolve(__dirname, '../fixtures/application.js'));
    await sandbox.copyFile(
      resolve(__dirname, '../fixtures/multiple.artifact.js'),
      'controllers/multiple.controller.js',
    );

    const MyApp = require(resolve(SANDBOX_PATH, 'application.js')).BooterApp;
    app = new MyApp({
      rest: givenHttpServerConfig(),
    });
  }

  async function stopApp() {
    try {
      await app.stop();
    } catch (err) {
      console.log(`Stopping the app threw an error: ${err}`);
    }
  }
});
