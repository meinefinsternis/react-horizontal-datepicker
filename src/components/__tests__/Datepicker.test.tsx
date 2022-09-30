import React from "react";
import { enUS } from "date-fns/locale";
import { render, screen } from "@testing-library/react";
import { Datepicker, DatepickerProps } from "../Datepicker";
import "@testing-library/jest-dom";
import { differenceInDays, format, getDate } from "date-fns";
import userEvent from "@testing-library/user-event";

const toDate = (d?: string | Date) => (d ? new Date(d) : new Date());
const getFormatDayLabel = (d: number | Date) => format(d, "EEEEE");
const getFormatDateLabel = (d: number | Date) => String(getDate(d));

const startDate = toDate("2022-10-10");
const endDate = toDate("2022-10-20");

describe("<Datepicker/>", () => {
  const createDatepicker = (
    props: Omit<DatepickerProps, "locale" | "onChange">,
  ) => {
    return render(<Datepicker {...props} locale={enUS} onChange={jest.fn()} />);
  };

  describe("render props", () => {
    const startValue = toDate("2022-10-15");
    const endValue = toDate("2022-10-17");
    const disabledDates = [
      toDate("2022-10-12"),
      toDate("2022-10-15"),
      toDate("2022-10-20"),
    ];
    it("should render start date", () => {
      const startDate = toDate("2022-10-10");
      createDatepicker({
        startValue: null,
        endValue: null,
        startDate,
      });

      const dayLabel = screen.getAllByTestId("DAY_LABEL")[0];
      const dateLabel = screen.getAllByTestId("DATE_LABEL")[0];

      expect(dateLabel).toHaveTextContent(getFormatDateLabel(startDate));
      expect(dayLabel).toHaveTextContent(getFormatDayLabel(startDate));
    });
    it("should render end date", () => {
      createDatepicker({
        startValue: null,
        endValue: null,
        endDate,
      });

      const dayLabels = screen.getAllByTestId("DAY_LABEL");
      const dateLabels = screen.getAllByTestId("DATE_LABEL");
      const lastDayLabel = dayLabels[dayLabels.length - 1];
      const lastDateLabel = dateLabels[dateLabels.length - 1];

      expect(lastDateLabel).toHaveTextContent(getFormatDateLabel(endDate));
      expect(lastDayLabel).toHaveTextContent(getFormatDayLabel(endDate));
    });
    it("should render days", () => {
      createDatepicker({
        startValue: null,
        endValue: null,
        startDate,
        endDate,
      });
      const diff = differenceInDays(endDate, startDate) + 1;
      const days = screen.getAllByTestId("DAY_ITEM");
      expect(days).toHaveLength(diff);
    });
    it("should render startValue", () => {
      const { container } = createDatepicker({
        startValue,
        endValue: null,
        endDate,
        startDate,
      });

      const selectedDays = container.querySelectorAll(".dateDayItemSelected");
      const dayLabel = selectedDays[0].firstElementChild;
      const dateLabel = selectedDays[0].lastElementChild;
      expect(selectedDays).toHaveLength(1);
      expect(dateLabel).toHaveTextContent(getFormatDateLabel(startValue));
      expect(dayLabel).toHaveTextContent(getFormatDayLabel(startValue));
    });
    it("should render endValue", () => {
      const { container } = createDatepicker({
        startValue: null,
        endValue,
        endDate,
        startDate,
      });

      const selectedDays = container.querySelectorAll(".dateDayItemSelected");
      const dayLabel = selectedDays[0].firstElementChild;
      const dateLabel = selectedDays[0].lastElementChild;
      expect(selectedDays).toHaveLength(1);
      expect(dateLabel).toHaveTextContent(getFormatDateLabel(endValue));
      expect(dayLabel).toHaveTextContent(getFormatDayLabel(endValue));
    });
    it("should render startValue && endValue", () => {
      const { container } = createDatepicker({
        startValue,
        endValue,
        endDate,
        startDate,
      });
      const selectedDays = container.querySelectorAll(".dateDayItemSelected");
      expect(selectedDays).toHaveLength(2);
    });
    it("should render range dates between startValue && endValue", () => {
      const { container } = createDatepicker({
        startValue,
        endValue,
        endDate,
        startDate,
      });

      const diff = differenceInDays(endValue, startValue) + 1;
      const selectedDate = container.querySelectorAll(".inRange");
      expect(selectedDate).toHaveLength(diff);
    });
    it("should render disabldeDates", () => {
      const { container } = createDatepicker({
        startValue,
        endValue,
        endDate,
        startDate,
        disabledDates,
      });
      const selectedDate = container.querySelectorAll('[aria-disabled="true"]');
      expect(selectedDate).toHaveLength(disabledDates.length);
    });
  });

  describe("<Datepicker/> events", () => {
    test("endValue onClick", async () => {
      let startValue: Date | null = toDate("2022-10-15");
      let endValue: Date | null = null;
      const onChange = jest.fn((dates) => {
        [startValue, endValue] = dates;
      });
      const { rerender } = render(
        <Datepicker
          locale={enUS}
          onChange={onChange}
          endValue={endValue}
          startValue={startValue}
          startDate={startDate}
          endDate={endDate}
        />,
      );
      const days = screen.getAllByTestId("DAY_ITEM");
      const current = days[0];
      await userEvent.click(current);
      expect(onChange).toHaveBeenCalledTimes(1);
      rerender(
        <Datepicker
          locale={enUS}
          onChange={onChange}
          endValue={endValue}
          startValue={startValue}
          startDate={startDate}
          endDate={endDate}
        />,
      );
      const currentDateLabel = current.lastElementChild;
      const currentDayLabel = current.firstElementChild;
      expect(current).toHaveClass("dateDayItemSelected");
      expect(currentDateLabel).toHaveTextContent(getFormatDateLabel(startDate));
      expect(currentDayLabel).toHaveTextContent(getFormatDayLabel(startDate));
    });
  });
});
