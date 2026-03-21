import {
  expect,
  test,
  describe,
  vi
} from "vitest";
import "@testing-library/jest-dom";
import {
  render,
  screen,
  fireEvent
} from "@testing-library/react";
import Button from "../../src/components/base/button";

const text = "Hello world";

describe("Render", () => {
  test("Default", () => {
    render(
      <Button
        variant="default"
      >
        {text}
      </Button>
    );

    const btn = screen.getByText(text);
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveClass("button-default");
  });

  test("Primary", () => {
    render(
      <Button
        variant="primary"
      >
        {text}
      </Button>
    );

    const btn = screen.getByText(text);
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveClass("button-primary");
  });

  test("Second", () => {
    render(
      <Button
        variant="second"
      >
        {text}
      </Button>
    );

    const btn = screen.getByText(text);
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveClass("button-second");
  });

  test("Danger", () => {
    render(
      <Button
        variant="danger"
      >
        {text}
      </Button>
    );

    const btn = screen.getByText(text);
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveClass("button-danger");
  });

  test("Text", () => {
    render(
      <Button
        variant="text"
      >
        {text}
      </Button>
    );

    const btn = screen.getByText(text);
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveClass("button-text");
  });

  test("Danger", () => {
    render(
      <Button
        variant="clear"
      >
        {text}
      </Button>
    );

    const btn = screen.getByText(text);
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveClass("button-clear");
  });
});

test("Disabled", () => {
  render(
    <Button
      disabled
    >
      {text}
    </Button>
  );

  const btn = screen.getByText(text);
  expect(btn).toBeInTheDocument();
  expect(btn).toBeDisabled();
});

test("Loading", () => {
  render(
    <Button
      loading
    >
      {text}
    </Button>
  );

  const btn = screen.getByText(text);
  expect(btn).toBeInTheDocument();
  expect(btn).toBeDisabled();
  expect(btn).toHaveClass("animate-pulse");
});

test("Custom className", () => {
  render(
    <Button
      className="test test-second"
    >
      {text}
    </Button>
  );

  const btn = screen.getByText(text);
  expect(btn).toBeInTheDocument();
  expect(btn).toHaveClass("test");
  expect(btn).toHaveClass("test-second");
});

test("onClick", async () => {
  const handleClick = vi.fn();

  render(
    <Button
      onClick={handleClick}
    >
      {text}
    </Button>
  );

  const btn = screen.getByText(text);
  expect(btn).toBeInTheDocument();
  expect(btn).toHaveClass("button-default");
  fireEvent.click(btn);
  expect(handleClick).toHaveBeenCalledTimes(1);
});

test("onClick: disabled", async () => {
  const handleClick = vi.fn();

  render(
    <Button
      onClick={handleClick}
      disabled
    >
      {text}
    </Button>
  );

  const btn = screen.getByText(text);
  expect(btn).toBeInTheDocument();
  expect(btn).toHaveClass("button-default");
  fireEvent.click(btn);
  expect(handleClick).toHaveBeenCalledTimes(0);
});