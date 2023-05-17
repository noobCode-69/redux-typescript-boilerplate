# 🤮 Redux + Typescript

# Let’s Talk about Redux.

1. Redux Store is where all you data i.e state resides.
2. Inside Redux Store is you Reducers , each reducer handle a bunch of states. i.e each reducer handle one or more states
3. For each action we define type for that action. In single file define the type of all the actions. Here you can see , I have 4 actions (will have to add more) , and we are giving each of them a type. Don’t confuse,   it’s not the ts definition of Actions. It’s the type of Action or you can just say  a specific “id” of a Action . **“**Each action have two properties : type and payload**”**
    
    ```jsx
    export enum ActionTypes {
      MOVE_CELL = "move_cell",
      DELETE_CELL = "delete_cell",
      INSERT_CELL_BEFORE = "insert_cell_before",
      UPDATE_CELL = "update_cell",
    }
    ```
    
4. Now talk about Action
    1. As I said , action is just a plain object , that defines and event or intention to change the state of an application.
    
    ```jsx
    // This is a Action, As earlier mentioned Action have two properties
    // 1) type
    // 2) payload
    export interface DeleteCellAction {
      type: ActionType.DELETE_CELL;
      payload: string;
    }
    
    ```
    
    2. What we do is define multiple Action and combine all these in one Action Type (this type is the typescript type) , we later use this in reducer. This step is just for typescript purpose
    
    ```jsx
    // Multiple Action combines in a single type
    export type Action =
      | MoveCellAction
      | DeleteCellAction
      | InsertCellBeforeAction
      | UpdateCellAction;
    ```
    
5. Now let’s talk about Reducers
    1. Reducer is a function , that is responsible for changing a state, remember Action is willingness to change a state , but reducer is actually responsible for changing the state
    2. It’s just a function , that receive two arguments
        1. The first is a object of all the state, this reducer is responsible for. Remember each reducer handle one or multiple state
        2. The second is the action 
    
    ```jsx
    const reducer = (
      state: CellsState = initialState,
      action: Action
    ): CellsState => {
      return state;
    };
    
    // This is what the reducer look like
    // 1) state is all the state it handles , CellsState is the type
    // 2) action is the action which is trigerring this function . The type for 
    // this can be any of all the Actions. Remember we have made this above
    ```
    
6. The next step after creating all of these is the combine all the reducers 
    
    ```jsx
    import { combineReducers } from "redux";
    import cellsReducer from "./cellReducer";
    
    const reducers = combineReducers({
    	// here we are assigning that all the states that are
      // handled by the cellReducer to be call as cells
      cells: cellsReducer,
    });
    
    export default reducers;
    // this reducers object will be later used to setup our store.
    ```
    
7. Set-up the store
    
    ```jsx
    import { createStore, applyMiddleware } from "redux";
    import thunk from "redux-thunk";
    import reducers from "./reducers";
    export const store = createStore(reducers, {}, applyMiddleware(thunk));
    
    // Now we can dispatch the reducers directly (not recommended thought) from 
    // store like this.
    store.dispatch()
    ```
    
8. Wrap your root component with Provider
    
    ```jsx
    import { Provider } from "react-redux";
    import { store } from "./state";
    function App() {
      return (
        <Provider store={store}>
          <div>
            <TextEditor />
          </div>
        </Provider>
      );
    } 
    ```
    

1. Action Creator ⇒ It’s a function (that interact with you component) that return an Action (remember Action is just a javascript file)
    
    ```jsx
    export const updateCell = (id: string, content: string): UpdateCellAction => {
      return {
        type: ActionType.UPDATE_CELL,
        payload: {
          id,
          content,
        },
      };
    };
    ```
    
2. While working with reducers , you have to write very ugly code with all the spread logic , But not anymore . Enter immerjs
    
    ```jsx
    // Without Immer
    const { id, content } = action.payload;
    return {
    	...state,
    	data : {
    		...state.data,
    		[id] : {
    			...state.data[id],
    			content : content;
    		}
    	}
    }
    // With Immer
    const { id, content } = action.payload;
    state.data[id].content = content;
    ```
    
3. This is more or less all the files that you are going to setup the redux. Now you should know how to use it.

# Now to the React Part….

1. useSelector : It’s is used to get the data from redux store and make it available to the React component

```jsx
import { useSelector } from 'react-redux';
const selectData = (state) => state.data; 
const selectedData = useSelector(selectData);
// useSelector take a function as input and return the desired state
// desired state means the state that we want 
// state : Here the state is the whole state of the redux store , but we don't 
//         need all the state , so we filter it by key we have defined during 
//         initializing out redux store.
```

1. Some problems about useSelector : useSelector is good , but can it be better, right now useSelector doesn’t support any typescript feature so we make our own hook just so that we get typescript support .

```jsx
import { useSelector, TypedUseSelectorHook } from "react-redux";
import { RootState } from "../state";
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
// now we are going to use this hook instated of useSelector hook
```

1. Here is now we are going to use it

```jsx
// we extract what we need
const cellListState = useTypedSelector(({ cells: { order, data } }) => {
    return order.map((id) => {
      return data[id];
    });
  });

```

1. useDispatch : It’s used to make changes to our redux store.

```jsx
// One way you can work with useDispatch is like this
const dispatch = useDispatch()
// it return a function , you can then use these function to dispatch actions
dispatch(actionCreator.updateCell(args))
// inside dispatch you pass the action creator
// but it's too ugly , so we can do better
```

```jsx
import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";

import { actionCreators } from "../state";
// actionCreators is all my action creator function
export const useActions = () => {
  const dispatch = useDispatch();
  return bindActionCreators(actionCreators, dispatch);
};

// now we can use it as not hook
```

```jsx
const {udpdateCell} = useActions();
updateCell(args)
```
