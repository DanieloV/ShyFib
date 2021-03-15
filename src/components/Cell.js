import { useEffect, useRef, useState } from "react";

function Cell(props) {

  const [extraClasses, setExtraClasses] = useState("");
  const [timeoutVar, setTimeoutVar] = useState();

  const prevValueRef = useRef();
  useEffect(() => {
    prevValueRef.current = props.value;
  });
  const prevValue = prevValueRef.current || 0;


  useEffect(() => {
    if (props.value === prevValue) return;

    clearTimeout(timeoutVar);

    if (props.value === 0) {
      setExtraClasses("cell--green");
    }
    else
      setExtraClasses("cell--yellow");

    setTimeoutVar(
      setTimeout(() => { setExtraClasses("")}, 300)
    );
  }, [props.value]);

  return (
    <div className={"cell border pointer " + extraClasses} onClick={props.onClick}>
      {props.value}
    </div>
  )
}

export default Cell;