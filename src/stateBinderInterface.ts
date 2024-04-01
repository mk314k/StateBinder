export type HTMLUpdateFunction<T> = (element:HTMLElement, state:T) => void;

//Single State to Single Element
interface SingleStateSingleBinder<T>{
    // new(state_0:T, id:string, updateFunction:HTMLUpdateFunction<T>);
    transition(newState:T):void;
}
interface SingleStyleStateSingleBinder<T>{
    // constructor(state_0:T, id:string, prop:string);
    stateToStyle(state:T):string;
    transition(newState:T):void;
}

//Single State Multiple Element Binding
interface StateBinder<T> {
    /**
     * Adds a binding between an element ID and an update function.
     * @param id The ID of the element.
     * @param updateFunction The update function to be bound.
     */
    addBinding(id: string, updateFunction: HTMLUpdateFunction<T>): void;
    /**
     * Transitions the state to a new state.
     * @param newState The new state.
     */
    transition(newState: T): void;
}

interface StyleStateBinder<T> {
    /**
     * Converts the state to a CSS style string.
     * @param state The state to be converted.
     * @returns A CSS style string representing the state.
     */
    stateToStyle(state: T): string;
    /**
     * Adds a binding between an element ID and a style property.
     * @param id The ID of the element.
     * @param prop The name of the style property.
     */
    addBinding(id: string, prop: string): void;
    /**
     * Transitions the state to a new state.
     * @param newState The new state.
     */
    transition(newState: T): void;
}

//Multiple State - Element Single update method 
interface StateBinderList<T>{
    // constructor(state_0:T|T[], id:string|string[], updateFunction:HTMLUpdateFunction<T>);
    addBinding(id:string, state_0:T):void;
    transition(index:number, newState:T):void;
    listTransition(newState:T[]):void;
}
interface StateBinderMap<K, T>{
    // constructor(state_0:T|T[], key:K|K[], updateFunction:HTMLUpdateFunction<T>);
    keyToId(key:K):string;
    addBinding(key:K, state_0:T):void;
    transition(key:K, newState:T):void;
    listTransition(newState:T[]):void;
}

interface StyleStateBinderList<T>{
    // constructor(state_0:T|T[], id:string|string[], prop:string);
    stateToStyle(state:T):string;
    addBinding(id:string, state_0:T):void;
    transition(index:number, newState:T):void;
    listTransition(newState:T[]):void;
}

interface StyleStateBinderMap<K, T>{
    // constructor(state_0:T|T[], key:K|K[], prop:string);
    keyToId(key:K):string;
    stateToStyle(state:T):string;
    addBinding(key:K, state_0:T):void;
    transition(key:K, newState:T):void;
    listTransition(newState:T[]):void;
}


//Multiple State - Element Multiple update method 
interface MultipleStateMultipleBinderList<T>{
    // constructor(state_0:T|T[]);
    addBinding(index:number, id:string, updateFunction:HTMLUpdateFunction<T>):void;
    addListBinding(id:string[], updateFunction:HTMLUpdateFunction<T>):void;
    transition(index:number, newState:T):void;
    listTransition(newState:T[]):void;
}