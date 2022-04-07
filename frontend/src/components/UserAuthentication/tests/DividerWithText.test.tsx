import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom';
import DividerWithText from '../DividerWithText';

describe('DividerWithText', () => {

  // TODO: for some reasons the react-test-renderer library does not work
  // it('should match the snapshot', () => {
  //   const component = renderer.create(<DividerWithText>or</DividerWithText>);
  //   expect(component.toJSON()).toMatchSnapshot();
  // })

  it('should show that it has rendered the or children', () => {
    const { getByTestId } = render(<DividerWithText>or</DividerWithText>);
    expect(getByTestId('children')).toBeInTheDocument();
  });

  it('should show that it has rendered the button children', () => {
    const action = jest.fn();
    const { getByText } = render(<DividerWithText><button type="button" onClick={action}>Click</button></DividerWithText>);
    const button = getByText('Click');
    fireEvent.click(button);
    expect(action).toHaveBeenCalledTimes(1);
  })

})