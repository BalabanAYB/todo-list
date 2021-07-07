import React from 'react'
import style from './ToolBar.module.css'
import Wrapper from '../Wrapper/Wrapper'
import {connect} from 'react-redux'
import {setColor} from '../../store/canvasReducer'



const ToolBar = (props) => {

   return <div className={style.toolBar}>
      <div>
<button className={`${style.toolBarBtn} ${style.brush}`}/>
<input className={style.colorBtn} type="color" 
onChange={(e) => props.setColor(e.target.value)}
/>
</div>
<Wrapper/>
<div className={style.buttonEdit}>
   <button onClick={props.undo}></button>
   <button onClick={props.redo}></button>
</div>
   </div>
}

const mapStateToProps = (state) => ({
   color: state.canvas.color
})

export default connect(mapStateToProps, {setColor})(ToolBar)