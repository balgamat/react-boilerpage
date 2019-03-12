import React, { ReactNode } from 'react';
import { VerticallyCentered } from '../../common/common.styles';
import { Overlay } from './Loading.styles';
import Loader from 'react-loader-spinner';

interface LoadingPropsType {
  scrollable?: boolean;
  text?: string | ReactNode;
}

const Loading = ({ scrollable, text }: LoadingPropsType) => {
  const loader = (
    <div>
      <Loader type="Grid" color={'#6cabae'} height={80} width={80} />
      {text && <div>{text}</div>}
    </div>
  );

  return (
    <Overlay scrollable={scrollable}>
      {scrollable ? loader : <VerticallyCentered>{loader}</VerticallyCentered>}
    </Overlay>
  );
};

export default Loading;
