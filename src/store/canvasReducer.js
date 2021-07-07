const COLOR = 'COLOR'
const UNDO = 'UNDO'
const REDO = 'REDO'
const INDEX = 'INDEX'

export const setColor = (color) => ({ type: COLOR, color })
export const pushToUndo = (data) => ({ type: UNDO, data })
export const pushToRedo = (data) => ({ type: REDO, data })
export const indexEdit = () => ({ type: INDEX})

let initialState = {
   color: 'white',
   undoList: [],
   redoList: [],
   index: -1
}

const canvasReducer = (state = initialState, action) => {
   switch (action.type) {
      case COLOR: {
         return {
             ...state,
             color: action.color
         }
     }
      case UNDO: {
         return {
             ...state,
             undoList: [...state.undoList, action.data]
         }
     }
      case REDO: {
         return {
             ...state,
             redoList: [...state.redoList, action.data]
         }
     }
      case INDEX: {
         return {
             ...state,
             index: state.index + 1
         }
     }
       default:
           return state;
   }
}

export default canvasReducer;