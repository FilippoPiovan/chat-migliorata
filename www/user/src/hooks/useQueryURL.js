import { useState, useEffect } from "react";
const useQueryURL = (paramName) => {
  const [parametroId, setParametroId] = useState(undefined);
  useEffect(() => {
    let p = new URLSearchParams(window.location.search);
    let p1 = p.get(paramName);
    setParametroId(p1);
  }, [paramName]);
  return { parametroId };
};

export default useQueryURL;
