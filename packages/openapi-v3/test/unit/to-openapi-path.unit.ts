// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: @loopback/openapi-v3.
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {expect} from '@loopback/testlab';

import {toOpenApiPath} from '../../src/controller-spec';

describe('toOpenApiPath', () => {
  it('allows /:foo/bar', () => {
    const path = toOpenApiPath('/:foo');
    expect(path).to.eql('/{foo}');
  });

  it('allows /:foo/bar', () => {
    const path = toOpenApiPath('/:foo/bar');
    expect(path).to.eql('/{foo}/bar');
  });

  it('allows /{foo}/bar', () => {
    const path = toOpenApiPath('/{foo}/bar');
    expect(path).to.eql('/{foo}/bar');
  });

  it('allows /{foo}/{bar}', () => {
    const path = toOpenApiPath('/{foo}/{bar}');
    expect(path).to.eql('/{foo}/{bar}');
  });

  it('disallows /:foo+', () => {
    expect(() => toOpenApiPath('/:foo+')).to.throw(
      /Parameter modifier is not allowed/,
    );
  });

  it('disallows /:foo?', () => {
    expect(() => toOpenApiPath('/:foo?')).to.throw(
      /Parameter modifier is not allowed/,
    );
  });

  it('disallows /:foo*', () => {
    expect(() => toOpenApiPath('/:foo*')).to.throw(
      /Parameter modifier is not allowed/,
    );
  });

  it('disallows /:foo(\\d+)', () => {
    expect(() => toOpenApiPath('/:foo(\\d+)')).to.throw(
      /Parameter modifier is not allowed/,
    );
  });

  it('disallows /foo/(.*)', () => {
    expect(() => toOpenApiPath('/foo/(.*)')).to.throw(
      /Unnamed parameter is not allowed/,
    );
  });
});
