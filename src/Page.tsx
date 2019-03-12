import React, { PureComponent } from 'react';
import { RouteComponentProps } from 'react-router';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import Loading from './Loading';
import { FunctionsMapType, ActionType, StateType } from './types';
import qs from 'qs';
import updateQueryParams from './updateQueryParams';

const {
  Provider: PageContextProvider,
  Consumer: PageContextConsumer,
} = React.createContext({ data: {}, actions: {} });

export { PageContextProvider, PageContextConsumer };

export type PageActionsBaseType = FunctionsMapType;

export interface PageBaseType {
  actions: PageActionsBaseType;
  data: any | null;
}

export interface PagePropsType extends RouteComponentProps {
  actions: FunctionsMapType;
  data: any;
  dataSelector: (state: StateType, ownProps: PagePropsType) => object;
  dispatches: (
    dispatch: Dispatch<ActionType>,
    ownProps: PagePropsType,
    updateQuery: (params: object) => void,
  ) => {
    getData:
      | ((
          params: { routeParams?: any; state?: StateType; queryParams?: any },
        ) => void)
      | undefined;
    actions: FunctionsMapType;
  };
  getData: (
    params: { routeParams?: any; state?: StateType; queryParams?: any },
  ) => void;
  reset?: () => void;
  state: StateType;
  isLoading: boolean;
}

class Page extends PureComponent<PagePropsType> {
  shouldGetData = true;

  componentDidMount() {
    const {
      getData,
      location: { search },
      match: { params },
      state,
    } = this.props;

    if (this.shouldGetData && getData) {
      getData({
        routeParams: params,
        state,
        queryParams: qs.parse(search, { ignoreQueryPrefix: true }),
      });
    }

    this.shouldGetData = false;
  }

  getSnapshotBeforeUpdate(prevProps: PagePropsType) {
    if (window.scrollY > 0 && !prevProps.isLoading) {
      return window.scrollY;
    }

    return 0;
  }

  componentDidUpdate(
    prevProps: PagePropsType,
    prevState: any,
    snapshot: number,
  ) {
    window.scrollTo(0, snapshot);
  }

  componentWillUnmount() {
    const { reset } = this.props;
    if (reset) {
      reset();
    }
  }

  render() {
    const { actions, children, data, isLoading } = this.props;

    return isLoading || this.shouldGetData ? (
      <Loading />
    ) : (
      <PageContextProvider
        value={{
          actions,
          data,
        }}
      >
        {children}
      </PageContextProvider>
    );
  }
}

const mapState = (state: StateType, ownProps: PagePropsType) => ({
  data: ownProps.dataSelector(state, ownProps),
  isLoading: state.app.loading.isLoading,
  state,
});

const mapDispatch = (
  dispatch: Dispatch<ActionType>,
  ownProps: PagePropsType,
) => {
  const {
    dispatches,
    location: { pathname },
  } = ownProps;

  const updateQuery = (params: object) => {
    const { state, query } = updateQueryParams(params);

    history.replaceState(
      state,
      'ATLAS',
      `${window.location.search}#${pathname}?${query}`,
    );
  };

  return dispatches(dispatch, ownProps, updateQuery);
};

export default connect(
  mapState,
  mapDispatch,
)(Page);
