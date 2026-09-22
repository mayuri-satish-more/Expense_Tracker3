export const calculateNextOccurrence = (
  date,
  frequency
) => {
  const nextDate = new Date(date);

  switch (frequency) {
    case "Daily":
      nextDate.setDate(
        nextDate.getDate() + 1
      );
      break;

    case "Weekly":
      nextDate.setDate(
        nextDate.getDate() + 7
      );
      break;

    case "Monthly":
      nextDate.setMonth(
        nextDate.getMonth() + 1
      );
      break;

    case "Yearly":
      nextDate.setFullYear(
        nextDate.getFullYear() + 1
      );
      break;

    default:
      return null;
  }

  return nextDate;
};