import qs from 'qs';

const updateQueryParams = (
  toUpdate: object,
): { state: object; query: string } => {
  const currentParams = window.history.state;
  const newParams = {
    ...currentParams,
    ...toUpdate,
  };
  return { state: newParams, query: qs.stringify(newParams) };
};

export default updateQueryParams;
