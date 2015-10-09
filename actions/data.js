export const FETCH_ALL = 'FETCH_ALL';
export const FILTER = 'FILTER';

export function fetchall() {
  return {
    type: FETCH_ALL
  };
}

export function filter() {
  return {
    type: FILTER,
    payload: (data) => data.filter((d) => d > 30),
  };
}

export function incrementIfOdd() {
  return (dispatch, getState) => {
    const { counter } = getState();

    if (counter % 2 === 0) {
      return;
    }

    dispatch(increment());
  };
}

export function incrementAsync(delay = 1000) {
  return dispatch => {
    setTimeout(() => {
      dispatch(increment());
    }, delay);
  };
}
