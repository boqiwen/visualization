function daysDifference(startDate, endDate) {
    let date1 = new Date(startDate),
        date2 = new Date(endDate),
        time_difference = date2.getTime() - date1.getTime(),
        days_difference = time_difference / (1000 * 60 * 60 * 24);

    return days_difference;
} 