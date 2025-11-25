import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  StateVar,
  StyleVar,
  MultiStateVar,
  MultiStyleVar,
  StateVarList,
  StyleVarList,
  queueTransitions,
  setGlobalLookup,
  getGlobalLookup,
} from '../dist/index.js';

class FakeStyle {
  constructor() {
    this.map = new Map();
  }
  setProperty(key, value) {
    this.map.set(key, value);
  }
}

class FakeElement {
  constructor() {
    this.textContent = '';
    this.value = '';
    this.style = new FakeStyle();
  }
}

const makeLookup = (entries) => {
  const map = new Map(entries);
  return (id) => map.get(id) ?? null;
};

test('StateVar updates only when element exists', () => {
  const elem = new FakeElement();
  const lookup = makeLookup([['node', elem]]);
  const state = new StateVar(0, 'node', (el, v) => {
    el.textContent = String(v);
  }, lookup);

  state.transition(5);
  assert.equal(elem.textContent, '5');

  const missingLookup = makeLookup([]);
  const silentState = new StateVar(0, 'missing', (el, v) => {
    el.textContent = String(v);
  }, missingLookup);
  assert.doesNotThrow(() => silentState.transition(1));
});

test('StyleVar and MultiStyleVar apply styles via setProperty', () => {
  const elA = new FakeElement();
  const elB = new FakeElement();
  const lookup = makeLookup([['a', elA], ['b', elB]]);

  const style = new StyleVar('0px', 'a', 'padding', (v) => `${v}px`, lookup);
  style.transition('8');
  assert.equal(elA.style.map.get('padding'), '8px');

  const multi = new MultiStyleVar(0, (v) => `${v}px`, lookup);
  multi.addBinding('a', 'margin');
  multi.addBinding('b', 'padding');
  multi.transition(4);
  assert.equal(elA.style.map.get('margin'), '4px');
  assert.equal(elB.style.map.get('padding'), '4px');

  multi.removeBinding('a');
  multi.transition(5);
  assert.equal(elA.style.map.get('margin'), '4px'); // unchanged after removal
  assert.equal(elB.style.map.get('padding'), '5px');

  multi.clearBindings();
  multi.transition(6);
  assert.equal(elB.style.map.get('padding'), '5px'); // no further updates
});

test('MultiStateVar fans out updates', () => {
  const elA = new FakeElement();
  const elB = new FakeElement();
  const lookup = makeLookup([['a', elA], ['b', elB]]);

  const multi = new MultiStateVar(0, lookup);
  multi.addBinding('a', (el, v) => { el.textContent = String(v); });
  multi.addBinding('b', (el, v) => { el.textContent = String(v * 2); });

  multi.transition(3);
  assert.equal(elA.textContent, '3');
  assert.equal(elB.textContent, '6');

  multi.removeBinding('b');
  multi.transition(4);
  assert.equal(elA.textContent, '4');
  assert.equal(elB.textContent, '6'); // unchanged after removal

  multi.clearBindings();
  multi.transition(5);
  assert.equal(elA.textContent, '4'); // no further updates
});

test('StateVarList and StyleVarList update indexed items', () => {
  const elA = new FakeElement();
  const elB = new FakeElement();
  const lookup = makeLookup([['a', elA], ['b', elB]]);

  const list = new StateVarList(
    [{ id: 'a', state: 0 }, { id: 'b', state: 1 }],
    (el, v) => { el.textContent = String(v); },
    lookup,
  );

  list.transition(1, 7);
  assert.equal(elB.textContent, '7');
  assert.throws(() => list.transition(5, 0), /index out of bounds/);

  const styleList = new StyleVarList(
    [{ id: 'a', state: '0px' }, { id: 'b', state: '0px' }],
    'padding',
    (v) => `${v}px`,
    lookup,
  );
  styleList.listTransition(['2', '3']);
  assert.equal(elA.style.map.get('padding'), '2px');
  assert.equal(elB.style.map.get('padding'), '3px');

  list.removeBinding('a');
  assert.throws(() => list.transition(5, 0), /index out of bounds/);

  styleList.removeBinding('b');
  styleList.clearBindings();
});

test('queueTransitions runs in FIFO order', () => {
  const seq = [];
  queueTransitions([
    () => seq.push(1),
    () => seq.push(2),
    () => seq.push(3),
  ]);
  assert.deepEqual(seq, [1, 2, 3]);
});

test('setGlobalLookup applies to new instances', () => {
  const prev = getGlobalLookup();
  const el = new FakeElement();
  const lookup = makeLookup([['x', el]]);
  setGlobalLookup(lookup);

  const state = new StateVar(0, 'x', (elem, v) => { elem.textContent = String(v); });
  state.transition(9);
  assert.equal(el.textContent, '9');

  setGlobalLookup(prev);
});
