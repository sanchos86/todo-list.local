export default {
  low: {
    value: 'low',
    label: 'Low',
  },
  middle: {
    value: 'middle',
    label: 'Middle',
  },
  high: {
    value: 'high',
    label: 'High',
  },

  get options() {
    return [
      this.low,
      this.middle,
      this.high,
    ];
  },
};
