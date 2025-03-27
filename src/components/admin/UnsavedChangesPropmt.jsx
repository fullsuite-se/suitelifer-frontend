// import { useEffect, useState } from "react";
// import { useBlocker } from "react-router-dom";

// const UnsavedChangesPropmt = (message = "Are you sure you want to leave?") => {
//   const [hasChange, setHasChange] = useState(false);

//   const blocker = useBlocker(hasChange);

//   useEffect(() => {
//     const handleBeforeUnload = (event) => {
//       if (hasChange) {
//         event.preventDefault();
//         event.returnValue = message;
//       }
//     };
//     window.addEventListener("beforeunload", handleBeforeUnload);

//     return () => {
//       window.removeEventListener("beforeunload", handleBeforeUnload);
//     };
//   }, [hasChange]);

//   return [
//     blocker.state === "blocked" ? (
//       window.confirm(message) ? blocker.proceed() : blocker.reset()
//     ) : null,
//     () => setHasChange(true), // Call when changes occur
//     () => setHasChange(false), // Call when saved or reset
//   ];
// };

// export default UnsavedChangesPropmt;
