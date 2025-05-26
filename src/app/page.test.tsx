import React from "react";
import { render, screen } from "@testing-library/react";

// Mock the IndexPage component
jest.mock("../components/index/index", () => () => (
  <div data-testid="index-page-mock">IndexPage Content</div>
));

import Home from "./page";

describe("Home Page", () => {
  it("renders the IndexPage component", () => {
    render(<Home />);
    expect(screen.getByTestId("index-page-mock")).toBeInTheDocument();
    expect(screen.getByTestId("index-page-mock")).toHaveTextContent("IndexPage Content");
  });
});