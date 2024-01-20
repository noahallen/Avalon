import { render, screen } from "@testing-library/react";
import App from "./App";
import { GameContext } from "./components/GameProvider";

/*
test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
*/
// Test suite for App component
describe("App component", () => {
  // Test case: App renders without crashing
  test("renders without crashing", () => {
    // Render the App component
    const { container } = render(<App />);

    // Check if the App component rendered
    expect(container).toBeTruthy();
  });
});
