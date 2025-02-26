import { render, screen } from '@testing-library/react'
import App from '../../App';

describe("testing home page", () => {
  describe("should render the home page", () => {
    it("should render the home page buttons", () => {
      render(<App />);
      const buttons = screen.getAllByRole("button");
      expect(buttons).toHaveLength(2);
    });
  });
})