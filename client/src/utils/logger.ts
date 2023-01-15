const info = (...params: any[]): void => {
  if (process.env.REACT_APP_ENV !== 'production') {
    console.log(...params);
  }
};

const error = (...params: any[]): void => {
  if (process.env.REACT_APP_ENV !== 'production') {
    console.error(...params);
  }
};

export default { info, error };
