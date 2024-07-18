const React = (() => {
  let hooks = []; // this array gives the rules of hooks, they must run in the same order every render
  let hooksIndex = 0;

  function useState(initVal) {
    let state = hooks[hooksIndex] || initVal;
    let _index = hooksIndex;

    let setState = (newVal) => {
      hooks[_index] = newVal;
    };

    hooksIndex++;

    return [state, setState];
  }

  // emulate the useEffect hook
  function useEffect(callback, dependencyArray) {
    let dependencyArrayChanged = true;
    let _index = hooksIndex;
    const previousDependencyState = hooks[_index]; //lookup the previous state of dependency array for hook

    // detect if old state does not match new state for this hook
    //  we should call the callback everytime dependency array state changes
    if (previousDependencyState) {
      dependencyArrayChanged = dependencyArray.some((dep, i) => !Object.is(dep, previousDependencyState[i]));
    }

    if (dependencyArrayChanged) {
      callback();
    }
    // save the new state of the dependency array to detect change on next render
    hooks[_index] = dependencyArray;
    hooksIndex++;
  }

  function render(Component) {
    hooksIndex = 0;
    const comp = Component();
    comp.render();
    return comp;
  }

  return { useState, useEffect, render };
})();

function Component() {
  const [count, setCount] = React.useState(1);
  const [text, setText] = React.useState('2nd useState hook in component');

  React.useEffect(() => {
    console.log('useEffect hook for count change');
  }, [count]);

  React.useEffect(() => {
    console.log('useEffect hook for text change');
  }, [text]);

  return {
    render: () => {
      console.log({ count, text });
    },
    click: () => {
      setCount(count + 1);
    },
    type: (newText) => {
      setText(newText);
    },
  };
}

let comp = React.render(Component);
comp.click();
comp = React.render(Component);
comp.type('User typed new text');
comp = React.render(Component);
