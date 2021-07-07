import React, { useRef, useEffect, useState } from 'react'
import style from './Canvas.module.css'
import { connect } from 'react-redux'
import _ from 'underscore'
import ToolBar from './ToolBar'
import { pushToRedo, pushToUndo, indexEdit } from '../../store/canvasReducer'



const Canvas = (props) => {

   const canvasRef = useRef(null)
   const contextRef = useRef(null)
   const [temporarilyCanvas, setTemporarilyCanvas] = useState('')
   const [lineItems, setlineItems] = React.useState(
      JSON.parse(localStorage.getItem('canvas')) || ''
   )
   const [theCurrent, setTheCurrent] = useState([...lineItems])
   const [isDrawing, setIsDrawing] = useState(false)
   const [color, setColor] = useState(props.color)



   useEffect(() => {
      const canvas = canvasRef.current
      canvas.width = window.innerWidth * 2
      canvas.height = window.innerHeight * 2
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`


      const context = canvas.getContext('2d')
      context.scale(2, 2)
      context.lineCap = 'round'
      context.strokeStyle = `${props.color}`
      context.lineWidth = 5
      contextRef.current = context


      setColor(props.color)
         if (lineItems.length) {
            lineItems.map(list => {
               list.map(item => {
                  if (_.isEqual(list[0], item)) {
                     contextRef.current.beginPath()
                     contextRef.current.moveTo(item[0], item[1])
                  }
                  else if (_.isEqual(list[item.length - 1], item)) {
                     contextRef.current.lineTo(item[0], item[1])
                     contextRef.current.closePath()
                  }
                  else {
                     contextRef.current.lineTo(item[0], item[1])
                     contextRef.current.stroke()
                  }

               })
            })
         }
      
         if (temporarilyCanvas.length) {
            temporarilyCanvas.map(item => {
               if (_.isEqual(temporarilyCanvas[0], item)) {
                  contextRef.current.beginPath()
                  contextRef.current.moveTo(item[0], item[1])
               }
               else if (_.isEqual(temporarilyCanvas[item.length - 1], item)) {
                  contextRef.current.lineTo(item[0], item[1])
                  contextRef.current.closePath()
               }
               else {
                  contextRef.current.lineTo(item[0], item[1])
                  contextRef.current.stroke()
               }
            })
         }
      
   }, [props.color, lineItems, temporarilyCanvas])

const startDrawing = () => {
   setIsDrawing(true)
}

const finishDrawing = () => {
   localStorage.setItem('canvas', JSON.stringify(lineItems))
   if (temporarilyCanvas !== '') {
      setlineItems([...lineItems, temporarilyCanvas])
      setTheCurrent([...lineItems, temporarilyCanvas])
   }
   setTemporarilyCanvas('')
   setIsDrawing(false)
}


const draw = ({ nativeEvent }) => {
   if (!isDrawing) {
      return
   }
   const { offsetX, offsetY } = nativeEvent
   setTemporarilyCanvas([...temporarilyCanvas, [offsetX, offsetY]])
}

const undo = () => {
   if (lineItems.length){
      let deleteItem = lineItems
      deleteItem.length--
         setlineItems([...deleteItem])
   }
}

const redo = () => {
   if (lineItems.length <  theCurrent.length){
   let redoItem = [...lineItems]
   redoItem.push(theCurrent[lineItems.length])
      setlineItems([...redoItem])
   }
}


return <div className={style.canvas}>
   <ToolBar undo={undo} redo={redo}/>
   <canvas
      onMouseDown={startDrawing}
      onMouseUp={finishDrawing}
      onMouseMove={draw}
      ref={canvasRef} />
</div>
}

const mapStateToProps = (state) => ({
   color: state.canvas.color,
   undoList: state.canvas.undoList,
   index: state.canvas.index
})

export default connect(mapStateToProps, { pushToRedo, pushToUndo, indexEdit })(Canvas)