function formatNumber(number: number | undefined): number | string {
  if (number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }
  return 0;
}
export { formatNumber };
