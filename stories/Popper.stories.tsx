import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import Popper, { PopperContent, PopperFooter } from './components/Popper';

export default {
  title: 'Example/Popper',
  component: Popper,
} as ComponentMeta<typeof Popper>;

const Template: ComponentStory<typeof Popper> = (args) => <Popper {...args} />;

const Button = React.forwardRef<HTMLButtonElement, { onToggle: () => void; isNested?: boolean; isOpened: boolean }>(
  ({ onToggle, isNested, isOpened }, ref) => (
    <button ref={ref} onClick={onToggle} style={{ color: isOpened ? 'blue' : 'black' }}>
      {isNested ? 'Open Nested Popper' : 'Open Popper'}
    </button>
  )
);

const Content: React.FC<{ isNested?: boolean; onClose?: () => void }> = ({ isNested, onClose }) => (
  <PopperContent style={{ padding: '12px', justifyContent: 'center', alignItems: 'center' }}>
    <p>{isNested ? 'Nested Content' : 'Content'}</p>
    {onClose && <button onClick={onClose}>Close</button>}
  </PopperContent>
);

const NestedPopper: React.FC<{ onClose: () => void; isNested?: boolean; withFooter?: boolean }> = ({ onClose, isNested, withFooter }) => (
  <PopperContent style={{ padding: '12px', justifyContent: 'center', alignItems: 'center' }}>
    <Content onClose={onClose} isNested={isNested} />

    <Popper
      width={withFooter ? '240px' : '150px'}
      height={withFooter ? '300px' : '200px'}
      portalNode={document.body}
      placement="right"
      renderContent={({ onClose }) => <NestedPopper onClose={onClose} isNested withFooter={withFooter} />}
      renderFooter={
        withFooter
          ? ({ onClose }) => (
              <PopperFooter style={{ height: '140px' }}>
                <NestedPopper onClose={onClose} isNested withFooter={withFooter} />
              </PopperFooter>
            )
          : undefined
      }
    >
      {(props) => <Button {...props} isNested />}
    </Popper>
  </PopperContent>
);

export const Simple = Template.bind({});
Simple.args = {
  width: '150px',
  height: '200px',
  portalNode: document.body,
  children: (props) => <Button {...props} />,
  renderContent: () => <Content />,
};

export const WithCloseButton = Template.bind({});
WithCloseButton.args = {
  width: '150px',
  height: '200px',
  portalNode: document.body,
  children: (props) => <Button {...props} />,
  renderContent: ({ onClose }) => <Content onClose={onClose} />,
};

export const Nested = Template.bind({});
Nested.args = {
  width: '150px',
  height: '200px',
  portalNode: document.body,
  placement: 'right',
  children: (props) => <Button {...props} />,
  renderContent: ({ onClose }) => <NestedPopper onClose={onClose} />,
};

export const MultipleNested = Template.bind({});
MultipleNested.args = {
  width: '240px',
  height: '300px',
  portalNode: document.body,
  placement: 'right',
  children: (props) => <Button {...props} />,
  renderContent: ({ onClose }) => <NestedPopper onClose={onClose} withFooter />,
  renderFooter: ({ onClose }) => (
    <PopperFooter style={{ height: '140px' }}>
      <NestedPopper onClose={onClose} isNested withFooter />
    </PopperFooter>
  ),
};
