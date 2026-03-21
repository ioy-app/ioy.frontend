import {
  expect,
  test,
  vi
} from "vitest";
import "@testing-library/jest-dom";
import {
  render,
  screen,
  fireEvent
} from "@testing-library/react";
import Checkbox from "../../src/components/base/checkbox";

test("Render", () => {
  render(
    <Checkbox
      name="test"
      placeholder="test"
    />
  );

  const check = screen.getByLabelText("test");
  expect(check).toBeInTheDocument();
});

test("Disabled", () => {
  render(
    <Checkbox
      name="test"
      placeholder="test"
      disabled
    />
  );

  const check = screen.getByLabelText("test");
  expect(check).toBeInTheDocument();
  expect(check).toBeDisabled();
});

test("onChange", () => {
  const handleChange = vi.fn();
  render(
    <Checkbox
      name="test"
      placeholder="test"
      onChange={handleChange}
    />
  );

  const check = screen.getByText("test");
  expect(check).toBeInTheDocument();
  fireEvent.click(check);
  expect(handleChange).toHaveBeenCalledTimes(1);
});

test("onChange: disabled", () => {
  const handleChange = vi.fn();
  render(
    <Checkbox
      name="test"
      placeholder="test"
      onChange={handleChange}
      disabled
    />
  );

  const check = screen.getByText("test");
  expect(check).toBeInTheDocument();
  fireEvent.click(check);
  expect(handleChange).toHaveBeenCalledTimes(0);
});