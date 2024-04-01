# StateBinder

StateBinder is a library for binding state variables to HTMLElements, making them reactive by directly and efficiently updating targeted properties in the DOM.

## Installation

You can install StateBinder via npm:

```bash
npm install statebinderk
```

## Usage

### Basic Usage

Here's a basic example demonstrating how to use StateBinder:

```typescript
import { StateVar } from 'statebinderk';

// Define an update function
const updateFunction = (element: HTMLElement, state: number) => {
    element.textContent = `State: ${state}`;
};

// Create a state variable bound to an HTMLElement and an update function
const stateVar = new StateVar<number>(0, 'myElement', updateFunction);

// Transition the state
stateVar.transition(42);
```

### Advanced Usage

StateBinder provides advanced features for managing state and style bindings:

- MultiStateVar: A multi-state variable that can bind multiple update functions to different HTMLElements.
- MultiStyleVar: A multi-style variable that can bind multiple style properties to different HTMLElements.
- StateVarList: A list of state variables with methods for batch transitions and updates.
- StyleVarList: A list of style variables with methods for batch transitions and updates.

```typescript
import { MultiStateVar, MultiStyleVar, StateVarList, StyleVarList } from 'statebinderk';

// Usage examples for advanced features...
```

## Contributing

Contributions to StateBinder are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request on GitHub.

## License

StateBinder is licensed under the [MIT License](LICENSE).
