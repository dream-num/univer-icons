import React from 'react';
interface IInput {
  handleChange: (value: string) => void;
}
export default class SearchInput extends React.Component<IInput> {
  render = () => (
    <div className="inputWrapper">
      <div className="inputContainer">
        <input
          type="text"
          placeholder="Search Icon Here :)"
          className="search"
          onChange={(e) => {
            this.props.handleChange(e.target.value);
          }}
        />
      </div>
    </div>
  );
}
