import React, { useState } from 'react';
import { HexColorInput } from 'react-colorful';
import ColorShower from './color-shower';

export default function ColorPicker(props: any) {
  const [color, setColor] = useState(props.defaultColor || '');
  const [visible, setVisible] = useState(false);
  const changeColor = (value: string) => {
    setColor(value);
    props.handleColorChange(value);
  };
  const handleClick = (e: any) => {
    e?.nativeEvent.stopImmediatePropagation();
  };

  return (
    <div className="colorPickerContainer">
      <div className="colorPickerWrapper">
        <ColorShower
          color={color}
          onChange={changeColor}
          visible={visible}
          setVisible={setVisible}
        />
        <HexColorInput
          className="colorInput"
          color={color}
          onChange={changeColor}
          onClick={handleClick}
        />
      </div>
    </div>
  );
}
