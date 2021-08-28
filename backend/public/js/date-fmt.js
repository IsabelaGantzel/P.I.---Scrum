const dateFmt = {
  fullDate(date) {
    if (date === null) return null;
    const d = new Date(date);
    if (isNaN(d.getTime())) {
      return null;
    } else {
      const yyyy = d.getFullYear();
      const MM = (d.getMonth() + 1).toString().padStart(2, "0");
      const dd = d.getDate().toString().padStart(2, "0");
      return `${dd}/${MM}/${yyyy}`;
    }
  },
};
