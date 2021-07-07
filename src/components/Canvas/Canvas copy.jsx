import React, { useRef, useEffect, useState } from 'react'
import style from './Canvas.module.css'
import { connect } from 'react-redux'
import _, { map } from 'underscore'
import _, { map } from 'underscore'
import { pushToRedo, pushToUndo, indexEdit } from '../../store/canvasReducer'



const Canvas = (props) => {

   const canvasRef = useRef(null)
   const contextRef = useRef(null)
   const [temporarilyCanvas, setTemporarilyCanvas] = useState('')
   const [localItems, setLocalItems] = React.useState(
      JSON.parse(localStorage.getItem('canvas')) || ''
   )
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
      if (localItems.length) {
         localItems.map(list => {
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
   }, [props.color, localItems])

   const startDrawing = ({ nativeEvent }) => {
      contextRef.current.beginPath()
      const { offsetX, offsetY } = nativeEvent
      contextRef.current.moveTo(offsetX, offsetY)
      setIsDrawing(true)
   }

   const finishDrawing = () => {
      setLocalItems((localItems) => [...localItems, temporarilyCanvas])
      localStorage.setItem('canvas', JSON.stringify(localItems))
      setTemporarilyCanvas('')
      contextRef.current.closePath()
      setIsDrawing(false)
   }


   const draw = ({ nativeEvent }) => {
      if (!isDrawing) {
         return
      }
      const { offsetX, offsetY } = nativeEvent
      setTemporarilyCanvas([...temporarilyCanvas, [offsetX, offsetY]])
      contextRef.current.lineTo(offsetX, offsetY)
      contextRef.current.stroke()
   }


   return <div className={style.canvas}>
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