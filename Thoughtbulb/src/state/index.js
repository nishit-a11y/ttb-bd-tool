import { createGlobalState } from "react-hooks-global-state";

const {setGlobalState, useGlobalState} = createGlobalState({
    inperson_location: ""
});

export {setGlobalState, useGlobalState};