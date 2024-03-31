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
interface StateBinder<T>{
    // constructor(state_0:T);
    addBinding(id:string, updateFunction:HTMLUpdateFunction<T>):void;
    transition(newState:T):void;
}

interface StyleStateBinder<T>{
    // constructor(state_0:T);
    stateToStyle(state:T):string;
    addBinding(id:string, prop:string):void;
    transition(newState:T):void;
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