/* eslint-disable jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events, jsx-a11y/anchor-is-valid */
import { ComponentMeta, ComponentStory } from '@storybook/react';
import React, { PropsWithChildren } from 'react';

import Button from './components/Button';
import Popper from './components/Popper';

export default {
  title: 'Example/Popper',
  component: Popper,
} as ComponentMeta<typeof Popper>;

const Template: ComponentStory<typeof Popper> = (args) => <Popper {...args} />;

const PLACEMENTS = ['bottom-start', 'bottom-end', 'right-start', 'right-end', 'top-start', 'top-end', 'left-start', 'left-end'] as const;

const TriggerButton = React.forwardRef<HTMLButtonElement, { onToggle: () => void; isNested?: boolean; isOpened: boolean }>(
  ({ onToggle, isNested, isOpened }, ref) => (
    <Button ref={ref} onClick={onToggle} active={isOpened}>
      {isNested ? 'Open Nested Popper' : 'Open Popper'}
    </Button>
  )
);

const Content: React.FC<PropsWithChildren<{ index?: number }>> = ({ index, children }) => (
  <Popper.Content style={{ padding: '12px', justifyContent: 'center', alignItems: 'center' }}>
    <p>{index ? `Nested Content ${index}` : 'Content'}</p>

    {children}
  </Popper.Content>
);

const Footer: React.FC<PropsWithChildren<{ onClose: VoidFunction }>> = ({ onClose }) => (
  <Popper.Footer>
    <a onClick={onClose}>Close</a>
  </Popper.Footer>
);

const NestedPopper: React.FC<{ index?: number; withNested?: boolean }> = ({ index = 0, withNested }) => (
  <Popper.Content style={{ padding: '12px', justifyContent: 'center', alignItems: 'center' }}>
    <Content index={index}>
      {(!index || withNested) && (
        <Popper
          width={withNested ? '240px' : '150px'}
          height={withNested ? '240px' : '200px'}
          placement={PLACEMENTS[index % PLACEMENTS.length]}
          portalNode={document.body}
          renderFooter={({ onClose }) => <Footer onClose={onClose} />}
          renderContent={() => <NestedPopper index={index + 1} withNested={withNested} />}
          preventOverflowPadding={index * 5}
        >
          {(props) => <TriggerButton {...props} isNested={!!index} />}
        </Popper>
      )}
    </Content>
  </Popper.Content>
);

export const Simple = Template.bind({});
Simple.args = {
  width: '150px',
  height: '200px',
  portalNode: document.body,
  children: (props) => <TriggerButton {...props} />,
  renderContent: () => <Content />,
};

export const WithCloseTriggerButton = Template.bind({});
WithCloseTriggerButton.args = {
  width: '150px',
  height: '200px',
  portalNode: document.body,
  children: (props) => <TriggerButton {...props} />,
  renderFooter: ({ onClose }) => <Footer onClose={onClose} />,
  renderContent: () => <Content />,
};

export const Nested = Template.bind({});
Nested.args = {
  width: '240px',
  height: '240px',
  portalNode: document.body,
  placement: 'right',
  children: (props) => <TriggerButton {...props} />,
  renderFooter: ({ onClose }) => <Footer onClose={onClose} />,
  renderContent: () => <NestedPopper />,
};

export const MultipleNested = Template.bind({});
MultipleNested.args = {
  width: '240px',
  height: '300px',
  portalNode: document.body,
  placement: 'right',
  children: (props) => <TriggerButton {...props} />,
  renderFooter: ({ onClose }) => <Footer onClose={onClose} />,
  renderContent: () => <NestedPopper withNested />,
};
