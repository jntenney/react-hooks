// inspired by @swyx to demonstrate how React hooks work
//
// define React variable as an arrow function that is immediately invoked when the variable is evaluated by JS
const React = (() => {
  // this array gives the rules of React hooks
  //  because hooks store state in the array they must always run & in the same order on every render
  //  ie, hooks can't be in conditional statements, etc
  let hooks = [];
  // this index keeps track of the index into hooks array for each hook
  //  each hook must advance the hooks index so the next hook to execute uses the correct index for its own hook state
  let hooksIndex = 0;

  //simulate useState hook
  function useState(initVal) {
    // each hook should capture the hooks array and hooksIndex for closure
    //  closure is how each hook function maintains the state across multiple renders of
    //  a Component
    let state = hooks[hooksIndex] || initVal;
    let _index = hooksIndex;

    let setState = (newVal) => {
      hooks[_index] = newVal;
    };

    hooksIndex++;

    return [state, setState];
  }

  // simulate the useEffect hook
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

  // return the useState, useEffect and render methods
  return { useState, useEffect, render };
})(); //() immediately invoke the function when the React variable is evaluated

function Component() {
  const [count, setCount] = React.useState(0); // hook 'count' state
  const [text, setText] = React.useState('User initial text'); // hook 'text' state

  //  Uncomment lines below to see how useEffect works
  // React.useEffect(() => {
  //   console.log('useEffect hook for count change');
  // }, [count]); // dependency on 'count' state, fire every time 'count' changes

  // React.useEffect(() => {
  //   console.log('useEffect hook for text change');
  // }, [text]); // dependency on 'text' state, fire every time 'text' changes

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

// simulate React component render life cycle and component events that occur
let comp = React.render(Component); // {count: 0, text: 'User inital text' }
comp.click();
comp = React.render(Component); // {count: 1, text: 'User inital text' }
comp.type('User typed new text');
comp = React.render(Component); // {count: 1, text: 'User typed new text' }
comp.click();
comp = React.render(Component); // {count: 2, text: 'User typed new text' }
comp.type('User typed more new text');
comp = React.render(Component); // {count: 2, text: 'User typed more new text' }
