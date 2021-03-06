'use strict';

var assert = require('assert');
var fixtures = require('../fixtures');
var sharp = require('../../index');

var defaultConcurrency = sharp.concurrency();

describe('Utilities', function() {

  describe('Cache', function() {
    it('Can be disabled', function() {
      sharp.cache(false);
      var cache = sharp.cache(false);
      assert.strictEqual(cache.memory.current, 0);
      assert.strictEqual(cache.memory.max, 0);
      assert.strictEqual(typeof cache.memory.high, 'number');
      assert.strictEqual(cache.files.current, 0);
      assert.strictEqual(cache.files.max, 0);
      assert.strictEqual(cache.items.current, 0);
      assert.strictEqual(cache.items.max, 0);
    });
    it('Can be enabled with defaults', function() {
      var cache = sharp.cache(true);
      assert.strictEqual(cache.memory.max, 50);
      assert.strictEqual(cache.files.max, 20);
      assert.strictEqual(cache.items.max, 100);
    });
    it('Can be set to zero', function() {
      var cache = sharp.cache({
        memory: 0,
        files: 0,
        items: 0
      });
      assert.strictEqual(cache.memory.max, 0);
      assert.strictEqual(cache.files.max, 0);
      assert.strictEqual(cache.items.max, 0);
    });
    it('Can be set to a maximum of 10MB, 100 files and 1000 items', function() {
      var cache = sharp.cache({
         memory: 10,
         files: 100,
         items: 1000
      });
      assert.strictEqual(cache.memory.max, 10);
      assert.strictEqual(cache.files.max, 100);
      assert.strictEqual(cache.items.max, 1000);
    });
    it('Ignores invalid values', function() {
      sharp.cache(true);
      var cache = sharp.cache('spoons');
      assert.strictEqual(cache.memory.max, 50);
      assert.strictEqual(cache.files.max, 20);
      assert.strictEqual(cache.items.max, 100);
    });
  });

  describe('Concurrency', function() {
    it('Can be set to use 16 threads', function() {
      sharp.concurrency(16);
      assert.strictEqual(16, sharp.concurrency());
    });
    it('Can be reset to default', function() {
      sharp.concurrency(0);
      assert.strictEqual(defaultConcurrency, sharp.concurrency());
    });
    it('Ignores invalid values', function() {
      sharp.concurrency(0);
      sharp.concurrency('spoons');
      assert.strictEqual(defaultConcurrency, sharp.concurrency());
    });
  });

  describe('Counters', function() {
    it('Have zero value at rest', function() {
      var counters = sharp.counters();
      assert.strictEqual(0, counters.queue);
      assert.strictEqual(0, counters.process);
    });
  });

  describe('SIMD', function() {
    it('Can get current state', function() {
      var simd = sharp.simd();
      assert.strictEqual(typeof simd, 'boolean');
    });
    it('Can disable', function() {
      var simd = sharp.simd(false);
      assert.strictEqual(simd, false);
    });
    it('Can attempt to enable', function() {
      var simd = sharp.simd(true);
      assert.strictEqual(typeof simd, 'boolean');
    });
  });

  describe('Format', function() {
    it('Contains expected attributes', function() {
      assert.strictEqual('object', typeof sharp.format);
      Object.keys(sharp.format).forEach(function(format) {
        assert.strictEqual(true, 'id' in sharp.format[format]);
        assert.strictEqual(format, sharp.format[format].id);
        ['input', 'output'].forEach(function(direction) {
          assert.strictEqual(true, direction in sharp.format[format]);
          assert.strictEqual('object', typeof sharp.format[format][direction]);
          assert.strictEqual(3, Object.keys(sharp.format[format][direction]).length);
          assert.strictEqual(true, 'file' in sharp.format[format][direction]);
          assert.strictEqual(true, 'buffer' in sharp.format[format][direction]);
          assert.strictEqual(true, 'stream' in sharp.format[format][direction]);
          assert.strictEqual('boolean', typeof sharp.format[format][direction].file);
          assert.strictEqual('boolean', typeof sharp.format[format][direction].buffer);
          assert.strictEqual('boolean', typeof sharp.format[format][direction].stream);
        });
      });
    });
  });

  describe('Versions', function() {
    it('Contains expected attributes', function() {
      assert.strictEqual('object', typeof sharp.versions);
      assert.strictEqual('string', typeof sharp.versions.vips);
    });
  });

});
