import React from 'react'
import style from './Wrapper.module.css'
import {v4 as uuidv4} from 'uuid'
import {randomColor} from 'randomcolor'
import Draggable from 'react-draggable'
import { UPDATE_OPERATORS } from '@babel/types'

const Wrapper = (props) => {

   const [item, setItem] = React.useState('')
   const [localItems, setLocalItems] = React.useState(
      JSON.parse(localStorage.getItem('elements')) || []
   )

   React.useEffect( () => {
localStorage.setItem('elements', JSON.stringify(localItems))
   }, [localItems])

   const onItemSubmit = () => {
      if (item.trim() !== '') {
         const newItem = {
            id: uuidv4(),
            item,
            color: randomColor({
               luminosity: 'linght'
            }),
            defaultPos: {
               x: 0,
               y: 500
            }
         }
         setLocalItems((localItems) => [...localItems, newItem])
         setItem('')
      }
      else {
         alert('Enter somethimg...')
         setItem('')
      }
   }

   const deleteNode = (id) => {
       const newArr = [...localItems].filter(item => item.id !== id)
       setLocalItems(newArr)
   }
   
const updatePos = (data, index) => {
   let newArray = [...localItems]
newArray[index].defaultPos = {x:data.x, y: data.y}
setLocalItems(newArray)
}

const keyPress = (e) => {
   const code = e.keyCode || e.which
   if (code === 13) {
      onItemSubmit()
   }
}

   const list = localItems.map((item, index) => {
      return <Draggable
      key={index}
      defaultPosition={item.defaultPos}
      onStop={(_, data) => {
         updatePos(data, index) 
      }}
      >
         <div style={{backgroundColor: item.color}} className={style.todoItem}>
{`${item.item}`}
<button className={style.delete}
  onClick={() => deleteNode(item.id)}>X</button>
         </div>
      </Draggable>
   })

   return <div className={style.wrapper}>
    <div>
<input 
value={item}
type='text'
placeholder='Enter something...' 
onChange={(e) => setItem(e.target.value)}
onKeyPress={e => keyPress(e)}
/>
<button onClick={onItemSubmit}>Enter</button>
   </div>
   {list}
   </div>
} 

export default Wrapper