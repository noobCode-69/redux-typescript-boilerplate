import { combineReducers } from "redux";
import repostoriesReducer from "./repositoriesReducer";

const reducers = combineReducers({
  repositories: repostoriesReducer,
});

export default reducers;
export type RootState = ReturnType<typeof reducers>;
