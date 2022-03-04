function filters(dates, secondDate, brands, categories, colors, sizes, types) {
  let filter = {};

  if (brands) filter = { brand: brands.split(",") };

  if (categories) filter = { category: categories.split(",") };

  if (colors) filter = { color: colors.split(",") };

  if (sizes) filter = { size: sizes.split(",") };

  if (types) filter = { type: types.split(",") };

  if (dates) {
    let startDates = new Date(dates);
    startDates.toISOString();
    startDates = new Date(startDates.setHours(0, 0, 0, 0));

    let endDates = new Date(dates);
    endDates.toISOString();
    endDates = new Date(endDates.setHours(23, 59, 59, 999));

    filter = { date: { $gt: startDates, $lt: endDates } };
  }

  if (dates && secondDate) {
    let startDate = new Date(dates);
    startDate.toISOString();
    startDate = new Date(startDate.setHours(0, 0, 0, 0));

    let endDate = new Date(secondDate);
    endDate.toISOString();
    endDate = new Date(endDate.setHours(23, 59, 59, 999));
    filter = { date: { $gt: startDate, $lt: endDate } };
  }
  return filter;
}

module.exports = filters;
