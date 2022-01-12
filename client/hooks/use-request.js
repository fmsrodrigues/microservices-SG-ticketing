import { useState } from 'react';
import axios from 'axios';

const UseRequest = ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null);

  const doRequest = async (props = {}) => {
    try {
      setErrors(null);
      const res = await axios[method](url, {
        ...body,
        ...props
      });

      if(onSuccess) {
        onSuccess(res.data);
      }

      return res.data;
    } catch(err) {
      setErrors(
        <div className="alert alert-danger">
          <h4>Oooops...</h4>
          <ul className="my-0">
          {err.response.data.errors.map(error => <li key={error.message}>{error.message}</li>)}
          </ul>
        </div>
      );
    }
  };

  return { doRequest, errors };
}

export default UseRequest;