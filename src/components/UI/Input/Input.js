import React from 'react';
import  classes from './Input.module.css';
const input = (props) => {
    const inputClasses = [classes.InputElement]
    if(props.invalid && props.shouldValidate && props.touched){
        inputClasses.push(classes.Invalid)
    }
    let inputElement= null;
    switch(props.elementType){
        case('text'):
            inputElement = <input 
                {...props.elementConfig} 
                className={inputClasses.join(' ')} 
                value={props.value} 
                onChange={props.changed}/>
            break;
        case('textarea'):
            inputElement = <textarea 
                {...props.elementConfig} 
                className={inputClasses.join(' ')} 
                value={props.value}
                onChange={props.changed}/>
            break;
        case('select'):
            inputElement = (
                <select 
                    className={inputClasses.join(' ')}
                    value={props.value}
                    onChange={props.changed}>
                    {props.elementConfig.options.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.displayValue}
                        </option>
                    ))}
                </select>
            )
            break;
        default:
            inputElement = <input 
                {...props.elementConfig} 
                className={inputClasses.join(' ')} 
                value={props.value}
                onChange={props.changed}/>
    }
    return(
        <div className={classes.Input}>
            <label className={classes.Label}>{props.label}</label>
            {inputElement}
        </div>
    )
}
export default input;