![alt text](https://i.ibb.co/k4k1w90/image-2022-09-19-23-50-53.png)

## Installation

The package can be installed via [npm](https://github.com/npm/cli):

```
npm install @meinefinsternis/react-horizontal-date-picker --save
```

Below is a simple example of how to use the Datepicker in a React view.

```tsx
import React from "react";
import { Datepicker, DatepickerEvent} from "@meinefinsternis/react-horizontal-date-picker";
import { enUS } from "date-fns/locale";

const Example = () => {
  const [date, setDate] = React.useState<{
    endValue: Date | null;
    startValue: Date | null;
    rangeDates: Date[] | null;
  }>({
    startValue: null,
    endValue: null,
    rangeDates: [],
  });

  const handleChange = (d: DatepickerEvent) => {
    const [startValue, endValue, rangeDates] = d;
    setDate((prev) => ({ ...prev, endValue, startValue, rangeDates }));
  };

  return (
    <Datepicker
      onChange={handleChange}
      locale={enUS}
      startValue={date.startValue}
      endValue={date.endValue}
    />
  );
};
```

## Props

Common props you may want to specify include:

- `locale`: `Locale` - locales directly exported from date-fns/locales.
- `onChange`: `(d: [Date | null, Date | null, Date[] | null]) => void` - subscribe to change events
- `startValue`: `Date | null` - defines the initial start value
- `endValue`: `Date | null` - defines the initial end value
- `startDate`?: `Date` - defines minimum date. Default `new Date()`.
- `endDate`?: `Date` - defines maximum date. Default `new Date() + 3 months`
- `className`?: `object` - apply a className to the customize
- `disabledDates`?: `Date[]` - list of disabled dates
