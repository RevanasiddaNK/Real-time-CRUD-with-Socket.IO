import React from 'react'

export const Input = ({name,placeholder,value, handleInput}) => {
  return (
    <input 
    name = {name} 
    value ={value}
    onChange={handleInput}
    style={{
      marginBottom: '15px',
      width: '100%',
      padding: '10px',
      borderRadius: '6px',
      border: '1px solid #ccc',
    }}
    placeholder={placeholder}
    />
  )
}
