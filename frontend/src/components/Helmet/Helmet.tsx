import React, { useEffect } from 'react';

export type Props = {
  title: string;
};

const Helmet: React.FunctionComponent<Props> = ({ title }) => {
  useEffect(() => {
    document.title = title;
  });

  return null;
};

export default Helmet;
