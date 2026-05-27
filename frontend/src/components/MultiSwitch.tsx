
export type MultiSwitchProps<T> = {
  label: string;
  options: { text: string; value: T; }[];
  currentValue: T;
  setValue: (newValue: T) => void;
};

export default function MultiSwitch<T>(props: MultiSwitchProps<T>) {
  return <div style={{ display: 'flex', alignItems: 'center' }}>
    <label><span>{props.label}:</span> </label>
    {props.options.map(({ text, value }) => (
      <button
        key={value as any}
        // style={ value === props.currentValue ? { fontWeight: 'bold' } : {}}
        className={ value === props.currentValue ? "inset" : "ghost"}
        onClick={() => props.setValue(value)}
      >{text}</button>
    ))}
  </div>;
}
