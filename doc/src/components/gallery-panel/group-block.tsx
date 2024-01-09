import translate from './name-map';

export default function GroupBlock(props: any) {
  return (
    <div className="block" id={props.appName + props.groupName}>
      <div className="blockHeader">
        <div className="blockName">{`${translate(props.groupName)}`}</div>
      </div>
      <div className="iconGroup">{props.children}</div>
    </div>
  );
}
