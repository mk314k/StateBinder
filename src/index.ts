// import HTMLUpdateFunction from './stateBinderInterface.ts';
export type HTMLUpdateFunction<T> = (element:HTMLElement, state?:T) => void;

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

export class globalVar<T> implements StateBinder<T>{
    private state:T
    private bindings:Map<string, HTMLUpdateFunction<T>> = new Map()
    constructor(state_0:T){
      this.state = state_0;
    }
    public transition(nextState:T){
      this.state = nextState;
      this.bindings.forEach((funct, id)=>{
        const elem = document.getElementById(id);
        if (elem){
          funct(elem, this.state);
        }
      })
    }
    public current(){
      return this.state;
    }
    public addBinding(id:string, updateFunct:HTMLUpdateFunction<T>){
      this.bindings.set(id, updateFunct);
    }
}

export class globalStyleVar<T> implements StyleStateBinder<T>{
    private state:T
    private bindings:Map<string, string> = new Map()
    public stateToStyle = (state:T)=>{return `${state}`}
    constructor(state_0:T, state2style?){
      this.state = state_0;
      if(state2style){
        this.stateToStyle = state2style;
      }
    }
    public transition(nextState:T){
      this.state = nextState;
      this.bindings.forEach((prop, id)=>{
        const elem = document.getElementById(id);
        if (elem){
            elem.style[prop] = this.stateToStyle(this.state);
        }
      })
    }
    public current(){
      return this.state;
    }
    public addBinding(id:string, prop:string){
      this.bindings.set(id, prop);
    }

}