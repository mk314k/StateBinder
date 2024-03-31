// import {HTMLUpdateFunction} from './stateBinderInterface.ts';
export type styleFunction<T> = (state:T) => string;
export type HTMLUpdateFunction<T> = (element:HTMLElement, state:T) => void;

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

class baseVar<T>{
    private state:T
    constructor(state_0:T){
      this.state = state_0;
    }
    public transition(nextState:T){
        this.state = nextState;
    }
    public current(){
      return this.state;
    }
}

export class StateVar<T> extends baseVar<T>{
    constructor (
        state_0:T, 
        public readonly id:string, 
        public readonly funct:HTMLUpdateFunction<T>
    ){
        super(state_0);
    }
    public override transition(nextState:T){
        super.transition(nextState);
        const elem = document.getElementById(this.id);
        if (elem){
            this.funct(elem, this.current());
        }
    }
}
export class StyleVar<T> extends baseVar<T>{
    public stateToStyle = (state:T)=>{return `${state}`}
    constructor(
        state_0:T, 
        public readonly id:string, 
        public readonly prop:string,
        state2style?:styleFunction<T>
    ){
      super(state_0);
      if(state2style){
        this.stateToStyle = state2style;
      }
    }
    public override transition(nextState:T){
        super.transition(nextState);
        const elem = document.getElementById(this.id);
        if (elem){
            (elem.style as any)[this.prop] = this.stateToStyle(this.current());
        }
    }
}

export class MultiStateVar<T> extends baseVar<T> implements StateBinder<T>{
    private bindings:Map<string, HTMLUpdateFunction<T>> = new Map()
    public override transition(nextState:T){
      super.transition(nextState);
      this.bindings.forEach((funct, id)=>{
        const elem = document.getElementById(id);
        if (elem){
          funct(elem, nextState);
        }
      })
    }
    public addBinding(id:string, updateFunct:HTMLUpdateFunction<T>){
      this.bindings.set(id, updateFunct);
    }
}

export class MultiStyleVar<T> extends baseVar<T> implements StyleStateBinder<T>{
    private bindings:Map<string, string> = new Map()
    public stateToStyle = (state:T)=>{return `${state}`}
    constructor(state_0:T, state2style?:styleFunction<T>){
      super(state_0);
      if(state2style){
        this.stateToStyle = state2style;
      }
    }
    public override transition(nextState:T){
        super.transition(nextState);
        this.bindings.forEach((prop, id)=>{
            const elem = document.getElementById(id);
            if (elem){
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (elem.style as any)[prop] = this.stateToStyle(this.current());
            }
        })
    }
    public addBinding(id:string, prop:string){
      this.bindings.set(id, prop);
    }

}

export class StateVarList<T>{
    private ids:string[] = [];
    private states:T[] = [];
    constructor(
        id_states:{id:string, state:T}[],
        public readonly funct:HTMLUpdateFunction<T>,
    ){
        id_states.map(
            (id_state) =>{
                this.addBinding(id_state.id, id_state.state);
            }
        )
    }
    public transition(index:number, nextState:T){
        if (index >=0 && index<this.ids.length){
            this.states[index] = nextState;
            const elem = document.getElementById(this.ids[index]??'');
            if(elem){
                this.funct(elem, nextState);
            }
        }else{
            throw Error('index out of bounds')
        }
    }
    public listTransition(nextState:T[]){
        if (nextState.length === this.states.length){
            nextState.map((state, index)=>{
                this.transition(index, state);
            })
        }else{
            throw Error('states does not match the length, use transition method instead');
        }
    }
    public addBinding(id:string, state_0:T){
        this.ids.push(id);
        this.states.push(state_0);
    }
}

export class StyleVarList<T> extends StateVarList<T>{
    public stateToStyle = (state:T)=>{return `${state}`}
    constructor(
        id_states:{id:string, state:T}[],
        prop:string,
        state2style?:styleFunction<T>
    ){
        const funct = (elem:HTMLElement, state:T) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (elem.style as any)[prop] = this.stateToStyle(state);
        }
        super(id_states, funct);
        if(state2style){
            this.stateToStyle = state2style;
        }
    }
}