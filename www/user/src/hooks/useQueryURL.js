import { useState, useEffect } from "react";
const useQueryURL = (parameterName) => {
  const [idParameter, setIdParameter] = useState(undefined);
  useEffect(() => {
    let allParameters = new URLSearchParams(window.location.search);
    let searchedParameter = allParameters.get(parameterName);
    setIdParameter(searchedParameter);
  }, [parameterName]);
  return { idParameter };
};

export default useQueryURL;
