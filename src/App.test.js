import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "./App";

describe("Kickstarter Projects App", () => {
  const mockProjects = [
    { "s.no": 0, "percentage.funded": 186, "amt.pledged": 15823 },
    { "s.no": 1, "percentage.funded": 8, "amt.pledged": 6859 },
    { "s.no": 2, "percentage.funded": 102, "amt.pledged": 17906 },
    { "s.no": 3, "percentage.funded": 191, "amt.pledged": 67081 },
    { "s.no": 4, "percentage.funded": 50, "amt.pledged": 12345 },
    { "s.no": 5, "percentage.funded": 75, "amt.pledged": 54321 },
  ];

  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockProjects),
      })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders the app correctly", async () => {
    render(<App />);
    expect(screen.getByText(/highly-rated kickstarter projects/i)).toBeInTheDocument();
    expect(screen.getByRole("table")).toBeInTheDocument();

    await waitFor(() => expect(screen.getByText("186%")).toBeInTheDocument());
  });

  test("displays correct number of rows per page", async () => {
    render(<App />);

    await waitFor(() => screen.getByText("186%"));

    const rows = screen.getAllByRole("row");
    expect(rows.length).toBe(6);
  });

  test("navigates to the next page", async () => {
    render(<App />);

    await waitFor(() => screen.getByText("186%"));

    const nextButton = screen.getByText(/next/i);
    fireEvent.click(nextButton);

    await waitFor(() => expect(screen.getByText("75%")).toBeInTheDocument());
  });

  test("disables the 'Previous' button on the first page", async () => {
    render(<App />);

    await waitFor(() => screen.getByText("186%"));

    const prevButton = screen.getByText(/previous/i);
    expect(prevButton).toBeDisabled();
  });

  test("disables the 'Next' button on the last page", async () => {
    render(<App />);

    await waitFor(() => screen.getByText("186%"));

    const nextButton = screen.getByText(/next/i);
    fireEvent.click(nextButton);

    await waitFor(() => expect(nextButton).toBeDisabled());
  });

  test("handles API errors gracefully", async () => {
    global.fetch = jest.fn(() => Promise.reject("API is down"));

    render(<App />);

    await waitFor(() =>
      expect(screen.queryByText("186%")).not.toBeInTheDocument()
    );

    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
});
