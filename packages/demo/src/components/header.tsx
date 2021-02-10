import { FunctionalComponent, h } from '@stencil/core';
import { Helmet } from '@stencil/helmet';

export interface HeaderProps {
  title: String;
}

export const Header: FunctionalComponent<HeaderProps> = (props, children) => {
  const { title = 'MimeoJS' } = { ...props };
  return (
    <Helmet>
      <title>{title}</title>
      {children}
    </Helmet>
  );
};
